import { supabase } from './supabase';

export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string | null; error: Error | null }> => {
  try {
    // Sanitizar el nombre del archivo para evitar problemas con espacios y caracteres especiales
    const sanitizedPath = path.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._\-\/]/g, '');
    
    // Generar un nombre único basado en timestamp para evitar colisiones
    const timestamp = new Date().getTime();
    const fileParts = sanitizedPath.split('/');
    const fileName = fileParts.pop() || '';
    const fileExt = fileName.includes('.') ? fileName.split('.').pop() : '';
    const baseFileName = fileName.includes('.') ? fileName.split('.').slice(0, -1).join('.') : fileName;
    const uniqueFileName = `${baseFileName}_${timestamp}${fileExt ? '.' + fileExt : ''}`;
    const uniquePath = [...fileParts, uniqueFileName].join('/');
    
    console.log('Subiendo archivo a:', bucket, 'ruta:', uniquePath);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uniquePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Error de Supabase Storage:', error);
      throw new Error(`Error al subir el archivo: ${error.message}`);
    }

    if (!data || !data.path) {
      throw new Error('No se recibió información del archivo subido');
    }

    // Obtener la URL pública del archivo subido
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    if (!urlData || !urlData.publicUrl) {
      throw new Error('No se pudo obtener la URL pública del archivo');
    }

    // Asegurarnos de que la URL sea accesible para el visor de PDF
    const publicUrl = urlData.publicUrl;
    
    // Verificar que la URL sea accesible
    try {
      const response = await fetch(publicUrl, { method: 'HEAD' });
      if (!response.ok) {
        console.warn('La URL puede no ser accesible directamente:', publicUrl);
      }
    } catch (e) {
      console.warn('Error al verificar accesibilidad de la URL:', e);
    }

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Error en uploadFile:', error);
    return {
      url: null,
      error: error instanceof Error ? error : new Error('Error desconocido al subir el archivo'),
    };
  }
};

export const deleteFile = async (
  bucket: string,
  path: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Error al eliminar el archivo'),
    };
  }
};

export const getFileURL = (
  bucket: string,
  path: string
): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
}; 