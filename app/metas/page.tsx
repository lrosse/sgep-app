import { auth } from "@/auth";
import { MetasClient } from "@/components/ui/MetasClient";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function MetasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const meta = await prisma.meta.findFirst({
    where: { ativa: true, userId },
    orderBy: { createdAt: "desc" },
  });

  async function definirMeta(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;
    const userId = session.user.id;

    const horas = parseInt(formData.get("horas") as string);
    if (isNaN(horas) || horas <= 0 || horas > 168) return;

    await prisma.meta.updateMany({ where: { userId }, data: { ativa: false } });
    await prisma.meta.create({ data: { objetivoMinutos: horas * 60, userId } });

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
      <MetasClient metaAtual={meta ?? undefined} onSalvar={definirMeta} />
    </div>
  );
}
