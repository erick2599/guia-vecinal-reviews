'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ReportarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados existentes
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [categoria, setCategoria] = useState('mecanicos');
  const [descripcion, setDescripcion] = useState('');
  const [calificacion, setCalificacion] = useState(1);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  // NUEVO: Estado para el archivo de imagen
  const [archivoFoto, setArchivoFoto] = useState<File | null>(null);

  const generarSlug = (texto: string) => {
    return texto
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+\$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!nombre.trim() || !descripcion.trim()) {
      setError('Por favor, completa todos los campos requeridos.');
      setLoading(false);
      return;
    }

    let urlPublicaImagen = null;

    // NUEVO: Lógica para subir la imagen a Supabase Storage si el usuario seleccionó una
    if (archivoFoto) {
      const nombreArchivo = `${Date.now()}_${archivoFoto.name.replace(/\s+/g, '_')}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pruebas_reseñas')
        .upload(nombreArchivo, archivoFoto);

      if (uploadError) {
        setError('Error al subir la imagen de prueba. Por favor, intenta de nuevo.');
        setLoading(false);
        return;
      }

      // Obtener la URL pública del archivo subido
      const { data: publicUrlData } = supabase.storage
        .from('pruebas_reseñas')
        .getPublicUrl(nombreArchivo);

      urlPublicaImagen = publicUrlData.publicUrl;
    }

    const slug = generarSlug(nombre);

    // Operación de Escritura (INSERT) incluyendo la URL de la imagen
    const { error: insertError } = await supabase
      .from('negocios')
      .insert([
        {
          nombre: nombre.trim(),
          categoria,
          slug,
          descripcion: descripcion.trim(),
          calificacion: Number(calificacion),
          direccion: direccion.trim(),
          imagen_prueba_url: urlPublicaImagen, // <-- Se añade la URL de la prueba
        },
      ]);

    if (insertError) {
      setError('Ocurrió un error al enviar el reporte. Inténtalo de nuevo.');
      setLoading(false);
    } else {
      router.push(`/categorias/${categoria}`);
      router.refresh();
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10 border border-gray-100">
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:underline">
          ← Volver al inicio
        </Link>
        <h1 className="text-2xl font-bold text-gray-950 mt-2">
          Escribir una Reseña o Experiencia 📝
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Comparte tu opinión con la comunidad para destacar los buenos servicios o alertar sobre malas experiencias.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nombre del negocio o establecimiento *
          </label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Mecánica El Chanchullo"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Dirección o ubicación del negocio (Opcional)
          </label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Ej: Calle Principal #123, frente al parque"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Sector o Rubro *
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
          >
            <option value="mecanicos">🔧 Talleres Mecánicos</option>
            <option value="restaurantes">🍔 Gastronomía y Cafés</option>
            <option value="salud">⚕️ Salud y Clínicas</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Tu calificación (1 al 5)
          </label>
          <select
            value={calificacion}
            onChange={(e) => setCalificacion(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
          >
            <option value="1">⭐ Crítica (Mala experiencia, cobros indebidos)</option>
            <option value="2">⭐⭐ Insatisfecho</option>
            <option value="3">⭐⭐⭐ Regular</option>
            <option value="4">⭐⭐⭐⭐ Bueno</option>
            <option value="5">⭐⭐⭐⭐⭐ Excelente servicio</option>
          </select>
        </div>

        {/* NUEVO: Campo para adjuntar la fotografía/prueba */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Adjuntar comprobante o fotografía (Recomendado para evitar difamaciones)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setArchivoFoto(e.target.files[0]);
              }
            }}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
          />
          <p className="text-xs text-gray-400 mt-1">Puedes subir una foto del ticket, factura, presupuesto o evidencia del trabajo realizado.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Cuéntanos tu experiencia *
          </label>
          <textarea
            required
            rows={4}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Explica detalladamente tu experiencia con este negocio..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
          />
        </div>

        {/* NUEVO: Bloque de Aviso Legal y Términos y Condiciones */}
<div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 space-y-2">
  <p className="font-semibold text-gray-700">Aviso de Responsabilidad Legal:</p>
  <p className="leading-relaxed">
    Esta es una plataforma comunitaria y colaborativa. El usuario es el único y exclusivo responsable legal de las opiniones, declaraciones y pruebas fotográficas vertidas en este formulario. 
  </p>
  <p className="leading-relaxed">
    Queda estrictamente prohibido el uso de lenguaje injurioso, difamaciones malintencionadas por enemistad o datos personales sensibles. Nos reservamos el derecho de remover reseñas que violen las normativas comunitarias o que sean reportadas como falsas por falta de sustento.
  </p>
  
  <label className="flex items-start gap-2 pt-2 border-t border-gray-200 font-medium text-gray-800 cursor-pointer mt-1">
    <input
      type="checkbox"
      checked={aceptaTerminos}
      onChange={(e) => setAceptaTerminos(e.target.checked)}
      className="mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
    />
    <span>
      Declaro bajo juramento que mi reseña es verídica y acepto los Términos y Condiciones Comunitarios. *
    </span>
  </label>
</div>


        <button
  type="submit"
  disabled={loading || !aceptaTerminos} // <-- Modifica esta línea
  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
>
  {loading ? 'Subiendo evidencia y reseña...' : 'Publicar Reseña 📢'}
</button>

      </form>
    </main>
  );
}
