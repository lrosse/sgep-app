"use client";

import { Bell, BellOff } from "lucide-react";
import { useEffect, useState } from "react";

export function NotificationPermission() {
  const [status, setStatus] = useState<NotificationPermission | "unsupported">(
    "default",
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus(Notification.permission);

    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => console.error("[SW] Erro ao registrar:", err));
  }, []);

  async function solicitarPermissao() {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setStatus(permission);

      if (permission !== "granted") return;

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToArrayBuffer(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      });

      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
    } catch (err) {
      console.error("[PUSH] Erro ao ativar notificações:", err);
    } finally {
      setLoading(false);
    }
  }

  async function desativarNotificacoes() {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await fetch("/api/notifications/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }
      setStatus("default");
    } catch (err) {
      console.error("[PUSH] Erro ao desativar:", err);
    } finally {
      setLoading(false);
    }
  }

  if (status === "unsupported" || status === "denied") return null;

  return (
    <div className="flex items-center gap-2">
      {status === "granted" ? (
        <button
          onClick={desativarNotificacoes}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Desativar notificações"
        >
          <Bell className="w-4 h-4 text-pink-500" />
          <span className="hidden sm:inline">Notificações ativas</span>
        </button>
      ) : (
        <button
          onClick={solicitarPermissao}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-pink-600/10 hover:bg-pink-600/20 text-pink-400 transition-colors"
          title="Ativar notificações"
        >
          <BellOff className="w-4 h-4" />
          <span className="hidden sm:inline">
            {loading ? "Ativando..." : "Ativar notificações"}
          </span>
        </button>
      )}
    </div>
  );
}

function urlBase64ToArrayBuffer(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const buffer = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    buffer[i] = rawData.charCodeAt(i);
  }
  return buffer.buffer;
}
