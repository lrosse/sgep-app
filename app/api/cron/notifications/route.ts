import {
  notificarRevisaoHoje,
  notificarStreakRisco,
  notificarVespera,
} from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Chamar este endpoint todo dia de manhã (ex: 08:00)
// Exemplo no vercel.json:
// { "crons": [{ "path": "/api/cron/notifications", "schedule": "0 8 * * *" }] }

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Busca todos os usuários que têm pelo menos uma subscription ativa
    const usuarios = await prisma.pushSubscription.findMany({
      select: { userId: true },
      distinct: ["userId"],
    });

    const resultados = await Promise.allSettled(
      usuarios.map(async ({ userId }) => {
        await notificarRevisaoHoje(userId);
        await notificarVespera(userId);
        await notificarStreakRisco(userId);
      }),
    );

    const erros = resultados.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      ok: true,
      totalUsuarios: usuarios.length,
      erros,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] Erro no cron de notificações:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
