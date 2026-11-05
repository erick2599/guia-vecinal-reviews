'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CATEGORIAS } from '@/lib/categorias';
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
  const [calificacion, setCalificacion] = useState(0);
  const [estrellasHover, setEstrellasHover] = useState(0);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [archivoFoto, setArchivoFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const inputFotoRef = useRef<HTMLInputElement>(null);

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
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    return () => {
      if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    };
  }, [fotoPreview]);

  const seleccionarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0] ?? null;
    setError(null);

    if (!archivo) {
      setArchivoFoto(null);
      setFotoPreview(null);
      return;
    }

    if (!archivo.type.startsWith('image/')) {
      setError('La fotografía debe ser una imagen (JPG, PNG o WebP).');
      e.target.value = '';
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      setError('La fotografía no puede pesar más de 5 MB.');
      e.target.value = '';
      return;
    }

    setArchivoFoto(archivo);
    setFotoPreview(URL.createObjectURL(archivo));
  };

  const quitarFoto = () => {
    setArchivoFoto(null);
    setFotoPreview(null);
    if (inputFotoRef.current) inputFotoRef.current.value = '';
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

    if (calificacion < 1) {
      setError('Por favor, selecciona una calificación de 1 a 5 estrellas.');
      setLoading(false);
      return;
    }

    let urlPublicaImagen: string | null = null;
    let nombreArchivoSubido: string | null = null;

    if (archivoFoto) {
      const extension = archivoFoto.name.split('.').pop()?.toLowerCase() || 'jpg';
      const nombreArchivo = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${extension}`;
      nombreArchivoSubido = nombreArchivo;

      const { error: uploadError } = await supabase.storage
        .from('fotos-resenas')
        .upload(nombreArchivo, archivoFoto, {
          contentType: archivoFoto.type,
          cacheControl: '3600',
        });

      if (uploadError) {
        setError('Error al subir la imagen. Por favor, intenta de nuevo.');
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('fotos-resenas')
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
      // Si el negocio no se pudo guardar, no dejamos la foto huérfana.
      if (nombreArchivoSubido) {
        await supabase.storage
          .from('fotos-resenas')
          .remove([nombreArchivoSubido]);
      }
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
            {Object.entries(CATEGORIAS).map(([slug, info]) => (
              <option key={slug} value={slug}>
                {info.icono} {info.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Calificación con estrellas */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Calificación del establecimiento *
          </label>
          <div
            role="radiogroup"
            aria-label="Calificación en estrellas"
            className="flex flex-wrap items-center gap-1"
          >
            {[1, 2, 3, 4, 5].map((valor) => {
              const activa = valor <= (estrellasHover || calificacion);
              return (
                <button
                  key={valor}
                  type="button"
                  role="radio"
                  aria-checked={calificacion === valor}
                  aria-label={`${valor} ${valor === 1 ? 'estrella' : 'estrellas'}`}
                  onClick={() => setCalificacion(valor)}
                  onMouseEnter={() => setEstrellasHover(valor)}
                  onMouseLeave={() => setEstrellasHover(0)}
                  onFocus={() => setEstrellasHover(valor)}
                  onBlur={() => setEstrellasHover(0)}
                  className={`text-4xl leading-none transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded ${
                    activa ? 'text-amber-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              );
            })}
            <span className="ml-2 text-sm font-semibold text-gray-600">
              {calificacion > 0
                ? `${calificacion} de 5 estrellas`
                : 'Toca las estrellas para calificar'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Selecciona de 1 a 5 estrellas según tu experiencia.
          </p>
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

        {/* Fotografía opcional */}
        <div>
          <label
            htmlFor="foto"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Fotografía del lugar{' '}
            <span className="font-normal text-gray-500">(opcional)</span>
          </label>
          <input
            ref={inputFotoRef}
            id="foto"
            type="file"
            accept="image/*"
            onChange={seleccionarFoto}
            className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-100 file:cursor-pointer border border-gray-200 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            JPG, PNG o WebP · máximo 5 MB. Se mostrará junto a tu reseña.
          </p>

          {fotoPreview && (
            <div className="mt-3 relative inline-block">
              {/* Vista previa local del archivo elegido */}
              <img
                src={fotoPreview}
                alt="Vista previa de la fotografía"
                className="max-h-56 rounded-xl border border-gray-200 object-contain bg-gray-50"
              />
              <button
                type="button"
                onClick={quitarFoto}
                className="absolute top-2 right-2 rounded-full bg-black/60 text-white text-xs font-semibold px-2.5 py-1 hover:bg-black/80"
              >
                Quitar
              </button>
            </div>
          )}
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