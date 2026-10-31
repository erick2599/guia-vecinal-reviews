import Link from "next/link";

export const metadata = {
  title: "Sin conexión",
  description: "Esta página no está disponible sin conexión.",
};

export default function OfflinePage() {
  return (
    <main className="max-w-md mx-auto p-6 mt-16 text-center">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
        <span className="text-5xl block mb-4" role="img" aria-hidden="true">
          📡
        </span>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Estás sin conexión
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          No pudimos cargar esta página porque no tienes internet en este
          momento. Las páginas que ya visitaste antes siguen disponibles.
        </p>

        <Link
          href="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          ← Volver al inicio
        </Link>

        <p className="text-xs text-gray-400 mt-6">
          Cuando recuperes la conexión, el contenido se actualizará
          automáticamente.
        </p>
      </div>
    </main>
  );
}
