'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ContactoPage() {
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados del formulario
  const [nombreDueno, setNombreDueno] = useState('');
  const [emailContacto, setEmailContacto] = useState('');
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [direccionNegocio, setDireccionNegocio] = useState('');
  const [mensajeVerificacion, setMensajeVerificacion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validación básica
    if (!nombreDueno.trim() || !emailContacto.trim() || !nombreNegocio.trim() || !mensajeVerificacion.trim()) {
      setError('Por favor, rellena todos los campos obligatorios.');
      setLoading(false);
      return;
    }

    // Operación de Escritura (INSERT) en la tabla de solicitudes
    const { error: insertError } = await supabase
      .from('solicitudes_verificacion')
      .insert([
        {
          nombre_dueno: nombreDueno.trim(),
          email_contacto: emailContacto.trim(),
          nombre_negocio: nombreNegocio.trim(),
          direccion_negocio: direccionNegocio.trim(),
          mensaje_verificacion: mensajeVerificacion.trim(),
        },
      ]);

    if (insertError) {
      setError('Hubo un problema al enviar tu solicitud. Inténtalo de nuevo más tarde.');
      setLoading(false);
    } else {
      setEnviado(true);
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <main className="max-w-xl mx-auto p-8 bg-white shadow-md rounded-xl mt-16 border border-emerald-100 text-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-gray-950 mb-2">¡Solicitud Recibida con Éxito!</h1>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Hemos registrado tus datos. Nuestro equipo comunitario revisará la información comercial provista y te contactará por correo electrónico en un plazo de 24 a 48 horas para entregarte tus credenciales de acceso oficial.
        </p>
        <Link href="/" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
          Volver al Inicio
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10 border border-gray-100">
      <div className="mb-6">
        <Link href="/login" className="text-sm text-gray-500 hover:underline">
          ← Volver al Portal de Comercios
        </Link>
        <h1 className="text-2xl font-bold text-gray-950 mt-2">
          Verifica tu Negocio 💼
        </h1>
        <p className="text-gray-600 text-sm mt-1 leading-relaxed">
          Solicita tu cuenta oficial para responder de forma transparente y constructiva a las opiniones de tus clientes en la guía vecinal.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre del Propietario */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nombre completo del solicitante *
          </label>
          <input
            type="text"
            required
            value={nombreDueno}
            onChange={(e) => setNombreDueno(e.target.value)}
            placeholder="Ej: Juan Silva"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
          />
        </div>

        {/* Correo Electrónico Comercial */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Correo electrónico de contacto *
          </label>
          <input
            type="email"
            required
            value={emailContacto}
            onChange={(e) => setEmailContacto(e.target.value)}
            placeholder="contacto@tunegocio.com"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
          />
        </div>

        {/* Nombre del Comercio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre comercial registrado *
            </label>
            <input
              type="text"
              required
              value={nombreNegocio}
              onChange={(e) => setNombreNegocio(e.target.value)}
              placeholder="Ej: Taller Mecánico Silva"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Dirección física del local
            </label>
            <input
              type="text"
              value={direccionNegocio}
              onChange={(e) => setDireccionNegocio(e.target.value)}
              placeholder="Ej: Calle Las Flores #45"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
            />
          </div>
        </div>

        {/* Mensaje de Validación o Pruebas */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Información de verificación *
          </label>
          <textarea
            required
            rows={4}
            value={mensajeVerificacion}
            onChange={(e) => setMensajeVerificacion(e.target.value)}
            placeholder="Por favor, provéenos un enlace a tus redes sociales oficiales, número de patente, teléfono comercial o cualquier dato que nos permita corroborar que eres el dueño legítimo."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-sm"
          />
        </div>

        {/* Botón de Envío */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm disabled:bg-gray-400"
        >
          {loading ? 'Enviando Solicitud...' : 'Enviar Solicitud de Verificación 💼'}
        </button>
      </form>
    </main>
  );
}
