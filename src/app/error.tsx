'use client';

import Link from 'next/link';
import { mensajeSeguro } from '@/lib/errores';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-lg p-8 mt-16 text-center">
      <p className="text-4xl" aria-hidden="true">🔧</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        Algo salió mal
      </h1>
      <p className="mt-2 text-sm text-gray-600">{mensajeSeguro('cargar')}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Volver a intentar
        </button>
        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
