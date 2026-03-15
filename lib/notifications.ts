import { prisma } from "@/lib/prisma";
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_MAILTO!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

type PushPayload = {
  title: string;
  body: string;
  icon?: string;
  url?: string;
};

async function enviarParaUsuario(userId: string, payload: PushPayload) {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  const resultados = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush
        .sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload),
        )
        .catch(async (err) => {
          // Subscription expirada ou inválida — remove do banco
          if (err.statusCode === 404 || err.statusCode === 410) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } });
          }
          throw err;
        }),
    ),
  );

  return resultados;
}

/** Notifica o usuário sobre revisões agendadas para hoje */
export async function notificarRevisaoHoje(userId: string) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const fimHoje = new Date(hoje);
  fimHoje.setHours(23, 59, 59, 999);

  const revisoes = await prisma.revisao.findMany({
    where: {
      concluida: false,
      dataProgramada: { gte: hoje, lte: fimHoje },
      materia: { userId },
    },
    include: { materia: true },
  });

  if (revisoes.length === 0) return;

  const nomes = revisoes.map((r) => r.materia.nome).join(", ");

  return enviarParaUsuario(userId, {
    title: `📚 ${revisoes.length} revisão(ões) para hoje`,
    body: nomes,
    url: "/",
  });
}

/** Notifica o usuário sobre matérias em modo véspera */
export async function notificarVespera(userId: string) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const limite = new Date(hoje);
  limite.setDate(limite.getDate() + 3);
  limite.setHours(23, 59, 59, 999);

  const materias = await prisma.materia.findMany({
    where: { userId, dataExame: { gte: hoje, lte: limite } },
    orderBy: { dataExame: "asc" },
  });

  if (materias.length === 0) return;

  const nomes = materias.map((m) => m.nome).join(", ");

  return enviarParaUsuario(userId, {
    title: "🚨 Modo Véspera Ativado!",
    body: `Exame próximo: ${nomes}. Priorize as revisões hoje!`,
    url: "/",
  });
}

/** Notifica o usuário que o streak está em risco (não estudou ainda hoje) */
export async function notificarStreakRisco(userId: string) {
  const streak = await prisma.streak.findUnique({ where: { userId } });
  if (!streak || streak.atual === 0) return;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const ultimoEstudo = streak.ultimoEstudo
    ? new Date(streak.ultimoEstudo)
    : null;
  if (ultimoEstudo) {
    ultimoEstudo.setHours(0, 0, 0, 0);
    // Já estudou hoje — streak não está em risco
    if (ultimoEstudo.getTime() === hoje.getTime()) return;
  }

  return enviarParaUsuario(userId, {
    title: `🔥 Seu streak de ${streak.atual} dias está em risco!`,
    body: "Você ainda não estudou hoje. Conclua uma revisão para manter sua sequência.",
    url: "/",
  });
}
