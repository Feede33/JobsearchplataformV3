import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase, logEvent } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

interface SavedJob {
  id: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  location: string;
  salary: string;
  employmentType: string;
  savedDate: string;
}

interface SavedJobsContextType {
  savedJobs: SavedJob[];
  saveJob: (job: Omit<SavedJob, "savedDate">) => void;
  removeJob: (id: string) => void;
  isSaved: (id: string) => boolean;
  loading: boolean;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

export const SavedJobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Cargar trabajos guardados
  useEffect(() => {
    const loadSavedJobs = async () => {
      setLoading(true);
      
      // Si el usuario está autenticado, cargar de Supabase
      if (user && isAuthenticated) {
        try {
          const { data, error } = await supabase
            .from('saved_jobs')
            .select('*')
            .eq('user_id', user.id);
            
          if (error) {
            console.error("Error fetching saved jobs:", error);
            return;
          }
          
          // Transformar los datos de Supabase al formato SavedJob
          if (data) {
            const formattedJobs: SavedJob[] = data.map(item => {
              const jobData = item.job_data as any;
              return {
                id: item.job_id,
                jobTitle: jobData.jobTitle,
                companyName: jobData.companyName,
                companyLogo: jobData.companyLogo,
                location: jobData.location,
                salary: jobData.salary,
                employmentType: jobData.employmentType,
                savedDate: item.created_at
              };
            });
            
            setSavedJobs(formattedJobs);
          }
        } catch (error) {
          console.error("Error loading saved jobs:", error);
        }
      } else {
        // Si no está autenticado, usar localStorage
        const storedJobs = localStorage.getItem("savedJobs");
        if (storedJobs) {
          setSavedJobs(JSON.parse(storedJobs));
        }
      }
      
      setLoading(false);
    };

    loadSavedJobs();
  }, [user, isAuthenticated]);

  // Guardar trabajos en localStorage si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
    }
  }, [savedJobs, isAuthenticated]);

  const saveJob = async (job: Omit<SavedJob, "savedDate">) => {
    // Verificar si el trabajo ya está guardado
    if (isSaved(job.id)) {
      return;
    }

    const now = new Date().toISOString();
    const jobWithDate: SavedJob = {
      ...job,
      savedDate: now,
    };

    // Si el usuario está autenticado, guardar en Supabase
    if (user && isAuthenticated) {
      try {
        const { error } = await supabase
          .from('saved_jobs')
          .insert([
            {
              user_id: user.id,
              job_id: job.id,
              job_data: job,
              created_at: now
            }
          ]);
          
        if (error) {
          console.error("Error saving job:", error);
          return;
        }
        
        // Registrar el evento
        await logEvent({
          user_id: user.id,
          event_type: 'save_job',
          details: { jobId: job.id, jobTitle: job.jobTitle }
        });
        
      } catch (error) {
        console.error("Error saving job:", error);
      }
    }

    // Actualizar el estado local en todos los casos
    setSavedJobs((prev) => [...prev, jobWithDate]);
  };

  const removeJob = async (id: string) => {
    // Si el usuario está autenticado, eliminar de Supabase
    if (user && isAuthenticated) {
      try {
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', id);
          
        if (error) {
          console.error("Error removing job:", error);
          return;
        }
        
        // Registrar el evento
        await logEvent({
          user_id: user.id,
          event_type: 'remove_job',
          details: { jobId: id }
        });
        
      } catch (error) {
        console.error("Error removing job:", error);
      }
    }

    // Actualizar el estado local en todos los casos
    setSavedJobs((prev) => prev.filter((job) => job.id !== id));
  };

  const isSaved = (id: string) => {
    return savedJobs.some((job) => job.id === id);
  };

  return (
    <SavedJobsContext.Provider value={{ savedJobs, saveJob, removeJob, isSaved, loading }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (context === undefined) {
    throw new Error("useSavedJobs must be used within a SavedJobsProvider");
  }
  return context;
}; 