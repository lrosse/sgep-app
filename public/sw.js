// public/sw.js
// Service Worker — recebe e exibe notificações Web Push

self.addEventListener("push", (event) => {
    if (!event.data) return;

    let payload;
    try {
        payload = event.data.json();
    } catch {
        payload = { title: "SGEP", body: event.data.text() };
    }

    const options = {
        body: payload.body || "",
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        data: { url: payload.url || "/" },
        vibrate: [200, 100, 200],
    };

    event.waitUntil(
        self.registration.showNotification(payload.title || "SGEP", options),
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const url = event.notification.data?.url || "/";

    event.waitUntil(
        clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then((clientList) => {
                // Se já tem uma aba aberta, foca nela
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && "focus" in client) {
                        client.navigate(url);
                        return client.focus();
                    }
                }
                // Senão abre uma nova aba
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            }),
    );
});