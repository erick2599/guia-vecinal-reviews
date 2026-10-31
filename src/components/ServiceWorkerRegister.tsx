"use client";

import { useEffect } from "react";

/**
 * Registra el service worker (public/sw.js) y recarga una sola vez cuando
 * hay una versión nueva de la app lista para usarse.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let recargando = false;
    const teniaControl = Boolean(navigator.serviceWorker.controller);

    const alCambiarControl = () => {
      // En la primera instalación no recargamos: la app ya está abierta.
      if (!teniaControl || recargando) return;
      recargando = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      alCambiarControl
    );

    const registrar = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        const registro = await navigator.serviceWorker.ready;
        // Busca actualizaciones sin bloquear la interfaz.
        registro.update().catch(() => {});
      } catch (error) {
        console.warn("[PWA] No se pudo registrar el service worker:", error);
      }
    };

    if (document.readyState === "complete") {
      registrar();
    } else {
      window.addEventListener("load", registrar, { once: true });
    }

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        alCambiarControl
      );
    };
  }, []);

  return null;
}
