type Props = {
  nome: string;
  cor: string;
  prioridadeAdaptativa: number;
};

const coresMap: Record<string, string> = {
  "pink-600": "#db2777",
  "blue-500": "#3b82f6",
  "green-500": "#22c55e",
  "yellow-500": "#eab308",
  "purple-500": "#a855f7",
  "red-500": "#ef4444",
  "orange-500": "#f97316",
  "cyan-500": "#06b6d4",
};

export function MateriaChip({ nome, cor, prioridadeAdaptativa }: Props) {
  const hexCor = cor.startsWith("#") ? cor : coresMap[cor] || "#db2777";
  const altaPrioridade = prioridadeAdaptativa >= 1.5;

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white truncate"
      style={{
        backgroundColor: hexCor + "22",
        borderLeft: `3px solid ${hexCor}`,
        outline: altaPrioridade ? `1px solid ${hexCor}88` : "none",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: hexCor }}
      />
      <span className="truncate">{nome}</span>
      {altaPrioridade && (
        <span className="shrink-0 text-[10px]" title="Alta prioridade">
          ⚠️
        </span>
      )}
    </div>
  );
}
