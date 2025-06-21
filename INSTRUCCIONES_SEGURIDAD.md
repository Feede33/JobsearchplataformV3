# Instrucciones para solucionar problemas de seguridad en Supabase

## Introducción

Se han detectado las siguientes advertencias de seguridad en el proyecto:

1. **Función `public.update_timestamp` con search_path mutable**
2. **Tiempo de expiración OTP demasiado largo**
3. **Protección contra contraseñas filtradas deshabilitada**

Este documento proporciona instrucciones detalladas para solucionar cada uno de estos problemas.

## Requisitos previos

- Acceso al panel de administración de Supabase para tu proyecto
- Los archivos SQL de migración incluidos en este repositorio

## Solución paso a paso

### 1. Solucionar funciones con search_path mutable

#### Opción 1: Usar la interfaz web de Supabase

1. Accede al [Panel de control de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a "SQL Editor"
4. Crea un nuevo script SQL
5. Copia y pega el contenido del archivo `supabase/migrations/fix_all_security_issues.sql`
6. Haz clic en el botón "RUN" para ejecutar el script

#### Opción 2: Usar la CLI de Supabase (para desarrolladores)

```bash
# Instalar Supabase CLI si aún no está instalada
npm install -g supabase

# Iniciar sesión (solo necesario la primera vez)
supabase login

# Ejecutar el script SQL
supabase db execute --project-ref TU_ID_DE_PROYECTO -f supabase/migrations/fix_all_security_issues.sql

# Verificar el resultado
supabase db execute --project-ref TU_ID_DE_PROYECTO -c "SELECT * FROM check_all_functions_security();"
```

#### Opción 3: Usar psql (para usuarios avanzados)

```bash
# Reemplaza los valores con tu información de conexión
export PGPASSWORD=tu_contraseña
psql -h db.TU_ID_DE_PROYECTO.supabase.co -p 5432 -U postgres -d postgres -f supabase/migrations/fix_all_security_issues.sql

# Verificar el resultado
psql -h db.TU_ID_DE_PROYECTO.supabase.co -p 5432 -U postgres -d postgres -c "SELECT * FROM check_all_functions_security();"
```

### 2. Ajustar el tiempo de expiración OTP

1. Accede al [Panel de control de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a "Authentication" en el menú lateral
4. Selecciona la pestaña "Providers"
5. Encuentra la sección de "Email"
6. Modifica el campo "OTP expiry" a un valor menor a 3600 segundos (recomendamos 1800 segundos = 30 minutos)
7. Guarda los cambios

### 3. Habilitar protección contra contraseñas filtradas

1. Accede al [Panel de control de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a "Authentication" en el menú lateral
4. Selecciona la pestaña "Policies"
5. Encuentra la sección "Password Policies"
6. Activa la opción "Enable leaked password protection"
7. Guarda los cambios

## Verificación

Para verificar que todas las correcciones se han aplicado correctamente:

### Verificar funciones corregidas

Ejecuta esta consulta en el SQL Editor:

```sql
SELECT * FROM check_all_functions_security();
```

Todas las funciones deberían mostrar `search_path_set = true`

### Verificar estado general de seguridad

1. Ejecuta la aplicación en modo de desarrollo:
   ```bash
   npm run dev
   ```

2. Navega a la página de diagnóstico de Supabase en tu aplicación
3. Haz clic en "Verificar configuración de seguridad"
4. Confirma que todas las advertencias hayan sido resueltas

## Solución de problemas

### Error "Function not found"

Si al ejecutar `check_all_functions_security()` obtienes un error indicando que la función no existe, asegúrate de ejecutar primero el script `supabase/migrations/check_security_settings.sql`.

### Error "Permission denied"

Si obtienes errores de permiso al ejecutar los scripts:

1. Asegúrate de estar utilizando las credenciales de administrador correctas
2. Verifica que estés conectado a la base de datos correcta
3. Si usas la CLI de Supabase, asegúrate de haber ejecutado `supabase login` correctamente

## Contacto

Si necesitas ayuda adicional para resolver estos problemas, contacta al equipo de desarrollo o abre un issue en el repositorio del proyecto. 