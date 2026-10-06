import { createClient } from '@supabase/supabase-js';

// Obtener variables de entorno configuradas en .env
const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Sanitizar la URL para asegurar la URL base del proyecto
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase URL o Anon Key no están configuradas en el archivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
