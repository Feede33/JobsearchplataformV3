-- Tabla para trabajos guardados (favoritos)
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id INTEGER NOT NULL,
  job_data JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Agregar políticas RLS (Row Level Security) para saved_jobs
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- Política para permitir a los usuarios ver solo sus propios trabajos guardados
CREATE POLICY "Users can view their own saved jobs" 
  ON saved_jobs FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para permitir a los usuarios insertar sus propios trabajos guardados
CREATE POLICY "Users can insert their own saved jobs" 
  ON saved_jobs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para permitir a los usuarios eliminar sus propios trabajos guardados
CREATE POLICY "Users can delete their own saved jobs" 
  ON saved_jobs FOR DELETE 
  USING (auth.uid() = user_id);

-- Tabla para aplicaciones a trabajos
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id INTEGER NOT NULL,
  cover_letter TEXT,
  resume_url TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  job_data JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Agregar políticas RLS para job_applications
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Política para permitir a los usuarios ver solo sus propias aplicaciones
CREATE POLICY "Users can view their own job applications" 
  ON job_applications FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para permitir a los usuarios insertar sus propias aplicaciones
CREATE POLICY "Users can insert their own job applications" 
  ON job_applications FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para permitir a los usuarios actualizar sus propias aplicaciones
CREATE POLICY "Users can update their own job applications" 
  ON job_applications FOR UPDATE 
  USING (auth.uid() = user_id);

-- Tabla para almacenar trabajos reales
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  logo TEXT,
  location TEXT,
  salary TEXT,
  type TEXT,
  requirements JSONB,
  description TEXT,
  posted_date TEXT,
  category TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_remote BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar políticas RLS para jobs
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública de trabajos
CREATE POLICY "Jobs are viewable by everyone" 
  ON jobs FOR SELECT 
  USING (true);

-- Política para permitir inserción solo a administradores
CREATE POLICY "Only admins can insert jobs" 
  ON jobs FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Política para permitir actualización solo a administradores
CREATE POLICY "Only admins can update jobs" 
  ON jobs FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Política para permitir eliminación solo a administradores
CREATE POLICY "Only admins can delete jobs" 
  ON jobs FOR DELETE 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Índices para mejorar el rendimiento de búsquedas
CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs USING gin(company gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs USING gin(location gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_is_featured ON jobs(is_featured);
CREATE INDEX IF NOT EXISTS idx_jobs_is_remote ON jobs(is_remote); 