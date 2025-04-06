self.addEventListener("push", (event) => {
  const payload = event.data.json();

  const options = {
    body: payload.body,
    icon: "/icon/logo", 
    tag: "faser-notification",
    data: {
      url: payload.url || "/", 
    },
  };

  if (payload.silent === true) {
    options.silent = true;
  }

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data.url;

  if (url) {
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((windowClients) => {
        for (let client of windowClients) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});
