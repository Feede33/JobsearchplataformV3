-- Datos de prueba para la tabla jobs
INSERT INTO public.jobs (id, title, company, location, description, salary, requirements, created_at, updated_at)
VALUES 
(gen_random_uuid(), 'Desarrollador Frontend', 'TechCorp', 'Remoto', 'Empresa busca desarrollador frontend con experiencia en React y TypeScript', '$2000 - $3500', 'React, TypeScript, 2+ años de experiencia', now(), now()),
(gen_random_uuid(), 'Desarrollador Backend Node.js', 'InnovateSoft', 'Buenos Aires', 'Desarrollador backend con experiencia en Node.js y bases de datos', '$2500 - $4000', 'Node.js, Express, PostgreSQL, 3+ años de experiencia', now(), now()),
(gen_random_uuid(), 'Diseñador UX/UI', 'CreativeMinds', 'Córdoba', 'Diseñador UX/UI para aplicación móvil en crecimiento', '$1800 - $3000', 'Figma, Adobe XD, experiencia en diseño de aplicaciones móviles', now(), now()),
(gen_random_uuid(), 'DevOps Engineer', 'CloudTech', 'Remoto', 'Ingeniero DevOps para gestionar infraestructura en la nube', '$3000 - $4500', 'AWS, Docker, Kubernetes, CI/CD', now(), now()),
(gen_random_uuid(), 'Data Scientist', 'DataInnovate', 'Buenos Aires', 'Científico de datos para proyecto de machine learning', '$2800 - $4200', 'Python, TensorFlow, experiencia en ML', now(), now());

-- Función para crear perfiles de admin automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url, updated_at, user_id, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), NULL, NOW(), NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfiles automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();