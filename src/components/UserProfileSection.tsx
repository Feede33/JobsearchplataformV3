import React, { useState, useEffect, useRef } from "react";
import { FileUpload } from "./FileUpload";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  BriefcaseIcon,
  BookmarkIcon,
  TrashIcon,
  ExternalLinkIcon,
  ArrowLeft,
  LoaderCircle,
  Eye,
  EyeOff,
  Download,
  AlertCircle,
  Send,
  FileText,
  CheckCircle,
  MapPin,
  DollarSign,
  Upload
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/lib/SupabaseContext";
import { useNavigate } from "react-router-dom";
import { getSavedJobs, getUserApplications, unsaveJob, applyToJob, uploadResume } from "@/lib/jobInteractions";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import NotificationCenter from './NotificationCenter';

interface Application {
  id: string;
  jobId?: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  appliedDate: string;
  status: "pending" | "reviewed" | "interview" | "rejected" | "accepted";
  coverLetter?: string;
  resumeUrl?: string;
}

interface SavedJob {
  id: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  location: string;
  salary: string;
  employmentType: string;
  savedDate: string;
  savedJobId?: string;
}

interface UserProfileSectionProps {
  applications?: Application[];
  savedJobs?: SavedJob[];
}

const UserProfileSection = ({
  applications = [],
  savedJobs = [],
}: UserProfileSectionProps) => {
  const { user } = useAuth();
  const { user: supabaseUser } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estados para el CV
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [activeApplications, setActiveApplications] = useState<Application[]>(applications);
  const [activeSavedJobs, setActiveSavedJobs] = useState<SavedJob[]>(savedJobs);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Estados para diálogos y aplicaciones
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [applicationDetailsOpen, setApplicationDetailsOpen] = useState<boolean>(false);
  const [selectedSavedJob, setSelectedSavedJob] = useState<SavedJob | null>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState<boolean>(false);
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [applyResumeFile, setApplyResumeFile] = useState<File | null>(null);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          // Cargar trabajos guardados
          const savedJobsData = await getSavedJobs(user.id);
          setActiveSavedJobs(savedJobsData.map(job => ({
            id: job.id || job.jobId,
            jobTitle: job.jobTitle || "Título no disponible",
            companyName: job.companyName || "Empresa no disponible",
            companyLogo: job.companyLogo || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback",
            location: job.location || "Ubicación no disponible",
            salary: job.salary || "Salario no disponible",
            employmentType: job.employmentType || "Tipo no disponible",
            savedDate: job.savedDate || new Date().toISOString(),
            savedJobId: job.savedJobId
          })));

          // Cargar aplicaciones
          const applicationsData = await getUserApplications(user.id);
          setActiveApplications(applicationsData.map(app => ({
            id: app.id,
            jobId: app.jobId,
            jobTitle: app.jobTitle || "Título no disponible",
            companyName: app.companyName || "Empresa no disponible",
            companyLogo: app.companyLogo || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback",
            appliedDate: app.appliedDate || new Date().toISOString(),
            status: app.status || "pending",
            coverLetter: app.coverLetter,
            resumeUrl: app.resumeUrl
          })));
        } catch (error) {
          console.error("Error al cargar datos de usuario:", error);
          toast({
            title: "Error",
            description: "No se pudieron cargar tus datos. Por favor, intenta de nuevo más tarde.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserData();
  }, [user]);

  // Manejadores de eventos
  const handleUploadComplete = (url: string, fileName?: string) => {
    setResumeUrl(url);
    setResumeError(null);
    setLoadingPdf(false);
    if (fileName) {
      setResumeFileName(fileName);
    }
    setShowPreview(false);
  };

  const handleUploadError = (error: Error) => {
    setResumeError(error.message);
  };

  const handleDownloadCV = () => {
    if (resumeUrl) {
      try {
        fetch(resumeUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al descargar el archivo');
            }
            return response.blob();
          })
          .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = blobUrl;
            
            link.setAttribute('download', resumeFileName || 'curriculum.pdf');
            
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
              window.URL.revokeObjectURL(blobUrl);
              document.body.removeChild(link);
            }, 100);
          })
          .catch(error => {
            console.error('Error al descargar el CV:', error);
            setResumeError('No se pudo descargar el archivo. Intenta de nuevo más tarde.');
          });
      } catch (error) {
        console.error('Error al descargar el CV:', error);
        setResumeError('No se pudo descargar el archivo. Intenta de nuevo más tarde.');
      }
    }
  };

  const handleViewPDF = () => {
    if (resumeUrl) {
      setShowPreview(true);
      setLoadingPdf(true);
    } else {
      setResumeError("No hay CV para previsualizar. Sube un archivo primero.");
    }
  };

  const handleHidePDF = () => {
    setShowPreview(false);
  };

  const togglePreview = () => {
    if (showPreview) {
      handleHidePDF();
    } else {
      handleViewPDF();
    }
  };

  const removeApplication = (id: string) => {
    // Aquí se podría implementar la eliminación de la aplicación en Supabase
    setActiveApplications(activeApplications.filter((app) => app.id !== id));
    toast({
      title: "Aplicación eliminada",
      description: "La aplicación ha sido eliminada de tu lista"
    });
  };

  const removeSavedJob = async (id: string) => {
    if (!user) return;
    
    try {
      // Primero eliminar de Supabase
      const job = activeSavedJobs.find(job => job.id === id);
      if (job) {
        const { success, error } = await unsaveJob(user.id, id);
        
        if (success) {
          // Luego actualizar el estado local
          setActiveSavedJobs(activeSavedJobs.filter((job) => job.id !== id));
          toast({
            title: "Trabajo eliminado",
            description: "El trabajo ha sido eliminado de tus favoritos"
          });
        } else if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error al eliminar trabajo guardado:", error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al eliminar el trabajo",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "interview":
        return "bg-purple-100 text-purple-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Función para manejar la visualización de detalles de aplicación
  const handleViewApplicationDetails = (application: Application) => {
    setSelectedApplication(application);
    setApplicationDetailsOpen(true);
  };

  // Función para preparar la aplicación a un trabajo guardado
  const handleApplyToSavedJob = (job: SavedJob) => {
    setSelectedSavedJob(job);
    setCoverLetter("");
    setApplyResumeFile(null);
    setApplyDialogOpen(true);
  };

  // Función para manejar cambios en el archivo de CV para aplicación
  const handleApplyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tipo de archivo (PDF, DOC, DOCX)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Tipo de archivo no permitido",
          description: "Por favor, sube un archivo PDF, DOC o DOCX",
          variant: "destructive",
        });
        return;
      }
      
      // Validar tamaño (máx 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB en bytes
      if (file.size > maxSize) {
        toast({
          title: "Archivo demasiado grande",
          description: "El tamaño máximo permitido es 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setApplyResumeFile(file);
      toast({
        title: "Archivo seleccionado",
        description: file.name,
      });
    }
  };

  // Función para enviar aplicación a un trabajo guardado
  const handleSubmitApplication = async () => {
    if (!user || !selectedSavedJob || !applyResumeFile) {
      toast({
        title: "Error",
        description: "Debes subir tu CV para aplicar a este trabajo",
        variant: "destructive",
      });
      return;
    }
    
    setIsApplying(true);
    
    try {
      // Preparar datos del trabajo a partir del trabajo guardado
      const jobData = {
        jobTitle: selectedSavedJob.jobTitle,
        companyName: selectedSavedJob.companyName,
        companyLogo: selectedSavedJob.companyLogo,
        location: selectedSavedJob.location,
        salary: selectedSavedJob.salary,
        employmentType: selectedSavedJob.employmentType,
        id: selectedSavedJob.id
      };
      
      const { success, error } = await applyToJob(user.id, selectedSavedJob.id, {
        coverLetter,
        resumeFile: applyResumeFile,
        jobData
      });
      
      if (success) {
        toast({
          title: "Aplicación enviada",
          description: "Tu aplicación ha sido enviada correctamente",
        });
        
        // Actualizar la lista de aplicaciones
        const updatedApplications = await getUserApplications(user.id);
        setActiveApplications(updatedApplications);
        
        // Cerrar el diálogo
        setApplyDialogOpen(false);
        setCoverLetter("");
        setApplyResumeFile(null);
      } else {
        toast({
          title: "Error",
          description: error || "Ha ocurrido un error al enviar tu aplicación",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al aplicar al trabajo:", error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al enviar tu aplicación",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Button>
            <h1 className="text-2xl font-bold text-primary">My Profile</h1>
          </div>
          <div className="flex items-center gap-3">
            <NotificationCenter />
          </div>
        </div>
      </header>

      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6 mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-grow">
            <h1 className="text-2xl font-bold">{user?.name || "User"}</h1>
            <p className="text-gray-600">{user?.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {user?.skills?.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              )) || (
                <>
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">JavaScript</Badge>
                  <Badge variant="outline">Node.js</Badge>
                </>
              )}
            </div>
            <div className="mt-4">
              {/* Sección de botones de perfil */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </div>
              
              {/* Sección de CV con mejor organización */}
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium mb-3">Curriculum Vitae</h3>
                <div className="flex flex-col gap-3">
                  {/* Primera fila: Botón de subir CV y nombre del archivo */}
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <FileUpload
                        bucket="resumes"
                        acceptedFileTypes="application/pdf"
                        onUploadComplete={handleUploadComplete}
                        onUploadError={handleUploadError}
                        className="inline-block"
                      />
                    </div>
                    
                    {/* Mostrar el nombre del archivo al lado del botón */}
                    {resumeUrl && (
                      <span className="ml-3 text-sm text-gray-600">
                        {resumeFileName || "curriculum.pdf"}
                      </span>
                    )}
                  </div>
                  
                  {/* Segunda fila: Botones de acción */}
                  {resumeUrl && (
                    <div className="flex items-center gap-3">
                      {/* Botón para previsualizar CV */}
                      {!showPreview ? (
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={handleViewPDF}
                          className="inline-flex items-center"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver CV
                        </Button>
                      ) : (
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={handleHidePDF}
                          className="inline-flex items-center"
                        >
                          <EyeOff className="mr-2 h-4 w-4" />
                          Ocultar CV
                        </Button>
                      )}
                      
                      {/* Botón para descargar CV si está disponible */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="inline-flex items-center"
                        onClick={handleDownloadCV}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Descargar CV
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Mensaje de error */}
                {resumeError && (
                  <div className="mt-2 p-3 bg-red-50 text-red-600 rounded-md">
                    <p className="text-sm">{resumeError}</p>
                  </div>
                )}
              </div>
              
              {/* Previsualización del PDF */}
              {resumeUrl && showPreview && (
                <Card className="w-full mt-4">
                  <CardHeader>
                    <CardTitle>Vista previa de tu CV</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div style={{ height: '480px' }} className="overflow-auto rounded border">
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        {loadingPdf && (
                          <div className="flex items-center justify-center h-full">
                            <LoaderCircle className="h-8 w-8 animate-spin text-gray-400" />
                            <span className="ml-2">Cargando documento...</span>
                          </div>
                        )}
                        <Viewer 
                          fileUrl={resumeUrl} 
                          plugins={[defaultLayoutPluginInstance]} 
                          onDocumentLoad={() => setLoadingPdf(false)}
                          renderError={(error) => (
                            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                              <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                              <h3 className="text-lg font-medium text-red-600">Error al cargar el PDF</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                No se pudo cargar el documento. Intenta descargarlo o sube otro archivo.
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{error.message}</p>
                            </div>
                          )}
                        />
                      </Worker>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        <Tabs
          defaultValue="applications"
          className="w-full bg-white rounded-lg shadow-sm"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="applications" className="text-base">
              <BriefcaseIcon className="mr-2 h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="saved" className="text-base">
              <BookmarkIcon className="mr-2 h-4 w-4" />
              Saved Jobs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {activeApplications.length > 0 ? (
                activeApplications.map((application) => (
                  <Card key={application.id} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage
                            src={application.companyLogo}
                            alt={application.companyName}
                          />
                          <AvatarFallback>
                            {application.companyName.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">
                            {application.jobTitle}
                          </CardTitle>
                          <CardDescription>
                            {application.companyName}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}
                        >
                          {application.status.charAt(0).toUpperCase() +
                            application.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Applied on{" "}
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewApplicationDetails(application)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeApplication(application.id)}
                      >
                        <TrashIcon className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No applications yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start applying to jobs to track your applications here.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => navigate("/")}>Browse Jobs</Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {activeSavedJobs.length > 0 ? (
                activeSavedJobs.map((job) => (
                  <Card key={job.id} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage
                            src={job.companyLogo}
                            alt={job.companyName}
                          />
                          <AvatarFallback>
                            {job.companyName.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">
                            {job.jobTitle}
                          </CardTitle>
                          <CardDescription>{job.companyName}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <BriefcaseIcon className="h-4 w-4 mr-1" />
                          {job.employmentType}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Saved on {new Date(job.savedDate).toLocaleDateString()}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        className="flex items-center"
                        onClick={() => handleApplyToSavedJob(job)}
                      >
                        Apply Now <ExternalLinkIcon className="ml-1 h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSavedJob(job.id)}
                      >
                        <TrashIcon className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <BookmarkIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No saved jobs
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Save jobs you're interested in to apply later.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => navigate("/")}>Browse Jobs</Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Diálogo para ver detalles de la aplicación */}
      <Dialog open={applicationDetailsOpen} onOpenChange={setApplicationDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles de Aplicación</DialogTitle>
            <DialogDescription>
              Detalles de tu aplicación para {selectedApplication?.jobTitle} en {selectedApplication?.companyName}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                  <img 
                    src={selectedApplication?.companyLogo} 
                    alt={selectedApplication?.companyName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{selectedApplication?.jobTitle}</h3>
                  <p className="text-sm text-gray-500">{selectedApplication?.companyName}</p>
                </div>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedApplication ? getStatusColor(selectedApplication.status) : ''}`}>
                  {selectedApplication?.status.charAt(0).toUpperCase() + selectedApplication?.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Fecha de aplicación</h4>
              <p className="text-sm">
                {selectedApplication?.appliedDate ? new Date(selectedApplication.appliedDate).toLocaleDateString() : 'No disponible'}
              </p>
            </div>
            
            {selectedApplication?.coverLetter && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Carta de presentación</h4>
                <div className="p-3 bg-gray-50 rounded-md text-sm">
                  {selectedApplication.coverLetter}
                </div>
              </div>
            )}
            
            {selectedApplication?.resumeUrl && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">CV enviado</h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open(selectedApplication.resumeUrl, '_blank')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Ver CV enviado
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplicationDetailsOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para aplicar a un trabajo guardado */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Aplicar a {selectedSavedJob?.jobTitle}</DialogTitle>
            <DialogDescription>
              Completa el formulario para enviar tu aplicación a {selectedSavedJob?.companyName}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="coverLetter">Carta de presentación</Label>
              <Textarea
                id="coverLetter"
                placeholder="Escribe una breve presentación..."
                className="min-h-[120px]"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                disabled={isApplying}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="resume">CV / Curriculum</Label>
              <div className="flex gap-2">
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleApplyFileChange}
                  disabled={isApplying}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isApplying}
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {applyResumeFile ? applyResumeFile.name : "Subir CV"}
                </Button>
                {applyResumeFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setApplyResumeFile(null)}
                    disabled={isApplying}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Formatos aceptados: PDF, DOC, DOCX. Tamaño máximo: 5MB.
              </p>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setApplyDialogOpen(false)}
              disabled={isApplying}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmitApplication}
              disabled={isApplying || !applyResumeFile}
            >
              {isApplying ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar aplicación
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfileSection;
