import { WeeklySummary } from "@/emails/WeeklySummary";
import { prisma } from "@/lib/prisma";
import { detectarModoVespera } from "@/lib/scheduler";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarResumoSemanal(userId: string) {
  // Busca dados do usuário
  const usuario = await prisma.user.findUnique({
    where: { id: userId },
    select: { nome: true, email: true },
  });

  if (!usuario?.email) return;

  // Streak
  const streak = await prisma.streak.findUnique({ where: { userId } });

  // Revisões concluídas na última semana
  const umaSemanaAtras = new Date();
  umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);

  const revisoesSemana = await prisma.revisao.findMany({
    where: {
      concluida: true,
      concluidaEm: { gte: umaSemanaAtras },
      materia: { userId },
    },
    include: { materia: true },
  });

  // Calcula desempenho por matéria
  const materiaMap = new Map<
    string,
    { nome: string; cor: string; total: number; acertos: number }
  >();
  for (const rev of revisoesSemana) {
    const existing = materiaMap.get(rev.materiaId) ?? {
      nome: rev.materia.nome,
      cor: rev.materia.cor,
      total: 0,
      acertos: 0,
    };
    existing.total += rev.questoesTotal;
    existing.acertos += rev.questoesAcerto;
    materiaMap.set(rev.materiaId, existing);
  }

  const materias = Array.from(materiaMap.values())
    .filter((m) => m.total > 0)
    .map((m) => ({
      nome: m.nome,
      cor: m.cor,
      totalQuestoes: m.total,
      totalAcertos: m.acertos,
      percentual: Math.round((m.acertos / m.total) * 100),
    }))
    .sort((a, b) => b.percentual - a.percentual);

  const melhorMateria = materias[0];
  const piorMateria =
    materias[materias.length - 1] !== melhorMateria
      ? materias[materias.length - 1]
      : undefined;

  // Desempenho geral
  const totalQuestoes = materias.reduce((acc, m) => acc + m.totalQuestoes, 0);
  const totalAcertos = materias.reduce((acc, m) => acc + m.totalAcertos, 0);
  const desempenhoGeral =
    totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;

  // Revisões da próxima semana
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const proximaSemana = new Date(hoje);
  proximaSemana.setDate(proximaSemana.getDate() + 7);

  const revisoesFuturas = await prisma.revisao.findMany({
    where: {
      concluida: false,
      dataProgramada: { gte: hoje, lte: proximaSemana },
      materia: { userId },
    },
    include: { materia: true },
    orderBy: { dataProgramada: "asc" },
  });

  // Matérias em véspera
  const materiasVespera = await detectarModoVespera(userId);

  // Envia o e-mail
  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: usuario.email,
    subject: `📚 Seu resumo semanal SGEP — ${desempenhoGeral}% de acertos`,
    react: WeeklySummary({
      nomeUsuario: usuario.nome ?? "Aluno",
      streakAtual: streak?.atual ?? 0,
      streakMaximo: streak?.maximo ?? 0,
      desempenhoGeral,
      materias,
      melhorMateria,
      piorMateria,
      revisoesSemana: revisoesFuturas.map((r) => ({
        materiaNome: r.materia.nome,
        dataProgramada: r.dataProgramada,
      })),
      materiasVespera: materiasVespera.map((m) => ({
        nome: m.nome,
        diasRestantes: m.diasRestantes,
      })),
    }),
  });
}
