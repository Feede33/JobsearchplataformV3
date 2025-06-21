# Guía completa de configuración de seguridad para Supabase

Este documento proporciona instrucciones paso a paso para resolver todas las advertencias de seguridad detectadas en el proyecto.

## Advertencias de seguridad identificadas

1. **Función con search_path mutable**
   - Problema: La función `public.update_timestamp` tiene un search_path mutable.
   - Riesgo: Potencial vulnerabilidad de seguridad mediante inyección de búsqueda de ruta.

2. **Tiempo de expiración OTP demasiado largo**
   - Problema: El tiempo de expiración de OTP está configurado a más de una hora.
   - Riesgo: Mayor ventana de oportunidad para ataques mediante códigos OTP.

3. **Protección contra contraseñas filtradas deshabilitada**
   - Problema: La función de verificación contra contraseñas comprometidas está desactivada.
   - Riesgo: Los usuarios podrían usar contraseñas que ya han sido expuestas en filtraciones de datos.

## Solución 1: Corregir funciones con search_path mutable

### Paso 1: Ejecutar script SQL de corrección

1. Acceda a su proyecto de Supabase en la consola web: https://supabase.com/dashboard
2. Navegue a "SQL Editor"
3. Cree un nuevo script SQL o abra uno existente
4. Copie y pegue el contenido del archivo `supabase/migrations/fix_all_security_issues.sql`
5. Ejecute el script haciendo clic en "Run"

```sql
-- Ejemplo del contenido del script (versión resumida)
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER SET search_path = public;

-- Más funciones...
```

### Paso 2: Verificar la corrección

Para verificar que las funciones se hayan corregido correctamente:

1. En el SQL Editor, ejecute la siguiente consulta:

```sql
SELECT * FROM public.check_all_functions_security();
```

2. Confirme que todas las funciones aparezcan con `search_path_set = true`

## Solución 2: Ajustar el tiempo de expiración OTP

### Paso 1: Acceder a la configuración de autenticación

1. En el dashboard de Supabase, vaya a "Authentication"
2. Haga clic en la pestaña "Providers"
3. Localice "Email" en la lista de proveedores

![Ejemplo de panel de autenticación](https://ejemplo.com/auth-panel.png)

### Paso 2: Modificar la configuración de OTP

1. En la sección de configuración de Email, busque "OTP expiry time"
2. Establezca un valor menor a 3600 segundos (recomendamos 1800 segundos / 30 minutos)
3. Haga clic en "Save" para guardar los cambios

```
Configuración recomendada:
- OTP expiry: 1800 (segundos)
```

![Ejemplo de configuración de OTP](https://ejemplo.com/otp-config.png)

## Solución 3: Habilitar protección de contraseñas filtradas

### Paso 1: Acceder a la configuración de políticas de contraseñas

1. En el dashboard de Supabase, vaya a "Authentication"
2. Haga clic en la pestaña "Policies"
3. Localice la sección "Password Policies"

![Ejemplo de políticas de contraseñas](https://ejemplo.com/password-policies.png)

### Paso 2: Activar la protección de contraseñas filtradas

1. En la sección "Password Policies", busque la opción "Leaked password protection"
2. Active el interruptor para habilitar esta característica
3. Haga clic en "Save" para guardar los cambios

```
Configuración recomendada:
- Leaked password protection: ON
- Minimum password length: 8 (o mayor)
```

## Verificación final

### Verifique las correcciones mediante la herramienta de diagnóstico incluida

1. Ejecute la aplicación en modo de desarrollo (`npm run dev`)
2. Navegue a la página de diagnóstico de Supabase en su aplicación
3. Haga clic en "Verificar configuración de seguridad"
4. Confirme que todas las advertencias hayan sido resueltas

### Comprobación de seguridad en el Dashboard de Supabase

1. En el dashboard de Supabase, vaya a "Project Settings"
2. Haga clic en "Security & Compliance"
3. Revise la lista de advertencias de seguridad
4. Confirme que las advertencias anteriores ya no estén presentes

## Mejores prácticas adicionales de seguridad

- **Actualice regularmente** las dependencias de su proyecto para obtener las últimas correcciones de seguridad
- **Implemente 2FA** para cuentas administrativas
- **Revise periódicamente las políticas RLS** para asegurarse de que estén correctamente configuradas
- **Audite el acceso** a datos sensibles mediante registros
- **Realice pruebas de penetración** periódicas para identificar vulnerabilidades 