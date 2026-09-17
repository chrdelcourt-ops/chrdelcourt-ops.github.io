const CACHE_NAME = "marie-rivier-pwa-v25";
const CORE = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/offline.html",
  "/manifest.webmanifest",
  "/assets/logo-marie-rivier.png",
  "/assets/app-icon-192.png",
  "/assets/app-icon-512.png",
  "/assets/app-icon-maskable-512.png",
  "/themes/internet.html",
  "/themes/binaire-bases-debit.html",
  "/themes/web.html",
  "/classes/premiere-sti2d.html",
  "/classes/terminale-sti2d.html",
  "/classes/terminale-algorithmique.html",
  "/classes/terminale-algorithmique.js",
  "/classes/terminale-algorithmique-ee.html",
  "/classes/terminale-algorithmique-ee.js"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Navigation : réseau en priorité pour voir les cours à jour.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          return cached || caches.match("/offline.html");
        })
    );
    return;
  }

  // Ressources statiques : cache d'abord, puis mise à jour en arrière-plan.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
