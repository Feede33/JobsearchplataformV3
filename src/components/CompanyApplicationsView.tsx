import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ArrowLeft,
  FileText,
  ExternalLink,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  AlertCircle,
  Download,
  User,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface Application {
  id: string;
  user_id: string;
  job_id: number;
  cover_letter: string | null;
  resume_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  application_date: string;
  user_profile: {
    id: string;
    email: string | null;
    name: string | null;
    avatar_url: string | null;
  } | null;
  job_data: {
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
  } | null;
}

const CompanyApplicationsView: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { user, isCompany } = useAuth();
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Verificar si el usuario es una empresa
  useEffect(() => {
    if (!isCompany) {
      toast({
        title: "Acceso denegado",
        description: "Esta sección es solo para empresas.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isCompany, navigate]);

  // Cargar detalles del trabajo
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId || !user?.id) return;

      try {
        const numericJobId = parseInt(jobId, 10);
        if (isNaN(numericJobId)) {
          throw new Error("ID de trabajo inválido");
        }

        const { data: jobData, error: jobError } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", numericJobId)
          .eq("company_id", user.id)
          .single();

        if (jobError) {
          throw jobError;
        }

        if (!jobData) {
          toast({
            title: "Trabajo no encontrado",
            description: "No se encontró el trabajo especificado o no tienes permisos para verlo.",
            variant: "destructive",
          });
          navigate("/company/jobs");
          return;
        }

        setJobDetails(jobData);
      } catch (error) {
        console.error("Error al cargar detalles del trabajo:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los detalles del trabajo.",
          variant: "destructive",
        });
        navigate("/company/jobs");
      }
    };

    fetchJobDetails();
  }, [jobId, user?.id, navigate]);

  // Cargar aplicaciones
  useEffect(() => {
    const fetchApplications = async () => {
      if (!jobId || !user?.id) return;

      try {
        const numericJobId = parseInt(jobId, 10);
        if (isNaN(numericJobId)) {
          throw new Error("ID de trabajo inválido");
        }

        // Verificar primero que el trabajo pertenece a la empresa
        const { data: jobCheck, error: jobCheckError } = await supabase
          .from("jobs")
          .select("id")
          .eq("id", numericJobId)
          .eq("company_id", user.id)
          .single();

        if (jobCheckError || !jobCheck) {
          toast({
            title: "Acceso denegado",
            description: "No tienes permisos para ver las aplicaciones de este trabajo.",
            variant: "destructive",
          });
          navigate("/company/jobs");
          return;
        }

        // Obtener las aplicaciones con información de usuario
        const { data, error } = await supabase
          .from("job_applications")
          .select(`
            *,
            user_profile:profiles(id, email, name, avatar_url)
          `)
          .eq("job_id", numericJobId)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setApplications(data || []);
      } catch (error) {
        console.error("Error al cargar aplicaciones:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las aplicaciones.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId, user?.id, navigate]);

  // Actualizar estado de una aplicación
  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    if (updatingStatus) return;
    
    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", applicationId);

      if (error) {
        throw error;
      }

      // Actualizar el estado local
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));

      if (selectedApplication && selectedApplication.id === applicationId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus });
      }

      toast({
        title: "Estado actualizado",
        description: `La aplicación ha sido marcada como "${newStatus}".`,
      });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la aplicación.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Ver detalles de una aplicación
  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setDetailsOpen(true);
  };

  // Descargar CV
  const handleDownloadResume = (url: string, applicantName: string) => {
    if (!url) return;

    const fileName = `CV_${applicantName.replace(/\s+/g, '_')}.pdf`;
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al descargar el archivo');
        }
        return response.blob();
      })
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(error => {
        console.error('Error al descargar el CV:', error);
        toast({
          title: "Error",
          description: "No se pudo descargar el CV. Intenta de nuevo más tarde.",
          variant: "destructive",
        });
      });
  };

  // Obtener color según estado
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

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/company/jobs")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a mis ofertas
        </Button>
        <h1 className="text-2xl font-bold">Aplicaciones para {jobDetails?.title}</h1>
      </div>

      {jobDetails && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{jobDetails.title}</CardTitle>
            <CardDescription>{jobDetails.company}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{jobDetails.location}</span>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{jobDetails.type}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Publicado: {new Date(jobDetails.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {applications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No hay aplicaciones</h2>
            <p className="text-muted-foreground text-center">
              Aún no has recibido aplicaciones para esta oferta laboral.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage 
                        src={application.user_profile?.avatar_url || undefined} 
                        alt={application.user_profile?.name || "Usuario"} 
                      />
                      <AvatarFallback>
                        {application.user_profile?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {application.user_profile?.name || "Usuario"}
                      </CardTitle>
                      <CardDescription>
                        {application.user_profile?.email || "Email no disponible"}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Aplicó el {new Date(application.application_date).toLocaleDateString()}
                </div>
                {application.cover_letter && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-1">Carta de presentación:</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {application.cover_letter}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDetails(application)}
                >
                  Ver detalles
                </Button>
                <Select
                  value={application.status}
                  onValueChange={(value) => updateApplicationStatus(application.id, value)}
                  disabled={updatingStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Cambiar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="reviewed">Revisado</SelectItem>
                    <SelectItem value="interview">Entrevista</SelectItem>
                    <SelectItem value="rejected">Rechazado</SelectItem>
                    <SelectItem value="accepted">Aceptado</SelectItem>
                  </SelectContent>
                </Select>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Diálogo de detalles de aplicación */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles de la aplicación</DialogTitle>
            <DialogDescription>
              Información completa del candidato y su aplicación.
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage 
                    src={selectedApplication.user_profile?.avatar_url || undefined} 
                    alt={selectedApplication.user_profile?.name || "Usuario"} 
                  />
                  <AvatarFallback className="text-lg">
                    {selectedApplication.user_profile?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-medium">
                    {selectedApplication.user_profile?.name || "Usuario"}
                  </h2>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-3 w-3 mr-1" />
                    {selectedApplication.user_profile?.email || "Email no disponible"}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-1">Estado actual:</h3>
                <Badge className={getStatusColor(selectedApplication.status)}>
                  {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Fecha de aplicación:</h3>
                <p className="text-sm">
                  {new Date(selectedApplication.application_date).toLocaleDateString()}
                </p>
              </div>
              
              {selectedApplication.cover_letter && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Carta de presentación:</h3>
                  <div className="p-3 bg-gray-50 rounded-md text-sm max-h-40 overflow-y-auto">
                    {selectedApplication.cover_letter}
                  </div>
                </div>
              )}
              
              {selectedApplication.resume_url && (
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">CV / Curriculum:</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedApplication.resume_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadResume(
                        selectedApplication.resume_url || "",
                        selectedApplication.user_profile?.name || "candidato"
                      )}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </Button>
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Cambiar estado:</h3>
                <Select
                  value={selectedApplication.status}
                  onValueChange={(value) => updateApplicationStatus(selectedApplication.id, value)}
                  disabled={updatingStatus}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="reviewed">Revisado</SelectItem>
                    <SelectItem value="interview">Entrevista</SelectItem>
                    <SelectItem value="rejected">Rechazado</SelectItem>
                    <SelectItem value="accepted">Aceptado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyApplicationsView;
