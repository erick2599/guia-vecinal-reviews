import Link from 'next/link';

interface Emprendedor {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  direccion: string | null;
  horario: string | null;
  nombre_propietario: string | null;
  telefono_contacto: string | null;
  redes_sociales: string | null;
}

export default function VitrinaEmprendedores({ lista }: { lista: Emprendedor[] }) {
  return (
    <section className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b dark:border-gray-800 pb-3 gap-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            🤝 Espacio de Emprendedores Locales
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Conoce y apoya de forma directa a los pequeños comercios de nuestra ciudad.
          </p>
        </div>
        <Link
          href="/reportar"
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-sm transition-all self-start sm:self-center"
        >
          📢 Publicar Mi Negocio Aquí Gratis
        </Link>
      </div>

      {lista.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center bg-white dark:bg-zinc-900">
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">
            ¿Tienes un pequeño negocio y no puedes pagar publicidad? ¡Sé el primero en anunciar tus servicios aquí de forma gratuita!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {lista.map((e) => (
            <div
              key={e.id}
              className="border border-indigo-100 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-indigo-500 rounded-t-2xl"
            >
              <div>
                {/* Encabezado: Propietario y Negocio */}
                <div className="mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md">
                    {e.categoria === 'restaurantes' ? '🍞 Gastronomía' : e.categoria}
                  </span>
                  <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-lg mt-2">
                    {e.nombre}
                  </h3>
                  {e.nombre_propietario && (
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      Propietario: {e.nombre_propietario}
                    </p>
                  )}
                </div>

                {/* Presentación del servicio */}
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-xl italic">
                  "{e.descripcion}"
                </p>
              </div>

              {/* Ficha de datos de contacto fijos */}
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 border-t dark:border-zinc-800 pt-4">
                {e.direccion && (
                  <p className="flex items-start gap-1.5">
                    <span>📍</span>
                    <span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">Dirección:</span> {e.direccion}
                    </span>
                  </p>
                )}
                {e.horario && (
                  <p className="flex items-center gap-1.5">
                    <span>⏰</span>
                    <span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">Horario:</span> {e.horario}
                    </span>
                  </p>
                )}
                {(e.telefono_contacto || e.redes_sociales) && (
                  <div className="mt-3 pt-2 border-t border-gray-100 dark:border-zinc-800 grid grid-cols-2 gap-2 text-indigo-950 dark:text-indigo-300 font-medium">
                    {e.telefono_contacto && <p>📞 {e.telefono_contacto}</p>}
                    {e.redes_sociales && <p>📱 {e.redes_sociales}</p>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
