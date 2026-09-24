export default function LoadingCategorias() {
  return (
    <main className="max-w-4xl mx-auto p-6 mt-10 animate-pulse">
      {/* Esqueleto del título de la categoría */}
      <div className="h-9 bg-gray-200 rounded w-1/3 mb-6"></div>

      {/* Esqueleto de la cuadrícula de negocios (simula 4 tarjetas) */}
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded-lg p-4 bg-white shadow-sm">
            {/* Esqueleto del nombre del negocio */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            
            {/* Esqueleto de las estrellas de calificación */}
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
            
            {/* Esqueleto de la descripción (dos líneas) */}
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
            
            {/* Esqueleto del enlace */}
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </main>
  );
}
