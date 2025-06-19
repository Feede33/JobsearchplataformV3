import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser, AuthError } from "@supabase/supabase-js";

interface User {
  id: string;
  name: string | null;
  email: string;
  avatar?: string;
  skills?: string[];
  role?: string;
  isCompany?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, isCompany?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  isCompany: boolean;
  isAdmin: boolean;
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
  const [isCompany, setIsCompany] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Convertir un usuario de Supabase a nuestro formato de usuario
  const formatUser = (supabaseUser: SupabaseUser | null): User | null => {
    if (!supabaseUser) return null;
    
    const role = supabaseUser.app_metadata?.role || 'user';
    const isUserCompany = role === 'company';
    
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || null,
      email: supabaseUser.email || '',
      avatar: supabaseUser.user_metadata?.avatar_url || 
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.email}`,
      skills: supabaseUser.user_metadata?.skills || [],
      role: role,
      isCompany: isUserCompany,
    };
  };

  // Función para actualizar los datos del usuario
  const refreshUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error al refrescar sesión:", error);
        return;
      }
      
      if (session?.user) {
        // Obtener datos actualizados del perfil del usuario
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Error al obtener datos de perfil:", profileError);
        }
        
        // Actualizar el rol del usuario en app_metadata si es necesario
        if (profileData && profileData.role) {
          const currentRole = session.user.app_metadata?.role || 'user';
          if (currentRole !== profileData.role) {
            // Actualizar el usuario en el estado
            const updatedUser = formatUser({
              ...session.user,
              app_metadata: {
                ...session.user.app_metadata,
                role: profileData.role
              }
            });
            
            setUser(updatedUser);
            setIsCompany(updatedUser?.role === 'company' || false);
            setIsAdmin(updatedUser?.role === 'admin' || false);
          }
        }
      }
    } catch (error) {
      console.error("Error al refrescar usuario:", error);
    }
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
        const formattedUser = formatUser(session.user);
        setUser(formattedUser);
        setIsAuthenticated(true);
        setIsCompany(formattedUser?.role === 'company' || false);
        setIsAdmin(formattedUser?.role === 'admin' || false);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsCompany(false);
        setIsAdmin(false);
      }
      
      setLoading(false);
    };

    checkSession();

    // Configurar suscripción a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const formattedUser = formatUser(session.user);
          setUser(formattedUser);
          setIsAuthenticated(true);
          setIsCompany(formattedUser?.role === 'company' || false);
          setIsAdmin(formattedUser?.role === 'admin' || false);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setIsCompany(false);
          setIsAdmin(false);
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
    isCompany: boolean = false
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            role: isCompany ? 'company' : 'user',
          },
        },
      });

      if (error) {
        console.error("Error en registro:", error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Si es una empresa, crear el perfil de empresa
        if (isCompany && data.user) {
          const { error: profileError } = await supabase
            .from('company_profiles')
            .insert([
              {
                id: data.user.id,
                company_name: name,
                contact_email: email,
              },
            ]);

          if (profileError) {
            console.error("Error al crear perfil de empresa:", profileError);
            // No retornamos error aquí para no interrumpir el flujo de registro
          }
        }
        
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
      value={{ 
        user, 
        login, 
        signup, 
        logout, 
        refreshUser,
        isAuthenticated, 
        loading, 
        isCompany, 
        isAdmin 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
