import { enviarResumoSemanal } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Chamar todo domingo às 20h
// Exemplo no vercel.json:
// { "crons": [{ "path": "/api/cron/weekly-email", "schedule": "0 20 * * 0" }] }

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Busca todos os usuários com e-mail cadastrado
    const usuarios = await prisma.user.findMany({
      select: { id: true, email: true },
      where: { email: { not: undefined } },
    });

    const resultados = await Promise.allSettled(
      usuarios.map(({ id }) => enviarResumoSemanal(id)),
    );

    const sucesso = resultados.filter((r) => r.status === "fulfilled").length;
    const erros = resultados.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      ok: true,
      totalUsuarios: usuarios.length,
      sucesso,
      erros,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] Erro no cron de e-mail semanal:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
