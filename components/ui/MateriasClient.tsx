"use client";

import { DeletarMateriaModal } from "@/components/ui/DeletarMateriaModal";
import { EditarMateriaModal } from "@/components/ui/EditarMateriaModal";
import { toast } from "@/components/ui/Toast";
import {
  ArrowUpDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type OrdemTipo = "dataExame" | "prioridade" | "nome" | "pesoNoExame";
type QtdPagina = 6 | 12 | 24;

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

function ordenarMaterias(materias: Materia[], ordem: OrdemTipo): Materia[] {
  return [...materias].sort((a, b) => {
    switch (ordem) {
      case "dataExame":
        return (
          new Date(a.dataExame).getTime() - new Date(b.dataExame).getTime()
        );
      case "prioridade":
        return b.prioridade - a.prioridade;
      case "nome":
        return a.nome.localeCompare(b.nome, "pt-BR");
      case "pesoNoExame":
        return b.pesoNoExame - a.pesoNoExame;
    }
  });
}

export function MateriasClient({
  materias,
  coresMap,
  onEditar,
  onDeletar,
}: Props) {
  const router = useRouter();
  const [editando, setEditando] = useState<Materia | null>(null);
  const [deletando, setDeletando] = useState<Materia | null>(null);
  const [pagina, setPagina] = useState(1);
  const [ordem, setOrdem] = useState<OrdemTipo>("dataExame");
  const [porPagina, setPorPagina] = useState<QtdPagina>(6);

  const materiasOrdenadas = ordenarMaterias(materias, ordem);
  const totalPaginas = Math.ceil(materiasOrdenadas.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const materiasPagina = materiasOrdenadas.slice(inicio, inicio + porPagina);

  function handleOrdem(novaOrdem: OrdemTipo) {
    setOrdem(novaOrdem);
    setPagina(1);
  }

  function handlePorPagina(qtd: QtdPagina) {
    setPorPagina(qtd);
    setPagina(1);
  }

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

      <div className="lg:col-span-3 space-y-4">
        {/* Barra de controles */}
        {materias.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Ordenação */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Ordenar:</span>
              </div>
              {(
                [
                  "dataExame",
                  "prioridade",
                  "nome",
                  "pesoNoExame",
                ] as OrdemTipo[]
              ).map((op) => (
                <button
                  key={op}
                  onClick={() => handleOrdem(op)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    ordem === op
                      ? "bg-pink-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {op === "dataExame" && "Data do Exame"}
                  {op === "prioridade" && "Prioridade"}
                  {op === "nome" && "Nome (A-Z)"}
                  {op === "pesoNoExame" && "Peso"}
                </button>
              ))}
            </div>

            {/* Quantidade por página */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Por página:</span>
              {([6, 12, 24] as QtdPagina[]).map((qtd) => (
                <button
                  key={qtd}
                  onClick={() => handlePorPagina(qtd)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    porPagina === qtd
                      ? "bg-pink-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {qtd}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materias.length === 0 && (
            <div className="col-span-2 text-center py-16 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500">
              Nenhuma matéria cadastrada ainda.
            </div>
          )}

          {materiasPagina.map((m) => (
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

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-zinc-500">
              Mostrando {inicio + 1}–
              {Math.min(inicio + porPagina, materias.length)} de{" "}
              {materias.length} matérias
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              <span className="text-xs text-zinc-500 px-2">
                {pagina} / {totalPaginas}
              </span>
              <button
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Próxima <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
