import { zerarStreaksAtrasados } from "@/lib/streak";
import { NextResponse } from "next/server";

// Este endpoint deve ser chamado diariamente à meia-noite por um cron job.
// Em produção: configure um serviço como Vercel Cron, Railway Cron ou
// qualquer agendador HTTP para chamar GET /api/cron/streak com o header
// Authorization: Bearer <CRON_SECRET>
//
// Exemplo no vercel.json:
// {
//   "crons": [{ "path": "/api/cron/streak", "schedule": "0 0 * * *" }]
// }

export async function GET(request: Request) {
  // Proteção básica via secret para evitar chamadas externas indevidas
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await zerarStreaksAtrasados();
    return NextResponse.json({
      ok: true,
      message: "Streaks verificados e zerados com sucesso.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] Erro ao zerar streaks:", error);
    return NextResponse.json(
      { ok: false, error: "Erro interno ao zerar streaks." },
      { status: 500 },
    );
  }
}
