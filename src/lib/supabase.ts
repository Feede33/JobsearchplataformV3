import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Las variables de entorno de Supabase no están definidas");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

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
