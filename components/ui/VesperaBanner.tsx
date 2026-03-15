"use client";

import type { MateriaVespera } from "@/lib/scheduler";
import { AlertTriangle } from "lucide-react";

type Props = {
  materias: MateriaVespera[];
};

export function VesperaBanner({ materias }: Props) {
  if (materias.length === 0) return null;

  return (
    <div className="rounded-xl border border-red-500/60 bg-red-950/40 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />
        <p className="text-red-300 font-bold text-sm uppercase tracking-wider">
          Modo Véspera Ativado
        </p>
      </div>

      <div className="space-y-2">
        {materias.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between rounded-lg bg-red-900/30 border border-red-800/40 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              {/* bolinha com a cor da matéria */}
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: m.cor.startsWith("#") ? m.cor : undefined,
                }}
              />
              <span className="text-white font-semibold">{m.nome}</span>
            </div>

            <span className="text-red-300 font-bold text-sm whitespace-nowrap">
              {m.diasRestantes === 0
                ? "🚨 Hoje!"
                : m.diasRestantes === 1
                  ? "⚠️ Amanhã"
                  : `⏳ ${m.diasRestantes} dias`}
            </span>
          </div>
        ))}
      </div>

      <p className="text-red-400/80 text-xs">
        Priorize as revisões dessas matérias. O sistema já as destacou no topo
        da sua lista.
      </p>
    </div>
  );
}
