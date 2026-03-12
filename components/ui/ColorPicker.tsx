"use client";

import { useState } from "react";

type Props = {
  defaultValue?: string;
  name: string;
};

export function ColorPicker({ defaultValue = "#ec4899", name }: Props) {
  const [cor, setCor] = useState(defaultValue);

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-600 transition-colors group">
        <input
          name={name}
          type="color"
          value={cor}
          onChange={(e) => setCor(e.target.value)}
          className="sr-only"
        />
        <div
          className="w-7 h-7 rounded-full border-2 border-white/20 transition-all group-hover:scale-110"
          style={{ backgroundColor: cor }}
        />
        <div className="flex flex-col">
          <span className="text-sm text-zinc-300">Cor da Matéria</span>
          <span className="text-xs text-zinc-500">{cor}</span>
        </div>
        <span className="ml-auto text-xs text-zinc-600">Clique ↗</span>
      </label>
    </div>
  );
}
