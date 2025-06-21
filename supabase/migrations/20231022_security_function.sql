-- Función para verificar la configuración de seguridad de otras funciones
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