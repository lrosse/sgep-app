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
import { CalendarDays, Clock, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

const DIAS_SEMANA = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export default async function RotinaPage() {
  const rotinas = await prisma.rotina.findMany({
    orderBy: [{ diaSemana: "asc" }, { horaInicio: "asc" }],
  });

  async function adicionarHorario(formData: FormData) {
    "use server";
    const diaSemana = parseInt(formData.get("dia") as string);
    const horaInicio = formData.get("inicio") as string;
    const horaFim = formData.get("fim") as string;

    // Validação: dia da semana válido (0-6)
    if (isNaN(diaSemana) || diaSemana < 0 || diaSemana > 6) return;

    // Validação: horas em formato válido e horaFim > horaInicio
    if (!horaInicio || !horaFim || horaFim <= horaInicio) return;

    await prisma.rotina.create({
      data: { diaSemana, horaInicio, horaFim },
    });

    revalidatePath("/rotina");
  }

  async function excluirHorario(id: string) {
    "use server";
    await prisma.rotina.delete({ where: { id } });
    revalidatePath("/rotina");
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 text-white">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Disponibilidade Semanal
        </h1>
        <p className="text-zinc-400 mt-2">
          Diga ao sistema quando você está livre para estudar.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário de Cadastro */}
        <Card className="bg-zinc-900 border-zinc-800 h-fit">
          <CardHeader>
            <CardTitle className="text-white">Novo Bloco de Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={adicionarHorario} className="space-y-4">
              <div className="space-y-2">
                <Label>Dia da Semana</Label>
                <Select name="dia" required>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    {DIAS_SEMANA.map((dia, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {dia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Início</Label>
                  <Input
                    name="inicio"
                    type="time"
                    required
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fim (deve ser após início)</Label>
                  <Input
                    name="fim"
                    type="time"
                    required
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700"
              >
                Salvar Horário
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Horários */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-pink-600" /> Seus Horários
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rotinas.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">
                  Nenhum horário livre cadastrado.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {rotinas.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 group"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-zinc-500" />
                        <div>
                          <p className="font-medium text-sm text-white">
                            {DIAS_SEMANA[r.diaSemana]}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {r.horaInicio} às {r.horaFim}
                          </p>
                        </div>
                      </div>
                      <form action={excluirHorario.bind(null, r.id)}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-zinc-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
