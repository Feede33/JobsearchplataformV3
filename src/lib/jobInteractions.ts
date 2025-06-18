import { supabase, logEvent } from "./supabase";
import { uploadFile, deleteFile } from "./supabaseStorage";

/**
 * Guarda un trabajo en favoritos para un usuario
 */
export const saveJob = async (
  userId: string, 
  jobId: string | number, 
  jobData?: any
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Convertir jobId a número si es string
    const numericJobId = typeof jobId === 'string' ? parseInt(jobId, 10) : jobId;
    
    if (isNaN(numericJobId)) {
      return { success: false, error: "ID de trabajo inválido" };
    }
    
    // Verificar si ya está guardado
    const { data: existing, error: checkError } = await supabase
      .from("saved_jobs")
      .select("id")
      .eq("user_id", userId)
      .eq("job_id", numericJobId)
      .maybeSingle();

    if (checkError) {
      console.error("Error al verificar si el trabajo ya está guardado:", checkError);
      return { success: false, error: checkError.message };
    }

    if (existing) {
      return { success: true }; // Ya está guardado
    }

    // Si no se proporcionó jobData, usamos un objeto simple con el ID
    const job_data = jobData || { id: jobId.toString() };

    // Guardar el trabajo
    const { error } = await supabase.from("saved_jobs").insert([
      {
        user_id: userId,
        job_id: numericJobId,
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
      details: { job_id: numericJobId },
    });

    // También registrar como interacción para recomendaciones
    try {
      const { trackJobInteraction } = await import('./jobRecommendations');
      await trackJobInteraction(userId, numericJobId.toString(), 'save');
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
export const unsaveJob = async (userId: string, jobId: string | number): Promise<{ success: boolean; error?: string }> => {
  try {
    // Convertir jobId a número si es string
    const numericJobId = typeof jobId === 'string' ? parseInt(jobId, 10) : jobId;
    
    if (isNaN(numericJobId)) {
      return { success: false, error: "ID de trabajo inválido" };
    }
    
    const { error } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("user_id", userId)
      .eq("job_id", numericJobId);

    if (error) {
      console.error("Error al eliminar trabajo de favoritos:", error);
      return { success: false, error: error.message };
    }

    // Registrar evento
    await logEvent({
      user_id: userId,
      event_type: "job_unsaved",
      details: { job_id: numericJobId },
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
export const isJobSaved = async (userId: string, jobId: string | number): Promise<boolean> => {
  try {
    console.log("isJobSaved - jobId recibido:", jobId, "tipo:", typeof jobId);
    
    // Convertir jobId a número si es string
    const numericJobId = typeof jobId === 'string' ? parseInt(jobId, 10) : jobId;
    
    console.log("isJobSaved - jobId convertido:", numericJobId, "tipo:", typeof numericJobId);
    
    if (isNaN(numericJobId)) {
      console.error("isJobSaved - Error: jobId no es un número válido");
      return false;
    }
    
    // Usar .maybeSingle() en lugar de .single() para evitar errores cuando no hay resultados
    const { data, error } = await supabase
      .from("saved_jobs")
      .select("id")
      .eq("user_id", userId)
      .eq("job_id", numericJobId)
      .maybeSingle();
    
    if (error) {
      console.error("isJobSaved - Error en consulta:", error);
      return false;
    } 
    
    console.log("isJobSaved - Resultado:", !!data);
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
  jobId: string | number,
  applicationData?: {
    coverLetter?: string;
    resumeUrl?: string;
    resumeFile?: File;
    jobData?: any; // Añadimos un campo para los datos del trabajo
    forceUpdate?: boolean; // Indicador para forzar actualización si ya existe
  }
): Promise<{ success: boolean; error?: string; isUpdate?: boolean }> => {
  try {
    // Convertir jobId a número si es string
    const numericJobId = typeof jobId === 'string' ? parseInt(jobId, 10) : jobId;
    
    if (isNaN(numericJobId)) {
      return { success: false, error: "ID de trabajo inválido" };
    }
    
    // Verificar si ya aplicó
    const { data: existingApplication, error: checkError } = await supabase
      .from("job_applications")
      .select("id, status")
      .eq("user_id", userId)
      .eq("job_id", numericJobId)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error al verificar aplicación existente:", checkError);
      return { success: false, error: checkError.message };
    }

    // Si ya existe una aplicación y no se fuerza la actualización, retornar error
    if (existingApplication && !applicationData?.forceUpdate) {
      return { 
        success: false, 
        error: "Ya has aplicado a este trabajo", 
        isUpdate: false 
      };
    }

    // Preparar datos para la aplicación
    const applicationDataToSave: any = {
      user_id: userId,
      job_id: numericJobId,
      cover_letter: applicationData?.coverLetter || "",
      resume_url: applicationData?.resumeUrl || "",
      status: "pending",
      application_date: new Date().toISOString(),
      job_data: applicationData?.jobData || { id: numericJobId.toString() }
    };

    // Si se proporcionó un archivo de CV, subirlo primero
    if (applicationData?.resumeFile) {
      const uploadResult = await uploadResume(userId, applicationData.resumeFile);
      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error };
      }
      applicationDataToSave.resume_url = uploadResult.url;
    }

    let result;
    let applicationId;
    
    // Si ya existe, actualizar
    if (existingApplication) {
      result = await supabase
        .from("job_applications")
        .update(applicationDataToSave)
        .eq("id", existingApplication.id)
        .select();
      
      applicationId = existingApplication.id;
    } else {
      // Si no existe, insertar nuevo
      result = await supabase
        .from("job_applications")
        .insert([applicationDataToSave])
        .select();
      
      if (result.data && result.data.length > 0) {
        applicationId = result.data[0].id;
      }
    }

    const { error } = result;

    if (error) {
      console.error("Error al aplicar al trabajo:", error);
      return { success: false, error: error.message };
    }

    // Registrar evento
    await logEvent({
      user_id: userId,
      event_type: existingApplication ? "job_application_updated" : "job_application_created",
      details: { job_id: numericJobId },
    });

    // También registrar como interacción para recomendaciones
    try {
      const { trackJobInteraction } = await import('./jobRecommendations');
      await trackJobInteraction(userId, numericJobId.toString(), 'apply');
    } catch (e) {
      console.warn("No se pudo registrar la interacción para recomendaciones", e);
    }

    // Crear notificación de aplicación exitosa si es una nueva aplicación
    if (!existingApplication) {
      try {
        await createNotification(
          userId,
          'application_submitted',
          'Aplicación enviada con éxito',
          `Has aplicado correctamente al puesto de ${applicationData?.jobData?.title || 'trabajo'} en ${applicationData?.jobData?.company || 'la empresa'}.`,
          { 
            jobId: numericJobId,
            applicationId,
            job: applicationData?.jobData
          }
        );
      } catch (notifError) {
        console.error("Error al crear notificación:", notifError);
        // No interrumpimos el flujo si falla la notificación
      }
    }

    return { 
      success: true, 
      isUpdate: !!existingApplication 
    };
  } catch (error) {
    console.error("Error al aplicar al trabajo:", error);
    return { success: false, error: "Error al procesar la aplicación al trabajo" };
  }
};

/**
 * Verifica si un usuario ya aplicó a un trabajo
 */
export const hasAppliedToJob = async (userId: string, jobId: string | number): Promise<boolean> => {
  try {
    console.log("hasAppliedToJob - jobId recibido:", jobId, "tipo:", typeof jobId);
    
    // Convertir jobId a número si es string
    const numericJobId = typeof jobId === 'string' ? parseInt(jobId, 10) : jobId;
    
    console.log("hasAppliedToJob - jobId convertido:", numericJobId, "tipo:", typeof numericJobId);
    
    if (isNaN(numericJobId)) {
      console.error("hasAppliedToJob - Error: jobId no es un número válido");
      return false;
    }
    
    // Usar .maybeSingle() en lugar de .single() para evitar errores cuando no hay resultados
    const { data, error } = await supabase
      .from("job_applications")
      .select("id")
      .eq("user_id", userId)
      .eq("job_id", numericJobId)
      .maybeSingle();
    
    if (error) {
      console.error("hasAppliedToJob - Error en consulta:", error);
      return false;
    }
    
    console.log("hasAppliedToJob - Resultado:", !!data);
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
    console.log("Obteniendo trabajos guardados para el usuario:", userId);
    
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
      savedJobId: item.id,
      // Asegurar que job_id sea un número
      id: item.job_data?.id || item.job_id.toString(),
    }));
  } catch (error) {
    console.error("Error al obtener trabajos guardados:", error);
    return [];
  }
};

/**
 * Obtiene todas las aplicaciones a trabajos de un usuario
 */
export const getUserApplications = async (userId: string): Promise<any[]> => {
  try {
    console.log("Obteniendo aplicaciones para el usuario:", userId);
    
    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .eq("user_id", userId)
      .order("application_date", { ascending: false });

    if (error) {
      console.error("Error al obtener aplicaciones:", error);
      return [];
    }

    // Transformar los datos para que el job_data sea el objeto principal
    return (data || []).map(item => ({
      ...item.job_data,
      applicationId: item.id,
      applicationDate: item.application_date,
      status: item.status,
      coverLetter: item.cover_letter,
      resumeUrl: item.resume_url,
      // Asegurar que job_id sea un número
      id: item.job_data?.id || item.job_id.toString(),
    }));
  } catch (error) {
    console.error("Error al obtener aplicaciones:", error);
    return [];
  }
};

/**
 * Crea una nueva notificación para un usuario
 */
export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  data?: any
) => {
  try {
    // Convertir el jobId a número si viene como string
    if (data?.jobId && typeof data.jobId === 'string') {
      data.jobId = parseInt(data.jobId, 10);
    }

    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        data,
        is_read: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error al crear notificación:', error);
      return { success: false, error };
    }

    return { success: true, notification };
  } catch (err) {
    console.error('Error inesperado al crear notificación:', err);
    return { success: false, error: err };
  }
};

/**
 * Crea una notificación cuando un trabajo coincide con las habilidades del usuario
 */
export const notifyJobMatch = async (userId: string, job: any) => {
  return createNotification(
    userId,
    'job_match',
    '¡Nuevo trabajo que coincide con tu perfil!',
    `Encontramos un nuevo trabajo de ${job.title} en ${job.company} que coincide con tus habilidades.`,
    { jobId: job.id, job }
  );
};

/**
 * Crea una notificación cuando cambia el estado de una aplicación
 */
export const notifyApplicationStatusChange = async (userId: string, application: any, newStatus: string) => {
  let message = '';
  
  switch (newStatus) {
    case 'reviewed':
      message = `Tu aplicación para ${application.job_data?.title || 'el trabajo'} ha sido revisada.`;
      break;
    case 'interview':
      message = `¡Felicidades! Has sido seleccionado para una entrevista para ${application.job_data?.title || 'el trabajo'}.`;
      break;
    case 'rejected':
      message = `Lo sentimos, tu aplicación para ${application.job_data?.title || 'el trabajo'} no ha sido seleccionada.`;
      break;
    case 'accepted':
      message = `¡Felicidades! Tu aplicación para ${application.job_data?.title || 'el trabajo'} ha sido aceptada.`;
      break;
    default:
      message = `El estado de tu aplicación para ${application.job_data?.title || 'el trabajo'} ha cambiado a ${newStatus}.`;
  }
  
  return createNotification(
    userId,
    'application_status',
    'Actualización de tu aplicación',
    message,
    { 
      jobId: application.job_id,
      applicationId: application.id,
      status: newStatus,
      job: application.job_data
    }
  );
};

/**
 * Crea una notificación para nuevos trabajos en categorías de interés
 */
export const notifyNewJobInCategory = async (userId: string, job: any, category: string) => {
  return createNotification(
    userId,
    'new_job',
    `Nuevo trabajo en ${category}`,
    `Se ha publicado un nuevo trabajo de ${job.title} en ${job.company} en la categoría ${category}.`,
    { jobId: job.id, job, category }
  );
};

/**
 * Genera notificaciones de prueba para el usuario actual
 * Útil para probar la interfaz de notificaciones
 */
export const generateTestNotifications = async (userId: string, count: number = 5) => {
  if (!userId) return { success: false, error: 'Se requiere un ID de usuario' };
  
  try {
    const notificationTypes = [
      'job_match',
      'application_status',
      'new_job',
      'system'
    ];
    
    const jobTitles = [
      'Desarrollador Frontend',
      'Ingeniero de Software',
      'Diseñador UX/UI',
      'Product Manager',
      'Data Scientist',
      'DevOps Engineer',
      'Marketing Digital'
    ];
    
    const companies = [
      'TechCorp',
      'Innovate Inc',
      'Digital Solutions',
      'Creative Labs',
      'Data Insights',
      'Cloud Systems',
      'Marketing Pro'
    ];
    
    const applicationStatuses = [
      'recibida',
      'en revisión',
      'entrevista programada',
      'oferta enviada',
      'rechazada'
    ];
    
    const results = [];
    
    for (let i = 0; i < count; i++) {
      // Seleccionar tipo aleatorio
      const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      
      // Generar datos según el tipo
      let title = '';
      let message = '';
      let data = {};
      
      const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const jobId = Math.floor(Math.random() * 1000) + 1;
      
      switch (type) {
        case 'job_match':
          title = `¡Nuevo match de empleo!`;
          message = `Tu perfil coincide con la oferta de ${jobTitle} en ${company}.`;
          data = { jobId, matchScore: Math.floor(Math.random() * 30) + 70 };
          break;
          
        case 'application_status':
          const status = applicationStatuses[Math.floor(Math.random() * applicationStatuses.length)];
          title = `Actualización de aplicación`;
          message = `Tu aplicación para ${jobTitle} en ${company} ha sido ${status}.`;
          data = { 
            jobId, 
            applicationId: `app-${Math.random().toString(36).substring(2, 10)}`,
            status
          };
          break;
          
        case 'new_job':
          title = `Nueva oferta disponible`;
          message = `Se ha publicado una nueva oferta de ${jobTitle} en ${company} que podría interesarte.`;
          data = { jobId };
          break;
          
        case 'system':
          title = `Actualización del sistema`;
          message = `Hemos mejorado nuestra plataforma con nuevas funcionalidades para ayudarte a encontrar empleo.`;
          data = { updateId: Math.floor(Math.random() * 100) };
          break;
      }
      
      // Crear la notificación
      const result = await createNotification(
        userId,
        type,
        title,
        message,
        data
      );
      
      results.push(result);
      
      // Pequeña pausa para que las notificaciones tengan timestamps diferentes
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return { 
      success: true, 
      results,
      message: `Se han generado ${results.filter(r => r.success).length} notificaciones de prueba`
    };
  } catch (err) {
    console.error('Error al generar notificaciones de prueba:', err);
    return { success: false, error: err };
  }
}; 