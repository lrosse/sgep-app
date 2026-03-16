import { auth } from "@/auth";
import { RotinaClient } from "@/components/ui/RotinaClient";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function RotinaPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const rotinas = await prisma.rotina.findMany({
    where: { userId },
    orderBy: [{ diaSemana: "asc" }, { horaInicio: "asc" }],
  });

  async function adicionarHorario(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;
    const userId = session.user.id;

    const diaSemana = parseInt(formData.get("dia") as string);
    const horaInicio = formData.get("inicio") as string;
    const horaFim = formData.get("fim") as string;

    if (isNaN(diaSemana) || diaSemana < 0 || diaSemana > 6) return;
    if (!horaInicio || !horaFim || horaFim <= horaInicio) return;

    await prisma.rotina.create({
      data: { diaSemana, horaInicio, horaFim, userId },
    });

    revalidatePath("/rotina");
  }

  async function excluirHorario(id: string) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;

    await prisma.rotina.deleteMany({
      where: { id, userId: session.user.id },
    });

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
      <RotinaClient
        rotinas={rotinas}
        onAdicionar={adicionarHorario}
        onExcluir={excluirHorario}
      />
    </div>
  );
}
