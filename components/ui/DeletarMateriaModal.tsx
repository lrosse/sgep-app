"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  materiaId: string;
  materiaNome: string;
  onFechar: () => void;
  onConfirmar: (id: string) => Promise<void>;
};

export function DeletarMateriaModal({
  materiaId,
  materiaNome,
  onFechar,
  onConfirmar,
}: Props) {
  const router = useRouter();
  const [deletando, setDeletando] = useState(false);

  async function handleConfirmar() {
    setDeletando(true);
    await onConfirmar(materiaId);
    setDeletando(false);
    onFechar();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onFechar}
      />
      <div className="relative z-10 w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-bold">Deletar Matéria</h2>
          </div>
          <button
            onClick={onFechar}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-zinc-300 text-sm">
            Tem certeza que deseja deletar{" "}
            <span className="font-bold text-white">
              &quot;{materiaNome}&quot;
            </span>
            ?
          </p>
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-red-400">
              ⚠️ Esta ação é irreversível. Todas as revisões agendadas para esta
              matéria também serão deletadas.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onFechar}
            className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={deletando}
            onClick={handleConfirmar}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {deletando ? "Deletando..." : "Sim, Deletar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
