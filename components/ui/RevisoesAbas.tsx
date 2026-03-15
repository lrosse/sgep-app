"use client";

import { ConcluirRevisaoModal } from "@/components/ui/ConcluirRevisaoModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  CalendarRange,
  CheckCircle2,
  Flame,
} from "lucide-react";
import { useState } from "react";

type Revisao = {
  id: string;
  dataProgramada: Date;
  materia: {
    nome: string;
    prioridade: number;
  };
};

type Props = {
  revisoesAtrasadas: Revisao[];
  revisoesHoje: Revisao[];
  revisoesSemana: Revisao[];
  onConcluir: (formData: FormData) => Promise<void>;
  materiasVesperaIds?: string[]; // ids das matérias em modo véspera
};

export function RevisoesAbas({
  revisoesAtrasadas,
  revisoesHoje,
  revisoesSemana,
  onConcluir,
  materiasVesperaIds = [],
}: Props) {
  const [abaAtiva, setAbaAtiva] = useState<"hoje" | "semana" | "atrasadas">(
    "hoje",
  );
  const [revisaoSelecionada, setRevisaoSelecionada] = useState<Revisao | null>(
    null,
  );

  const abas = [
    {
      id: "hoje" as const,
      label: "Hoje",
      count: revisoesHoje.length,
      corAtiva: "border-pink-500 text-pink-500",
    },
    {
      id: "semana" as const,
      label: "Esta Semana",
      count: revisoesSemana.length,
      corAtiva: "border-blue-400 text-blue-400",
    },
    {
      id: "atrasadas" as const,
      label: "Atrasadas",
      count: revisoesAtrasadas.length,
      corAtiva: "border-amber-500 text-amber-500",
    },
  ];

  const revisoesAtivas =
    abaAtiva === "hoje"
      ? revisoesHoje
      : abaAtiva === "semana"
        ? revisoesSemana
        : revisoesAtrasadas;

  return (
    <>
      {revisaoSelecionada && (
        <ConcluirRevisaoModal
          revisaoId={revisaoSelecionada.id}
          materiaNome={revisaoSelecionada.materia.nome}
          dataProgramada={revisaoSelecionada.dataProgramada}
          onFechar={() => setRevisaoSelecionada(null)}
          onConcluir={onConcluir}
        />
      )}

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <CalendarRange className="w-5 h-5 text-pink-600" /> Cronograma de
            Revisões
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Revisões agendadas automaticamente pela Curva de Ebbinghaus.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ALERTA DE ATRASADAS */}
          {revisoesAtrasadas.length > 0 && abaAtiva !== "atrasadas" && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="text-sm text-amber-400">
                Você tem{" "}
                <span className="font-bold">{revisoesAtrasadas.length}</span>{" "}
                revisão(ões) atrasada(s).{" "}
                <button
                  onClick={() => setAbaAtiva("atrasadas")}
                  className="underline hover:text-amber-300 transition-colors"
                >
                  Ver agora
                </button>
              </p>
            </div>
          )}

          {/* ABAS */}
          <div className="flex border-b border-zinc-800">
            {abas.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  abaAtiva === aba.id
                    ? `${aba.corAtiva} border-current`
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {aba.label}
                {aba.count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      abaAtiva === aba.id
                        ? "bg-current/10"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {aba.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* CONTEÚDO */}
          {revisoesAtivas.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-zinc-800 rounded-xl">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm font-medium">
                {abaAtiva === "hoje" && "Nada para estudar hoje!"}
                {abaAtiva === "semana" &&
                  "Nenhuma revisão nos próximos 7 dias."}
                {abaAtiva === "atrasadas" && "Nenhuma revisão atrasada. 🎉"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {revisoesAtivas.map((rev) => {
                // matéria em modo véspera — só destaca na aba "hoje"
                const isVespera =
                  abaAtiva === "hoje" &&
                  materiasVesperaIds.includes(rev.materia.nome);

                return (
                  <div
                    key={rev.id}
                    className={`flex justify-between items-center p-4 rounded-lg border-l-4 transition-colors ${
                      isVespera
                        ? "bg-red-950/40 border-red-500"
                        : abaAtiva === "atrasadas"
                          ? "bg-zinc-950 border-amber-500"
                          : abaAtiva === "semana"
                            ? "bg-zinc-950 border-blue-500"
                            : "bg-zinc-950 border-pink-600"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white">
                          {rev.materia.nome}
                        </p>
                        {isVespera && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                            <Flame className="w-3 h-3" /> Véspera
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500">
                        {abaAtiva === "atrasadas"
                          ? "Atrasada desde: "
                          : "Agendado para: "}
                        {new Date(rev.dataProgramada).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-zinc-900 rounded-full text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        P{rev.materia.prioridade}
                      </div>
                      <button
                        onClick={() => setRevisaoSelecionada(rev)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Concluir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
