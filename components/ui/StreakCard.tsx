import { Flame } from "lucide-react";

type Props = {
  atual: number;
  maximo: number;
};

export function StreakCard({ atual, maximo }: Props) {
  const emChamas = atual > 0;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-5 flex items-center gap-4 ${
        emChamas
          ? "bg-orange-500/10 border-orange-500/30"
          : "bg-zinc-900 border-zinc-800"
      }`}
    >
      {/* Ícone */}
      <div
        className={`flex items-center justify-center w-14 h-14 rounded-full text-3xl ${
          emChamas ? "bg-orange-500/20" : "bg-zinc-800"
        }`}
      >
        <Flame
          className={`w-8 h-8 ${emChamas ? "text-orange-400" : "text-zinc-600"}`}
          fill={emChamas ? "currentColor" : "none"}
        />
      </div>

      {/* Texto */}
      <div className="flex-1">
        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-0.5">
          Sequência de Estudos
        </p>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-4xl font-black ${emChamas ? "text-orange-400" : "text-zinc-600"}`}
          >
            {atual}
          </span>
          <span className="text-zinc-500 text-sm">
            {atual === 1 ? "dia seguido" : "dias seguidos"}
          </span>
        </div>
        <p className="text-xs text-zinc-600 mt-1">
          🏆 Recorde pessoal:{" "}
          <span className="text-zinc-400 font-bold">{maximo} dias</span>
        </p>
      </div>

      {/* Badge se streak alto */}
      {atual >= 7 && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-wider">
          🔥 Em chamas!
        </div>
      )}
    </div>
  );
}
