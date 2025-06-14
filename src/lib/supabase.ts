import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// URL y clave anónima de Supabase tomados del proyecto
// Estas claves son públicas y seguras para usar en el navegador
const supabaseUrl = 'https://adlhgvwdvatwhesnhpph.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkbGhndndkdmF0d2hlc25ocHBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NDU1NDMsImV4cCI6MjA2NTQyMTU0M30.e8eFmf-OANI1kE0_zQ1QYrRzW4U0lEywYL8rFBBTmLk';

// Crea el cliente de Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Tipos para autenticación
export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
};

// Tipo para el registro de logs
export interface LogRecord {
  user_id?: string;
  event_type: 'login' | 'logout' | 'save_job' | 'remove_job' | 'view_job' | 'search' | 'apply_job';
  details?: any;
  created_at?: string;
}

// Función para registrar logs en Supabase
export const logEvent = async (event: LogRecord) => {
  try {
    const { data, error } = await supabase
      .from('logs')
      .insert([event])
    
    if (error) {
      console.error('Error logging event:', error)
    }
    return data
  } catch (err) {
    console.error('Error logging event:', err)
    return null
  }
} 