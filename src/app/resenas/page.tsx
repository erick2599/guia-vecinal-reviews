import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { infoCategoria } from '@/lib/categorias';

export const dynamic = 'force-dynamic';

interface Resena {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  direccion: string | null;
  calificacion: number;
  created_at: string;
  imagen_prueba_url: string | null;
  respuesta_dueno: string | null;
  es_promocionado: boolean | null;
}

const formatoFecha = new Intl.DateTimeFormat('es-SV', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function formatearFecha(fecha: string) {
  const valor = new Date(fecha);
  return Number.isNaN(valor.getTime()) ? '' : formatoFecha.format(valor);
}

function Estrellas({
  valor,
  className = 'text-base',
}: {
  valor: number;
  className?: string;
}) {
  const estrellas = Math.max(0, Math.min(5, Math.round(Number(valor))));
  return (
    <span
      className={`text-amber-500 tracking-tight ${className}`}
      aria-label={`${estrellas} de 5 estrellas`}
    >
      {'★'.repeat(estrellas)}
      <span className="text-gray-300">{'☆'.repeat(5 - estrellas)}</span>
    </span>
  );
}

function TituloSeccion({
  icono,
  titulo,
  descripcion,
}: {
  icono: string;
  titulo: string;
  descripcion: string;
}) {
  return (
    <div className="mb-4 border-b border-gray-100 pb-3 dark:border-zinc-800">
      <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
        <span aria-hidden="true">{icono}</span> {titulo}
      </h2>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {descripcion}
      </p>
    </div>
  );
}

function TarjetaResena({ resena }: { resena: Resena }) {
  const categoria = infoCategoria(resena.categoria);

  return (
    <article className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/negocios/${resena.id}`}
            className="line-clamp-1 font-bold text-gray-900 transition-colors hover:text-indigo-600 dark:text-gray-100 dark:hover:text-indigo-400"
          >
            {resena.nombre}
          </Link>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span aria-hidden="true">{categoria.icono}</span> {categoria.corto}
            {resena.created_at ? ` · ${formatearFecha(resena.created_at)}` : ''}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <Estrellas valor={resena.calificacion} className="text-sm" />
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            {resena.calificacion}/5
          </p>
        </div>
      </div>

      <p className="mt-3 line-clamp-4 whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {resena.descripcion}
      </p>

      {resena.direccion && (
        <p className="mt-2 truncate text-xs text-gray-500 dark:text-gray-400">
          📍 {resena.direccion}
        </p>
      )}

      {resena.imagen_prueba_url && (
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800">
          <Image
            src={resena.imagen_prueba_url}
            alt={`Fotografía de ${resena.nombre}`}
            width={800}
            height={450}
            className="h-44 w-full object-cover"
          />
        </div>
      )}

      {resena.respuesta_dueno?.trim() && (
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-900/40 dark:bg-blue-950/30">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            💬 Respuesta del comercio
          </p>
          <p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {resena.respuesta_dueno}
          </p>
        </div>
      )}

      <Link
        href={`/negocios/${resena.id}`}
        className="mt-4 inline-block text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
      >
        Ver ficha completa →
      </Link>
    </article>
  );
}

function Ranking({
  resenas,
  tipo,
  mensajeVacio,
}: {
  resenas: Resena[];
  tipo: 'mejor' | 'peor';
  mensajeVacio: string;
}) {
  const esMejor = tipo === 'mejor';

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <TituloSeccion
        icono={esMejor ? '🏆' : '⚠️'}
        titulo={esMejor ? 'Mejor calificados' : 'Peor calificados'}
        descripcion={
          esMejor
            ? 'Los lugares con las mejores experiencias de la comunidad.'
            : 'Los lugares que necesitan mejorar según la comunidad.'
        }
      />

      {resenas.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4 text-center text-xs text-gray-500 dark:border-zinc-700 dark:bg-zinc-800/40 dark:text-gray-400">
          {mensajeVacio}
        </div>
      )}

      <ol className="space-y-2">
        {resenas.map((resena, indice) => (
          <li key={`${tipo}-${resena.id}`}>
            <Link
              href={`/negocios/${resena.id}`}
              className="flex items-center gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-gray-200 hover:bg-gray-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/60"
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  esMejor
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                }`}
              >
                {indice + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {resena.nombre}
                </span>
                <span className="block truncate text-[11px] text-gray-500 dark:text-gray-400">
                  {infoCategoria(resena.categoria).icono}{' '}
                  {infoCategoria(resena.categoria).corto}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <Estrellas valor={resena.calificacion} className="text-xs" />
                <span className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                  {resena.calificacion}/5
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default async function ResenasPublicadasPage() {
  const { data, error } = await supabase
    .from('negocios')
    .select(
      'id, nombre, categoria, descripcion, direccion, calificacion, created_at, imagen_prueba_url, respuesta_dueno, es_promocionado'
    )
    .order('created_at', { ascending: false });

  const resenas: Resena[] = (data ?? []).filter(
    (negocio) =>
      !negocio.es_promocionado &&
      Number(negocio.calificacion) >= 1 &&
      Number(negocio.calificacion) <= 5
  );

  const total = resenas.length;
  const promedio =
    total > 0
      ? (
          resenas.reduce(
            (suma, resena) => suma + Number(resena.calificacion),
            0
          ) / total
        ).toFixed(1)
      : '—';
  const conRespuesta = resenas.filter((resena) =>
    resena.respuesta_dueno?.trim()
  ).length;

  const ultimas = resenas.slice(0, 6);
  const mejores = [...resenas]
    .sort(
      (a, b) =>
        Number(b.calificacion) - Number(a.calificacion) ||
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);
  const notaMaxima = resenas.reduce(
    (maxima, resena) => Math.max(maxima, Number(resena.calificacion)),
    0
  );

  const peores = [...resenas]
    .filter((resena) => Number(resena.calificacion) < notaMaxima)
    .sort(
      (a, b) =>
        Number(a.calificacion) - Number(b.calificacion) ||
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);
  const respuestas = resenas
    .filter((resena) => resena.respuesta_dueno?.trim())
    .slice(0, 6);

  return (
    <main className="mx-auto max-w-5xl p-6 mt-10 mb-16">
      <section className="overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6 shadow-sm sm:p-10 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Comunidad
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          Reseñas publicadas 📋
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-400">
          Las últimas experiencias de la comunidad, los lugares mejor y peor
          calificados y las respuestas de los comercios, todo en un solo lugar.
        </p>

        <div className="mt-6 grid max-w-lg grid-cols-3 gap-3">
          <div className="rounded-xl border border-indigo-100 bg-white/80 px-3 py-3 text-center dark:border-zinc-700 dark:bg-zinc-900/80">
            <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {total}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Reseñas
            </p>
          </div>
          <div className="rounded-xl border border-indigo-100 bg-white/80 px-3 py-3 text-center dark:border-zinc-700 dark:bg-zinc-900/80">
            <p className="text-2xl font-extrabold text-amber-500">{promedio}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Promedio
            </p>
          </div>
          <div className="rounded-xl border border-indigo-100 bg-white/80 px-3 py-3 text-center dark:border-zinc-700 dark:bg-zinc-900/80">
            <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {conRespuesta}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Respuestas
            </p>
          </div>
        </div>

        <Link
          href="/reportar"
          className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
        >
          ⭐ Escribir una reseña
        </Link>
      </section>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          No pudimos cargar las reseñas en este momento. Intenta de nuevo más
          tarde.
        </div>
      )}

      {total === 0 ? (
        <div className="mt-8 rounded-3xl border-2 border-dashed border-gray-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-4xl" aria-hidden="true">
            📝
          </p>
          <h2 className="mt-3 text-xl font-bold text-gray-900 dark:text-gray-100">
            Aún no hay reseñas publicadas
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
            Sé la primera persona en compartir una experiencia y ayudar a los
            vecinos a elegir mejor.
          </p>
          <Link
            href="/reportar"
            className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            ⭐ Publicar la primera reseña
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          <section>
            <TituloSeccion
              icono="🕒"
              titulo="Últimas reseñas publicadas"
              descripcion="Las experiencias más recientes de la comunidad, con sus fotos y respuestas."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {ultimas.map((resena) => (
                <TarjetaResena key={resena.id} resena={resena} />
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <Ranking
              resenas={mejores}
              tipo="mejor"
              mensajeVacio="Todavía no hay calificaciones suficientes."
            />
            <Ranking
              resenas={peores}
              tipo="peor"
              mensajeVacio="Por ahora todos los lugares publicados tienen la misma calificación."
            />
          </section>

          <section>
            <TituloSeccion
              icono="💬"
              titulo="Respuestas de los comercios"
              descripcion="Lo que responden los negocios a las opiniones de sus clientes."
            />
            {respuestas.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Todavía ningún comercio ha respondido a una reseña.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {respuestas.map((resena) => (
                  <article
                    key={`respuesta-${resena.id}`}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/negocios/${resena.id}`}
                        className="line-clamp-1 font-bold text-gray-900 hover:text-indigo-600 dark:text-gray-100 dark:hover:text-indigo-400"
                      >
                        {resena.nombre}
                      </Link>
                      <Estrellas
                        valor={resena.calificacion}
                        className="shrink-0 text-sm"
                      />
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs italic text-gray-500 dark:text-gray-400">
                      “{resena.descripcion}”
                    </p>
                    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-900/40 dark:bg-blue-950/30">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                        💬 Respuesta oficial
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                        {resena.respuesta_dueno}
                      </p>
                    </div>
                    <Link
                      href={`/negocios/${resena.id}`}
                      className="mt-3 inline-block text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      Ver ficha completa →
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
