import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { Target } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function MetasPage() {
  const metas = await prisma.meta.findMany({
    where: { ativa: true },
    orderBy: { createdAt: "desc" },
  });

  async function definirMeta(formData: FormData) {
    "use server";
    const horas = parseInt(formData.get("horas") as string);

    // Validação: horas devem estar em intervalo válido (0.5 a 168 horas/semana)
    if (isNaN(horas) || horas <= 0 || horas > 168) return;

    // Desativa todas as metas anteriores
    await prisma.meta.updateMany({ data: { ativa: false } });

    // Cria nova meta
    await prisma.meta.create({
      data: { objetivoMinutos: horas * 60 },
    });

    revalidatePath("/metas");
    revalidatePath("/");
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Metas de Estudo
        </h1>
        <p className="text-zinc-400 mt-2">Defina seus objetivos semanais.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="w-5 h-5 text-pink-600" /> Meta Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metas[0] ? (
              <div className="space-y-1">
                <span className="text-5xl font-black text-white">
                  {metas[0].objetivoMinutos / 60}h
                </span>
                <p className="text-zinc-500 text-sm">por semana</p>
              </div>
            ) : (
              <p className="text-zinc-500">Nenhuma meta definida.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Ajustar Objetivo</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={definirMeta} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Horas Semanais</Label>
                <Input
                  name="horas"
                  type="number"
                  placeholder="Ex: 15"
                  min="1"
                  max="168"
                  required
                  className="bg-zinc-950"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                Salvar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
