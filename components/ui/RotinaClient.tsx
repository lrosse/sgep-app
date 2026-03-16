"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/Toast";
import { AlertTriangle, CalendarDays, Clock, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

const DIAS_SEMANA = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

type Rotina = {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
};

type Props = {
  rotinas: Rotina[];
  onAdicionar: (formData: FormData) => Promise<void>;
  onExcluir: (id: string) => Promise<void>;
};

export function RotinaClient({ rotinas, onAdicionar, onExcluir }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [confirmarExclusao, setConfirmarExclusao] = useState<Rotina | null>(
    null,
  );

  async function handleAdicionar(formData: FormData) {
    startTransition(async () => {
      try {
        await onAdicionar(formData);
        formRef.current?.reset();
        toast("Horário adicionado com sucesso!", "success");
        router.refresh();
      } catch {
        toast("Erro ao adicionar horário.", "error");
      }
    });
  }

  async function handleExcluir() {
    if (!confirmarExclusao) return;
    startTransition(async () => {
      try {
        await onExcluir(confirmarExclusao.id);
        toast("Horário removido.", "success");
        setConfirmarExclusao(null);
        router.refresh();
      } catch {
        toast("Erro ao remover horário.", "error");
      }
    });
  }

  return (
    <>
      {/* MODAL DE CONFIRMAÇÃO */}
      {confirmarExclusao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setConfirmarExclusao(null)}
          />
          <div className="relative z-10 w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-5 h-5" />
                <h2 className="text-lg font-bold text-white">
                  Remover Horário
                </h2>
              </div>
              <button
                onClick={() => setConfirmarExclusao(null)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-zinc-300 text-sm">
              Deseja remover o horário de{" "}
              <span className="font-bold text-white">
                {DIAS_SEMANA[confirmarExclusao.diaSemana]}
              </span>{" "}
              das{" "}
              <span className="font-bold text-white">
                {confirmarExclusao.horaInicio}
              </span>{" "}
              às{" "}
              <span className="font-bold text-white">
                {confirmarExclusao.horaFim}
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setConfirmarExclusao(null)}
                className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Cancelar
              </Button>
              <Button
                disabled={isPending}
                onClick={handleExcluir}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isPending ? "Removendo..." : "Sim, Remover"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-zinc-900 border-zinc-800 h-fit">
          <CardHeader>
            <CardTitle className="text-white">Novo Bloco de Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={handleAdicionar} className="space-y-4">
              <div className="space-y-2">
                <Label>Dia da Semana</Label>
                <Select name="dia" required>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    {DIAS_SEMANA.map((dia, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {dia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Início</Label>
                  <Input
                    name="inicio"
                    type="time"
                    required
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fim</Label>
                  <Input
                    name="fim"
                    type="time"
                    required
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-pink-600 hover:bg-pink-700"
              >
                {isPending ? "Salvando..." : "Salvar Horário"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-pink-600" /> Seus Horários
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rotinas.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">
                  Nenhum horário cadastrado.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {rotinas.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-zinc-500" />
                        <div>
                          <p className="font-medium text-sm text-white">
                            {DIAS_SEMANA[r.diaSemana]}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {r.horaInicio} às {r.horaFim}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isPending}
                        onClick={() => setConfirmarExclusao(r)}
                        className="text-zinc-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
