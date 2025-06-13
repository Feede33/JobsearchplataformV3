import { useState, useCallback } from 'react';
import { supabase } from './supabase';
import type { Database } from '../types/supabase';

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