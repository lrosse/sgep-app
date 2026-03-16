"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/Toast";
import { Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";

type Props = {
  metaAtual?: { objetivoMinutos: number };
  onSalvar: (formData: FormData) => Promise<void>;
};

export function MetasClient({ metaAtual, onSalvar }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSalvar(formData: FormData) {
    startTransition(async () => {
      try {
        await onSalvar(formData);
        formRef.current?.reset();
        toast("Meta atualizada com sucesso!", "success");
        router.refresh();
      } catch {
        toast("Erro ao salvar meta.", "error");
      }
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="w-5 h-5 text-pink-600" /> Meta Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metaAtual ? (
            <div className="space-y-1">
              <span className="text-5xl font-black text-white">
                {metaAtual.objetivoMinutos / 60}h
              </span>
              <p className="text-zinc-500 text-sm">por semana</p>
            </div>
          ) : (
            <p className="text-zinc-500">Nenhuma meta definida.</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Ajustar Objetivo</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={handleSalvar} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Horas Semanais</Label>
              <Input
                name="horas"
                type="number"
                placeholder="Ex: 15"
                min="1"
                max="168"
                required
                className="bg-zinc-950"
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            >
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
