"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  revisaoId: string;
  materiaNome: string;
  dataProgramada: Date;
  onFechar: () => void;
  onConcluir: (formData: FormData) => Promise<void>;
};

export function ConcluirRevisaoModal({
  revisaoId,
  materiaNome,
  dataProgramada,
  onFechar,
  onConcluir,
}: Props) {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSalvando(true);
    await onConcluir(formData);
    setSalvando(false);
    onFechar();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onFechar}
      />
      <div className="relative z-10 w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white">Concluir Revisão</h2>
          </div>
          <button
            onClick={onFechar}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info da revisão */}
        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
          <p className="font-bold text-white">{materiaNome}</p>
          <p className="text-xs text-zinc-500">
            Agendada para:{" "}
            {new Date(dataProgramada).toLocaleDateString("pt-BR")}
          </p>
        </div>

        {/* Formulário */}
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="revisaoId" value={revisaoId} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Total de Questões</Label>
              <Input
                name="total"
                type="number"
                min={1}
                required
                placeholder="Ex: 40"
                className="bg-zinc-950 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Acertos</Label>
              <Input
                name="acertos"
                type="number"
                min={0}
                required
                placeholder="Ex: 32"
                className="bg-zinc-950 border-zinc-700 text-white"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onFechar}
              className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={salvando}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {salvando ? "Salvando..." : "✓ Concluir Revisão"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
