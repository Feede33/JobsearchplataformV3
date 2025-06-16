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

              {(!diagResults.tablesExist.saved_jobs || !diagResults.tablesExist.job_applications) && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Tablas faltantes</AlertTitle>
                  <AlertDescription>
                    Debes crear las tablas necesarias en Supabase. Sigue las instrucciones en el archivo <code>INSTRUCCIONES_SUPABASE.md</code> y ejecuta el script SQL en <code>supabase_tables.sql</code>.
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