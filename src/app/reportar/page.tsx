'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ReportarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados comunes del formulario
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [categoria, setCategoria] = useState('mecanicos');
  const [descripcion, setDescripcion] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [archivoFoto, setArchivoFoto] = useState<File | null>(null);

  // Estados para Promoción de Negocios
  const [esPromocionado, setEsPromocionado] = useState(false);
  const [horario, setHorario] = useState('');
  const [nombrePropietario, setNombrePropietario] = useState('');
  const [telefonoContacto, setTelefonoContacto] = useState('');
  const [redesSociales, setRedesSociales] = useState('');

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
      setError('Por favor, completa todos los campos requeridos (Nombre y Descripción).');
      setLoading(false);
      return;
    }

    let urlPublicaImagen = null;

    if (archivoFoto) {
      const nombreArchivo = `${Date.now()}_${archivoFoto.name.replace(/\s+/g, '_')}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pruebas_reseñas')
        .upload(nombreArchivo, archivoFoto);

      if (uploadError) {
        setError('Error al subir la imagen. Por favor, intenta de nuevo.');
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('pruebas_reseñas')
        .getPublicUrl(nombreArchivo);

      urlPublicaImagen = publicUrlData.publicUrl;
    }

    const slug = generarSlug(nombre);

    // Guardado en la base de datos con detección de errores detallada
    const { error: insertError } = await supabase
      .from('negocios')
      .insert([
        {
          nombre: nombre.trim(),
          categoria,
          slug,
          descripcion: descripcion.trim(),
          calificacion: Number(calificacion),
          direccion: direccion.trim() || null,
          imagen_prueba_url: urlPublicaImagen,
          es_promocionado: esPromocionado,
          horario: esPromocionado ? horario.trim() : null,
          nombre_propietario: esPromocionado ? nombrePropietario.trim() : null,
          telefono_contacto: esPromocionado ? telefonoContacto.trim() : null,
          redes_sociales: esPromocionado ? redesSociales.trim() : null,
        },
      ]);

    if (insertError) {
      setError(`Fallo en Supabase: ${insertError.message} -> ${insertError.details || 'Revisa restricciones NOT NULL'}`);
      setLoading(false);
    } else {
      router.push(`/categorias/${categoria}`);
      router.refresh();
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10 border border-gray-100 mb-20">
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:underline">
          ← Volver al inicio
        </Link>
        <h1 className="text-2xl font-bold text-gray-950 mt-2">
          Publicar un Servicio o Reseña Comercial 📝
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Utiliza este espacio tanto para calificar una experiencia como para dar a conocer tu propio negocio local de forma gratuita.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Casilla de verificación: Dueño vs Cliente */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 space-y-2">
          <label className="flex items-center gap-2 font-bold text-gray-900 cursor-pointer">
            <input
              type="checkbox"
              checked={esPromocionado}
              onChange={(e) => setEsPromocionado(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
            />
            <span>📢 ¡Soy propietario y quiero publicar mi negocio gratis!</span>
          </label>
          <p className="text-xs text-gray-500">
            Marca esta casilla si eres el dueño del comercio para desbloquear tu formulario personalizado de presentación.
          </p>
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {esPromocionado ? 'Nombre de tu negocio o emprendimiento *' : 'Nombre del negocio o establecimiento *'}
          </label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Panadería Gaitan o Taller Mecánico Silva"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
          />
        </div>

        {/* Campos condicionales para dueños */}
        {esPromocionado && (
          <div className="space-y-4 p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider">📋 Ficha del Propietario:</p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tu nombre completo *</label>
              <input
                type="text"
                required={esPromocionado}
                value={nombrePropietario}
                onChange={(e) => setNombrePropietario(e.target.value)}
                placeholder="Ej: Erick Gaitan"
                className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono o WhatsApp de contacto</label>
                <input
                  type="text"
                  value={telefonoContacto}
                  onChange={(e) => setTelefonoContacto(e.target.value)}
                  placeholder="Ej: +503 7000-0000"
                  className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Redes Sociales</label>
                <input
                  type="text"
                  value={redesSociales}
                  onChange={(e) => setRedesSociales(e.target.value)}
                  placeholder="Ej: @panaderiagaitan"
                  className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Horario de atención</label>
              <input
                type="text"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                placeholder="Ej: Todos los días de 7:00 AM a 3:00 PM"
                className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Dirección */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Dirección o ubicación física del local
          </label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Ej: Av. Principal #123, Frente al parque"
            className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría del Rubro *</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="mecanicos">🔧 Mecánicos & Talleres</option>
            <option value="restaurantes">🍞 Gastronomía & Restaurantes</option>
            <option value="tiendas">🛍️ Tiendas & Almacenes</option>
            <option value="salud">⚕️ Salud & Clínicas</option>
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción del Servicio o Reseña *</label>
          <textarea
            required
            rows={4}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe qué ofrece el negocio, especialidades o tu reseña sobre el lugar..."
            className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        {/* Botón de Envío */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all disabled:bg-gray-400"
        >
          {loading ? 'Guardando información...' : '🚀 Publicar Ahora'}
        </button>

      </form>
    </main>
  );
}