/*
 * Guía Comercial Vecinal — Service Worker
 *
 * Estrategia:
 *  - Navegaciones (HTML): red primero; si no hay internet, se sirve la última
 *    copia guardada. Si la página nunca se visitó, se muestra /offline.
 *  - Recursos estáticos de Next.js y fuentes: caché primero (son inmutables).
 *  - Imágenes (incluidas las de Supabase Storage): stale-while-revalidate.
 *  - Al instalar se precargan la portada y la pantalla de offline.
 *  - La portada puede pedir "CACHE_URLS" para guardar categorías y negocios
 *    y así poder navegar por ellos sin conexión.
 */

const VERSION = "v1";
const SHELL_CACHE = `guia-shell-${VERSION}`;
const PAGES_CACHE = `guia-pages-${VERSION}`;
const ASSETS_CACHE = `guia-assets-${VERSION}`;
const IMAGES_CACHE = `guia-images-${VERSION}`;

const CACHE_NAMES = [SHELL_CACHE, PAGES_CACHE, ASSETS_CACHE, IMAGES_CACHE];
const OFFLINE_URL = "/offline";
const MAX_PREFETCH = 60;
const NAVIGATION_TIMEOUT = 4500;

const PRECACHE_URLS = [
  "/",
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon.png",
];

// ---------------------------------------------------------------- instalación

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          cache.add(new Request(url, { cache: "reload" }))
        )
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => !CACHE_NAMES.includes(key))
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

// ------------------------------------------------------------------- mensajes

self.addEventListener("message", (event) => {
  const data = event.data || {};

  if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }

  if (data.type === "CACHE_URLS" && Array.isArray(data.urls)) {
    event.waitUntil(cacheUrls(data.urls));
  }
});

async function cacheUrls(urls) {
  const origin = self.location.origin;
  const unique = Array.from(
    new Set(
      urls
        .filter((url) => typeof url === "string")
        .map((url) => {
          try {
            return new URL(url, origin);
          } catch {
            return null;
          }
        })
        .filter((url) => url && url.origin === origin)
        .map((url) => url.pathname + url.search)
    )
  ).slice(0, MAX_PREFETCH);

  if (unique.length === 0) return;

  const cache = await caches.open(PAGES_CACHE);

  // En bloques pequeños para no saturar la red del celular.
  for (let i = 0; i < unique.length; i += 5) {
    const block = unique.slice(i, i + 5);
    await Promise.allSettled(
      block.map(async (url) => {
        try {
          const response = await fetch(new Request(url, { cache: "reload" }));
          if (response.ok) {
            await cache.put(new URL(url, origin).href, response.clone());
          }
        } catch {
          // Sin conexión: se ignora, se reintentará en la próxima visita.
        }
      })
    );
  }
}

// ------------------------------------------------------------------ utilidades

function fetchWithTimeout(request, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(request, { signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
}

async function putInCache(cacheName, request, response) {
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
  } catch {
    // Una respuesta opaca (status 0) o una cuota llena no deben romper nada.
  }
}

function isCacheable(response) {
  return response && (response.ok || response.type === "opaque");
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (isCacheable(response)) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("", { status: 504, statusText: "Sin conexión" });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then(async (response) => {
      if (isCacheable(response)) {
        await putInCache(cacheName, request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) return cached;

  return (
    (await network) ||
    new Response("", { status: 504, statusText: "Sin conexión" })
  );
}

async function networkFirst(request, cacheName, timeoutMs = NAVIGATION_TIMEOUT) {
  try {
    const response = await fetchWithTimeout(request, timeoutMs);
    if (isCacheable(response)) {
      await putInCache(cacheName, request, response.clone());
    }
    return response;
  } catch {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response("", { status: 504, statusText: "Sin conexión" });
  }
}

// ---------------------------------------------------------------- navegación

async function findCachedPage(rawUrl) {
  const pages = await caches.open(PAGES_CACHE);
  const exact = await pages.match(rawUrl);
  if (exact) return exact;

  const url = new URL(rawUrl);
  const canonical = url.origin + url.pathname;

  const page = await pages.match(canonical);
  if (page) return page;

  // La portada siempre está precargada: sirve como último recurso.
  if (url.pathname === "/") {
    const shell = await caches.open(SHELL_CACHE);
    const home = await shell.match("/");
    if (home) return home;
  }

  return null;
}

async function getOfflinePage() {
  const cached =
    (await caches.match(OFFLINE_URL)) ||
    (await caches.match(OFFLINE_URL, { ignoreSearch: true }));

  if (cached) return cached;

  return new Response(
    `<!doctype html><html lang="es"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Sin conexión</title>
    <style>body{font-family:system-ui,sans-serif;background:#f9fafb;color:#111827;
    display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px}
    div{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:32px;
    max-width:380px;text-align:center}h1{font-size:20px;margin:0 0 8px}
    p{font-size:14px;color:#4b5563;line-height:1.5}a{display:inline-block;margin-top:16px;
    background:#4f46e5;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;
    font-size:14px;font-weight:600}</style></head><body><div><h1>📡 Estás sin conexión</h1>
    <p>Esta página no está guardada en tu celular. Vuelve al inicio para ver el
    contenido que ya habías visitado.</p><a href="/">Volver al inicio</a></div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

async function handleNavigation(request) {
  try {
    const response = await fetchWithTimeout(request, NAVIGATION_TIMEOUT);
    if (isCacheable(response)) {
      await putInCache(PAGES_CACHE, request, response.clone());
    }
    // 4xx/3xx se devuelven tal cual; 5xx se tratan como caída del servidor.
    if (response.status < 500) return response;
  } catch {
    // Sin red: se usa la copia guardada.
  }

  const cached = await findCachedPage(request.url);
  if (cached) return cached;
  return getOfflinePage();
}

/**
 * Peticiones internas del App Router (navegación sin recargar la página).
 * Si no hay internet, se devuelve el HTML guardado de esa ruta; Next.js lo
 * detecta y hace una navegación completa, que también sale de la caché.
 */
async function handleRscRequest(request) {
  try {
    const response = await fetchWithTimeout(request, NAVIGATION_TIMEOUT);
    if (isCacheable(response)) {
      await putInCache(PAGES_CACHE, request, response.clone());
    }
    if (response.status < 500) return response;
  } catch {
    // Sin red: se usa la copia guardada.
  }

  const cached = await findCachedPage(request.url);
  if (cached) return cached;
  // HTML (no RSC) para que Next.js haga una navegación completa al offline.
  return getOfflinePage();
}

// ------------------------------------------------------------------- fetch

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Ignorar esquemas que no son http(s) (extensiones, devtools, etc.)
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  const sameOrigin = url.origin === self.location.origin;

  // El propio service worker no se cachea: el navegador debe ver siempre la
  // versión más reciente para poder actualizarlo.
  if (sameOrigin && url.pathname === "/sw.js") return;

  const isPublicSupabaseImage =
    /\.supabase\.co$/i.test(url.hostname) &&
    /\/storage\/v1\/object\/public\//i.test(url.pathname);

  if (!sameOrigin && !isPublicSupabaseImage) return;

  // 1. Navegaciones y peticiones internas del App Router de Next.js.
  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  const isRscRequest =
    request.headers.get("RSC") === "1" || url.searchParams.has("_rsc");

  if (isRscRequest) {
    event.respondWith(handleRscRequest(request));
    return;
  }

  // 2. Recursos estáticos inmutables de Next.js, fuentes e íconos.
  if (
    sameOrigin &&
    (url.pathname.startsWith("/_next/static/") ||
      url.pathname.startsWith("/icons/") ||
      request.destination === "font")
  ) {
    event.respondWith(cacheFirst(request, ASSETS_CACHE));
    return;
  }

  // 3. Imágenes (next/image, íconos, evidencias de Supabase Storage).
  if (
    request.destination === "image" ||
    url.pathname.startsWith("/_next/image") ||
    /\.(png|jpe?g|webp|avif|gif|svg|ico)$/i.test(url.pathname)
  ) {
    event.respondWith(staleWhileRevalidate(request, IMAGES_CACHE));
    return;
  }

  // 4. Scripts, estilos y otros GET del mismo origen.
  if (sameOrigin) {
    event.respondWith(networkFirst(request, ASSETS_CACHE, 8000));
  }
});
