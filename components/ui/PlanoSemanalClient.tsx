"use client";

import { ReagendarModal } from "@/components/ui/ReagendarModal";
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
  onReagendar: (formData: FormData) => Promise<void>;
};

export function PlanoSemanalClient({ revisoesPendentes, onReagendar }: Props) {
  const router = useRouter();
  const [modalAberto, setModalAberto] = useState(revisoesPendentes.length > 0);

  if (!modalAberto || revisoesPendentes.length === 0) return null;

  return (
    <ReagendarModal
      revisoesPendentes={revisoesPendentes}
      onAdicionarHorario={() => {
        setModalAberto(false);
        router.push("/rotina");
      }}
      onReagendar={async (formData) => {
        await onReagendar(formData);
        setModalAberto(false);
      }}
    />
  );
}
