# Plataforma de Búsqueda de Empleo con Supabase

Esta aplicación utiliza Supabase como backend para proporcionar servicios de autenticación, base de datos y almacenamiento.

## 🚀 Configuración completada

La configuración de Supabase ha sido completada. A continuación se detallan los componentes y características implementados:

### Base de datos

Se han configurado las siguientes tablas:

- **profiles**: Información de los usuarios
- **jobs**: Ofertas de trabajo disponibles
- **applications**: Solicitudes de los usuarios a los trabajos
- **saved_jobs**: Trabajos guardados por los usuarios
- **logs**: Registro de eventos del usuario

### Almacenamiento

Se han configurado dos buckets:
- **avatars**: Para imágenes de perfil de usuario
- **resumes**: Para currículums y archivos adjuntos

### Autenticación

- Sistema de autenticación con email/password
- Inicio de sesión con Google
- Funciones para restablecer contraseñas

### Políticas de seguridad (RLS)

Se han implementado políticas de seguridad para todas las tablas:
- Los usuarios pueden ver sus propios datos
- Los datos públicos son accesibles para todos
- Solo administradores pueden gestionar ciertas entidades

## 📁 Componentes principales

### Cliente de Supabase
- `src/lib/supabase.ts`: Inicialización del cliente de Supabase

### Hooks y contextos
- `src/lib/SupabaseContext.tsx`: Contexto para la autenticación
- `src/lib/useSupabaseAuth.ts`: Hook especializado para autenticación
- `src/lib/useSupabaseData.ts`: Hooks para trabajar con datos
- `src/lib/supabaseStorage.ts`: Funciones para gestionar archivos

### Componentes UI
- `src/components/FileUpload.tsx`: Componente para subir archivos
- `src/components/ProfileForm.tsx`: Formulario de perfil de usuario

## 🛠️ Uso

### Autenticación

```tsx
import { useSupabaseAuth } from '../lib/useSupabaseAuth';

function LoginComponent() {
  const { signIn, signUp, loading, error } = useSupabaseAuth();
  
  const handleLogin = async () => {
    const { success, error } = await signIn({
      email: 'usuario@ejemplo.com',
      password: 'contraseña'
    });
    
    if (success) {
      // Usuario autenticado correctamente
    }
  };
}
```

### Obtener datos

```tsx
import { useJobs } from '../lib/useSupabaseData';

function JobsComponent() {
  const { getJobs, loading } = useJobs();
  
  useEffect(() => {
    const loadJobs = async () => {
      const jobs = await getJobs();
      // Procesar trabajos
    };
    
    loadJobs();
  }, []);
}
```

### Almacenamiento de archivos

```tsx
import { FileUpload } from '../components/FileUpload';

function ResumeUploadComponent() {
  const handleUploadComplete = (url) => {
    console.log('Archivo subido:', url);
  };
  
  return (
    <FileUpload 
      bucket="resumes"
      onUploadComplete={handleUploadComplete}
      acceptedFileTypes=".pdf,.doc,.docx"
    />
  );
}
```

## ⚙️ Variables de entorno

Asegúrate de tener un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
VITE_SUPABASE_URL=https://adlhgvwdvatwhesnhpph.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
VITE_TEMPO=false
```

## 📚 Recursos adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de autenticación de Supabase](https://supabase.com/docs/guides/auth)
- [Documentación de almacenamiento de Supabase](https://supabase.com/docs/guides/storage)
- [Ejemplos de políticas RLS](https://supabase.com/docs/guides/auth/row-level-security)