import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevisoesAbas } from "@/components/ui/RevisoesAbas";
import { StreakCard } from "@/components/ui/StreakCard";
import { VesperaBanner } from "@/components/ui/VesperaBanner";
import {
  calcularPrioridadeAdaptativa,
  calcularTaxaAcerto,
} from "@/lib/adaptive";
import { prisma } from "@/lib/prisma";
import { detectarModoVespera } from "@/lib/scheduler";
import { buscarStreak, incrementarStreak } from "@/lib/streak";
import { addDays, getTodayAtEndOfDay, getTodayAtMidnight } from "@/lib/utils";
import { Activity, AlertCircle, BookCheck, TrendingUp } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const materias = await prisma.materia.findMany({
    where: { userId },
    orderBy: { dataExame: "asc" },
  });

  const metaAtual = await prisma.meta.findFirst({
    where: { ativa: true, userId },
    orderBy: { createdAt: "desc" },
  });

  const revisoesConcluidas = await prisma.revisao.findMany({
    where: { concluida: true, materia: { userId } },
    include: { materia: true },
    orderBy: { concluidaEm: "desc" },
  });

  const inicioDiaHoje = getTodayAtMidnight();
  const fimDiaHoje = getTodayAtEndOfDay();
  const fimSemana = addDays(fimDiaHoje, 7);

  const revisoesAtrasadas = await prisma.revisao.findMany({
    where: {
      concluida: false,
      dataProgramada: { lt: inicioDiaHoje },
      materia: { userId },
    },
    include: { materia: true },
    orderBy: { dataProgramada: "asc" },
  });

  const revisoesHojeBruto = await prisma.revisao.findMany({
    where: {
      concluida: false,
      dataProgramada: { gte: inicioDiaHoje, lte: fimDiaHoje },
      materia: { userId },
    },
    include: { materia: true },
    orderBy: { dataProgramada: "asc" },
  });

  const revisoesSemana = await prisma.revisao.findMany({
    where: {
      concluida: false,
      dataProgramada: { gt: fimDiaHoje, lte: fimSemana },
      materia: { userId },
    },
    include: { materia: true },
    orderBy: { dataProgramada: "asc" },
  });

  const totalQuestoes = revisoesConcluidas.reduce(
    (acc, r) => acc + r.questoesTotal,
    0,
  );
  const totalAcertos = revisoesConcluidas.reduce(
    (acc, r) => acc + r.questoesAcerto,
    0,
  );
  const desempenhoGeral =
    totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;
  const objetivoMinutos = metaAtual?.objetivoMinutos || 0;

  const streak = await buscarStreak(userId);

  // Detecta modo véspera
  const materiasVespera = await detectarModoVespera(userId);
  const nomesVespera = materiasVespera.map((m) => m.nome);

  // Ordena revisões de hoje: véspera primeiro, depois o resto
  const revisoesHoje = [...revisoesHojeBruto].sort((a, b) => {
    const aVespera = nomesVespera.includes(a.materia.nome) ? 0 : 1;
    const bVespera = nomesVespera.includes(b.materia.nome) ? 0 : 1;
    return aVespera - bVespera;
  });

  async function concluirRevisao(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;

    const revisaoId = formData.get("revisaoId") as string;
    const total = parseInt(formData.get("total") as string);
    const acertos = parseInt(formData.get("acertos") as string);

    if (!revisaoId || isNaN(total) || isNaN(acertos)) return;
    if (total <= 0 || acertos < 0 || acertos > total) return;

    const revisao = await prisma.revisao.findFirst({
      where: { id: revisaoId, materia: { userId: session.user.id } },
      include: { materia: true },
    });
    if (!revisao) return;

    await prisma.revisao.update({
      where: { id: revisaoId },
      data: {
        concluida: true,
        concluidaEm: new Date(),
        questoesTotal: total,
        questoesAcerto: acertos,
      },
    });

    await incrementarStreak(session.user.id);

    const todasRevisoes = await prisma.revisao.findMany({
      where: { materiaId: revisao.materiaId, concluida: true },
    });

    const totalQuestoesAcum = todasRevisoes.reduce(
      (acc, r) => acc + r.questoesTotal,
      0,
    );
    const totalAcertosAcum = todasRevisoes.reduce(
      (acc, r) => acc + r.questoesAcerto,
      0,
    );
    const taxaAcerto = calcularTaxaAcerto(totalAcertosAcum, totalQuestoesAcum);
    const novaPrioridade = calcularPrioridadeAdaptativa(
      revisao.materia.pesoNoExame,
      taxaAcerto,
    );

    await prisma.materia.update({
      where: { id: revisao.materiaId },
      data: { prioridadeAdaptativa: novaPrioridade },
    });

    revalidatePath("/");
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 text-white">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Painel de Controle
        </h1>
        <p className="text-zinc-400 mt-2">
          Inteligência aplicada ao seu ciclo de aprovação.
        </p>
      </header>

      <StreakCard atual={streak?.atual ?? 0} maximo={streak?.maximo ?? 0} />

      {materiasVespera.length > 0 && (
        <VesperaBanner materias={materiasVespera} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Desempenho Geral
            </CardTitle>
            <TrendingUp
              className={`w-4 h-4 ${desempenhoGeral >= 70 ? "text-emerald-500" : "text-amber-500"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{desempenhoGeral}%</div>
            <p className="text-xs text-zinc-500 mt-1">
              Taxa de acertos em questões
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Matérias Ativas
            </CardTitle>
            <BookCheck className="w-4 h-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materias.length}</div>
            <p className="text-xs text-zinc-500 mt-1">
              Disciplinas em ciclo de estudo
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Status da Meta
            </CardTitle>
            <AlertCircle className="w-4 h-4 text-zinc-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {objetivoMinutos > 0
                ? `${Math.round(objetivoMinutos / 60)}h`
                : "--"}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Objetivo semanal planejado
            </p>
          </CardContent>
        </Card>
      </div>

      <RevisoesAbas
        revisoesAtrasadas={revisoesAtrasadas}
        revisoesHoje={revisoesHoje}
        revisoesSemana={revisoesSemana}
        onConcluir={concluirRevisao}
        materiasVesperaIds={nomesVespera}
      />

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-pink-600" /> Evolução Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {revisoesConcluidas.length === 0 ? (
            <p className="text-zinc-500 text-center py-4">
              Nenhuma revisão concluída ainda.
            </p>
          ) : (
            <div className="space-y-3">
              {revisoesConcluidas.slice(0, 5).map((rev) => {
                const percentual =
                  rev.questoesTotal > 0
                    ? Math.round((rev.questoesAcerto / rev.questoesTotal) * 100)
                    : 0;
                const isGood =
                  rev.questoesTotal > 0 &&
                  rev.questoesAcerto / rev.questoesTotal >= 0.7;
                return (
                  <div
                    key={rev.id}
                    className="flex justify-between items-center p-4 rounded-lg bg-zinc-950 border border-zinc-800"
                  >
                    <div className="space-y-1">
                      <p className="font-bold text-white">{rev.materia.nome}</p>
                      <p className="text-xs text-zinc-500">
                        {rev.questoesAcerto}/{rev.questoesTotal} acertos
                      </p>
                      <p className="text-xs text-zinc-600">
                        Estudado em:{" "}
                        {rev.concluidaEm
                          ? new Date(rev.concluidaEm).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : new Date(rev.dataProgramada).toLocaleDateString(
                              "pt-BR",
                            )}
                      </p>
                    </div>
                    <div
                      className={`text-lg font-black ${isGood ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {percentual}%
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
