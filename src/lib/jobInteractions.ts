import { supabase, logEvent } from "./supabase";
import { uploadFile, deleteFile } from "./supabaseStorage";

/**
 * Guarda un trabajo en favoritos para un usuario
 */
export const saveJob = async (
  userId: string, 
  jobId: string, 
  jobData?: any
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Verificar si ya está guardado
    const { data: existing } = await supabase
      .from("saved_jobs")
      .select("*")
      .eq("user_id", userId)
      .eq("job_id", jobId)
      .single();

    if (existing) {
      return { success: true }; // Ya está guardado
    }

    // Si no se proporcionó jobData, usamos un objeto simple con el ID
    const job_data = jobData || { id: jobId };

    // Guardar el trabajo
    const { error } = await supabase.from("saved_jobs").insert([
      {
        user_id: userId,
        job_id: jobId,
        saved_at: new Date().toISOString(),
        job_data: job_data,
      },
    ]);

    if (error) {
      console.error("Error al guardar trabajo:", error);
      return { success: false, error: error.message };
    }

    // Registrar evento
    await logEvent({
      user_id: userId,
      event_type: "job_saved",
      details: { job_id: jobId },
    });

    // También registrar como interacción para recomendaciones
    try {
      const { trackJobInteraction } = await import('./jobRecommendations');
      await trackJobInteraction(userId, jobId, 'save');
    } catch (e) {
      console.warn("No se pudo registrar la interacción para recomendaciones", e);
    }

    return { success: true };
  } catch (error) {
    console.error("Error al guardar trabajo:", error);
    return { success: false, error: "Error al guardar trabajo en favoritos" };
  }
};

/**
 * Elimina un trabajo de favoritos para un usuario
 */
export const unsaveJob = async (userId: string, jobId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("user_id", userId)
      .eq("job_id", jobId);

    if (error) {
      console.error("Error al eliminar trabajo de favoritos:", error);
      return { success: false, error: error.message };
    }

    // Registrar evento
    await logEvent({
      user_id: userId,
      event_type: "job_unsaved",
      details: { job_id: jobId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error al eliminar trabajo de favoritos:", error);
    return { success: false, error: "Error al eliminar trabajo de favoritos" };
  }
};

/**
 * Verifica si un trabajo está guardado por un usuario
 */
export const isJobSaved = async (userId: string, jobId: string): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from("saved_jobs")
      .select("*")
      .eq("user_id", userId)
      .eq("job_id", jobId)
      .single();

    return !!data;
  } catch (error) {
    console.error("Error al verificar trabajo guardado:", error);
    return false;
  }
};

/**
 * Sube un archivo de CV para una aplicación de trabajo
 */
export const uploadResume = async (userId: string, file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    if (!file) {
      return { success: false, error: "No se proporcionó ningún archivo" };
    }

    // Validar tipo de archivo (PDF, DOC, DOCX)
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Tipo de archivo no permitido. Use PDF, DOC o DOCX" };
    }

    // Validar tamaño (máx 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      return { success: false, error: "El archivo es demasiado grande. Máximo 5MB" };
    }

    // Crear ruta única para el archivo
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop() || '';
    const filePath = `${userId}/${timestamp}.${fileExtension}`;

    // Subir archivo
    const { url, error } = await uploadFile('resumes', filePath, file);

    if (error || !url) {
      console.error("Error al subir CV:", error);
      return { success: false, error: error?.message || "Error al subir el archivo" };
    }

    // Registrar evento
    await logEvent({
      user_id: userId,
      event_type: "resume_uploaded",
      details: { resume_url: url },
    });

    return { success: true, url };
  } catch (error) {
    console.error("Error al subir CV:", error);
    return { success: false, error: "Error al subir el archivo de CV" };
  }
};

/**
 * Aplica a un trabajo
 */
export const applyToJob = async (
  userId: string, 
  jobId: string,
  applicationData?: {
    coverLetter?: string;
    resumeUrl?: string;
    resumeFile?: File;
    jobData?: any; // Añadimos un campo para los datos del trabajo
    forceUpdate?: boolean; // Indicador para forzar actualización si ya existe
  }
): Promise<{ success: boolean; error?: string; isUpdate?: boolean }> => {
  try {
    console.log("[applyToJob] Iniciando aplicación con datos:", { 
      userId, 
      jobId, 
      forceUpdate: applicationData?.forceUpdate,
      hasResumeFile: !!applicationData?.resumeFile,
      hasJobData: !!applicationData?.jobData
    });
    
    // Verificar si ya aplicó
    const { data: existing, error: existingError } = await supabase
      .from("job_applications")
      .select("*")
      .eq("user_id", userId)
      .eq("job_id", jobId)
      .single();
    
    console.log("[applyToJob] Verificación de aplicación existente:", { 
      exists: !!existing, 
      error: existingError?.message 
    });

    // Si ya existe una aplicación y no se solicita actualización, retornamos éxito
    if (existing && !applicationData?.forceUpdate) {
      console.log("[applyToJob] Ya existe aplicación y no se solicitó actualización");
      return { success: true, isUpdate: false }; // Ya aplicó y no se solicita actualización
    }

    let resumeUrl = applicationData?.resumeUrl;

    // Si se proporcionó un archivo de CV, subirlo
    if (applicationData?.resumeFile) {
      const uploadResult = await uploadResume(userId, applicationData.resumeFile);
      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error };
      }
      resumeUrl = uploadResult.url;
    }

    // Obtener los datos del trabajo si no se proporcionaron
    let jobData = applicationData?.jobData;
    if (!jobData) {
      // Intentar obtener los datos del trabajo de saved_jobs
      try {
        const { data: savedJob } = await supabase
          .from("saved_jobs")
          .select("job_data")
          .eq("job_id", jobId)
          .limit(1)
          .single();
          
        if (savedJob) {
          jobData = savedJob.job_data;
        }
      } catch (err) {
        console.warn("No se encontraron datos del trabajo para la aplicación", err);
        // Continuamos sin datos del trabajo
      }
    }

    // Datos de la aplicación
    const applicationRecord = {
      user_id: userId,
      job_id: jobId,
      application_date: new Date().toISOString(),
      status: "submitted",
      cover_letter: applicationData?.coverLetter || null,
      resume_url: resumeUrl || null,
      job_data: jobData || { id: jobId } // Almacenamos los datos del trabajo o al menos el ID
    };

    // Si ya existe una aplicación y se solicita actualización, actualizamos en lugar de insertar
    if (existing && applicationData?.forceUpdate) {
      console.log("[applyToJob] Actualizando aplicación existente con datos:", {
        ...applicationRecord,
        updated_at: new Date().toISOString(),
        status: "updated"
      });
      
      const { error } = await supabase
        .from("job_applications")
        .update({
          ...applicationRecord,
          updated_at: new Date().toISOString(),
          status: "updated" // Cambiamos el estado para indicar que fue actualizado
        })
        .eq("user_id", userId)
        .eq("job_id", jobId);

      if (error) {
        console.error("Error al actualizar la aplicación:", error);
        return { success: false, error: error.message };
      }
      
      console.log("[applyToJob] Aplicación actualizada correctamente");
      
      // Registrar evento de actualización
      await logEvent({
        user_id: userId,
        event_type: "job_application_updated",
        details: { job_id: jobId },
      });
      
      return { success: true, isUpdate: true };
    } else {
      // Registrar una nueva aplicación
      console.log("[applyToJob] Registrando nueva aplicación");
      
      const { error } = await supabase.from("job_applications").insert([applicationRecord]);

      if (error) {
        console.error("Error al aplicar al trabajo:", error);
        return { success: false, error: error.message };
      }
      
      console.log("[applyToJob] Nueva aplicación registrada correctamente");
    }

    // Registrar evento
    await logEvent({
      user_id: userId,
      event_type: "job_application_submitted",
      details: { job_id: jobId },
    });

    // También registrar como interacción para recomendaciones
    try {
      const { trackJobInteraction } = await import('./jobRecommendations');
      await trackJobInteraction(userId, jobId, 'apply');
    } catch (e) {
      console.warn("No se pudo registrar la interacción para recomendaciones", e);
    }

    return { success: true };
  } catch (error) {
    console.error("Error al aplicar al trabajo:", error);
    return { success: false, error: "Error al enviar la aplicación" };
  }
};

/**
 * Verifica si un usuario ya aplicó a un trabajo
 */
export const hasAppliedToJob = async (userId: string, jobId: string): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from("job_applications")
      .select("*")
      .eq("user_id", userId)
      .eq("job_id", jobId)
      .single();

    return !!data;
  } catch (error) {
    console.error("Error al verificar aplicación:", error);
    return false;
  }
};

/**
 * Obtiene todos los trabajos guardados por un usuario
 */
export const getSavedJobs = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from("saved_jobs")
      .select("*") // Seleccionamos todos los campos sin hacer join con jobs
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error al obtener trabajos guardados:", error);
      return [];
    }

    // Transformar los datos para que el job_data sea el objeto principal
    return (data || []).map(item => ({
      ...item.job_data,
      savedDate: item.created_at || item.saved_at,
      savedJobId: item.id
    }));
  } catch (error) {
    console.error("Error al obtener trabajos guardados:", error);
    return [];
  }
};

/**
 * Obtiene todas las aplicaciones de un usuario
 */
export const getUserApplications = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from("job_applications")
      .select("*") // Seleccionamos todos los campos sin hacer join con jobs
      .eq("user_id", userId)
      .order("application_date", { ascending: false });

    if (error) {
      console.error("Error al obtener aplicaciones:", error);
      return [];
    }

    // Enriquecemos los datos de las aplicaciones con información del trabajo
    // buscando en saved_jobs si es necesario
    const enrichedApplications = await Promise.all((data || []).map(async (application) => {
      // Si ya tenemos job_data completo, lo usamos
      if (application.job_data && application.job_data.jobTitle) {
        return {
          id: application.id,
          jobId: application.job_id,
          jobTitle: application.job_data.jobTitle || "Título no disponible",
          companyName: application.job_data.companyName || "Empresa no disponible",
          companyLogo: application.job_data.companyLogo || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback",
          appliedDate: application.application_date || application.created_at,
          status: application.status || "pending",
          coverLetter: application.cover_letter,
          resumeUrl: application.resume_url
        };
      }
      
      // Si no tenemos job_data, intentamos buscar en saved_jobs
      try {
        const { data: savedJobData } = await supabase
          .from("saved_jobs")
          .select("job_data")
          .eq("job_id", application.job_id)
          .limit(1)
          .single();
          
        const jobInfo = savedJobData?.job_data || {};
        
        return {
          id: application.id,
          jobId: application.job_id,
          jobTitle: jobInfo.jobTitle || "Título no disponible",
          companyName: jobInfo.companyName || "Empresa no disponible",
          companyLogo: jobInfo.companyLogo || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback",
          appliedDate: application.application_date || application.created_at,
          status: application.status || "pending",
          coverLetter: application.cover_letter,
          resumeUrl: application.resume_url
        };
      } catch (err) {
        // Si no encontramos datos en saved_jobs, devolvemos la información básica
        return {
          id: application.id,
          jobId: application.job_id,
          jobTitle: "Título no disponible",
          companyName: "Empresa no disponible",
          companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback",
          appliedDate: application.application_date || application.created_at,
          status: application.status || "pending",
          coverLetter: application.cover_letter,
          resumeUrl: application.resume_url
        };
      }
    }));

    return enrichedApplications;
  } catch (error) {
    console.error("Error al obtener aplicaciones:", error);
    return [];
  }
}; 