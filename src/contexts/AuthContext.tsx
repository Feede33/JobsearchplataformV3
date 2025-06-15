import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser, AuthError } from "@supabase/supabase-js";

interface User {
  id: string;
  name: string | null;
  email: string;
  avatar?: string;
  skills?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Convertir un usuario de Supabase a nuestro formato de usuario
  const formatUser = (supabaseUser: SupabaseUser | null): User | null => {
    if (!supabaseUser) return null;
    
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || null,
      email: supabaseUser.email || '',
      avatar: supabaseUser.user_metadata?.avatar_url || 
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.email}`,
      skills: supabaseUser.user_metadata?.skills || [],
    };
  };

  // Verificar sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      
      // Obtener la sesión actual
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error al verificar sesión:", error);
      }
      
      if (session?.user) {
        setUser(formatUser(session.user));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    checkSession();

    // Configurar suscripción a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(formatUser(session.user));
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    );

    // Limpiar suscripción al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Error en inicio de sesión:", error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        return { success: true };
      }

      return { success: false, error: "No se pudo iniciar sesión" };
    } catch (error) {
      console.error("Error inesperado:", error);
      return { success: false, error: "Error inesperado al iniciar sesión" };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          },
        },
      });

      if (error) {
        console.error("Error en registro:", error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // En entornos reales, Supabase puede requerir verificación de email
        return { 
          success: true, 
          error: data.session ? undefined : "Se ha enviado un correo de confirmación. Por favor, verifica tu bandeja de entrada." 
        };
      }

      return { success: false, error: "No se pudo completar el registro" };
    } catch (error) {
      console.error("Error inesperado:", error);
      return { success: false, error: "Error inesperado al registrarse" };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
