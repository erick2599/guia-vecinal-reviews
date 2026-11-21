'use client';

import { mensajeSeguro } from '@/lib/errores';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="es">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: 24,
          textAlign: 'center',
        }}
      >
        <div>
          <p style={{ fontSize: 40, margin: 0 }} aria-hidden="true">🔧</p>
          <h1 style={{ fontSize: 24, margin: '16px 0 8px' }}>Algo salió mal</h1>
          <p style={{ color: '#4b5563', fontSize: 14 }}>
            {mensajeSeguro('cargar')}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              borderRadius: 10,
              background: '#4f46e5',
              color: 'white',
              border: 0,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Volver a intentar
          </button>
        </div>
      </body>
    </html>
  );
}
