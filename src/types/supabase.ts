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
      jobs: {
        Row: {
          id: number;
          title: string;
          company: string;
          logo: string | null;
          location: string | null;
          salary: string | null;
          type: string | null;
          requirements: Json | null;
          description: string | null;
          posted_date: string | null;
          category: string | null;
          is_featured: boolean;
          is_remote: boolean;
          score: number;
          created_at: string;
          updated_at: string;
          company_id: string | null;
        };
        Insert: {
          id?: number;
          title: string;
          company: string;
          logo?: string | null;
          location?: string | null;
          salary?: string | null;
          type?: string | null;
          requirements?: Json | null;
          description?: string | null;
          posted_date?: string | null;
          category?: string | null;
          is_featured?: boolean;
          is_remote?: boolean;
          score?: number;
          created_at?: string;
          updated_at?: string;
          company_id?: string | null;
        };
        Update: {
          id?: number;
          title?: string;
          company?: string;
          logo?: string | null;
          location?: string | null;
          salary?: string | null;
          type?: string | null;
          requirements?: Json | null;
          description?: string | null;
          posted_date?: string | null;
          category?: string | null;
          is_featured?: boolean;
          is_remote?: boolean;
          score?: number;
          created_at?: string;
          updated_at?: string;
          company_id?: string | null;
        };
      };
      job_applications: {
        Row: {
          id: string;
          user_id: string;
          job_id: number;
          cover_letter: string | null;
          resume_url: string | null;
          status: string;
          job_data: Json | null;
          created_at: string;
          updated_at: string;
          application_date: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id: number;
          cover_letter?: string | null;
          resume_url?: string | null;
          status?: string;
          job_data?: Json | null;
          created_at?: string;
          updated_at?: string;
          application_date?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_id?: number;
          cover_letter?: string | null;
          resume_url?: string | null;
          status?: string;
          job_data?: Json | null;
          created_at?: string;
          updated_at?: string;
          application_date?: string;
        };
      };
      saved_jobs: {
        Row: {
          id: string;
          user_id: string;
          job_id: number;
          job_data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id: number;
          job_data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_id?: number;
          job_data?: Json | null;
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
      company_profiles: {
        Row: {
          id: string;
          company_name: string;
          industry: string | null;
          website: string | null;
          logo_url: string | null;
          description: string | null;
          location: string | null;
          size: string | null;
          founded_year: number | null;
          contact_email: string | null;
          contact_phone: string | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          company_name: string;
          industry?: string | null;
          website?: string | null;
          logo_url?: string | null;
          description?: string | null;
          location?: string | null;
          size?: string | null;
          founded_year?: number | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          industry?: string | null;
          website?: string | null;
          logo_url?: string | null;
          description?: string | null;
          location?: string | null;
          size?: string | null;
          founded_year?: number | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
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

