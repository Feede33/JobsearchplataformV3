-- Corrige el problema de search_path mutable en la función update_timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER SET search_path = public;

-- Asegurarse de que todas las funciones existentes tengan search_path explícito
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

-- Nota: Después de aplicar esta migración, es necesario configurar:
-- 1. Reducir el tiempo de expiración de OTP a menos de una hora en la configuración de Auth
-- 2. Habilitar la protección de contraseñas filtradas en la configuración de Auth 