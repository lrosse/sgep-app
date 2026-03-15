import { prisma } from "@/lib/prisma";

export type MateriaVespera = {
  id: string;
  nome: string;
  cor: string;
  dataExame: Date;
  diasRestantes: number;
  prioridadeAdaptativa: number;
};

/**
 * Detecta matérias cujo exame está a 3 dias ou menos.
 * Retorna lista ordenada por urgência (mais próximo primeiro).
 */
export async function detectarModoVespera(
  userId: string,
): Promise<MateriaVespera[]> {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const limite = new Date(hoje);
  limite.setDate(limite.getDate() + 3);
  limite.setHours(23, 59, 59, 999);

  const materias = await prisma.materia.findMany({
    where: {
      userId,
      dataExame: {
        gte: hoje, // não mostra exames que já passaram
        lte: limite, // apenas os próximos 3 dias
      },
    },
    orderBy: { dataExame: "asc" },
  });

  return materias.map((m) => {
    const exame = new Date(m.dataExame);
    exame.setHours(0, 0, 0, 0);
    const diffMs = exame.getTime() - hoje.getTime();
    const diasRestantes = Math.round(diffMs / (1000 * 60 * 60 * 24));

    return {
      id: m.id,
      nome: m.nome,
      cor: m.cor,
      dataExame: m.dataExame,
      diasRestantes,
      prioridadeAdaptativa: m.prioridadeAdaptativa,
    };
  });
}
