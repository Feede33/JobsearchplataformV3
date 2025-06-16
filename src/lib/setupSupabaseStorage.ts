import { supabase } from './supabase';

/**
 * Verifica si un bucket existe y muestra un mensaje si no existe
 * @param bucketName Nombre del bucket a verificar
 */
export const checkBucketExists = async (bucketName: string) => {
  try {
    // Verificar si el bucket existe intentando listar archivos en él
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list();
    
    if (error && error.message.includes('bucket not found')) {
      console.warn(`⚠️ El bucket "${bucketName}" no existe. Por favor, créalo manualmente en el panel de Supabase.`);
      return { exists: false, error: error };
    } else {
      console.log(`✅ El bucket "${bucketName}" existe.`);
      return { exists: true, error: null };
    }
  } catch (error) {
    console.error('Error al verificar bucket:', error);
    return { exists: false, error };
  }
};

/**
 * Verifica todos los buckets necesarios para la aplicación
 */
export const checkAllBuckets = async () => {
  console.log('Verificando buckets de almacenamiento...');
  
  // Verificar bucket para currículums
  const resumesBucket = await checkBucketExists('resumes');
  
  // Verificar bucket para avatares
  const avatarsBucket = await checkBucketExists('avatars');
  
  // Mostrar mensaje si algún bucket no existe
  if (!resumesBucket.exists || !avatarsBucket.exists) {
    console.warn(`
      ⚠️ ATENCIÓN: Algunos buckets necesarios no existen.
      
      Por favor, crea los siguientes buckets en el panel de Supabase:
      1. "resumes" - Para almacenar currículums
      2. "avatars" - Para almacenar fotos de perfil
      
      Y configura las siguientes políticas de seguridad:
      - Permitir lectura (SELECT) a todos
      - Permitir escritura (INSERT) solo a usuarios autenticados
    `);
  } else {
    console.log('✅ Todos los buckets necesarios están configurados correctamente.');
  }
  
  return {
    allExist: resumesBucket.exists && avatarsBucket.exists,
    resumes: resumesBucket.exists,
    avatars: avatarsBucket.exists
  };
};

/**
 * Verifica si un bucket existe y lo crea si no existe
 * @param bucketName Nombre del bucket a verificar/crear
 * @param isPublic Si el bucket debe ser público (true) o privado (false)
 */
export const ensureBucketExists = async (bucketName: string, isPublic: boolean = false) => {
  try {
    // Verificar si el bucket existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error al listar buckets:', listError);
      return { success: false, error: listError };
    }
    
    // Verificar si el bucket ya existe
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`El bucket ${bucketName} no existe. Creándolo...`);
      
      // Crear el bucket
      const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (createError) {
        console.error(`Error al crear el bucket ${bucketName}:`, createError);
        return { success: false, error: createError };
      }
      
      console.log(`Bucket ${bucketName} creado exitosamente.`);
      
      // Configurar políticas de RLS si es necesario
      if (isPublic) {
        await setupPublicBucketPolicies(bucketName);
      } else {
        await setupPrivateBucketPolicies(bucketName);
      }
    } else {
      console.log(`El bucket ${bucketName} ya existe.`);
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error al verificar/crear bucket:', error);
    return { success: false, error };
  }
};

/**
 * Configura políticas para un bucket público
 * Nota: Esto requiere permisos de administrador en Supabase
 * @param bucketName Nombre del bucket
 */
const setupPublicBucketPolicies = async (bucketName: string) => {
  try {
    // En un entorno de producción, esto se haría desde el panel de Supabase
    // o usando la API de administración con permisos adecuados
    console.log(`Para el bucket ${bucketName}, configura las siguientes políticas en el panel de Supabase:`);
    console.log('1. Permitir lectura anónima');
    console.log('2. Permitir escritura solo a usuarios autenticados');
  } catch (error) {
    console.error(`Error al configurar políticas para ${bucketName}:`, error);
  }
};

/**
 * Configura políticas para un bucket privado
 * Nota: Esto requiere permisos de administrador en Supabase
 * @param bucketName Nombre del bucket
 */
const setupPrivateBucketPolicies = async (bucketName: string) => {
  try {
    // En un entorno de producción, esto se haría desde el panel de Supabase
    // o usando la API de administración con permisos adecuados
    console.log(`Para el bucket ${bucketName}, configura las siguientes políticas en el panel de Supabase:`);
    console.log('1. Permitir lectura solo a usuarios autenticados');
    console.log('2. Permitir escritura solo a usuarios autenticados');
  } catch (error) {
    console.error(`Error al configurar políticas para ${bucketName}:`, error);
  }
};

/**
 * Configura todos los buckets necesarios para la aplicación
 */
export const setupAllBuckets = async () => {
  console.log('Configurando buckets de almacenamiento...');
  
  // Crear bucket para currículums (público para lectura)
  await ensureBucketExists('resumes', true);
  
  // Crear bucket para avatares (público para lectura)
  await ensureBucketExists('avatars', true);
  
  console.log('Configuración de buckets completada.');
}; 