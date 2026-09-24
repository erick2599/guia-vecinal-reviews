import Link from 'next/link';

export default function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        
        {/* Información de Derechos */}
        <div className="text-center sm:text-left">
          <p className="font-semibold text-gray-700">GuíaVecinal 🏙️</p>
          <p className="text-xs mt-0.5">
            &copy; {anioActual} — Espacio de construcción comunitaria y transparencia comercial.
          </p>
        </div>

        {/* Enlaces Rápidos de Navegación y Legalidad */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Inicio
          </Link>
          <Link href="/login" className="hover:text-indigo-600 transition-colors">
            Portal Comercios
          </Link>
          <Link href="/contacto" className="hover:text-indigo-600 transition-colors">
            Verificar mi Negocio
          </Link>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span className="text-gray-400 italic">
            Las reseñas expresadas son responsabilidad exclusiva de sus autores.
          </span>
        </div>

      </div>
    </footer>
  );
}
