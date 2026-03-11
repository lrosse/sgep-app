"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, CalendarRange, CheckCircle2 } from "lucide-react";
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
};

export function RevisoesAbas({
  revisoesAtrasadas,
  revisoesHoje,
  revisoesSemana,
}: Props) {
  const [abaAtiva, setAbaAtiva] = useState<"hoje" | "semana" | "atrasadas">(
    "hoje",
  );

  const abas = [
    {
      id: "hoje" as const,
      label: "Hoje",
      count: revisoesHoje.length,
      cor: "text-pink-500",
      corAtiva: "border-pink-500 text-pink-500",
    },
    {
      id: "semana" as const,
      label: "Esta Semana",
      count: revisoesSemana.length,
      cor: "text-blue-400",
      corAtiva: "border-blue-400 text-blue-400",
    },
    {
      id: "atrasadas" as const,
      label: "Atrasadas",
      count: revisoesAtrasadas.length,
      cor: "text-amber-500",
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
              {abaAtiva === "semana" && "Nenhuma revisão nos próximos 7 dias."}
              {abaAtiva === "atrasadas" && "Nenhuma revisão atrasada. 🎉"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {revisoesAtivas.map((rev) => (
              <div
                key={rev.id}
                className={`flex justify-between items-center p-4 rounded-lg bg-zinc-950 border-l-4 ${
                  abaAtiva === "atrasadas"
                    ? "border-amber-500"
                    : abaAtiva === "semana"
                      ? "border-blue-500"
                      : "border-pink-600"
                }`}
              >
                <div>
                  <p className="font-bold text-white">{rev.materia.nome}</p>
                  <p className="text-xs text-zinc-500">
                    {abaAtiva === "atrasadas"
                      ? "Atrasada desde: "
                      : "Agendado para: "}
                    {new Date(rev.dataProgramada).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="px-3 py-1 bg-zinc-900 rounded-full text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  P{rev.materia.prioridade}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
