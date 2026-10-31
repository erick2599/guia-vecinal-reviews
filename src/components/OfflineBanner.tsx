"use client";

import { useEffect, useState } from "react";
import { useOffline } from "next/offline";

/**
 * Franja que aparece cuando el celular pierde la conexión para avisar que
 * se está mostrando contenido guardado.
 *
 * Combina el hook de Next.js (detecta fallos reales de red) con
 * navigator.onLine (detecta el aviso inmediato del sistema operativo).
 */
export default function OfflineBanner() {
  const offlineHook = useOffline();
  const [sinRed, setSinRed] = useState(false);

  useEffect(() => {
    const actualizar = () => setSinRed(!navigator.onLine);

    actualizar();
    window.addEventListener("online", actualizar);
    window.addEventListener("offline", actualizar);

    return () => {
      window.removeEventListener("online", actualizar);
      window.removeEventListener("offline", actualizar);
    };
  }, []);

  if (!offlineHook && !sinRed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-16 z-40 bg-gray-900/95 text-white text-center text-xs font-medium px-4 py-2.5"
    >
      📡 Sin conexión — estás viendo contenido guardado
    </div>
  );
}
