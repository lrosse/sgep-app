import { auth } from "@/auth";
import { DiaCard } from "@/components/ui/DiaCard";
import { PlanoSemanalClient } from "@/components/ui/PlanoSemanalClient";
import {
  distribuirRevisoesNoBloco,
  sugerirMelhorDia,
  type RevisaoComMateria,
  type RotinaBloco,
} from "@/lib/plano";
import { prisma } from "@/lib/prisma";
import { getTodayAtMidnight } from "@/lib/utils";
import { CalendarRange } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const DIAS_SEMANA = [
  { nome: "Domingo", curto: "DOM" },
  { nome: "Segunda-feira", curto: "SEG" },
  { nome: "Terça-feira", curto: "TER" },
  { nome: "Quarta-feira", curto: "QUA" },
  { nome: "Quinta-feira", curto: "QUI" },
  { nome: "Sexta-feira", curto: "SEX" },
  { nome: "Sábado", curto: "SÁB" },
];

export default async function PlanoSemanalPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const hoje = getTodayAtMidnight();
  const diaDaSemanaHoje = hoje.getDay();
  const inicioSemana = new Date(hoje);
  const diffParaSegunda = diaDaSemanaHoje === 0 ? -6 : 1 - diaDaSemanaHoje;
  inicioSemana.setDate(hoje.getDate() + diffParaSegunda);

  const dias = Array.from({ length: 7 }, (_, i) => {
    const data = new Date(inicioSemana);
    data.setDate(inicioSemana.getDate() + i);
    return data;
  });

  const fimSemana = new Date(dias[6]);
  fimSemana.setHours(23, 59, 59, 999);

  const rotinas = await prisma.rotina.findMany({
    where: { userId },
    orderBy: { horaInicio: "asc" },
  });

  const revisoesSemana = (await prisma.revisao.findMany({
    where: {
      concluida: false,
      materia: { userId },
      dataProgramada: { gte: dias[0], lte: fimSemana },
    },
    include: { materia: true },
    orderBy: [
      { materia: { prioridadeAdaptativa: "desc" } },
      { dataProgramada: "asc" },
    ],
  })) as RevisaoComMateria[];

  // Monta mapa de rotinas e revisões por dia para sugestão
  const rotinasPorDia = new Map<number, RotinaBloco[]>();
  rotinas.forEach((r) => {
    if (!rotinasPorDia.has(r.diaSemana)) rotinasPorDia.set(r.diaSemana, []);
    rotinasPorDia.get(r.diaSemana)!.push(r);
  });

  const revisoesPorDia = new Map<string, RevisaoComMateria[]>();
  revisoesSemana.forEach((rev) => {
    const chave = new Date(rev.dataProgramada).toISOString().split("T")[0];
    if (!revisoesPorDia.has(chave)) revisoesPorDia.set(chave, []);
    revisoesPorDia.get(chave)!.push(rev);
  });

  // Processa cada dia: distribui revisões nos blocos
  const diasProcessados = dias.map((data) => {
    const diaSemana = data.getDay();
    const rotinasNoDia = rotinas.filter((r) => r.diaSemana === diaSemana);
    const chave = data.toISOString().split("T")[0];
    const revisoesNoDia = revisoesPorDia.get(chave) || [];

    // Distribui revisões entre os blocos proporcionalmente
    let revisoesRestantes = [...revisoesNoDia];
    const blocos = rotinasNoDia.map((bloco) => {
      const alocado = distribuirRevisoesNoBloco(bloco, revisoesRestantes);
      revisoesRestantes = []; // blocos seguintes ficam livres
      return alocado;
    });

    // Revisões que ficaram sem horário (dia sem rotina)
    const revisoesSemHorario = rotinasNoDia.length === 0 ? revisoesNoDia : [];

    return { data, diaSemana, blocos, revisoesSemHorario };
  });

  // Detecta revisões com tempo insuficiente e sugere reagendamento
  const revisoesPendentes = diasProcessados.flatMap(({ data, blocos }) =>
    blocos
      .filter((b) => b.tempoInsuficiente)
      .flatMap((b) =>
        b.revisoes
          .filter((r) => {
            const [hi, mi] = r.horaInicio.split(":").map(Number);
            const [hf, mf] = r.horaFim.split(":").map(Number);
            return hf * 60 + mf - (hi * 60 + mi) < 10;
          })
          .map((r) => {
            const revisaoOriginal = revisoesSemana.find(
              (rev) => rev.id === r.revisaoId,
            )!;
            const melhorDia = sugerirMelhorDia(
              revisaoOriginal,
              dias,
              rotinasPorDia,
              revisoesPorDia,
            );
            const diasDisponiveis = dias
              .filter((d) => {
                const d0 = new Date(d);
                d0.setHours(0, 0, 0, 0);
                if (d0 < hoje) return false;
                const diaSemana = d0.getDay();
                const rotinasD = rotinasPorDia.get(diaSemana) || [];
                if (rotinasD.length === 0) return false;
                const chave = d0.toISOString().split("T")[0];
                const revisoesD = revisoesPorDia.get(chave) || [];
                if (revisoesD.length >= 3) return false;
                const dataExame = new Date(revisaoOriginal.materia.dataExame);
                dataExame.setHours(0, 0, 0, 0);
                const diasParaExame =
                  (dataExame.getTime() - d0.getTime()) / (1000 * 60 * 60 * 24);
                if (diasParaExame < 2) return false;
                return true;
              })
              .map((d) => {
                const d0 = new Date(d);
                d0.setHours(0, 0, 0, 0);
                const chave = d0.toISOString().split("T")[0];
                return {
                  data: d,
                  diaNome: DIAS_SEMANA[d0.getDay()].nome,
                  numRevisoes: (revisoesPorDia.get(chave) || []).length,
                  isSugerido:
                    melhorDia !== null &&
                    d0.getTime() === new Date(melhorDia).setHours(0, 0, 0, 0),
                };
              });

            return {
              id: r.revisaoId,
              materiaNome: r.materiaNome,
              dataOriginal: data,
              diasDisponiveis,
            };
          }),
      ),
  );

  async function reagendarRevisoes(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;

    const entries = Array.from(formData.entries());
    for (const [key, value] of entries) {
      if (!key.startsWith("reagendar_") || !value) continue;
      const revisaoId = key.replace("reagendar_", "");
      const novaData = new Date(value as string);
      novaData.setHours(12, 0, 0, 0);

      // Verifica que a revisão pertence ao usuário
      const revisao = await prisma.revisao.findFirst({
        where: { id: revisaoId, materia: { userId: session.user.id } },
      });
      if (!revisao) continue;

      await prisma.revisao.update({
        where: { id: revisaoId },
        data: { dataProgramada: novaData },
      });
    }

    revalidatePath("/plano-semanal");
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-white">
      <header>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <CalendarRange className="w-8 h-8 text-pink-600" />
          Plano Semanal
        </h1>
        <p className="text-zinc-400 mt-2">
          Semana de{" "}
          {dias[0].toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
          })}{" "}
          a{" "}
          {dias[6].toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </header>

      {/* Client component gerencia o modal de reagendamento */}
      <PlanoSemanalClient
        revisoesPendentes={revisoesPendentes}
        onReagendar={reagendarRevisoes}
      />

      {/* Grade semanal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {diasProcessados.map(({ data, diaSemana, blocos }, i) => (
          <DiaCard
            key={i}
            diaCurto={DIAS_SEMANA[diaSemana].curto}
            data={data}
            isHoje={data.getTime() === hoje.getTime()}
            blocos={blocos}
            temHorario={rotinas.some((r) => r.diaSemana === diaSemana)}
          />
        ))}
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-4 pt-2 border-t border-zinc-800 text-xs text-zinc-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500/50 border border-amber-500" />
          Chip com ⚠️ = prioridade alta (algoritmo adaptativo)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400/30 border border-amber-400" />
          Badge ⚡ Intenso = mais de 3 revisões no dia
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-pink-500/30 border border-pink-500" />
          Borda rosa = hoje
        </div>
      </div>
    </div>
  );
}
