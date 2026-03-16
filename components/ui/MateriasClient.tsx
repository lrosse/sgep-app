"use client";

import { DeletarMateriaModal } from "@/components/ui/DeletarMateriaModal";
import { EditarMateriaModal } from "@/components/ui/EditarMateriaModal";
import { toast } from "@/components/ui/Toast";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Materia = {
  id: string;
  nome: string;
  prioridade: number;
  pesoNoExame: number;
  prioridadeAdaptativa: number;
  dataExame: Date;
  cor: string;
};

type Props = {
  materias: Materia[];
  coresMap: Record<string, string>;
  onEditar: (formData: FormData) => Promise<void>;
  onDeletar: (id: string) => Promise<void>;
};

export function MateriasClient({
  materias,
  coresMap,
  onEditar,
  onDeletar,
}: Props) {
  const router = useRouter();
  const [editando, setEditando] = useState<Materia | null>(null);
  const [deletando, setDeletando] = useState<Materia | null>(null);

  async function handleEditar(formData: FormData) {
    try {
      await onEditar(formData);
      toast("Matéria atualizada com sucesso!", "success");
      setEditando(null);
      router.refresh();
    } catch {
      toast("Erro ao atualizar matéria.", "error");
    }
  }

  return (
    <>
      {editando && (
        <EditarMateriaModal
          materia={editando}
          onFechar={() => setEditando(null)}
          onSalvar={handleEditar}
        />
      )}
      {deletando && (
        <DeletarMateriaModal
          materiaId={deletando.id}
          materiaNome={deletando.nome}
          onFechar={() => setDeletando(null)}
          onConfirmar={onDeletar}
        />
      )}

      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        {materias.length === 0 && (
          <div className="col-span-2 text-center py-16 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500">
            Nenhuma matéria cadastrada ainda.
          </div>
        )}

        {materias.map((m) => (
          <div
            key={m.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
          >
            <div
              className="h-1.5 w-full"
              style={{
                backgroundColor: m.cor.startsWith("#")
                  ? m.cor
                  : coresMap[m.cor] || "#ec4899",
              }}
            />
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl text-white">{m.nome}</h3>
                  <p className="text-sm text-zinc-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" /> Prova:{" "}
                    {new Date(m.dataExame).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    m.prioridade === 3
                      ? "bg-red-500/10 text-red-500"
                      : m.prioridade === 2
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-zinc-700/50 text-zinc-400"
                  }`}
                >
                  P{m.prioridade}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Peso no exame</span>
                  <span className="text-pink-500 font-bold">
                    {m.pesoNoExame}%
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5">
                  <div
                    className="bg-pink-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${m.pesoNoExame}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setEditando(m)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Editar
                </button>
                <button
                  onClick={() => setDeletando(m)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Deletar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
