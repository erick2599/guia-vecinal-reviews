import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Definición del tipo de datos para TypeScript
export interface Negocio {
  id: number;
  nombre: string;
  categoria: string;
  slug: string;
  descripcion: string;
  calificacion: number;
}
