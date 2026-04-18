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
