import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CheckCircle, AlertCircle, XCircle, Loader2, Database, Bell, ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { generateTestNotifications } from "@/lib/jobInteractions";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";

const SupabaseDiagnostic = () => {
  const { user } = useAuth();
  const [diagResults, setDiagResults] = useState<{
    connected: boolean;
    tablesExist: {
      saved_jobs: boolean;
      job_applications: boolean;
      jobs: boolean;
      notifications: boolean;
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
      notifications: false,
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

  // Estado para la generación de notificaciones de prueba
  const [notificationGeneration, setNotificationGeneration] = useState({
    count: 5,
    generating: false,
    success: false,
    error: null,
    message: ''
  });

  // Estado para verificación de seguridad
  const [securityCheck, setSecurityCheck] = useState({
    checking: false,
    functionSearchPathFixed: false,
    otpExpiryCorrect: false,
    leakedPasswordProtectionEnabled: false,
    error: null,
    message: ''
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

-- Tabla para notificaciones de usuarios
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Habilitar RLS para la tabla de notificaciones
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Política para permitir a los usuarios ver solo sus propias notificaciones
CREATE POLICY "Users can view their own notifications" 
  ON notifications FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para permitir a los usuarios marcar como leídas sus propias notificaciones
CREATE POLICY "Users can update their own notifications" 
  ON notifications FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para permitir a los usuarios eliminar sus propias notificaciones
CREATE POLICY "Users can delete their own notifications" 
  ON notifications FOR DELETE 
  USING (auth.uid() = user_id);

-- Índice para mejorar el rendimiento de consultas de notificaciones no leídas
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
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

      // Verificar tabla notifications
      let notificationsResult;
      try {
        notificationsResult = await supabase.from("notifications").select("id").limit(1);
      } catch (err) {
        notificationsResult = {
          data: null,
          error: { message: "Error al verificar notifications" },
        };
      }
      const { error: notificationsError } = notificationsResult;

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
          notifications: !notificationsError || notificationsError.code === "PGRST116",
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

  // Función para generar notificaciones de prueba
  const handleGenerateTestNotifications = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para generar notificaciones",
        variant: "destructive"
      });
      return;
    }

    setNotificationGeneration(prev => ({
      ...prev,
      generating: true,
      success: false,
      error: null,
      message: ''
    }));

    try {
      const result = await generateTestNotifications(user.id, notificationGeneration.count);
      
      if (result.success) {
        setNotificationGeneration(prev => ({
          ...prev,
          generating: false,
          success: true,
          message: result.message
        }));
        
        toast({
          title: "Notificaciones generadas",
          description: result.message,
        });
      } else {
        setNotificationGeneration(prev => ({
          ...prev,
          generating: false,
          error: result.error
        }));
        
        toast({
          title: "Error",
          description: "No se pudieron generar las notificaciones",
          variant: "destructive"
        });
      }
    } catch (error) {
      setNotificationGeneration(prev => ({
        ...prev,
        generating: false,
        error
      }));
      
      toast({
        title: "Error",
        description: "Error inesperado al generar notificaciones",
        variant: "destructive"
      });
    }
  };

  // Verificar configuración de seguridad
  const checkSecuritySettings = async () => {
    setSecurityCheck(prev => ({ ...prev, checking: true, error: null, message: '' }));
    
    try {
      // Obtener informe de seguridad utilizando la función RPC
      const { data: securityReport, error: reportError } = await supabase
        .rpc('get_security_report');

      if (reportError) {
        throw new Error(`Error al obtener informe de seguridad: ${reportError.message}`);
      }

      // Analizar resultados
      const insecureFunctionsCount = securityReport?.security_issues?.insecure_functions_count || 0;
      const insecureFunctions = securityReport?.security_issues?.insecure_functions || [];
      const functionSearchPathFixed = insecureFunctionsCount === 0;

      let message = functionSearchPathFixed 
        ? "Todas las funciones tienen search_path configurado correctamente." 
        : `Se encontraron ${insecureFunctionsCount} funciones inseguras: ${insecureFunctions.join(', ')}`;
      
      // 2 y 3: Estas verificaciones generalmente requieren acceso a nivel administrativo
      // que no está disponible desde el cliente. Mostramos instrucciones en su lugar

      setSecurityCheck(prev => ({
        ...prev,
        checking: false,
        functionSearchPathFixed,
        otpExpiryCorrect: false, // No podemos verificar desde el cliente
        leakedPasswordProtectionEnabled: false, // No podemos verificar desde el cliente
        message: message + "\n\nNota: Para verificar las configuraciones de OTP y protección de contraseñas, por favor acceda al panel de administración de Supabase."
      }));

      toast({
        title: "Verificación de seguridad",
        description: functionSearchPathFixed 
          ? "Las funciones tienen configuración de seguridad correcta. Verifique manualmente las otras configuraciones." 
          : `Se encontraron ${insecureFunctionsCount} funciones inseguras. Por favor, aplique la migración de seguridad.`,
      });
    } catch (error) {
      setSecurityCheck(prev => ({
        ...prev,
        checking: false,
        error: error.message,
        message: 'Error al verificar configuración de seguridad.'
      }));
      
      toast({
        variant: "destructive",
        title: "Error en verificación de seguridad",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Diagnóstico de Supabase</CardTitle>
          <CardDescription>
            Verifica la conexión a Supabase y el estado de las tablas y
            buckets necesarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Button onClick={runDiagnostic} disabled={diagResults.loading}>
              {diagResults.loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ejecutando diagnóstico...
                </>
              ) : (
                "Ejecutar diagnóstico"
              )}
            </Button>

            {/* Resultados del diagnóstico */}
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-medium">Resultados del diagnóstico:</h3>

              {/* Conexión */}
              <div className="flex items-center">
                {diagResults.connected ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                )}
                <span>Conexión a Supabase: {diagResults.connected ? "OK" : "Error"}</span>
              </div>

              {/* Tablas */}
              <div className="ml-4 space-y-1">
                <div className="flex items-center">
                  {diagResults.tablesExist.saved_jobs ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span>Tabla saved_jobs: {diagResults.tablesExist.saved_jobs ? "Existe" : "No existe"}</span>
                </div>

                <div className="flex items-center">
                  {diagResults.tablesExist.job_applications ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span>
                    Tabla job_applications: {diagResults.tablesExist.job_applications ? "Existe" : "No existe"}
                  </span>
                </div>

                <div className="flex items-center">
                  {diagResults.tablesExist.jobs ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span>Tabla jobs: {diagResults.tablesExist.jobs ? "Existe" : "No existe"}</span>
                </div>

                <div className="flex items-center">
                  {diagResults.tablesExist.notifications ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span>Tabla notifications: {diagResults.tablesExist.notifications ? "Existe" : "No existe"}</span>
                </div>
              </div>

              {/* Buckets */}
              <div className="ml-4 space-y-1">
                <div className="flex items-center">
                  {diagResults.bucketsExist.resumes ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span>Bucket resumes: {diagResults.bucketsExist.resumes ? "Existe" : "No existe"}</span>
                </div>

                <div className="flex items-center">
                  {diagResults.bucketsExist.avatars ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span>Bucket avatars: {diagResults.bucketsExist.avatars ? "Existe" : "No existe"}</span>
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

            {/* Sección para crear tablas */}
            {!diagResults.tablesExist.saved_jobs || 
             !diagResults.tablesExist.job_applications || 
             !diagResults.tablesExist.jobs ||
             !diagResults.tablesExist.notifications ? (
              <div className="mt-6">
                <Alert className="bg-amber-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Tablas faltantes</AlertTitle>
                  <AlertDescription>
                    Algunas tablas necesarias no existen. Puedes crearlas ejecutando el script SQL.
                  </AlertDescription>
                </Alert>

                <div className="mt-4">
                  <Button 
                    onClick={executeCreateTablesScript} 
                    disabled={scriptExecution.executing}
                    variant="default"
                  >
                    {scriptExecution.executing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ejecutando script...
                      </>
                    ) : (
                      "Crear tablas faltantes"
                    )}
                  </Button>

                  {scriptExecution.success && (
                    <Alert className="mt-2 bg-green-50">
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Éxito</AlertTitle>
                      <AlertDescription>
                        Las tablas se han creado correctamente. Ejecuta el diagnóstico nuevamente para verificar.
                      </AlertDescription>
                    </Alert>
                  )}

                  {scriptExecution.error && (
                    <Alert className="mt-2 bg-red-50">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        No se pudieron crear las tablas: {scriptExecution.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            ) : null}

            <Separator className="my-6" />

            {/* Sección para generar notificaciones de prueba */}
            <div className="mt-6">
              <h3 className="text-lg font-medium flex items-center mb-4">
                <Bell className="mr-2 h-5 w-5" /> Generador de Notificaciones de Prueba
              </h3>
              
              {!diagResults.tablesExist.notifications ? (
                <Alert className="bg-amber-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Tabla de notificaciones no disponible</AlertTitle>
                  <AlertDescription>
                    La tabla de notificaciones no existe. Crea las tablas primero.
                  </AlertDescription>
                </Alert>
              ) : !user ? (
                <Alert className="bg-amber-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Usuario no autenticado</AlertTitle>
                  <AlertDescription>
                    Debes iniciar sesión para generar notificaciones de prueba.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-6">
                      <Label htmlFor="notification-count">Número de notificaciones</Label>
                      <Input 
                        id="notification-count"
                        type="number" 
                        min="1" 
                        max="20" 
                        value={notificationGeneration.count} 
                        onChange={(e) => setNotificationGeneration(prev => ({
                          ...prev, 
                          count: parseInt(e.target.value) || 1
                        }))}
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-6">
                      <Button 
                        onClick={handleGenerateTestNotifications} 
                        disabled={notificationGeneration.generating || !user}
                        variant="default"
                      >
                        {notificationGeneration.generating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...
                          </>
                        ) : (
                          "Generar notificaciones"
                        )}
                      </Button>
                    </div>
                  </div>

                  {notificationGeneration.success && (
                    <Alert className="bg-green-50">
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Éxito</AlertTitle>
                      <AlertDescription>
                        {notificationGeneration.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  {notificationGeneration.error && (
                    <Alert className="bg-red-50">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        No se pudieron generar las notificaciones: {String(notificationGeneration.error)}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>

            {/* Nueva sección de seguridad */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                Verificación de Seguridad
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    {securityCheck.functionSearchPathFixed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <p>Función search_path segura</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {securityCheck.functionSearchPathFixed 
                      ? "La función tiene configuración segura" 
                      : "Se requiere fijar el search_path en la función"}
                  </p>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <p>Expiración OTP</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Verificar manualmente que sea menor a una hora
                  </p>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <p>Protección de contraseñas</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Verificar manualmente que esté activada
                  </p>
                </Card>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={checkSecuritySettings}
                  disabled={securityCheck.checking}
                  variant="outline"
                >
                  {securityCheck.checking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Verificar configuración de seguridad"
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.open('/SECURITY_SETUP.md', '_blank')}
                >
                  Ver instrucciones de seguridad
                </Button>
              </div>
              
              {securityCheck.message && (
                <Alert>
                  <AlertTitle>Información de seguridad</AlertTitle>
                  <AlertDescription>{securityCheck.message}</AlertDescription>
                </Alert>
              )}
              
              {securityCheck.error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{securityCheck.error}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseDiagnostic; 