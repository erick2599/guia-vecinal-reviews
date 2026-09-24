import { supabase, Negocio } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;

  // Operación de lectura filtrando por la columna 'categoria'
  const { data: negocios, error } = await supabase
    .from('negocios')
    .select('*')
    .eq('categoria', slug);

  if (error || !negocios) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-6 capitalize text-gray-800">
        Categoría: {slug}
      </h1>

      {negocios.length === 0 ? (
        <p className="text-gray-500 text-lg">No hay negocios registrados en esta categoría aún.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {negocios.map((n: Negocio) => (
            <div key={n.id} className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-1 text-gray-900">{n.nombre}</h2>
              
              <div className="text-amber-500 mb-2">
                {'★'.repeat(n.calificacion)}{'☆'.repeat(5 - n.calificacion)}
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {n.descripcion}
              </p>

              {/* Enlace dinámico hacia el perfil único del negocio */}
              <Link 
                href={`/negocios/${n.id}`}
                className="text-blue-600 font-medium hover:underline text-sm"
              >
                Ver opiniones e información →
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
