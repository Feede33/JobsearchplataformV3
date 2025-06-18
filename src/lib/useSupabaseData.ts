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