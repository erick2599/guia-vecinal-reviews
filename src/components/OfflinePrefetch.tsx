"use client";

import { useEffect, useRef } from "react";

/**
 * Pide al service worker que guarde páginas para poder verlas sin conexión.
 * Se usa en la portada con las categorías y los negocios ya cargados.
 */
export default function OfflinePrefetch({ urls }: { urls: string[] }) {
  const yaPedido = useRef(false);
  const clave = urls.join("|");

  useEffect(() => {
    if (yaPedido.current || !clave || !("serviceWorker" in navigator)) return;

    if (!navigator.onLine) return;
    if (!navigator.serviceWorker.controller) return;

    const marcaSesion = "gv-offline-prefetch";
    try {
      if (window.sessionStorage.getItem(marcaSesion) === clave) return;
      window.sessionStorage.setItem(marcaSesion, clave);
    } catch {
      // sessionStorage puede fallar en modo privado; seguimos igual.
    }

    yaPedido.current = true;
    navigator.serviceWorker.controller.postMessage({
      type: "CACHE_URLS",
      urls,
    });
  }, [clave, urls]);

  return null;
}
