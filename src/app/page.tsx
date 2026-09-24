import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import BuscadorNegocios from '@/components/BuscadorNegocios';

export default async function HomePage() {
  // Operación de lectura: Traer los datos clave para el buscador en tiempo real
  const { data: negocios, error } = await supabase
    .from('negocios')
    .select('id, nombre, categoria, descripcion, direccion, calificacion');

  const listaNegocios = error || !negocios ? [] : negocios;

  // Extraer las categorías únicas disponibles en el sistema
  const categoriasUnicas = Array.from(
    new Set(listaNegocios.map((n) => n.categoria))
  );

  return (
    <main className="max-w-4xl mx-auto p-6 mt-10">
      {/* Encabezado Principal Amigable */}
      <section className="text-center mb-12 py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Guía Comercial Vecinal 🏙️
        </h1>
        <p className="text-gray-600 text-base max-w-xl mx-auto px-4 leading-relaxed mb-6">
          Tu espacio para calificar y descubrir los pequeños negocios de nuestra ciudad. 
          Comparte tus buenas experiencias y ayuda a mejorar los servicios locales.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/reportar" 
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm text-sm transition-all transform hover:-translate-y-0.5"
          >
            ⭐ Escribir una Reseña
          </Link>
        </div>
      </section>

      {/* Inyección del Buscador Dinámico de Cliente */}
      <BuscadorNegocios 
        negociosIniciales={listaNegocios} 
        categoriasDisponibles={categoriasUnicas} 
      />
    </main>
  );
}
