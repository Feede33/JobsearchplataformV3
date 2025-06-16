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