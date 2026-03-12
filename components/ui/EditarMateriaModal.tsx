"use client";

import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type Materia = {
  id: string;
  nome: string;
  prioridade: number;
  pesoNoExame: number;
  dataExame: Date;
  cor: string;
};

type Props = {
  materia: Materia;
  onFechar: () => void;
  onSalvar: (formData: FormData) => Promise<void>;
};

export function EditarMateriaModal({ materia, onFechar, onSalvar }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [salvando, setSalvando] = useState(false);
  const [peso, setPeso] = useState(materia.pesoNoExame);

  const dataExameFormatada = new Date(materia.dataExame)
    .toISOString()
    .split("T")[0];

  const corInicial = materia.cor.startsWith("#") ? materia.cor : "#ec4899";

  async function handleSubmit(formData: FormData) {
    setSalvando(true);
    await onSalvar(formData);
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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Editar Matéria</h2>
          <button
            onClick={onFechar}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" value={materia.id} />

          <div className="space-y-2">
            <Label className="text-zinc-300">Nome da Matéria</Label>
            <Input
              name="nome"
              defaultValue={materia.nome}
              minLength={3}
              maxLength={100}
              required
              className="bg-zinc-950 border-zinc-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Data do Exame</Label>
            <Input
              name="dataExame"
              type="date"
              defaultValue={dataExameFormatada}
              required
              className="bg-zinc-950 border-zinc-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">
              Peso no Exame:{" "}
              <span className="text-pink-500 font-bold">{peso}%</span>
            </Label>
            <input
              name="pesoNoExame"
              type="range"
              min={0}
              max={100}
              step={5}
              value={peso}
              onChange={(e) => setPeso(Number(e.target.value))}
              className="w-full accent-pink-600"
            />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Prioridade</Label>
            <Select name="prioridade" defaultValue={String(materia.prioridade)}>
              <SelectTrigger className="bg-zinc-950 border-zinc-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                <SelectItem value="1">1 - Baixa</SelectItem>
                <SelectItem value="2">2 - Média</SelectItem>
                <SelectItem value="3">3 - Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ColorPicker name="cor" defaultValue={corInicial} />

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
              className="flex-1 bg-pink-600 hover:bg-pink-700"
            >
              {salvando ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
