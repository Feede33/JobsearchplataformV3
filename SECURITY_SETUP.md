# Configuración de Seguridad para Supabase

Este documento detalla los pasos necesarios para corregir problemas de seguridad detectados en el proyecto.

## 1. Problemas detectados y soluciones

### 1.1 Función con search_path mutable

**Problema**: La función `public.update_timestamp` tiene un search_path mutable, lo que puede conducir a vulnerabilidades de seguridad.

**Solución**: Se ha creado una migración que modifica la función para usar `SECURITY DEFINER SET search_path = public`. Esta migración necesita ser aplicada a la base de datos.

### 1.2 Tiempo de expiración OTP demasiado largo

**Problema**: El tiempo de expiración de OTP está configurado a más de una hora, lo que no es recomendado por razones de seguridad.

**Solución**: Es necesario reducir este tiempo en la configuración de Auth en la consola de Supabase.

### 1.3 Protección contra contraseñas filtradas deshabilitada

**Problema**: La protección contra el uso de contraseñas filtradas está desactivada.

**Solución**: Es necesario habilitar esta característica en la configuración de Auth en la consola de Supabase.

## 2. Instrucciones de implementación

### 2.1 Aplicar migración para corregir search_path mutable

1. Accede a la consola de Supabase
2. Ve a la sección "SQL Editor"
3. Carga y ejecuta el archivo `supabase/migrations/20231021_fix_security_issues.sql`

### 2.2 Configurar tiempo de expiración de OTP

1. Accede a la consola de Supabase
2. Ve a "Authentication" > "Providers" > "Email"
3. Localiza la configuración "OTP expiry time"
4. Establece un valor inferior a 3600 segundos (menos de una hora)
5. Guarda los cambios

### 2.3 Habilitar protección contra contraseñas filtradas

1. Accede a la consola de Supabase
2. Ve a "Authentication" > "Policies"
3. Localiza la sección "Password Policy"
4. Activa la opción "Enable leaked password protection"
5. Guarda los cambios

## 3. Verificación

Después de aplicar estas correcciones, puedes verificar que los problemas han sido resueltos ejecutando las comprobaciones de seguridad desde la consola de Supabase.

## 4. Mejores prácticas adicionales

- **Revisión regular de permisos**: Revisa periódicamente las políticas RLS para asegurarte de que sólo los usuarios autorizados tengan acceso a los datos.
- **Auditoría de funciones**: Asegúrate de que todas las funciones PostgreSQL usen `SECURITY DEFINER SET search_path = public` cuando sea apropiado.
- **Configuraciones de Auth**: Revisa periódicamente las configuraciones de autenticación para asegurar que siguen las mejores prácticas. 