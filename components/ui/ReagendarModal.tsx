"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DiaDisponivel = {
  data: Date;
  diaNome: string;
  numRevisoes: number;
  isSugerido: boolean;
};

type RevisaoPendente = {
  id: string;
  materiaNome: string;
  dataOriginal: Date;
  diasDisponiveis: DiaDisponivel[];
};

type Props = {
  revisoesPendentes: RevisaoPendente[];
  onAdicionarHorario: () => void;
  onReagendar: (formData: FormData) => Promise<void>;
};

export function ReagendarModal({
  revisoesPendentes,
  onAdicionarHorario,
  onReagendar,
}: Props) {
  const router = useRouter();
  const [etapa, setEtapa] = useState<"pergunta" | "escolher">("pergunta");
  const [salvando, setSalvando] = useState(false);
  const [selecionados, setSelecionados] = useState<Record<string, string>>({});

  if (revisoesPendentes.length === 0) return null;

  async function handleReagendar() {
    setSalvando(true);
    const formData = new FormData();
    Object.entries(selecionados).forEach(([revisaoId, novaData]) => {
      formData.append(`reagendar_${revisaoId}`, novaData);
    });
    await onReagendar(formData);
    setSalvando(false);
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">Tempo Insuficiente</h2>
        </div>

        {/* Revisões afetadas */}
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">
            As seguintes revisões não têm tempo suficiente no dia programado:
          </p>
          {revisoesPendentes.map((rev) => (
            <div
              key={rev.id}
              className="px-3 py-2 bg-zinc-950 rounded-lg border border-zinc-800 text-sm text-white font-medium"
            >
              {rev.materiaNome}
              <span className="text-zinc-500 font-normal ml-2 text-xs">
                (programada para{" "}
                {new Date(rev.dataOriginal).toLocaleDateString("pt-BR")})
              </span>
            </div>
          ))}
        </div>

        {etapa === "pergunta" ? (
          <>
            <p className="text-sm text-zinc-300 font-medium">
              Consegue estudar mais um pouco hoje?
            </p>
            <div className="flex gap-3">
              <Button
                onClick={onAdicionarHorario}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                ✅ Sim, adicionar horário
              </Button>
              <Button
                variant="outline"
                onClick={() => setEtapa("escolher")}
                className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                ❌ Não, reagendar
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-zinc-300 font-medium">
              Escolha o novo dia para cada revisão:
            </p>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {revisoesPendentes.map((rev) => (
                <div key={rev.id} className="space-y-2">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    {rev.materiaNome}
                  </p>
                  {rev.diasDisponiveis.length === 0 ? (
                    <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded px-2 py-1">
                      ❌ Nenhum dia disponível na janela de ±2 dias. A revisão
                      ficará no dia original.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-1.5">
                      {rev.diasDisponiveis.map((dia) => {
                        const dataStr = new Date(dia.data)
                          .toISOString()
                          .split("T")[0];
                        const selecionado = selecionados[rev.id] === dataStr;
                        return (
                          <button
                            key={dataStr}
                            onClick={() =>
                              setSelecionados((prev) => ({
                                ...prev,
                                [rev.id]: selecionado ? "" : dataStr,
                              }))
                            }
                            className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors ${
                              selecionado
                                ? "bg-pink-500/20 border-pink-500/50 text-white"
                                : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-600"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <CalendarDays className="w-3.5 h-3.5" />
                              <span>
                                {new Date(dia.data).toLocaleDateString(
                                  "pt-BR",
                                  {
                                    weekday: "long",
                                    day: "2-digit",
                                    month: "2-digit",
                                  },
                                )}
                              </span>
                              {dia.isSugerido && (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">
                                  ✨ Sugerido
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-zinc-500">
                              {dia.numRevisoes} revisão(ões)
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setEtapa("pergunta")}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                ← Voltar
              </Button>
              <Button
                onClick={handleReagendar}
                disabled={salvando}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
              >
                {salvando ? "Salvando..." : "Confirmar Reagendamento"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
