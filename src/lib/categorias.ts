export interface CategoriaInfo {
  nombre: string;
  corto: string;
  icono: string;
}

/**
 * Fuente única de verdad para los rubros de la guía. El orden de este objeto
 * es el que se muestra en el formulario de publicación.
 */
export const CATEGORIAS: Record<string, CategoriaInfo> = {
  mecanicos: {
    nombre: 'Mecánicos & Talleres',
    corto: 'Mecánicos',
    icono: '🔧',
  },
  restaurantes: {
    nombre: 'Gastronomía & Restaurantes',
    corto: 'Gastronomía',
    icono: '🍞',
  },
  tiendas: {
    nombre: 'Tiendas & Almacenes',
    corto: 'Tiendas',
    icono: '🛍️',
  },
  salud: {
    nombre: 'Salud & Clínicas',
    corto: 'Salud',
    icono: '⚕️',
  },
  gasolineras: {
    nombre: 'Gasolineras & Estaciones de Servicio',
    corto: 'Gasolineras',
    icono: '⛽',
  },
};

export function infoCategoria(slug: string): CategoriaInfo {
  return CATEGORIAS[slug] ?? { nombre: slug, corto: slug, icono: '🏢' };
}
