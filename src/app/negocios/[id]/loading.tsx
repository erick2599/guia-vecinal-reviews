export default function LoadingNegocio() {
  return (
    <main className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-10 animate-pulse">
      {/* Esqueleto del título */}
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      
      {/* Esqueleto de la categoría */}
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
      
      {/* Esqueleto de las estrellas */}
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-6"></div>
      
      {/* Esqueleto de la descripción */}
      <div className="space-y-3 border-t pt-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </main>
  );
}
