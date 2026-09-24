'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError('Credenciales inválidas. Verifica tu correo y contraseña.');
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <main className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl mt-16 border border-gray-100">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Portal de Comercios 💼</h1>
        <p className="text-gray-500 text-sm mt-1">
          Inicia sesión para responder de forma oficial a las opiniones de tus clientes.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="dueno@tunegocio.com"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Verificando...' : 'Ingresar al Portal'}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-400">
        ¿Aún no has verificado tu comercio? <Link href="/contacto" className="text-indigo-600 hover:underline">Solicita tu cuenta comunitaria</Link>.
      </div>
    </main>
  );
}
