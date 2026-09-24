import { supabase } from '@/lib/supabase';
import { getSupabaseServer } from '@/lib/supabaseServer';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NegocioPage({ params }: Props) {
  const { id } = await params;

  // 1. Obtener la sesión del usuario actual desde el servidor de forma segura
  const supabaseServer = await getSupabaseServer();
  const { data: { user } } = await supabaseServer.auth.getUser();

  // 2. Leer los datos del negocio
  const { data: negocio, error } = await supabase
    .from('negocios')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !negocio) {
    notFound();
  }

  // Verificar si el usuario autenticado es el propietario de este negocio asignado
  const esElDueno = user && user.id === negocio.dueno_id;

  return (
    <main className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10 border border-gray-100">
      <Link href={`/categorias/${negocio.categoria}`} className="text-sm text-indigo-600 hover:underline mb-4 inline-block">
        ← Volver a {negocio.categoria}
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{negocio.nombre}</h1>
      
      <div className="flex flex-wrap gap-2 items-center mb-6">
        <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-semibold uppercase">
          {negocio.categoria}
        </span>
        {negocio.direccion && (
          <span className="text-sm text-gray-500 flex items-center">📍 {negocio.direccion}</span>
        )}
      </div>
      
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <span className="text-2xl font-bold text-amber-500">
            {'★'.repeat(negocio.calificacion)}{'☆'.repeat(5 - negocio.calificacion)}
          </span>
          <span className="text-gray-600 ml-2 font-medium">({negocio.calificacion}/5)</span>
        </div>
        <p className="text-gray-700 leading-relaxed italic">"{negocio.descripcion}"</p>
      </div>

      {/* NUEVO: Mostrar la prueba adjunta si existe */}
  {negocio.imagen_prueba_url && (
  <div className="mt-4 border-t pt-4">
    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
      Evidencia adjunta por el usuario:
    </h4>
    <img 
      src={negocio.imagen_prueba_url} 
      alt="Evidencia adjunta" 
      className="max-h-64 rounded-lg border border-gray-200 object-contain bg-gray-50 p-1"
    />
  </div>
)}


      {/* Control de Respuesta Oficial */}
      {esElDueno ? (
        // Si es el dueño, se le renderiza un bloque de edición directa (puedes estructurar un Server Action o API Route aquí)
        <div className="mt-6 p-5 bg-indigo-50 border border-indigo-100 rounded-xl">
          <h3 className="text-sm font-bold text-indigo-900 mb-2">🛠️ Administrar respuesta de tu establecimiento:</h3>
          <form action={async (formData: FormData) => {
            'use server';
            const respuesta = formData.get('respuesta') as string;
            const client = await getSupabaseServer();
            await client.from('negocios').update({ respuesta_dueno: respuesta }).eq('id', id);
          }} className="space-y-2">
            <textarea
              name="respuesta"
              defaultValue={negocio.respuesta_dueno || ''}
              placeholder="Escribe tu postura o aclaración comunitaria aquí..."
              className="w-full p-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
              Guardar Respuesta Oficial
            </button>
          </form>
        </div>
      ) : negocio.respuesta_dueno ? (
        <div className="mt-6 p-5 bg-blue-50 border border-blue-100 rounded-xl">
          <h3 className="text-sm font-bold text-blue-900 mb-2">💬 Respuesta oficial del establecimiento:</h3>
          <p className="text-gray-700 text-sm leading-relaxed">{negocio.respuesta_dueno}</p>
        </div>
      ) : (
        <div className="mt-8 border-t pt-4 text-center">
          <p className="text-xs text-gray-400">
            ¿Eres el dueño de este negocio? <Link href="/login" className="text-indigo-600 font-semibold hover:underline">Inicia sesión aquí</Link> para responder a tus clientes de manera transparente.
          </p>
        </div>
      )}
    </main>
  );
}
