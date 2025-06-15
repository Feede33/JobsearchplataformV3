import { useState, useCallback } from 'react';
import { supabase } from './supabase';
import type { AuthError } from '@supabase/supabase-js';

interface SignUpCredentials {
  email: string;
  password: string;
  data?: { [key: string]: any };
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  error: AuthError | null;
  data?: any;
}

export const useSupabaseAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const signUp = useCallback(async ({ email, password, data }: SignUpCredentials): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: responseData, error } = await supabase.auth.signUp({
        email,
        password,
        options: data ? { data } : undefined
      });
      
      if (error) throw error;
      
      return { success: true, error: null, data: responseData };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      return { success: false, error: authError };
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInCredentials): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return { success: true, error: null, data };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      return { success: false, error: authError };
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) throw error;
      
      return { success: true, error: null, data };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      return { success: false, error: authError };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async (): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      return { success: false, error: authError };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      return { success: true, error: null, data };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      return { success: false, error: authError };
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      return { success: true, error: null, data };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      return { success: false, error: authError };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword
  };
};