import { auth } from "@/auth";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { MateriasClient } from "@/components/ui/MateriasClient";
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
import {
  addDays,
  getTodayAtMidnight,
  isFutureDate,
  parseDateLocal,
} from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function MateriasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const materias = await prisma.materia.findMany({
    where: { userId },
    orderBy: { dataExame: "asc" },
  });

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
    const session = await auth();
    if (!session?.user?.id) return;
    const userId = session.user.id;

    const nome = formData.get("nome") as string;
    const dataExame = parseDateLocal(formData.get("dataExame") as string);
    const prioridade = parseInt(formData.get("prioridade") as string);
    const pesoNoExame = parseFloat(formData.get("pesoNoExame") as string);
    const cor = (formData.get("cor") as string) || "#ec4899";

    if (!nome || isNaN(dataExame.getTime())) return;
    if (prioridade < 1 || prioridade > 3) return;
    if (!isFutureDate(dataExame)) return;
    if (isNaN(pesoNoExame) || pesoNoExame < 0 || pesoNoExame > 100) return;

    const rotinas = await prisma.rotina.findMany({ where: { userId } });
    if (rotinas.length === 0) return;

    const novaMateria = await prisma.materia.create({
      data: {
        nome,
        dataExame,
        prioridade,
        pesoNoExame,
        cor,
        prioridadeAdaptativa: pesoNoExame / 100,
        userId,
      },
    });

    const intervalos = [1, 7, 14];
    const hoje = getTodayAtMidnight();

    for (const dias of intervalos) {
      const dataAlvo = addDays(hoje, dias);
      if (dataAlvo >= dataExame) continue;

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

    const vespera = addDays(dataExame, -1);
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

  async function editarMateria(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;

    const id = formData.get("id") as string;
    const nome = formData.get("nome") as string;
    const dataExame = parseDateLocal(formData.get("dataExame") as string);
    const prioridade = parseInt(formData.get("prioridade") as string);
    const pesoNoExame = parseFloat(formData.get("pesoNoExame") as string);
    const cor = formData.get("cor") as string;

    if (!id || !nome || isNaN(dataExame.getTime())) return;
    if (prioridade < 1 || prioridade > 3) return;
    if (isNaN(pesoNoExame) || pesoNoExame < 0 || pesoNoExame > 100) return;

    const materia = await prisma.materia.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!materia) return;

    await prisma.materia.update({
      where: { id },
      data: { nome, dataExame, prioridade, pesoNoExame, cor },
    });

    if (materia.dataExame.getTime() !== dataExame.getTime()) {
      const hoje = getTodayAtMidnight();

      await prisma.revisao.deleteMany({
        where: {
          materiaId: id,
          concluida: false,
          dataProgramada: { gte: hoje },
        },
      });

      const rotinas = await prisma.rotina.findMany({
        where: { userId: session.user.id },
      });

      const intervalos = [1, 7, 14];
      for (const dias of intervalos) {
        const dataAlvo = addDays(hoje, dias);
        if (dataAlvo >= dataExame) continue;

        const horarioDisponivel = rotinas.find(
          (r) => r.diaSemana === dataAlvo.getDay(),
        );
        if (horarioDisponivel) {
          await prisma.revisao.create({
            data: {
              materiaId: id,
              dataProgramada: dataAlvo,
              concluida: false,
            },
          });
        }
      }

      const vespera = addDays(dataExame, -1);
      if (vespera >= hoje) {
        await prisma.revisao.create({
          data: {
            materiaId: id,
            dataProgramada: vespera,
            concluida: false,
          },
        });
      }
    }

    revalidatePath("/materias");
    revalidatePath("/");
  }

  async function deletarMateria(id: string) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;

    const materia = await prisma.materia.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!materia) return;

    await prisma.materia.delete({ where: { id } });

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
                <Label>Peso no Exame (50% padrão)</Label>
                <input
                  name="pesoNoExame"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  defaultValue={50}
                  className="w-full accent-pink-600"
                />
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
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

              <ColorPicker name="cor" defaultValue="#ec4899" />

              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700"
              >
                Cadastrar e Calcular Ciclo
              </Button>
            </form>
          </CardContent>
        </Card>

        <MateriasClient
          materias={materias}
          coresMap={coresMap}
          onEditar={editarMateria}
          onDeletar={deletarMateria}
        />
      </div>
    </div>
  );
}
