"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const CLAVE_DESCARTE = "gv-install-descartado";
const DIAS_DESCARTE = 14;
const EVENTO_MOSTRAR = "gv:mostrar-instalar";

function esIOS() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const iPadOS =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return /iPad|iPhone|iPod/i.test(ua) || iPadOS;
}

function estaInstalada() {
  if (typeof window === "undefined") return true;
  const standalone = window.matchMedia("(display-mode: standalone)").matches;
  const navigatorStandalone = Boolean(
    (navigator as Navigator & { standalone?: boolean }).standalone
  );
  return standalone || navigatorStandalone;
}

function fueDescartado() {
  try {
    const valor = window.localStorage.getItem(CLAVE_DESCARTE);
    if (!valor) return false;
    const fecha = Number(valor);
    if (!Number.isFinite(fecha)) return false;
    return Date.now() - fecha < DIAS_DESCARTE * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export default function InstallPrompt() {
  const [evento, setEvento] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [ayudaAbierta, setAyudaAbierta] = useState(false);
  const [instalada, setInstalada] = useState(true);
  const [instalando, setInstalando] = useState(false);
  const ios = esIOS();

  useEffect(() => {
    // La lectura del entorno se hace después de montar para que el HTML del
    // servidor y el del cliente coincidan (evita errores de hidratación).
    const frame = window.requestAnimationFrame(() => {
      setInstalada(estaInstalada());
    });

    const alPoderInstalar = (e: Event) => {
      e.preventDefault();
      setEvento(e as BeforeInstallPromptEvent);
    };

    const alInstalar = () => {
      setInstalada(true);
      setVisible(false);
      setAyudaAbierta(false);
      setEvento(null);
    };

    const abrirManual = () => {
      if (estaInstalada()) return;
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", alPoderInstalar);
    window.addEventListener("appinstalled", alInstalar);
    window.addEventListener(EVENTO_MOSTRAR, abrirManual);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("beforeinstallprompt", alPoderInstalar);
      window.removeEventListener("appinstalled", alInstalar);
      window.removeEventListener(EVENTO_MOSTRAR, abrirManual);
    };
  }, []);

  // En Android/Chrome aparece solo cuando el navegador confirma que se puede
  // instalar. En iOS no existe ese evento, así que mostramos la guía manual.
  useEffect(() => {
    if (instalada || fueDescartado()) return;
    if (!evento && !ios) return;

    const temporizador = window.setTimeout(() => setVisible(true), 2500);
    return () => window.clearTimeout(temporizador);
  }, [evento, ios, instalada]);

  const descartar = useCallback(() => {
    setVisible(false);
    setAyudaAbierta(false);
    try {
      window.localStorage.setItem(CLAVE_DESCARTE, String(Date.now()));
    } catch {
      // Sin localStorage el aviso simplemente volverá en otra visita.
    }
  }, []);

  const instalar = async () => {
    if (!evento) {
      setAyudaAbierta(true);
      return;
    }

    setInstalando(true);
    try {
      await evento.prompt();
      const eleccion = await evento.userChoice;
      if (eleccion.outcome === "accepted") {
        setVisible(false);
        setInstalada(true);
      } else {
        descartar();
      }
    } catch {
      setAyudaAbierta(true);
    } finally {
      setInstalando(false);
      setEvento(null);
    }
  };

  if (!visible) return null;

  return (
    <>
      {ayudaAbierta && (
        <div
          className="fixed inset-0 z-[80] bg-black/50 flex items-end sm:items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-instalar"
          onClick={() => setAyudaAbierta(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2
                id="titulo-instalar"
                className="text-lg font-bold text-gray-900"
              >
                Instalar GuíaVecinal 📲
              </h2>
              <button
                onClick={() => setAyudaAbierta(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            {ios ? (
              <ol className="text-sm text-gray-600 space-y-3 list-decimal list-inside">
                <li>
                  Abre esta página en <strong>Safari</strong>.
                </li>
                <li>
                  Toca el botón <strong>Compartir</strong> (el cuadro con la
                  flecha hacia arriba).
                </li>
                <li>
                  Desliza y elige{" "}
                  <strong>&ldquo;Añadir a pantalla de inicio&rdquo;</strong>.
                </li>
                <li>
                  Toca <strong>Añadir</strong> y listo: se abrirá como una app.
                </li>
              </ol>
            ) : (
              <ol className="text-sm text-gray-600 space-y-3 list-decimal list-inside">
                <li>
                  Abre el menú del navegador (los tres puntos{" "}
                  <strong>⋮</strong>).
                </li>
                <li>
                  Elige <strong>&ldquo;Instalar app&rdquo;</strong> o{" "}
                  <strong>&ldquo;Añadir a pantalla de inicio&rdquo;</strong>.
                </li>
                <li>Confirma y ábrela desde tu pantalla de inicio.</li>
              </ol>
            )}

            <button
              onClick={() => setAyudaAbierta(false)}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-sm"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <div
        className="fixed inset-x-0 bottom-0 z-[60] px-3 pt-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto max-w-md bg-white border border-gray-200 shadow-xl rounded-2xl p-4 flex items-center gap-3">
          <Image
            src="/icons/icon-192.png"
            alt=""
            width={44}
            height={44}
            className="rounded-xl shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-900 leading-tight">
              Instala GuíaVecinal
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Acceso directo y uso sin conexión.
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={instalar}
              disabled={instalando}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors"
            >
              {instalando ? "..." : "Instalar"}
            </button>
            <button
              onClick={descartar}
              className="text-gray-400 hover:text-gray-600 p-1.5"
              aria-label="Ahora no"
              title="Ahora no"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/** Botón para que el usuario pueda abrir el aviso de instalación más tarde. */
export function InstallAppButton() {
  const [instalada, setInstalada] = useState(true);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setInstalada(estaInstalada());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (instalada) return null;

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(EVENTO_MOSTRAR))}
      className="inline-flex items-center gap-1 hover:text-indigo-600 transition-colors"
    >
      📲 Instalar app
    </button>
  );
}
