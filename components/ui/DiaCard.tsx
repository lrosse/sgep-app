"use client";

import { MateriaChip } from "@/components/ui/MateriaChip";
import type { BlocoAlocado } from "@/lib/plano";
import { Clock } from "lucide-react";

type Props = {
  diaCurto: string;
  data: Date;
  isHoje: boolean;
  blocos: BlocoAlocado[];
  temHorario: boolean;
};

export function DiaCard({ diaCurto, data, isHoje, blocos, temHorario }: Props) {
  const totalRevisoes = blocos.reduce((acc, b) => acc + b.revisoes.length, 0);
  const sobrecarregado = totalRevisoes > 3;
  const totalMinutos = blocos.reduce((acc, b) => acc + b.totalMinutos, 0);
  const totalHoras = (totalMinutos / 60).toFixed(1);
  const algumTempoInsuficiente = blocos.some((b) => b.tempoInsuficiente);

  return (
    <div
      className={`rounded-xl border p-4 space-y-3 flex flex-col ${
        isHoje
          ? "bg-pink-500/10 border-pink-500/40"
          : "bg-zinc-900 border-zinc-800"
      }`}
    >
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-xs font-bold uppercase tracking-wider ${isHoje ? "text-pink-400" : "text-zinc-500"}`}
          >
            {diaCurto}
          </p>
          <p
            className={`text-lg font-black ${isHoje ? "text-white" : "text-zinc-300"}`}
          >
            {data.getDate().toString().padStart(2, "0")}/
            {(data.getMonth() + 1).toString().padStart(2, "0")}
          </p>
          {isHoje && (
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">
              Hoje
            </span>
          )}
        </div>
        {sobrecarregado && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            ⚡ Intenso
          </span>
        )}
      </div>

      {/* Blocos de horário */}
      {!temHorario ? (
        <p className="text-[11px] text-zinc-700 italic">Sem horário livre</p>
      ) : (
        <div className="space-y-3">
          {blocos.map((bloco) => (
            <div key={bloco.rotinaId} className="space-y-1.5">
              {/* Cabeçalho do bloco */}
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                <Clock className="w-3 h-3 shrink-0" />
                <span>
                  {bloco.horaInicio} – {bloco.horaFim}
                </span>
                <span className="text-zinc-700">
                  ({(bloco.totalMinutos / 60).toFixed(1)}h)
                </span>
              </div>

              {/* Aviso de tempo insuficiente */}
              {bloco.tempoInsuficiente && (
                <div className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-1">
                  ⚠️ Tempo curto para todas as revisões
                </div>
              )}

              {/* Revisões alocadas no bloco */}
              {bloco.revisoes.length === 0 ? (
                <p className="text-[11px] text-zinc-700 italic pl-4">
                  Dia livre 🎉
                </p>
              ) : (
                <div className="space-y-1 pl-1">
                  {bloco.revisoes.map((rev) => {
                    const duracaoMin = (() => {
                      const [hi, mi] = rev.horaInicio.split(":").map(Number);
                      const [hf, mf] = rev.horaFim.split(":").map(Number);
                      return hf * 60 + mf - (hi * 60 + mi);
                    })();
                    return (
                      <div key={rev.revisaoId} className="space-y-0.5">
                        <div className="flex items-center gap-1 text-[10px] text-zinc-600">
                          <span>
                            {rev.horaInicio} – {rev.horaFim}
                          </span>
                          <span className="text-zinc-700">
                            ({duracaoMin}min)
                          </span>
                        </div>
                        <MateriaChip
                          nome={rev.materiaNome}
                          cor={rev.materiaCor}
                          prioridadeAdaptativa={rev.prioridadeAdaptativa}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Rodapé */}
      {temHorario && (
        <div className="pt-1 border-t border-zinc-800 flex justify-between items-center mt-auto">
          <span className="text-[10px] text-zinc-600">Disponível</span>
          <span
            className={`text-xs font-bold ${sobrecarregado ? "text-amber-400" : "text-zinc-400"}`}
          >
            {totalHoras}h
          </span>
        </div>
      )}
    </div>
  );
}
