// Archivo temporal

import { supabase } from './supabase';

interface JobData {
  title: string;
  description: string;
  requirements: string[];
  location: string;
  salary: string;
  type: string; // full-time, part-time, contract, etc.
  category: string;
  experience_level: string;
  skills_required: string[];
  application_url?: string;
  application_email?: string;
  is_remote: boolean;
  is_active: boolean;
  closing_date?: string;
  benefits?: string[];
}

interface JobApplication {
  id: string;
  user_id: string;
  job_id: number;
  cover_letter: string | null;
  resume_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  user_profile?: {
    id: string;
    email: string | null;
    name: string | null;
    avatar_url: string | null;
  };
}

/**
 * Crea una nueva oferta de trabajo
 * @param companyId ID de la empresa
 * @param jobData Datos del trabajo
 * @returns Objeto con el resultado de la operación
 */
export const createJob = async (companyId: string, jobData: JobData) => {
  try {
    // Convertir jobId a número si es necesario
    const job = {
      ...jobData,
      company_id: companyId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();

    if (error) {
      console.error('Error al crear trabajo:', error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, error: null, data };
  } catch (error) {
    console.error('Error al crear trabajo:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido', 
      data: null 
    };
  }
};

/**
 * Actualiza una oferta de trabajo existente
 * @param jobId ID del trabajo a actualizar
 * @param companyId ID de la empresa (para verificación)
 * @param jobData Datos actualizados del trabajo
 * @returns Objeto con el resultado de la operación
 */
export const updateJob = async (jobId: number, companyId: string, jobData: Partial<JobData>) => {
  try {
    // Asegurarse de que jobId es un número
    const numericJobId = typeof jobId === 'string' ? parseInt(jobId, 10) : jobId;
    
    if (isNaN(numericJobId)) {
      return { success: false, error: 'ID de trabajo inválido', data: null };
    }

    // Verificar que el trabajo pertenece a la empresa
    const { data: jobCheck, error: checkError } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', numericJobId)
      .eq('company_id', companyId)
      .single();

    if (checkError || !jobCheck) {
      return { 
        success: false, 
        error: 'No tienes permisos para actualizar este trabajo o no existe', 
        data: null 
      };
    }

    // Actualizar el trabajo
    const updateData = {
      ...jobData,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('jobs')
      .update(updateData)
      .eq('id', numericJobId)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar trabajo:', error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, error: null, data };
  } catch (error) {
    console.error('Error al actualizar trabajo:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido', 
      data: null 
    };
  }
};

/**
 * Elimina una oferta de trabajo
 * @param jobId ID del trabajo a eliminar
 * @param companyId ID de la empresa (para verificación)
 * @returns Objeto con el resultado de la operación
 */
export const deleteJob = async (jobId: number, companyId: string) => {
  try {
    // Asegurarse de que jobId es un número
    const numericJobId = typeof jobId === 'string' ? parseInt(jobId, 10) : jobId;
    
    if (isNaN(numericJobId)) {
      return { success: false, error: 'ID de trabajo inválido' };
    }

    // Verificar que el trabajo pertenece a la empresa
    const { data: jobCheck, error: checkError } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', numericJobId)
      .eq('company_id', companyId)
      .single();

    if (checkError || !jobCheck) {
      return { 
        success: false, 
        error: 'No tienes permisos para eliminar este trabajo o no existe'
      };
    }

    // Eliminar el trabajo
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', numericJobId)
      .eq('company_id', companyId);

    if (error) {
      console.error('Error al eliminar trabajo:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error al eliminar trabajo:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Obtiene todas las ofertas de trabajo de una empresa
 * @param companyId ID de la empresa
 * @returns Objeto con el resultado de la operación
 */
export const getCompanyJobs = async (companyId: string) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener trabajos:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, error: null, data: data || [] };
  } catch (error) {
    console.error('Error al obtener trabajos:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido', 
      data: [] 
    };
  }
};

/**
 * Obtiene los detalles de un trabajo específico
 * @param jobId ID del trabajo
 * @param companyId ID de la empresa (para verificación)
 * @returns Objeto con el resultado de la operación
 */
export const getJobDetails = async (jobId: number, companyId: string) => {
  try {
    // Asegurarse de que jobId es un número
    const numericJobId = typeof jobId === 'string' ? parseInt(jobId, 10) : jobId;
    
    if (isNaN(numericJobId)) {
      return { success: false, error: 'ID de trabajo inválido', data: null };
    }

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', numericJobId)
      .eq('company_id', companyId)
      .single();

    if (error) {
      console.error('Error al obtener detalles del trabajo:', error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, error: null, data };
  } catch (error) {
    console.error('Error al obtener detalles del trabajo:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido', 
      data: null 
    };
  }
};

/**
 * Obtiene todas las aplicaciones para un trabajo específico
 * @param jobId ID del trabajo
 * @param companyId ID de la empresa (para verificación)
 * @returns Objeto con el resultado de la operación
 */
export const getJobApplications = async (jobId: number, companyId: string) => {
  try {
    // Asegurarse de que jobId es un número
    const numericJobId = typeof jobId === 'string' ? parseInt(jobId, 10) : jobId;
    
    if (isNaN(numericJobId)) {
      return { success: false, error: 'ID de trabajo inválido', data: [] };
    }

    // Verificar que el trabajo pertenece a la empresa
    const { data: jobCheck, error: checkError } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', numericJobId)
      .eq('company_id', companyId)
      .single();

    if (checkError || !jobCheck) {
      return { 
        success: false, 
        error: 'No tienes permisos para ver las aplicaciones de este trabajo o no existe', 
        data: [] 
      };
    }

    // Obtener las aplicaciones con información de usuario
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        user_profile:profiles(id, email, name, avatar_url)
      `)
      .eq('job_id', numericJobId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener aplicaciones:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, error: null, data: data || [] };
  } catch (error) {
    console.error('Error al obtener aplicaciones:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido', 
      data: [] 
    };
  }
};

/**
 * Actualiza el estado de una aplicación
 * @param applicationId ID de la aplicación
 * @param companyId ID de la empresa (para verificación)
 * @param status Nuevo estado de la aplicación
 * @returns Objeto con el resultado de la operación
 */
export const updateApplicationStatus = async (
  applicationId: string, 
  companyId: string, 
  status: string
) => {
  try {
    // Primero, obtener el job_id de la aplicación
    const { data: appData, error: appError } = await supabase
      .from('job_applications')
      .select('job_id')
      .eq('id', applicationId)
      .single();

    if (appError || !appData) {
      return { 
        success: false, 
        error: 'No se encontró la aplicación o no tienes permisos para actualizarla' 
      };
    }

    // Verificar que el trabajo asociado pertenece a la empresa
    const { data: jobCheck, error: checkError } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', appData.job_id)
      .eq('company_id', companyId)
      .single();

    if (checkError || !jobCheck) {
      return { 
        success: false, 
        error: 'No tienes permisos para actualizar esta aplicación' 
      };
    }

    // Actualizar el estado de la aplicación
    const { error } = await supabase
      .from('job_applications')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', applicationId);

    if (error) {
      console.error('Error al actualizar estado de aplicación:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error al actualizar estado de aplicación:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Obtiene estadísticas de los trabajos de una empresa
 * @param companyId ID de la empresa
 * @returns Objeto con estadísticas de trabajos y aplicaciones
 */
export const getCompanyJobStats = async (companyId: string) => {
  try {
    // Obtener todos los trabajos de la empresa
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('id, is_active, created_at')
      .eq('company_id', companyId);

    if (jobsError) {
      throw jobsError;
    }

    // Si no hay trabajos, devolver estadísticas vacías
    if (!jobs || jobs.length === 0) {
      return {
        success: true,
        error: null,
        data: {
          totalJobs: 0,
          activeJobs: 0,
          totalApplications: 0,
          applicationsByStatus: {
            pending: 0,
            reviewed: 0,
            interview: 0,
            rejected: 0,
            accepted: 0
          },
          recentApplications: []
        }
      };
    }

    // Obtener IDs de todos los trabajos
    const jobIds = jobs.map(job => job.id);
    
    // Contar trabajos activos
    const activeJobs = jobs.filter(job => job.is_active).length;

    // Obtener todas las aplicaciones para estos trabajos
    const { data: applications, error: appsError } = await supabase
      .from('job_applications')
      .select(`
        id, job_id, status, created_at,
        user_profile:profiles(name, avatar_url)
      `)
      .in('job_id', jobIds)
      .order('created_at', { ascending: false });

    if (appsError) {
      throw appsError;
    }

    // Calcular estadísticas de aplicaciones
    const applicationsByStatus = {
      pending: 0,
      reviewed: 0,
      interview: 0,
      rejected: 0,
      accepted: 0
    };

    if (applications) {
      applications.forEach(app => {
        if (app.status && applicationsByStatus.hasOwnProperty(app.status)) {
          applicationsByStatus[app.status as keyof typeof applicationsByStatus]++;
        }
      });
    }

    // Obtener las 5 aplicaciones más recientes
    const recentApplications = applications ? applications.slice(0, 5) : [];

    return {
      success: true,
      error: null,
      data: {
        totalJobs: jobs.length,
        activeJobs,
        totalApplications: applications ? applications.length : 0,
        applicationsByStatus,
        recentApplications
      }
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido',
      data: null
    };
  }
};

/**
 * Activa o desactiva una oferta de trabajo
 * @param jobId ID del trabajo
 * @param companyId ID de la empresa
 * @param isActive Estado de activación
 * @returns Objeto con el resultado de la operación
 */
export const toggleJobStatus = async (jobId: number, companyId: string, isActive: boolean) => {
  try {
    // Asegurarse de que jobId es un número
    const numericJobId = typeof jobId === 'string' ? parseInt(jobId, 10) : jobId;
    
    if (isNaN(numericJobId)) {
      return { success: false, error: 'ID de trabajo inválido' };
    }

    // Verificar que el trabajo pertenece a la empresa
    const { data: jobCheck, error: checkError } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', numericJobId)
      .eq('company_id', companyId)
      .single();

    if (checkError || !jobCheck) {
      return { 
        success: false, 
        error: 'No tienes permisos para modificar este trabajo o no existe'
      };
    }

    // Actualizar el estado del trabajo
    const { error } = await supabase
      .from('jobs')
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString() 
      })
      .eq('id', numericJobId)
      .eq('company_id', companyId);

    if (error) {
      console.error('Error al actualizar estado del trabajo:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error al actualizar estado del trabajo:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};
