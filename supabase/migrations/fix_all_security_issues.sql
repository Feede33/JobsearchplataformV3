-- Script para corregir todas las advertencias de seguridad relacionadas con funciones
-- 1. Corregir update_timestamp con search_path mutable
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER SET search_path = public;

-- 2. Corregir update_updated_at_column con search_path mutable
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER SET search_path = public;

-- 3. Corregir handle_new_user con search_path mutable
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Función para verificar la configuración de seguridad de otras funciones
-- Esta función puede ser usada desde la aplicación para comprobar si las correcciones
-- han sido aplicadas correctamente
CREATE OR REPLACE FUNCTION public.check_function_security(function_name TEXT)
RETURNS JSON AS $$
DECLARE
  func_info RECORD;
  result JSONB;
BEGIN
  -- Intentar obtener información de la función
  SELECT * INTO func_info 
  FROM pg_proc p 
  JOIN pg_namespace n ON p.pronamespace = n.oid 
  WHERE n.nspname = 'public' AND p.proname = function_name;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Function % not found in public schema', function_name;
  END IF;
  
  -- Verificar configuración de security_definer y search_path
  result = jsonb_build_object(
    'function_name', function_name,
    'security_definer', func_info.prosecdef,
    'search_path_set', func_info.proconfig::text[] IS NOT NULL AND 
      array_position(func_info.proconfig::text[], 'search_path=public') > 0
  );
  
  RETURN result::JSON;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Comprueba si alguna función en el esquema public no tiene configurado search_path
-- Esta función puede ayudar a identificar otras funciones que puedan tener problemas
CREATE OR REPLACE FUNCTION public.check_all_functions_security()
RETURNS TABLE (
  function_name TEXT,
  security_definer BOOLEAN,
  search_path_set BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.proname::TEXT,
    p.prosecdef,
    p.proconfig::text[] IS NOT NULL AND 
      array_position(p.proconfig::text[], 'search_path=public') > 0
  FROM pg_proc p 
  JOIN pg_namespace n ON p.pronamespace = n.oid 
  WHERE n.nspname = 'public';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public; 