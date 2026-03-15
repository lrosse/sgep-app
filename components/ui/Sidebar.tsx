import { NotificationPermission } from "@/components/ui/NotificationPermission";
import {
  BookOpen,
  CalendarDays,
  CalendarRange,
  LayoutDashboard,
  Settings,
  Target,
} from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-zinc-950 border-r border-zinc-900 flex flex-col p-4">
      <div className="mb-8 px-4 mt-4">
        <h2 className="text-xl font-bold tracking-tight text-white">
          SGEP<span className="text-pink-600">.</span>
        </h2>
      </div>

      <nav className="flex-1 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>

        <Link
          href="/materias"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <BookOpen className="w-5 h-5" />
          Matérias
        </Link>

        <Link
          href="/rotina"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <CalendarRange className="w-5 h-5" />
          Minha Rotina
        </Link>

        <Link
          href="/metas"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <Target className="w-5 h-5" />
          Metas
        </Link>

        <Link
          href="/plano-semanal"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <CalendarDays className="w-5 h-5" />
          Plano Semanal
        </Link>
      </nav>

      <div className="mt-auto mb-4 space-y-2">
        {/* Botão de notificações */}
        <div className="px-4">
          <NotificationPermission />
        </div>

        <Link
          href="/configuracoes"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          Configurações
        </Link>
      </div>
    </aside>
  );
}
