-- Script para verificar configuraciones de seguridad en funciones
-- Este script crea una función para verificar si todas las funciones del esquema 'public'
-- tienen correctamente configurado search_path para prevenir ataques.

-- Función para verificar la configuración de seguridad de todas las funciones
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

-- Función para obtener un informe resumido del estado de seguridad
CREATE OR REPLACE FUNCTION public.get_security_report()
RETURNS JSON AS $$
DECLARE
  insecure_functions TEXT[];
  func_record RECORD;
  result JSONB;
BEGIN
  -- Inicializar array para funciones inseguras
  insecure_functions := ARRAY[]::TEXT[];
  
  -- Recopilar nombres de funciones inseguras
  FOR func_record IN 
    SELECT function_name 
    FROM check_all_functions_security() 
    WHERE NOT search_path_set
  LOOP
    insecure_functions := insecure_functions || func_record.function_name;
  END LOOP;
  
  -- Construir informe
  result := jsonb_build_object(
    'security_issues', jsonb_build_object(
      'insecure_functions_count', array_length(insecure_functions, 1),
      'insecure_functions', insecure_functions
    )
  );
  
  RETURN result::JSON;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ejecutar el verificador para ver el estado actual
SELECT * FROM check_all_functions_security();

-- Obtener un informe resumido
SELECT * FROM get_security_report(); 