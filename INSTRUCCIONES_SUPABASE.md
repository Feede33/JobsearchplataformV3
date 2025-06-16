# Instrucciones para configurar Supabase

Para que la aplicación funcione correctamente, necesitas configurar tu proyecto de Supabase siguiendo estos pasos:

## 1. Configuración de Storage (Almacenamiento)

### 1.1. Crear buckets de almacenamiento:

1. Inicia sesión en tu proyecto de Supabase: https://app.supabase.com
2. Ve a la sección "Storage" en el menú lateral
3. Crea dos buckets:
   - `resumes` (para almacenar currículums)
   - `avatars` (para fotos de perfil)

### 1.2. Configurar políticas para el bucket "resumes":

1. Haz clic en el bucket "resumes"
2. Ve a la pestaña "Policies"
3. Crea una política para permitir SELECT (lectura) a todos:
   - Policy name: `Allow public read access`
   - Allowed operations: `SELECT`
   - Target roles: `Public (anonymous)`
   - Policy definition: `true`

4. Crea otra política para permitir INSERT (escritura) solo a usuarios autenticados:
   - Policy name: `Allow authenticated uploads`
   - Allowed operations: `INSERT`
   - Target roles: `Authenticated`
   - Policy definition: `auth.uid() = auth.uid()`

### 1.3. Configurar políticas para el bucket "avatars":

1. Haz clic en el bucket "avatars"
2. Ve a la pestaña "Policies"
3. Crea una política para permitir SELECT (lectura) a todos:
   - Policy name: `Allow public read access`
   - Allowed operations: `SELECT`
   - Target roles: `Public (anonymous)`
   - Policy definition: `true`

4. Crea otra política para permitir INSERT (escritura) solo a usuarios autenticados:
   - Policy name: `Allow authenticated uploads`
   - Allowed operations: `INSERT`
   - Target roles: `Authenticated`
   - Policy definition: `auth.uid() = auth.uid()`

## 2. Crear tablas en la base de datos

### 2.1. Usar el Editor SQL

1. Ve a la sección "SQL Editor" en el menú lateral
2. Crea una nueva consulta
3. Copia y pega el contenido del archivo `supabase_tables.sql` incluido en este proyecto
4. Ejecuta la consulta para crear las tablas necesarias:
   - `saved_jobs`: Para almacenar los trabajos guardados por los usuarios
   - `job_applications`: Para almacenar las aplicaciones a trabajos

### 2.2. Verificar la creación de tablas

1. Ve a la sección "Table Editor" en el menú lateral
2. Deberías ver las tablas `saved_jobs` y `job_applications` en la lista
3. Si no aparecen, vuelve a ejecutar el script SQL

## 3. Configuración de Autenticación

Para que los usuarios puedan iniciar sesión y subir archivos:

1. Ve a la sección "Authentication" en el menú lateral
2. Ve a la pestaña "Providers"
3. Asegúrate de que "Email" esté habilitado
4. Si deseas permitir el inicio de sesión con Google, configura también ese proveedor

### 3.1. Crear un usuario de prueba

1. Ve a la pestaña "Users"
2. Haz clic en "Invite user" o "Add user"
3. Ingresa un correo electrónico y contraseña
4. Usa este usuario para probar la aplicación

## 4. Variables de entorno

Asegúrate de que tu archivo `.env` tenga las siguientes variables configuradas: 

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

Puedes encontrar estos valores en la sección "Project Settings" > "API" de tu proyecto de Supabase.

## 5. Verificación

Una vez configurado todo, la aplicación debería:

1. Mostrar mensajes de confirmación en la consola indicando que los buckets existen
2. Permitir iniciar sesión con el usuario que creaste
3. Permitir guardar trabajos favoritos
4. Permitir aplicar a trabajos y subir currículums

Si sigues teniendo problemas, verifica:
- Los permisos de los buckets
- Las credenciales de Supabase en tu archivo `.env`
- Que estás usando las credenciales correctas para iniciar sesión
- Que las tablas se han creado correctamente con sus políticas RLS 