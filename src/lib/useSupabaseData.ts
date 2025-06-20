import { useState, useCallback, useEffect } from 'react';
import { supabase } from './supabase';
import type { Database } from '../types/supabase';
import { useAuth } from '../contexts/AuthContext';

// Tipos para Jobs
type Job = Database['public']['Tables']['jobs']['Row'];
type JobInsert = Database['public']['Tables']['jobs']['Insert'];
type JobUpdate = Database['public']['Tables']['jobs']['Update'];

// Tipos para Applications
type Application = Database['public']['Tables']['job_applications']['Row'];
type ApplicationInsert = Database['public']['Tables']['job_applications']['Insert'];
type ApplicationUpdate = Database['public']['Tables']['job_applications']['Update'];

// Tipos para Profiles
type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export const useJobs = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data as Job[];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getJobById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as Job;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createJob = useCallback(async (job: JobInsert) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('jobs')
        .insert(job)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Job;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateJob = useCallback(async (id: string, updates: JobUpdate) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Job;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteJob = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
  };
};

export const useApplications = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getApplicationsByUserId = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('job_applications')
        .select('*, jobs(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getApplicationsByJobId = useCallback(async (jobId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('job_applications')
        .select('*, profiles(*)')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createApplication = useCallback(async (application: ApplicationInsert) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('job_applications')
        .insert(application)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Application;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApplication = useCallback(async (id: string, updates: ApplicationUpdate) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('job_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Application;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getApplicationsByUserId,
    getApplicationsByJobId,
    createApplication,
    updateApplication,
  };
};

export const useProfiles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getProfileByUserId = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      
      return data as Profile;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (userId: string, updates: ProfileUpdate) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Profile;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProfile = useCallback(async (profile: ProfileInsert) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Profile;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getProfileByUserId,
    updateProfile,
    createProfile,
  };
};

// Nuevo hook para obtener títulos de trabajos y ubicaciones para las sugerencias de búsqueda
export const useSearchSuggestions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  
  // Caché para almacenar resultados recientes y evitar consultas repetidas
  const [jobTitlesCache, setJobTitlesCache] = useState<Record<string, { data: string[], timestamp: number }>>({});
  const [locationsCache, setLocationsCache] = useState<Record<string, { data: string[], timestamp: number }>>({});
  
  const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutos en milisegundos

  // Obtener títulos de trabajos únicos de la base de datos
  const fetchJobTitles = useCallback(async (searchTerm: string = '') => {
    try {
      // Verificar si tenemos resultados en caché para este término
      const cacheKey = searchTerm.toLowerCase();
      const cachedResult = jobTitlesCache[cacheKey];
      const now = Date.now();
      
      // Si tenemos resultados en caché y no han expirado, usarlos
      if (cachedResult && (now - cachedResult.timestamp < CACHE_EXPIRY)) {
        return cachedResult.data;
      }
      
      setLoading(true);
      
      let query = supabase
        .from('jobs')
        .select('title, company_name, skills');
      
      // Si hay un término de búsqueda, mejorar la búsqueda para incluir habilidades y otros campos relevantes
      if (searchTerm && searchTerm.trim() !== '') {
        query = query.or(`title.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%,skills.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      
      // Combinar títulos, empresas y habilidades para sugerencias más completas
      let suggestions: string[] = [];
      if (data) {
        // Extraer títulos únicos
        const uniqueTitles = Array.from(
          new Set(data.map((job: any) => job.title))
        );
        
        // Extraer nombres de empresas únicos
        const uniqueCompanies = Array.from(
          new Set(data.map((job: any) => job.company_name).filter(Boolean))
        );
        
        // Extraer habilidades únicas de trabajos (si existen)
        const uniqueSkills = Array.from(
          new Set(
            data
              .flatMap((job: any) => {
                // Verificar si skills es un array, string o null
                if (Array.isArray(job.skills)) return job.skills;
                if (typeof job.skills === 'string') return job.skills.split(',').map(s => s.trim());
                return [];
              })
              .filter(Boolean)
          )
        );
        
        // Combinar títulos, empresas y habilidades en el array de sugerencias
        suggestions = [...uniqueTitles, ...uniqueCompanies, ...uniqueSkills];
        
        // Ordenar las sugerencias por relevancia con el término de búsqueda
        if (searchTerm) {
          suggestions.sort((a, b) => {
            const aStartsWith = a.toLowerCase().startsWith(searchTerm.toLowerCase()) ? -1 : 0;
            const bStartsWith = b.toLowerCase().startsWith(searchTerm.toLowerCase()) ? -1 : 0;
            return aStartsWith - bStartsWith;
          });
        }
      }
      
      // Guardar en caché
      setJobTitlesCache(prev => ({
        ...prev,
        [cacheKey]: { data: suggestions, timestamp: now }
      }));
      
      // Actualizar el estado si es el término de búsqueda actual
      if (searchTerm === '') {
        setJobTitles(suggestions);
      }
      
      return suggestions;
    } catch (err) {
      console.error('Error al obtener títulos de trabajos:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [jobTitlesCache]);

  // Obtener ubicaciones únicas de la base de datos
  const fetchLocations = useCallback(async (searchTerm: string = '') => {
    try {
      // Verificar si tenemos resultados en caché para este término
      const cacheKey = searchTerm.toLowerCase();
      const cachedResult = locationsCache[cacheKey];
      const now = Date.now();
      
      // Si tenemos resultados en caché y no han expirado, usarlos
      if (cachedResult && (now - cachedResult.timestamp < CACHE_EXPIRY)) {
        return cachedResult.data;
      }
      
      setLoading(true);
      
      let query = supabase
        .from('jobs')
        .select('location, city, country');
      
      // Si hay un término de búsqueda, ampliar la búsqueda para incluir ciudad y país
      if (searchTerm && searchTerm.trim() !== '') {
        query = query.or(`location.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query
        .order('location')
        .limit(30);
      
      if (error) throw error;
      
      // Extraer ubicaciones únicas (filtrar valores nulos o vacíos)
      const uniqueLocations = Array.from(
        new Set(data.map((job: any) => job.location).filter(Boolean))
      );
      
      // Extraer ciudades y países únicos si están disponibles
      const uniqueCities = Array.from(
        new Set(data.map((job: any) => job.city).filter(Boolean))
      );
      
      const uniqueCountries = Array.from(
        new Set(data.map((job: any) => job.country).filter(Boolean))
      );
      
      // Combinar todas las ubicaciones únicas
      const allLocations = [...uniqueLocations, ...uniqueCities, ...uniqueCountries];
      
      // Ordenar por relevancia si hay un término de búsqueda
      if (searchTerm) {
        allLocations.sort((a, b) => {
          const aStartsWith = a.toLowerCase().startsWith(searchTerm.toLowerCase()) ? -1 : 0;
          const bStartsWith = b.toLowerCase().startsWith(searchTerm.toLowerCase()) ? -1 : 0;
          return aStartsWith - bStartsWith;
        });
      }
      
      // Guardar en caché
      setLocationsCache(prev => ({
        ...prev,
        [cacheKey]: { data: allLocations, timestamp: now }
      }));
      
      // Actualizar el estado si es el término de búsqueda actual
      if (searchTerm === '') {
        setLocations(allLocations);
      }
      
      return allLocations as string[];
    } catch (err) {
      console.error('Error al obtener ubicaciones:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [locationsCache]);

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Cargar títulos de trabajo populares
        await fetchJobTitles();
        
        // Cargar ubicaciones populares
        await fetchLocations();
      } catch (err) {
        console.error('Error al cargar datos iniciales:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [fetchJobTitles, fetchLocations]);

  // Función para limpiar la caché periódicamente
  useEffect(() => {
    const cleanupCache = () => {
      const now = Date.now();
      setJobTitlesCache(prev => {
        const updated = {...prev};
        Object.keys(updated).forEach(key => {
          if (now - updated[key].timestamp > CACHE_EXPIRY) {
            delete updated[key];
          }
        });
        return updated;
      });
      
      setLocationsCache(prev => {
        const updated = {...prev};
        Object.keys(updated).forEach(key => {
          if (now - updated[key].timestamp > CACHE_EXPIRY) {
            delete updated[key];
          }
        });
        return updated;
      });
    };
    
    // Limpiar la caché cada 10 minutos
    const interval = setInterval(cleanupCache, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    jobTitles,
    locations,
    loading,
    error,
    fetchJobTitles,
    fetchLocations
  };
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Cargar notificaciones del usuario
  const fetchNotifications = useCallback(async (options?: {
    type?: string;
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id);
      
      // Aplicar filtro por tipo si se especifica
      if (options?.type && options.type !== 'all') {
        query = query.eq('type', options.type);
      }
      
      // Aplicar ordenación
      const orderBy = options?.orderBy || 'created_at';
      const orderDirection = options?.orderDirection || 'desc';
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });
      
      // Aplicar paginación si se especifica
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setNotifications(data || []);
      
      // Calcular número de notificaciones no leídas
      const unread = data ? data.filter(n => !n.is_read).length : 0;
      setUnreadCount(unread);
      
      return data;
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido al cargar notificaciones'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Obtener conteo de notificaciones por tipo
  const getNotificationCountByType = useCallback(async () => {
    if (!user) return {};
    
    try {
      // En lugar de usar group by, que no está soportado, obtenemos todas las notificaciones
      // y hacemos el conteo manualmente
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Contar manualmente por tipo
      const counts = (data || []).reduce((acc, item) => {
        const type = item.type || 'other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return counts;
    } catch (err) {
      console.error('Error al obtener conteo de notificaciones:', err);
      return {};
    }
  }, [user]);

  // Marcar una notificación como leída
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return null;
    
    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Actualizar el estado local
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n)
      );
      
      // Actualizar contador de no leídas
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return data;
    } catch (err) {
      console.error('Error al marcar notificación como leída:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido al actualizar notificación'));
      return null;
    }
  }, [user]);

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = useCallback(async (type?: string) => {
    if (!user) return null;
    
    try {
      setError(null);
      
      let query = supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('is_read', false);
      
      // Si se especifica un tipo, filtrar por ese tipo
      if (type && type !== 'all') {
        query = query.eq('type', type);
      }
      
      const { data, error } = await query.select();
      
      if (error) throw error;
      
      // Actualizar el estado local
      setNotifications(prev => 
        prev.map(n => {
          if (!n.is_read && (!type || type === 'all' || n.type === type)) {
            return { ...n, is_read: true, read_at: new Date().toISOString() };
          }
          return n;
        })
      );
      
      // Recalcular contador de no leídas
      const newUnreadCount = notifications.filter(n => 
        !n.is_read && (type && type !== 'all' ? n.type !== type : false)
      ).length;
      
      setUnreadCount(newUnreadCount);
      
      return data;
    } catch (err) {
      console.error('Error al marcar todas las notificaciones como leídas:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido al actualizar notificaciones'));
      return null;
    }
  }, [user, notifications]);

  // Eliminar una notificación
  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!user) return false;
    
    try {
      setError(null);
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Actualizar el estado local
      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Actualizar contador si la notificación eliminada no estaba leída
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      return true;
    } catch (err) {
      console.error('Error al eliminar notificación:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido al eliminar notificación'));
      return false;
    }
  }, [user, notifications]);

  // Eliminar todas las notificaciones (con filtro opcional por tipo)
  const deleteAllNotifications = useCallback(async (type?: string) => {
    if (!user) return false;
    
    try {
      setError(null);
      
      let query = supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);
      
      // Si se especifica un tipo, filtrar por ese tipo
      if (type && type !== 'all') {
        query = query.eq('type', type);
      }
      
      const { error } = await query;
      
      if (error) throw error;
      
      // Actualizar el estado local
      if (type && type !== 'all') {
        const remainingNotifications = notifications.filter(n => n.type !== type);
        setNotifications(remainingNotifications);
        
        // Recalcular contador de no leídas
        const newUnreadCount = remainingNotifications.filter(n => !n.is_read).length;
        setUnreadCount(newUnreadCount);
      } else {
        // Si no hay filtro, eliminar todas
        setNotifications([]);
        setUnreadCount(0);
      }
      
      return true;
    } catch (err) {
      console.error('Error al eliminar notificaciones:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido al eliminar notificaciones'));
      return false;
    }
  }, [user, notifications]);

  // Cargar notificaciones al montar el componente o cuando cambie el usuario
  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      // Limpiar notificaciones si no hay usuario
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotifications]);

  // Configurar suscripción en tiempo real para nuevas notificaciones
  useEffect(() => {
    if (!user) return;

    // Suscribirse a cambios en la tabla de notificaciones para este usuario
    const subscription = supabase
      .channel('notifications_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // Añadir la nueva notificación al estado
          setNotifications(prev => [payload.new, ...prev]);
          
          // Incrementar contador de no leídas
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    // Limpiar suscripción al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    getNotificationCountByType,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications
  };
}; 