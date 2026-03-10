import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { prisma } from "@/lib/prisma";
import { getTodayAtEndOfDay } from "@/lib/utils";
import {
  Activity,
  AlertCircle,
  BookCheck,
  CalendarRange,
  CheckCircle2,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function Dashboard() {
  // 1. BUSCA DE DADOS
  const materias = await prisma.materia.findMany({
    orderBy: { dataExame: "asc" },
  });

  const metaAtual = await prisma.meta.findFirst({
    where: { ativa: true },
    orderBy: { createdAt: "desc" },
  });

  // Buscamos as revisões já concluídas para o histórico/média
  const revisoesConcluidas = await prisma.revisao.findMany({
    where: { concluida: true },
    include: { materia: true },
    orderBy: { dataProgramada: "desc" },
  });

  // Buscamos o que está agendado para HOJE (ou atrasado) e não foi feito
  const hoje = getTodayAtEndOfDay();

  const revisoesPendentes = await prisma.revisao.findMany({
    where: {
      concluida: false,
      dataProgramada: { lte: hoje },
    },
    include: { materia: true },
    orderBy: { dataProgramada: "asc" },
  });

  // 2. CÁLCULOS DE INTELIGÊNCIA
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

  // 3. AÇÃO DE REGISTRO DE PERFORMANCE
  async function registrarPerformance(formData: FormData) {
    "use server";
    const materiaId = formData.get("materiaId") as string;
    const total = parseInt(formData.get("total") as string);
    const acertos = parseInt(formData.get("acertos") as string);

    // Validação rigorosa: material, total, acertos válidos e coerentes
    if (!materiaId || isNaN(total) || isNaN(acertos)) return;
    if (total <= 0 || acertos < 0 || acertos > total) return;

    // Registra a conclusão e os dados de acerto
    await prisma.revisao.create({
      data: {
        materiaId,
        dataProgramada: new Date(),
        concluida: true,
        questoesTotal: total,
        questoesAcerto: acertos,
      },
    });

    revalidatePath("/");
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-white">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Painel de Controle
        </h1>
        <p className="text-zinc-400 mt-2">
          Inteligência aplicada ao seu ciclo de aprovação.
        </p>
      </header>

      {/* MÉTRICAS DE PERFORMANCE */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CRONOGRAMA INTELIGENTE (O QUE ESTUDAR HOJE) */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CalendarRange className="w-5 h-5 text-pink-600" /> O que estudar
              hoje?
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Tarefas agendadas automaticamente pela sua rotina.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {revisoesPendentes.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-zinc-800 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                <p className="text-zinc-500 text-sm font-medium">
                  Você está em dia com seu cronograma!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {revisoesPendentes.map((rev) => (
                  <div
                    key={rev.id}
                    className="flex justify-between items-center p-4 rounded-lg bg-zinc-950 border-l-4 border-pink-600"
                  >
                    <div>
                      <p className="font-bold text-white">{rev.materia.nome}</p>
                      <p className="text-xs text-zinc-500">
                        Agendado para:{" "}
                        {new Date(rev.dataProgramada).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-zinc-900 rounded-full text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      P{rev.materia.prioridade}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* REGISTRO DE PERFORMANCE */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-pink-600" /> Registrar
              Desempenho
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Insira os dados da sessão para alimentar o algoritmo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={registrarPerformance} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Matéria Estudada</Label>
                  <Select name="materiaId" required>
                    <SelectTrigger className="bg-zinc-950 border-zinc-800">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      {materias.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Total de Questões</Label>
                    <Input
                      name="total"
                      type="number"
                      required
                      className="bg-zinc-950 border-zinc-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Acertos</Label>
                    <Input
                      name="acertos"
                      type="number"
                      required
                      className="bg-zinc-950 border-zinc-800"
                    />
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700"
              >
                Salvar e Analisar Ciclo
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* HISTÓRICO DE PERFORMANCE */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-pink-600" /> Evolução Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {revisoesConcluidas.length === 0 ? (
            <p className="text-zinc-500 text-center py-4">
              Nenhum registro de questões concluído ainda.
            </p>
          ) : (
            <div className="space-y-3">
              {revisoesConcluidas.slice(0, 5).map((rev) => {
                const percentual =
                  rev.questoesTotal > 0
                    ? Math.round((rev.questoesAcerto / rev.questoesTotal) * 100)
                    : 0;
                const isGoodPerformance =
                  rev.questoesTotal > 0 &&
                  rev.questoesAcerto / rev.questoesTotal >= 0.7;
                return (
                  <div
                    key={rev.id}
                    className="flex justify-between items-center p-4 rounded-lg bg-zinc-950 border border-zinc-800"
                  >
                    <div>
                      <p className="font-bold">{rev.materia.nome}</p>
                      <p className="text-sm text-zinc-500">
                        {rev.questoesAcerto}/{rev.questoesTotal} acertos
                      </p>
                    </div>
                    <div
                      className={`text-lg font-black ${isGoodPerformance ? "text-emerald-500" : "text-red-500"}`}
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
