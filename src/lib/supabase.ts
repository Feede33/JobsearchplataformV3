import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

// Valores por defecto para desarrollo local
const DEFAULT_SUPABASE_URL = "https://your-project.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "your-anon-key";

// Obtener valores de las variables de entorno o usar valores por defecto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || DEFAULT_SUPABASE_ANON_KEY;

// Configuración de opciones avanzadas para mejorar la confiabilidad
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    // Configuración para reintentos automáticos
    fetch: (url: RequestInfo, options?: RequestInit) => {
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 1000; // 1 segundo

      // Función para realizar reintentos
      const fetchWithRetry = async (attempt = 0): Promise<Response> => {
        try {
          return await fetch(url, options);
        } catch (error) {
          if (attempt < MAX_RETRIES) {
            console.log(`Error en la conexión a Supabase. Reintentando (${attempt + 1}/${MAX_RETRIES})...`);
            // Esperar antes de reintentar
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return fetchWithRetry(attempt + 1);
          }
          console.error("Error de conexión a Supabase después de múltiples intentos:", error);
          throw error;
        }
      };

      return fetchWithRetry();
    }
  }
};

// Verificar si las variables de entorno están definidas y mostrar advertencia
if (supabaseUrl === DEFAULT_SUPABASE_URL || supabaseAnonKey === DEFAULT_SUPABASE_ANON_KEY) {
  console.warn("⚠️ Las variables de entorno de Supabase no están correctamente configuradas. Se están utilizando valores predeterminados.");
}

// Crear cliente de Supabase con opciones avanzadas
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Verificar la conexión al iniciar
(async () => {
  try {
    // Verificar la conexión consultando la tabla jobs que sabemos existe
    const { error } = await supabase.from('jobs').select('id', { count: 'exact', head: true }).limit(1);
    
    if (error) {
      console.warn("⚠️ No se pudo conectar con Supabase:", error.message);
    } else {
      console.log("✅ Conexión a Supabase establecida correctamente");
    }
  } catch (err) {
    console.warn("⚠️ Error al verificar la conexión con Supabase:", err);
  }
})();

// Event logging function
export const logEvent = async (eventData: {
  user_id: string;
  event_type: string;
  details?: any;
}) => {
  try {
    const { error } = await supabase.from("user_events").insert([
      {
        user_id: eventData.user_id,
        event_type: eventData.event_type,
        event_details: eventData.details,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error logging event:", error);
    }
  } catch (error) {
    console.error("Error logging event:", error);
  }
};
