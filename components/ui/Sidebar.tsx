"use client";

import { NotificationPermission } from "@/components/ui/NotificationPermission";
import {
  BookOpen,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Menu,
  Settings,
  Target,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/materias", label: "Matérias", icon: BookOpen },
  { href: "/rotina", label: "Minha Rotina", icon: CalendarRange },
  { href: "/metas", label: "Metas", icon: Target },
  { href: "/plano-semanal", label: "Plano Semanal", icon: CalendarDays },
];

function linkClass(ativa: boolean, collapsed: boolean) {
  return `flex items-center gap-3 py-3 text-sm font-medium rounded-lg transition-colors ${
    collapsed ? "justify-center px-2" : "px-4"
  } ${
    ativa
      ? "bg-pink-600/15 text-pink-400 border border-pink-600/30"
      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
  }`;
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileAberta, setMobileAberta] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  function isAtiva(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* BOTÃO HAMBURGUER — só no mobile */}
      <button
        onClick={() => setMobileAberta(true)}
        className="fixed top-4 left-4 z-40 md:hidden bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-400 hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* OVERLAY mobile */}
      {mobileAberta && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileAberta(false)}
        />
      )}

      {/* SIDEBAR MOBILE */}
      <aside
        className={`
        fixed top-0 left-0 z-50 h-screen bg-zinc-950 border-r border-zinc-900 flex flex-col p-4 w-64
        transition-transform duration-300 md:hidden
        ${mobileAberta ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Header mobile */}
        <div className="mb-8 px-4 mt-4 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-white">
            SGEP<span className="text-pink-600">.</span>
          </h2>
          <button
            onClick={() => setMobileAberta(false)}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav mobile */}
        <nav className="flex-1 space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileAberta(false)}
              className={linkClass(isAtiva(href), false)}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer mobile */}
        <div className="mt-auto mb-4 space-y-2">
          <div className="px-4">
            <NotificationPermission />
          </div>
          <Link
            href="/configuracoes"
            onClick={() => setMobileAberta(false)}
            className={linkClass(isAtiva("/configuracoes"), false)}
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span>Configurações</span>
          </Link>
        </div>
      </aside>

      {/* SIDEBAR DESKTOP */}
      <aside
        className={`
        hidden md:flex flex-col h-screen bg-zinc-950 border-r border-zinc-900 p-4
        transition-all duration-300 shrink-0
        ${collapsed ? "w-16" : "w-64"}
      `}
      >
        {/* Header desktop */}
        <div
          className={`mb-8 mt-4 flex items-center ${collapsed ? "justify-center px-0" : "justify-between px-4"}`}
        >
          {!collapsed && (
            <h2 className="text-xl font-bold tracking-tight text-white">
              SGEP<span className="text-pink-600">.</span>
            </h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-zinc-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-900"
            title={collapsed ? "Expandir" : "Recolher"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Nav desktop */}
        <nav className="flex-1 space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={linkClass(isAtiva(href), collapsed)}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer desktop */}
        <div className="mt-auto mb-4 space-y-2">
          {!collapsed && (
            <div className="px-4">
              <NotificationPermission />
            </div>
          )}
          <Link
            href="/configuracoes"
            className={linkClass(isAtiva("/configuracoes"), collapsed)}
            title={collapsed ? "Configurações" : undefined}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Configurações</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
