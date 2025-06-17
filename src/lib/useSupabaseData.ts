import { useState, useCallback, useEffect } from 'react';
import { supabase } from './supabase';
import type { Database } from '../types/supabase';
import { useAuth } from '../contexts/AuthContext';

// Tipos para Jobs
type Job = Database['public']['Tables']['jobs']['Row'];
type JobInsert = Database['public']['Tables']['jobs']['Insert'];
type JobUpdate = Database['public']['Tables']['jobs']['Update'];

// Tipos para Applications
type Application = Database['public']['Tables']['applications']['Row'];
type ApplicationInsert = Database['public']['Tables']['applications']['Insert'];
type ApplicationUpdate = Database['public']['Tables']['applications']['Update'];

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
        .from('applications')
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
        .from('applications')
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
        .from('applications')
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

  const updateApplicationStatus = useCallback(async (id: string, status: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('applications')
        .update({ status })
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
    updateApplicationStatus,
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
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
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
  const markAllAsRead = useCallback(async () => {
    if (!user) return null;
    
    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('is_read', false)
        .select();
      
      if (error) throw error;
      
      // Actualizar el estado local
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
      
      // Resetear contador de no leídas
      setUnreadCount(0);
      
      return data;
    } catch (err) {
      console.error('Error al marcar todas las notificaciones como leídas:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido al actualizar notificaciones'));
      return null;
    }
  }, [user]);

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

  // Cargar notificaciones al montar el componente o cuando cambie el usuario
  useEffect(() => {
    if (user) {
      fetchNotifications();
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
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
}; 