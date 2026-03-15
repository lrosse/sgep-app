import { prisma } from "@/lib/prisma";

export async function incrementarStreak(userId: string) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const ontem = new Date(hoje);
  ontem.setDate(ontem.getDate() - 1);

  const streak = await prisma.streak.findUnique({ where: { userId } });

  if (!streak) {
    // Primeira vez estudando
    return prisma.streak.create({
      data: { userId, atual: 1, maximo: 1, ultimoEstudo: new Date() },
    });
  }

  const ultimoEstudo = streak.ultimoEstudo
    ? new Date(streak.ultimoEstudo)
    : null;

  if (ultimoEstudo) {
    ultimoEstudo.setHours(0, 0, 0, 0);

    // Já estudou hoje — não incrementa
    if (ultimoEstudo.getTime() === hoje.getTime()) {
      return streak;
    }

    // Estudou ontem — incrementa
    if (ultimoEstudo.getTime() === ontem.getTime()) {
      const novoAtual = streak.atual + 1;
      const novoMaximo = Math.max(novoAtual, streak.maximo);
      return prisma.streak.update({
        where: { userId },
        data: {
          atual: novoAtual,
          maximo: novoMaximo,
          ultimoEstudo: new Date(),
        },
      });
    }
  }

  // Pulou um dia — zera
  return prisma.streak.update({
    where: { userId },
    data: { atual: 1, ultimoEstudo: new Date() },
  });
}

export async function zerarStreaksAtrasados() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Zera streaks de quem não estudou hoje nem ontem
  await prisma.streak.updateMany({
    where: {
      ultimoEstudo: { lt: hoje },
      atual: { gt: 0 },
    },
    data: { atual: 0 },
  });
}

export async function buscarStreak(userId: string) {
  return prisma.streak.findUnique({ where: { userId } });
}
