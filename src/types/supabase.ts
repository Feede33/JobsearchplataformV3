export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      logs: {
        Row: {
          id: number;
          user_id: string | null;
          event_type: string;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id?: string | null;
          event_type: string;
          details?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string | null;
          event_type?: string;
          details?: Json | null;
          created_at?: string;
        };
      };
      saved_jobs: {
        Row: {
          id: number;
          user_id: string;
          job_id: string;
          job_data: Json;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          job_id: string;
          job_data: Json;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          job_id?: string;
          job_data?: Json;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          name: string | null;
          avatar_url: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          updated_at?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          data: Json | null;
          is_read: boolean;
          created_at: string;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          data?: Json | null;
          is_read?: boolean;
          created_at?: string;
          read_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          data?: Json | null;
          is_read?: boolean;
          created_at?: string;
          read_at?: string | null;
        };
      };
    };
  };
}

