import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CheckCircle, AlertCircle, XCircle, Loader2, Database } from "lucide-react";

const SupabaseDiagnostic = () => {
  const [diagResults, setDiagResults] = useState<{
    connected: boolean;
    tablesExist: {
      saved_jobs: boolean;
      job_applications: boolean;
      jobs: boolean;
    };
    bucketsExist: {
      resumes: boolean;
      avatars: boolean;
    };
    loading: boolean;
    error: string | null;
  }>({
    connected: false,
    tablesExist: {
      saved_jobs: false,
      job_applications: false,
      jobs: false,
    },
    bucketsExist: {
      resumes: false,
      avatars: false,
    },
    loading: true,
    error: null,
  });

  // Estado para la verificación de la columna job_data
  const [columnCheck, setColumnCheck] = useState({
    checking: false,
    exists: false,
    fixed: false,
    error: null
  });

  // Estado para la ejecución del script SQL
  const [scriptExecution, setScriptExecution] = useState({
    executing: false,
    success: false,
    error: null
  });

  // Script SQL para crear tablas
  const createTablesScript = `
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
`;

  const runDiagnostic = async () => {
    setDiagResults((prev) => ({ ...prev, loading: true, error: null }));
    try {
      // Verificar conexión a Supabase
      let connectionResult;
      try {
        connectionResult = await supabase.from("_dummy_query_for_connection_test_").select("*").limit(1);
      } catch (err) {
        connectionResult = {
          data: null,
          error: { message: "Error de conexión" },
        };
      }
      const { error: connectionError } = connectionResult;

      // La conexión es exitosa incluso si la tabla no existe (error específico)
      const connected = !connectionError || connectionError.code === "PGRST116";

      // Verificar tablas
      let savedJobsResult;
      try {
        savedJobsResult = await supabase.from("saved_jobs").select("id").limit(1);
      } catch (err) {
        savedJobsResult = {
          data: null,
          error: { message: "Error al verificar saved_jobs" },
        };
      }
      const { error: savedJobsError } = savedJobsResult;

      let jobApplicationsResult;
      try {
        jobApplicationsResult = await supabase.from("job_applications").select("id").limit(1);
      } catch (err) {
        jobApplicationsResult = {
          data: null,
          error: { message: "Error al verificar job_applications" },
        };
      }
      const { error: jobApplicationsError } = jobApplicationsResult;

      // Verificar tabla jobs
      let jobsResult;
      try {
        jobsResult = await supabase.from("jobs").select("id").limit(1);
      } catch (err) {
        jobsResult = {
          data: null,
          error: { message: "Error al verificar jobs" },
        };
      }
      const { error: jobsError } = jobsResult;

      // Verificar buckets
      let resumesBucketResult;
      try {
        resumesBucketResult = await supabase.storage.from("resumes").list("", { limit: 1 });
      } catch (err) {
        resumesBucketResult = {
          data: null,
          error: { message: "Error al verificar bucket resumes" },
        };
      }
      const { error: resumesError } = resumesBucketResult;

      let avatarsBucketResult;
      try {
        avatarsBucketResult = await supabase.storage.from("avatars").list("", { limit: 1 });
      } catch (err) {
        avatarsBucketResult = {
          data: null,
          error: { message: "Error al verificar bucket avatars" },
        };
      }
      const { error: avatarsError } = avatarsBucketResult;

      setDiagResults({
        connected,
        tablesExist: {
          saved_jobs: !savedJobsError || savedJobsError.code === "PGRST116",
          job_applications: !jobApplicationsError || jobApplicationsError.code === "PGRST116",
          jobs: !jobsError || jobsError.code === "PGRST116",
        },
        bucketsExist: {
          resumes: !resumesError,
          avatars: !avatarsError,
        },
        loading: false,
        error: null,
      });
    } catch (error) {
      setDiagResults((prev) => ({
        ...prev,
        loading: false,
        error: "Error al ejecutar diagnóstico",
      }));
    }
  };

  // Función para verificar y arreglar la columna job_data
  const checkAndFixJobDataColumn = async () => {
    setColumnCheck({ checking: true, exists: false, fixed: false, error: null });
    
    try {
      // Primero verificamos si la tabla job_applications existe
      if (!diagResults.tablesExist.job_applications) {
        setColumnCheck({
          checking: false,
          exists: false,
          fixed: false,
          error: "La tabla job_applications no existe. Primero debes crearla."
        });
        return;
      }
      
      // Intentamos verificar si la columna existe en la tabla
      try {
        // Intentamos hacer una consulta directa a la columna job_data
        const { data, error } = await supabase
          .from('job_applications')
          .select('job_data')
          .limit(1);
        
        if (!error) {
          // Si no hay error, la columna existe
          setColumnCheck({
            checking: false,
            exists: true,
            fixed: false,
            error: null
          });
          return;
        }
        
        // Si hay un error específico de columna no encontrada, la columna no existe
        if (error.message.includes("column") && error.message.includes("does not exist")) {
          // Intentamos añadir la columna
          const { error: alterError } = await supabase.rpc('execute_sql', {
            sql: "ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS job_data JSONB DEFAULT NULL;"
          });
          
          if (alterError) {
            // Si falla la función RPC, intentamos con una consulta SQL directa
            const { error: directSqlError } = await supabase
              .from('_diagnose_fix')
              .insert({ 
                query: "ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS job_data JSONB DEFAULT NULL;"
              });
            
            if (directSqlError) {
              setColumnCheck({
                checking: false,
                exists: false,
                fixed: false,
                error: `No se pudo añadir la columna: ${alterError.message}`
              });
              return;
            }
          }
          
          // Verificamos si la columna se añadió correctamente
          const { error: verifyError } = await supabase
            .from('job_applications')
            .select('job_data')
            .limit(1);
          
          if (!verifyError) {
            setColumnCheck({
              checking: false,
              exists: true,
              fixed: true,
              error: null
            });
          } else {
            setColumnCheck({
              checking: false,
              exists: false,
              fixed: false,
              error: "No se pudo verificar si la columna se añadió correctamente."
            });
          }
        } else {
          setColumnCheck({
            checking: false,
            exists: false,
            fixed: false,
            error: error.message
          });
        }
      } catch (err) {
        setColumnCheck({
          checking: false,
          exists: false,
          fixed: false,
          error: `Error al verificar la columna: ${err.message}`
        });
      }
    } catch (error) {
      setColumnCheck({
        checking: false,
        exists: false,
        fixed: false,
        error: `Error general: ${error.message}`
      });
    }
  };

  // Función para ejecutar el script SQL
  const executeCreateTablesScript = async () => {
    setScriptExecution({ executing: true, success: false, error: null });
    
    try {
      // Ejecutar el script SQL
      const { error } = await supabase.rpc('exec_sql', { sql: createTablesScript });
      
      if (error) {
        // Si falla, intentar ejecutar con otro método
        try {
          // Dividir el script en instrucciones individuales
          const statements = createTablesScript
            .split(';')
            .map(statement => statement.trim())
            .filter(statement => statement.length > 0);
          
          // Ejecutar cada instrucción por separado
          for (const statement of statements) {
            const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement + ';' });
            if (stmtError) {
              console.warn('Error en instrucción:', statement, stmtError);
              // Continuar con la siguiente instrucción
            }
          }
          
          setScriptExecution({ executing: false, success: true, error: null });
          
          // Recargar diagnóstico después de un breve retraso
          setTimeout(() => runDiagnostic(), 1500);
          
        } catch (err) {
          console.error('Error al ejecutar script por partes:', err);
          setScriptExecution({ 
            executing: false, 
            success: false, 
            error: "No se pudo ejecutar el script. Verifica los permisos de tu usuario en Supabase." 
          });
        }
      } else {
        setScriptExecution({ executing: false, success: true, error: null });
        
        // Recargar diagnóstico después de un breve retraso
        setTimeout(() => runDiagnostic(), 1500);
      }
    } catch (error) {
      console.error('Error al ejecutar script:', error);
      setScriptExecution({ 
        executing: false, 
        success: false, 
        error: "Error al ejecutar el script SQL. Verifica la consola para más detalles." 
      });
    }
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Diagnóstico de Supabase</CardTitle>
        <CardDescription>
          Verifica la configuración de tu proyecto Supabase
        </CardDescription>
      </CardHeader>
      <CardContent>
        {diagResults.loading ? (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Ejecutando diagnóstico...</span>
          </div>
        ) : (
          <>
            {diagResults.error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{diagResults.error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">Conexión a Supabase:</span>
                {diagResults.connected ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-1" /> Conectado
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <XCircle className="h-5 w-5 mr-1" /> No conectado
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Tablas:</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between bg-muted p-2 rounded">
                    <span>saved_jobs</span>
                    {diagResults.tablesExist.saved_jobs ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between bg-muted p-2 rounded">
                    <span>job_applications</span>
                    {diagResults.tablesExist.job_applications ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between bg-muted p-2 rounded">
                    <span>jobs</span>
                    {diagResults.tablesExist.jobs ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Buckets:</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between bg-muted p-2 rounded">
                    <span>resumes</span>
                    {diagResults.bucketsExist.resumes ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between bg-muted p-2 rounded">
                    <span>avatars</span>
                    {diagResults.bucketsExist.avatars ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
              </div>

              {/* Sección para verificar y arreglar la columna job_data */}
              {diagResults.tablesExist.job_applications && (
                <div className="space-y-2 mt-4 border-t pt-4">
                  <h3 className="font-medium">Verificar columna job_data:</h3>
                  <div className="bg-muted p-4 rounded">
                    <p className="text-sm mb-2">
                      Comprueba si la columna job_data existe en la tabla job_applications.
                      Esta columna es necesaria para guardar los datos de trabajos aplicados.
                    </p>
                    
                    {columnCheck.checking ? (
                      <div className="flex items-center text-blue-600">
                        <Loader2 className="h-5 w-5 animate-spin mr-1" /> 
                        Verificando...
                      </div>
                    ) : columnCheck.exists ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-1" /> 
                        {columnCheck.fixed 
                          ? "Columna job_data añadida correctamente." 
                          : "La columna job_data ya existe."}
                      </div>
                    ) : columnCheck.error ? (
                      <div>
                        <div className="flex items-center text-red-600 mb-2">
                          <XCircle className="h-5 w-5 mr-1" /> 
                          Error: {columnCheck.error}
                        </div>
                        <Button 
                          onClick={checkAndFixJobDataColumn}
                          size="sm"
                          className="mt-2"
                          disabled={columnCheck.checking}
                        >
                          Intentar nuevamente
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={checkAndFixJobDataColumn}
                        className="mt-2"
                        disabled={columnCheck.checking}
                      >
                        <Database className="mr-2 h-4 w-4" />
                        Verificar y arreglar columna job_data
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {(!diagResults.tablesExist.saved_jobs || !diagResults.tablesExist.job_applications || !diagResults.tablesExist.jobs) && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Tablas faltantes</AlertTitle>
                  <AlertDescription>
                    Algunas tablas requeridas no existen. Puedes crearlas manualmente ejecutando el script SQL o usar el botón a continuación.
                    <div className="mt-4">
                      <Button
                        onClick={executeCreateTablesScript}
                        disabled={scriptExecution.executing}
                        className="flex items-center gap-2"
                      >
                        {scriptExecution.executing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Ejecutando...
                          </>
                        ) : (
                          <>
                            <Database className="h-4 w-4" />
                            Crear tablas automáticamente
                          </>
                        )}
                      </Button>
                      
                      {scriptExecution.success && (
                        <p className="text-green-600 text-sm mt-2">
                          Script ejecutado correctamente. Recargando diagnóstico...
                        </p>
                      )}
                      
                      {scriptExecution.error && (
                        <p className="text-red-600 text-sm mt-2">
                          {scriptExecution.error}
                        </p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {(!diagResults.bucketsExist.resumes || !diagResults.bucketsExist.avatars) && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Buckets faltantes</AlertTitle>
                  <AlertDescription>
                    Debes crear los buckets necesarios en Supabase. Sigue las instrucciones en el archivo <code>INSTRUCCIONES_SUPABASE.md</code>.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Button
              onClick={runDiagnostic}
              className="mt-6 w-full"
              disabled={diagResults.loading}
            >
              {diagResults.loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ejecutando...
                </>
              ) : (
                "Ejecutar diagnóstico nuevamente"
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SupabaseDiagnostic; 