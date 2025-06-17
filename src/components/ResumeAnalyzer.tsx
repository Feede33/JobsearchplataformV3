import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { analyzeResume, extractTextFromResume, saveResumeAnalysis } from "@/lib/resumeAnalyzer";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Loader2, CheckCircle, AlertCircle, XCircle, FileText, Upload, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumeAnalyzerProps {
  jobData: any;
  onComplete?: (result: any) => void;
}

const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ jobData, onComplete }) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    keywords: false,
    suggestions: true,
    strengths: true
  });

  // Manejar cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Verificar tipo de archivo
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Formato de archivo no soportado. Por favor, sube un PDF, DOC, DOCX o TXT.");
        return;
      }
      
      // Verificar tamaño (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("El archivo es demasiado grande. Máximo 5MB.");
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  // Manejar cambio de texto
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
  };

  // Analizar CV
  const handleAnalyze = async () => {
    if (!user) {
      setError("Debes iniciar sesión para analizar tu CV.");
      return;
    }

    if (activeTab === "upload" && !file) {
      setError("Por favor, selecciona un archivo de CV.");
      return;
    }

    if (activeTab === "paste" && resumeText.trim().length < 50) {
      setError("El texto del CV es demasiado corto para un análisis significativo.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      
      // Obtener texto del CV según el método seleccionado
      let textToAnalyze = "";
      
      if (activeTab === "upload" && file) {
        textToAnalyze = await extractTextFromResume(file);
      } else {
        textToAnalyze = resumeText;
      }
      
      // Realizar análisis
      const result = await analyzeResume(textToAnalyze, jobData);
      setAnalysisResult(result);
      
      // Guardar análisis en la base de datos
      if (user) {
        await saveResumeAnalysis(user.id, jobData.id, result);
      }
      
      // Llamar al callback si existe
      if (onComplete) {
        onComplete(result);
      }
    } catch (err) {
      console.error("Error al analizar CV:", err);
      setError("Ocurrió un error al analizar el CV. Por favor, inténtalo de nuevo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Alternar secciones expandidas
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Función para renderizar el nivel de compatibilidad
  const renderMatchLevel = (score: number) => {
    if (score >= 80) {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Compatibilidad Alta</span>
        </div>
      );
    } else if (score >= 60) {
      return (
        <div className="flex items-center text-amber-600">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Compatibilidad Media</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-red-600">
          <XCircle className="h-5 w-5 mr-2" />
          <span>Compatibilidad Baja</span>
        </div>
      );
    }
  };

  // Función para obtener el color de la barra de progreso
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-amber-600";
    return "bg-red-600";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Analizador de CV</CardTitle>
        <CardDescription>
          Analiza la compatibilidad de tu CV con este trabajo y obtén sugerencias para mejorarlo
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!analysisResult ? (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Subir CV</TabsTrigger>
                <TabsTrigger value="paste">Pegar texto</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-4 mt-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <FileText className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    Arrastra y suelta tu CV aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Formatos soportados: PDF, DOC, DOCX, TXT (Max. 5MB)
                  </p>
                  <input
                    type="file"
                    id="resume-file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => document.getElementById("resume-file")?.click()}
                    className="mx-auto"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Seleccionar archivo
                  </Button>
                  
                  {file && (
                    <div className="mt-4 p-2 bg-muted rounded flex items-center justify-between">
                      <span className="text-sm truncate max-w-[80%]">{file.name}</span>
                      <Badge variant="outline">{(file.size / 1024).toFixed(0)} KB</Badge>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="paste" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="resume-text" className="text-sm font-medium">
                    Pega el contenido de tu CV
                  </label>
                  <textarea
                    id="resume-text"
                    className="w-full min-h-[200px] p-3 border rounded-md"
                    placeholder="Pega aquí el texto de tu CV..."
                    value={resumeText}
                    onChange={handleTextChange}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Puntuación de compatibilidad</h3>
                {renderMatchLevel(analysisResult.score)}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Compatibilidad con el trabajo</span>
                  <span className="font-medium">{analysisResult.score}%</span>
                </div>
                <Progress 
                  value={analysisResult.score} 
                  className={cn("h-2", getProgressColor(analysisResult.score))}
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Coincidencia de palabras clave</span>
                  <span className="font-medium">{analysisResult.matchPercentage}%</span>
                </div>
                <Progress 
                  value={analysisResult.matchPercentage} 
                  className={cn("h-2", getProgressColor(analysisResult.matchPercentage))}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Sección de palabras clave */}
              <div className="border rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between p-3 bg-muted cursor-pointer"
                  onClick={() => toggleSection("keywords")}
                >
                  <h3 className="font-medium">Palabras clave</h3>
                  {expandedSections.keywords ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
                
                {expandedSections.keywords && (
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Palabras clave encontradas ({analysisResult.keywordMatches.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.keywordMatches.length > 0 ? (
                          analysisResult.keywordMatches.map((keyword: string, index: number) => (
                            <Badge key={index} variant="secondary">{keyword}</Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No se encontraron palabras clave</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Palabras clave faltantes (Top 10)</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.missingKeywords.length > 0 ? (
                          analysisResult.missingKeywords.map((keyword: string, index: number) => (
                            <Badge key={index} variant="outline">{keyword}</Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">¡Excelente! No faltan palabras clave importantes</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sección de sugerencias */}
              <div className="border rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between p-3 bg-muted cursor-pointer"
                  onClick={() => toggleSection("suggestions")}
                >
                  <h3 className="font-medium">Sugerencias de mejora</h3>
                  {expandedSections.suggestions ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
                
                {expandedSections.suggestions && (
                  <div className="p-4">
                    {analysisResult.suggestions.length > 0 ? (
                      <ul className="space-y-3">
                        {analysisResult.suggestions.map((suggestion: any, index: number) => (
                          <li key={index} className="flex gap-3">
                            {suggestion.severity === 'high' ? (
                              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            ) : suggestion.severity === 'medium' ? (
                              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            )}
                            <span>{suggestion.message}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">¡Tu CV parece estar en excelente forma! No tenemos sugerencias adicionales.</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Sección de fortalezas */}
              <div className="border rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between p-3 bg-muted cursor-pointer"
                  onClick={() => toggleSection("strengths")}
                >
                  <h3 className="font-medium">Fortalezas detectadas</h3>
                  {expandedSections.strengths ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
                
                {expandedSections.strengths && (
                  <div className="p-4">
                    {analysisResult.strengths.length > 0 ? (
                      <ul className="space-y-3">
                        {analysisResult.strengths.map((strength: string, index: number) => (
                          <li key={index} className="flex gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No se detectaron fortalezas específicas. Considera mejorar tu CV siguiendo las sugerencias.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {!analysisResult ? (
          <>
            <Button variant="outline" onClick={() => window.history.back()}>
              Cancelar
            </Button>
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analizando...
                </>
              ) : (
                "Analizar CV"
              )}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setAnalysisResult(null)}>
              Nuevo análisis
            </Button>
            <Button onClick={() => window.history.back()}>
              Continuar
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ResumeAnalyzer;