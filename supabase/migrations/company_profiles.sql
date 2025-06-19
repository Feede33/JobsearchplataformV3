-- Tabla para perfiles de empresas
CREATE TABLE IF NOT EXISTS company_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  logo_url TEXT,
  description TEXT,
  location TEXT,
  size TEXT,
  founded_year INTEGER,
  contact_email TEXT,
  contact_phone TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para perfiles de empresas
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para perfiles de empresas
CREATE POLICY "Companies can view their own profile" 
  ON company_profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Companies can update their own profile" 
  ON company_profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Companies can insert their own profile" 
  ON company_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Política para permitir a los administradores ver todos los perfiles de empresas
CREATE POLICY "Admins can view all company profiles" 
  ON company_profiles FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Modificar políticas de jobs para permitir a las empresas crear/editar sus propios trabajos
CREATE POLICY "Companies can insert their own jobs" 
  ON jobs FOR INSERT 
  WITH CHECK (
    auth.jwt() ->> 'role' = 'company' AND 
    company = (SELECT company_name FROM company_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Companies can update their own jobs" 
  ON jobs FOR UPDATE 
  USING (
    auth.jwt() ->> 'role' = 'company' AND 
    company = (SELECT company_name FROM company_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Companies can delete their own jobs" 
  ON jobs FOR DELETE 
  USING (
    auth.jwt() ->> 'role' = 'company' AND 
    company = (SELECT company_name FROM company_profiles WHERE id = auth.uid())
  );

-- Añadir campo company_id a la tabla jobs para relacionar con el perfil de empresa
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES company_profiles(id); 