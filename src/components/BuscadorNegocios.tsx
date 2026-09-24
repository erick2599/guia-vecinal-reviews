'use client';

import { useState } from 'react';
import Link from 'next/link';

// Definición de la estructura de datos que recibe el componente
interface NegocioBasico {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  direccion: string | null;
  calificacion: number;
}

interface BuscadorProps {
  negociosIniciales: NegocioBasico[];
  categoriasDisponibles: string[];
}

export default function BuscadorNegocios({ negociosIniciales, categoriasDisponibles }: BuscadorProps) {
  const [busqueda, setBusqueda] = useState('');

  // Diccionario visual para íconos y nombres limpios de categorías
  const formatoCategorias: Record<string, { nombre: string; icono: string }> = {
    mecanicos: { nombre: 'Talleres Mecánicos', icono: '🔧' },
    restaurantes: { nombre: 'Gastronomía y Cafés', icono: '🍔' },
    salud: { nombre: 'Salud y Clínicas', icono: '⚕️' },
  };

  // Filtrado en tiempo real según lo que escribe el usuario
  const negociosFiltrados = negociosIniciales.filter((n) => {
    const termino = busqueda.toLowerCase().trim();
    if (!termino) return false; // Si no hay búsqueda, no mostramos sugerencias individuales aquí

    return (
      n.nombre.toLowerCase().includes(termino) ||
      n.descripcion.toLowerCase().includes(termino) ||
      (n.direccion && n.direccion.toLowerCase().includes(termino))
    );
  });

  return (
    <div className="space-y-10">
      {/* Barra de entrada de búsqueda */}
      <div className="max-w-md mx-auto -mt-6 mb-8 relative z-10 px-4">
        <div className="relative shadow-md rounded-xl">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xl pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, palabra clave o dirección..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white placeholder-gray-400 text-sm"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 text-xs"
            >
              Borrar
            </button>
          )}
        </div>
      </div>

      {/* RESULTADOS DE BÚSQUEDA EN TIEMPO REAL */}
      {busqueda && (
        <section className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 animate-fadeIn">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            ✨ Resultados de búsqueda para "{busqueda}" 
            <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full">
              {negociosFiltrados.length} encontrados
            </span>
          </h2>

          {negociosFiltrados.length === 0 ? (
            <p className="text-gray-500 text-sm italic py-2">
              No encontramos ningún comercio que coincida con esos términos. ¡Puedes intentar con otra palabra!
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {negociosFiltrados.map((n) => (
                <Link
                  key={n.id}
                  href={`/negocios/${n.id}`}
                  className="block p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {n.nombre}
                    </h3>
                    <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                      {formatoCategorias[n.categoria]?.nombre || n.categoria}
                    </span>
                  </div>
                  <div className="text-amber-500 text-sm mb-1.5">
                    {'★'.repeat(n.calificacion)}{'☆'.repeat(5 - n.calificacion)}
                  </div>
                  <p className="text-gray-600 text-xs line-clamp-2 mb-2 italic">
                    "{n.descripcion}"
                  </p>
                  {n.direccion && (
                    <span className="text-[11px] text-gray-400 block truncate">
                      📍 {n.direccion}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* SECCIÓN ESTÁTICA: EXPLORACIÓN POR SECTORES GENERALES */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
          Explorar por sector comercial
        </h2>

        {categoriasDisponibles.length === 0 ? (
          <p className="text-gray-500 italic">Comienza registrando el primer negocio de la ciudad.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {categoriasDisponibles.map((slug) => {
              const info = formatoCategorias[slug] || { nombre: slug, icono: '🏢' };
              return (
                <Link
                  key={slug}
                  href={`/categorias/${slug}`}
                  className="flex items-center p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
                >
                  <span className="text-3xl mr-4" role="img" aria-hidden="true">
                    {info.icono}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors capitalize text-sm">
                      {info.nombre}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Ver todas las opiniones →
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
