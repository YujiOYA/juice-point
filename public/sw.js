const CACHE_NAME = "otetusdai-point-v1";
const STATIC_PREFIX = "/_next/static/";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // /_next/static/ のみ Stale-While-Revalidate でキャッシュ
  if (url.pathname.startsWith(STATIC_PREFIX)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const networkFetch = fetch(request).then((response) => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        });
        return cached ?? networkFetch;
      })
    );
    return;
  }

  // それ以外はネットワーク優先（API・ページ遷移）
});

self.addEventListener("push", (event) => {
  let data = { title: "おてつだいポイント", body: "新しいお知らせがあります", data: null };
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: "/favicon-orange.png",
    badge: "/favicon-orange.png",
    data: data.data,
  };

  if (data.data?.submissionId) {
    options.actions = [
      { action: "approve",    title: "承認" },
      { action: "disapprove", title: "却下" },
    ];
  }

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const action = event.action;
  const submissionId = event.notification.data?.submissionId;

  if ((action === "approve" || action === "disapprove") && submissionId) {
    event.waitUntil(
      fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type: action, id: submissionId }),
      }).catch(() => {
        // 失敗時はフォールバックとして管理画面を開く
        if (clients.openWindow) clients.openWindow("/admin");
      })
    );
    return;
  }

  const targetUrl = submissionId ? `/admin/quick?id=${submissionId}` : "/admin";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
