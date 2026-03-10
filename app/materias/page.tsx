import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { addDays, getTodayAtMidnight, isFutureDate } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function MateriasPage() {
  const materias = await prisma.materia.findMany({
    orderBy: { dataExame: "asc" },
  });

  // Mapa de cores - Tailwind não parseia classe dinâmica, então usamos inline style
  const coresMap: Record<string, string> = {
    "pink-600": "#ec4899",
    "blue-600": "#2563eb",
    "purple-600": "#9333ea",
    "green-600": "#16a34a",
    "red-600": "#dc2626",
    "amber-600": "#d97706",
  };

  async function criarMateria(formData: FormData) {
    "use server";
    const nome = formData.get("nome") as string;
    const dataExame = new Date(formData.get("dataExame") as string);
    const prioridade = parseInt(formData.get("prioridade") as string);

    // Validação 1: dados básicos
    if (!nome || isNaN(dataExame.getTime())) return;
    if (prioridade < 1 || prioridade > 3) return;

    // Validação 2: data de exame deve ser no futuro
    if (!isFutureDate(dataExame)) return;

    // Validação 3: rotina cadastrada (ANTES de criar matéria)
    const rotinas = await prisma.rotina.findMany();
    if (rotinas.length === 0) return;

    // 1. Cria a Matéria
    const novaMateria = await prisma.materia.create({
      data: { nome, dataExame, prioridade },
    });

    // 2. Define os intervalos de revisão
    const intervalos = [1, 7, 14];
    const hoje = getTodayAtMidnight();

    for (const dias of intervalos) {
      const dataAlvo = addDays(hoje, dias);

      // Validação: revisão não pode ser programada para depois da prova
      if (dataAlvo >= dataExame) continue;

      // Encontra o próximo dia da rotina disponível
      const horarioDisponivel = rotinas.find(
        (r) => r.diaSemana === dataAlvo.getDay(),
      );

      if (horarioDisponivel) {
        await prisma.revisao.create({
          data: {
            materiaId: novaMateria.id,
            dataProgramada: dataAlvo,
            concluida: false,
          },
        });
      }
    }

    // 3. Cria a revisão "Véspera de Prova"
    const vespera = addDays(dataExame, -1);

    // Validação: véspera não pode ser antes de hoje
    if (vespera >= hoje) {
      await prisma.revisao.create({
        data: {
          materiaId: novaMateria.id,
          dataProgramada: vespera,
          concluida: false,
        },
      });
    }

    revalidatePath("/materias");
    revalidatePath("/");
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-white">
      <header>
        <h1 className="text-3xl font-bold">Configuração de Disciplinas</h1>
        <p className="text-zinc-400">
          Insira os dados para o algoritmo de priorização.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="bg-zinc-900 border-zinc-800 h-fit">
          <CardHeader>
            <CardTitle className="text-white">Nova Matéria</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={criarMateria} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Matéria</Label>
                <Input
                  name="nome"
                  placeholder="Ex: Direito Civil"
                  minLength={3}
                  maxLength={100}
                  required
                  className="bg-zinc-950 border-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <Label>Data do Exame (futuro)</Label>
                <Input
                  name="dataExame"
                  type="date"
                  required
                  className="bg-zinc-950 border-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <Label>Prioridade (Peso)</Label>
                <Select name="prioridade" defaultValue="2">
                  <SelectTrigger className="bg-zinc-950 border-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectItem value="1">
                      1 - Baixa (Conhecimento Prévio)
                    </SelectItem>
                    <SelectItem value="2">2 - Média (Padrão)</SelectItem>
                    <SelectItem value="3">
                      3 - Alta (Dificuldade/Peso Prova)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700"
              >
                Cadastrar e Calcular Ciclo
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {materias.map((m) => (
            <Card
              key={m.id}
              className="bg-zinc-900 border-zinc-800 overflow-hidden"
            >
              <div
                className="h-1.5 w-full"
                style={{
                  backgroundColor: coresMap[m.cor] || coresMap["pink-600"],
                }}
              />
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl">{m.nome}</h3>
                    <p className="text-sm text-zinc-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" /> Prova:{" "}
                      {m.dataExame.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      m.prioridade === 3
                        ? "bg-red-500/10 text-red-500"
                        : "bg-blue-500/10 text-blue-500"
                    }`}
                  >
                    P{m.prioridade}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
