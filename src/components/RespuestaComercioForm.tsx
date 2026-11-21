'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { mensajeSeguro } from '@/lib/errores';

export default function RespuestaComercioForm({
  id,
  respuesta,
}: {
  id: string | number;
  respuesta: string | null;
}) {
  const router = useRouter();
  const [texto, setTexto] = useState(respuesta ?? '');
  const [guardando, setGuardando] = useState(false);
  const [estado, setEstado] = useState<'ok' | 'error' | null>(null);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setEstado(null);

    try {
      const { error } = await supabase
        .from('negocios')
        .update({ respuesta_dueno: texto })
        .eq('id', id);

      if (error) {
        setEstado('error');
        return;
      }

      setEstado('ok');
      router.refresh();
    } catch {
      setEstado('error');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={guardar} className="space-y-2">
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe tu postura o aclaración comunitaria aquí..."
        className="w-full p-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500"
        rows={3}
      />

      {estado === 'ok' && (
        <p className="text-xs font-semibold text-emerald-700">
          Tu respuesta se guardó correctamente.
        </p>
      )}
      {estado === 'error' && (
        <p className="text-xs font-semibold text-red-700">
          {mensajeSeguro('guardar')}
        </p>
      )}

      <button
        type="submit"
        disabled={guardando}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
      >
        {guardando ? 'Guardando…' : 'Guardar Respuesta Oficial'}
      </button>
    </form>
  );
}
