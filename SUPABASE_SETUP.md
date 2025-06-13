# Configuración de Supabase para la plataforma de búsqueda de empleo

Este documento explica cómo configurar Supabase como backend para esta aplicación.

## Paso 1: Crear una cuenta en Supabase

1. Visita [https://supabase.com](https://supabase.com) y crea una cuenta o inicia sesión.
2. Crea un nuevo proyecto desde el dashboard.
3. Toma nota de tu URL de Supabase y de la clave anónima (API key).

## Paso 2: Configuración del entorno local

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```bash
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
VITE_TEMPO=false
```

Reemplaza los valores con tus credenciales de Supabase.

## Paso 3: Configuración de la base de datos en Supabase

Desde el dashboard de Supabase, ve a la sección "Table Editor" y crea las siguientes tablas:

### Tabla `jobs`

| Columna       | Tipo       | Configuración               |
|--------------|------------|----------------------------|
| id           | uuid       | PK, Default: gen_random_uuid() |
| title        | text       | not null                    |
| company      | text       | not null                    |
| location     | text       | not null                    |
| description  | text       | not null                    |
| salary       | text       | null                        |
| requirements | text       | null                        |
| created_at   | timestamptz | default: now()             |
| updated_at   | timestamptz | default: now()             |

### Tabla `applications`

| Columna       | Tipo       | Configuración               |
|--------------|------------|----------------------------|
| id           | uuid       | PK, Default: gen_random_uuid() |
| job_id       | uuid       | FK -> jobs.id, not null     |
| user_id      | uuid       | FK -> auth.users.id, not null |
| resume_url   | text       | null                        |
| cover_letter | text       | null                        |
| status       | text       | not null, default: 'pendiente' |
| created_at   | timestamptz | default: now()             |
| updated_at   | timestamptz | default: now()             |

### Tabla `profiles`

| Columna       | Tipo       | Configuración               |
|--------------|------------|----------------------------|
| id           | uuid       | PK, Default: gen_random_uuid() |
| user_id      | uuid       | FK -> auth.users.id, unique, not null |
| full_name    | text       | not null                    |
| email        | text       | not null                    |
| bio          | text       | null                        |
| avatar_url   | text       | null                        |
| created_at   | timestamptz | default: now()             |
| updated_at   | timestamptz | default: now()             |

## Paso 4: Configuración de almacenamiento

1. Ve a la sección "Storage" en el dashboard de Supabase.
2. Crea dos buckets:
   - `resumes`: para almacenar los currículums de los usuarios
   - `avatars`: para almacenar las imágenes de perfil de los usuarios
3. Configura los permisos adecuados para cada bucket.

## Paso 5: Configuración de autenticación

1. Ve a la sección "Authentication" en el dashboard de Supabase.
2. Configura los proveedores de autenticación que desees utilizar (Email, Google, etc.).
3. Personaliza las plantillas de correo electrónico para el registro y recuperación de contraseña.

## Paso 6: Políticas de seguridad RLS (Row Level Security)

Configura las políticas de seguridad a nivel de fila para cada tabla:

### Políticas para la tabla `jobs`

```sql
-- Todos pueden ver los trabajos
CREATE POLICY "Todos pueden ver los trabajos" ON jobs FOR SELECT USING (true);

-- Solo los administradores pueden crear/actualizar/eliminar trabajos
CREATE POLICY "Solo administradores pueden gestionar trabajos" ON jobs FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM profiles WHERE role = 'admin')
);
```

### Políticas para la tabla `applications`

```sql
-- Los usuarios pueden ver sus propias solicitudes
CREATE POLICY "Los usuarios pueden ver sus propias solicitudes" ON applications FOR SELECT USING (
  auth.uid() = user_id
);

-- Los empleadores pueden ver las solicitudes para sus trabajos
CREATE POLICY "Empleadores pueden ver solicitudes para sus trabajos" ON applications FOR SELECT USING (
  job_id IN (SELECT id FROM jobs WHERE company_id = auth.uid())
);

-- Los usuarios pueden crear solicitudes
CREATE POLICY "Los usuarios pueden crear solicitudes" ON applications FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- Los usuarios pueden actualizar sus propias solicitudes
CREATE POLICY "Los usuarios pueden actualizar sus solicitudes" ON applications FOR UPDATE USING (
  auth.uid() = user_id
);
```

### Políticas para la tabla `profiles`

```sql
-- Los usuarios pueden ver todos los perfiles
CREATE POLICY "Los usuarios pueden ver todos los perfiles" ON profiles FOR SELECT USING (true);

-- Los usuarios solo pueden actualizar su propio perfil
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON profiles FOR UPDATE USING (
  auth.uid() = user_id
);

-- Los usuarios pueden crear su propio perfil
CREATE POLICY "Los usuarios pueden crear su propio perfil" ON profiles FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
```

## Uso de la librería de cliente

Ya hemos configurado todos los archivos necesarios para interactuar con Supabase:

1. `src/lib/supabase.ts`: Cliente principal de Supabase
2. `src/lib/SupabaseContext.tsx`: Contexto para la autenticación
3. `src/lib/useSupabaseData.ts`: Hooks para interactuar con la base de datos
4. `src/lib/supabaseStorage.ts`: Funciones para gestionar el almacenamiento

### Ejemplo de uso:

```tsx
import { useSupabase } from '../lib/SupabaseContext';
import { useJobs, useProfiles } from '../lib/useSupabaseData';
import { uploadFile } from '../lib/supabaseStorage';

function MiComponente() {
  const { user } = useSupabase();
  const { getJobs, loading } = useJobs();
  const { getProfileByUserId } = useProfiles();
  
  // Obtener trabajos
  const fetchJobs = async () => {
    const jobs = await getJobs();
    console.log(jobs);
  };
  
  // Subir un archivo
  const handleFileUpload = async (file: File) => {
    const path = `${user?.id}/${file.name}`;
    const { url, error } = await uploadFile('resumes', path, file);
    
    if (error) {
      console.error('Error al subir archivo:', error);
    } else {
      console.log('URL del archivo:', url);
    }
  };

  return (
    // ...
  );
}
```

## Generación de tipos de TypeScript

Para mantener actualizados los tipos de TypeScript con tu esquema de base de datos, ejecuta:

```bash
npm run types:supabase
```

Asegúrate de tener configurada la variable de entorno `SUPABASE_PROJECT_ID` con el ID de tu proyecto de Supabase. 