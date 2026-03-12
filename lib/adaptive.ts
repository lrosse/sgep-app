export function calcularPrioridadeAdaptativa(
  pesoNoExame: number,
  taxaAcerto: number,
): number {
  const fator =
    taxaAcerto >= 0.9
      ? 0.5
      : taxaAcerto >= 0.7
        ? 1.0
        : taxaAcerto >= 0.5
          ? 1.5
          : 2.0;

  return (pesoNoExame / 100) * fator;
}

export function calcularTaxaAcerto(
  totalAcertos: number,
  totalQuestoes: number,
): number {
  if (totalQuestoes === 0) return 0;
  return totalAcertos / totalQuestoes;
}
