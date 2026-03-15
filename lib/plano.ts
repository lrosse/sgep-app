import { getTodayAtMidnight } from "@/lib/utils";

export type RevisaoComMateria = {
  id: string;
  dataProgramada: Date;
  materia: {
    id: string;
    nome: string;
    cor: string;
    prioridadeAdaptativa: number;
    dataExame: Date;
  };
};

export type RotinaBloco = {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
};

export type RevisaoAlocada = {
  revisaoId: string;
  materiaNome: string;
  materiaCor: string;
  prioridadeAdaptativa: number;
  horaInicio: string;
  horaFim: string;
};

export type BlocoAlocado = {
  rotinaId: string;
  horaInicio: string;
  horaFim: string;
  totalMinutos: number;
  revisoes: RevisaoAlocada[];
  tempoInsuficiente: boolean;
};

export type DiaProcessado = {
  data: Date;
  diaSemana: number;
  blocos: BlocoAlocado[];
  revisoesSemHorario: RevisaoComMateria[]; // revisões que não couberam
};

function calcularMinutos(horaInicio: string, horaFim: string): number {
  const [hi, mi] = horaInicio.split(":").map(Number);
  const [hf, mf] = horaFim.split(":").map(Number);
  return hf * 60 + mf - (hi * 60 + mi);
}

function adicionarMinutos(hora: string, minutos: number): string {
  const [h, m] = hora.split(":").map(Number);
  const total = h * 60 + m + minutos;
  const novaHora = Math.floor(total / 60) % 24;
  const novoMin = total % 60;
  return `${novaHora.toString().padStart(2, "0")}:${novoMin.toString().padStart(2, "0")}`;
}

// Distribui revisões dentro de um bloco de horário
export function distribuirRevisoesNoBloco(
  bloco: RotinaBloco,
  revisoes: RevisaoComMateria[],
): BlocoAlocado {
  const totalMinutos = calcularMinutos(bloco.horaInicio, bloco.horaFim);
  const MINUTOS_MINIMOS = 10;

  if (revisoes.length === 0) {
    return {
      rotinaId: bloco.id,
      horaInicio: bloco.horaInicio,
      horaFim: bloco.horaFim,
      totalMinutos,
      revisoes: [],
      tempoInsuficiente: false,
    };
  }

  // Soma total das prioridades adaptativas
  const somaPrioridades = revisoes.reduce(
    (acc, r) => acc + r.materia.prioridadeAdaptativa,
    0,
  );

  // Calcula minutos por revisão proporcionalmente
  const minutosCalculados = revisoes.map((rev) => ({
    revisao: rev,
    minutos: Math.round(
      (rev.materia.prioridadeAdaptativa / somaPrioridades) * totalMinutos,
    ),
  }));

  // Verifica se alguma ficou com menos de 10 minutos
  const tempoInsuficiente = minutosCalculados.some(
    (r) => r.minutos < MINUTOS_MINIMOS,
  );

  // Aloca os horários bloco a bloco
  const revisoesAlocadas: RevisaoAlocada[] = [];
  let horaAtual = bloco.horaInicio;

  minutosCalculados.forEach(({ revisao, minutos }, idx) => {
    const horaFimRevisao =
      idx === minutosCalculados.length - 1
        ? bloco.horaFim // última revisão sempre termina no fim do bloco
        : adicionarMinutos(horaAtual, minutos);

    revisoesAlocadas.push({
      revisaoId: revisao.id,
      materiaNome: revisao.materia.nome,
      materiaCor: revisao.materia.cor,
      prioridadeAdaptativa: revisao.materia.prioridadeAdaptativa,
      horaInicio: horaAtual,
      horaFim: horaFimRevisao,
    });

    horaAtual = horaFimRevisao;
  });

  return {
    rotinaId: bloco.id,
    horaInicio: bloco.horaInicio,
    horaFim: bloco.horaFim,
    totalMinutos,
    revisoes: revisoesAlocadas,
    tempoInsuficiente,
  };
}

// Sugere o melhor dia para reagendar uma revisão
export function sugerirMelhorDia(
  revisao: RevisaoComMateria,
  diasDaSemana: Date[],
  rotinasPorDia: Map<number, RotinaBloco[]>,
  revisoesPorDia: Map<string, RevisaoComMateria[]>,
): Date | null {
  const hoje = getTodayAtMidnight();
  const dataOriginal = new Date(revisao.dataProgramada);
  dataOriginal.setHours(0, 0, 0, 0);

  const dataExame = new Date(revisao.materia.dataExame);
  dataExame.setHours(0, 0, 0, 0);

  const JANELA_DIAS = 2;
  const MIN_DIAS_ANTES_EXAME = 2;

  // Dias candidatos: ±2 dias da data original, dentro da semana
  const candidatos = diasDaSemana.filter((dia) => {
    const d = new Date(dia);
    d.setHours(0, 0, 0, 0);

    // Não pode ser o próprio dia original
    if (d.getTime() === dataOriginal.getTime()) return false;

    // Não pode ser no passado
    if (d < hoje) return false;

    // Deve estar dentro da janela de tolerância
    const diffDias = Math.abs(
      (d.getTime() - dataOriginal.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDias > JANELA_DIAS) return false;

    // Não pode ser próximo do exame
    const diasParaExame =
      (dataExame.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    if (diasParaExame < MIN_DIAS_ANTES_EXAME) return false;

    // Precisa ter horário livre
    const diaSemana = d.getDay();
    const rotinas = rotinasPorDia.get(diaSemana) || [];
    if (rotinas.length === 0) return false;

    // Não pode estar sobrecarregado (3+ revisões)
    const chave = d.toISOString().split("T")[0];
    const revisoesNoDia = revisoesPorDia.get(chave) || [];
    if (revisoesNoDia.length >= 3) return false;

    return true;
  });

  if (candidatos.length === 0) return null;

  // Ordena por menor número de revisões (dia menos ocupado)
  candidatos.sort((a, b) => {
    const chaveA = a.toISOString().split("T")[0];
    const chaveB = b.toISOString().split("T")[0];
    const revisoesA = (revisoesPorDia.get(chaveA) || []).length;
    const revisoesB = (revisoesPorDia.get(chaveB) || []).length;
    return revisoesA - revisoesB;
  });

  return candidatos[0];
}
