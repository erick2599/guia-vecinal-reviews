import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logotipo / Nombre del Sitio */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl" role="img" aria-hidden="true">🏙️</span>
          <span className="font-extrabold text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">
            GuíaVecinal
          </span>
        </Link>

        {/* Enlaces de Navegación */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link 
            href="/login" 
            className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
          >
            <span role="img" aria-hidden="true">💼</span>
            <span className="hidden sm:inline">Portal</span> Comercios
          </Link>

          <Link 
            href="/reportar" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-sm transition-all transform hover:-translate-y-0.5"
          >
            ⭐ Escribir Reseña
          </Link>
        </div>
      </div>
    </nav>
  );
}
