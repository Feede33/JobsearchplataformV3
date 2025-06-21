import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, DollarSign, Clock, Share2, Bookmark, Send, Check, Upload, FileText, Copy, Facebook, Twitter, Linkedin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { saveJob, unsaveJob, isJobSaved, applyToJob, hasAppliedToJob, uploadResume } from "@/lib/jobInteractions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface JobListingCardProps {
  id: string;
  companyLogo: string;
  jobTitle: string;
  companyName: string;
  location: string;
  salaryRange: string;
  employmentType: string;
  keyRequirements?: string[];
  postedDate: string;
  className?: string;
  onClick?: () => void;
}

const JobListingCard = ({
  id,
  companyLogo,
  jobTitle,
  companyName,
  location,
  salaryRange,
  employmentType,
  keyRequirements = ["React", "TypeScript", "Node.js"],
  postedDate,
  className = "",
  onClick,
}: JobListingCardProps) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const checkInteractions = async () => {
      if (isAuthenticated && user) {
        console.log("JobListingCard - Verificando interacciones para jobId:", id);
        
        const saved = await isJobSaved(user.id, id);
        setIsSaved(saved);
        
        const applied = await hasAppliedToJob(user.id, id);
        setIsApplied(applied);
      }
    };
    
    checkInteractions();
  }, [isAuthenticated, user, id]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      setResumeFile(file);
      toast({
        title: "Archivo seleccionado",
        description: file.name,
      });
    }
  };
  
  const handleSaveJob = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate("/auth", { state: { returnUrl: window.location.pathname, action: "save-job", jobId: id } });
      return;
    }
    
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      if (!isSaved) {
        // Crear un objeto con los datos del trabajo
        const jobData = {
          id,
          jobTitle,
          companyName,
          companyLogo,
          location,
          salary: salaryRange,
          employmentType,
          postedDate
        };
        
        // Intentamos guardar el trabajo con los datos completos
        const { success, error } = await saveJob(user.id, id, jobData);
        
        if (success) {
          setIsSaved(true);
          toast({
            title: "Trabajo guardado",
            description: "El trabajo ha sido añadido a tus favoritos",
          });
        } else if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
        }
      } else {
        // Intentamos eliminar el trabajo mediante la API
        const { success, error } = await unsaveJob(user.id, id);
        
        if (success) {
          setIsSaved(false);
          toast({
            title: "Trabajo eliminado",
            description: "El trabajo ha sido eliminado de tus favoritos",
          });
        } else if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error al guardar/eliminar trabajo:", error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const openApplyDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate("/auth", { state: { returnUrl: window.location.pathname, action: "apply-job", jobId: id } });
      return;
    }
    
    if (!user) return;
    
    // Siempre abrimos el diálogo, ya sea para aplicar por primera vez o para actualizar
    setApplyDialogOpen(true);
    
    // Si el usuario ya aplicó, mostramos un log para debugging
    if (isApplied) {
      console.log("Abriendo diálogo para actualizar aplicación existente");
    }
  };
  
  const handleApply = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      console.log("Iniciando aplicación a trabajo, isApplied:", isApplied);
      
      // Crear objeto con los datos del trabajo para guardarlos
      const jobData = {
        jobTitle,
        companyName,
        companyLogo,
        location,
        salary: salaryRange,
        employmentType,
        id
      };
      
      // Si ya aplicó antes, enviamos el flag forceUpdate
      const { success, error, isUpdate } = await applyToJob(user.id, id, {
        coverLetter,
        resumeFile: resumeFile || undefined,
        jobData, // Añadimos los datos del trabajo
        forceUpdate: isApplied // Si ya está aplicado, forzamos actualización
      });
      
      console.log("Resultado de la aplicación:", { success, error, isUpdate });
      
      if (success) {
        setIsApplied(true);
        setApplyDialogOpen(false);
        setCoverLetter("");
        setResumeFile(null);
        
        if (isUpdate) {
          toast({
            title: "Aplicación actualizada",
            description: "Has actualizado correctamente tu aplicación a este trabajo",
          });
        } else {
          toast({
            title: "Aplicación enviada",
            description: "Tu aplicación ha sido enviada correctamente",
          });
        }
      } else if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al aplicar al trabajo:", error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al enviar tu aplicación. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareOpen(true);
  };
  
  const copyToClipboard = () => {
    const jobUrl = `${window.location.origin}/search-results?jobId=${id}`;
    navigator.clipboard.writeText(jobUrl);
    toast({
      title: "Enlace copiado",
      description: "El enlace ha sido copiado al portapapeles",
    });
    setTimeout(() => setShareOpen(false), 1000);
  };
  
  const shareOnSocialMedia = (platform: string) => {
    const jobUrl = `${window.location.origin}/search-results?jobId=${id}`;
    let shareUrl = "";
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`¡He encontrado este trabajo de ${jobTitle} en ${companyName}!`)}&url=${encodeURIComponent(jobUrl)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`¡He encontrado este trabajo de ${jobTitle} en ${companyName}! ${jobUrl}`)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => setShareOpen(false), 1000);
  };

  // Función que maneja el clic en la tarjeta
  const handleCardClick = () => {
    // Si se proporciona una función onClick personalizada, úsala
    if (onClick) {
      onClick();
      return;
    }
    
    // Comportamiento predeterminado: navegar a la página de resultados de búsqueda
    navigate(`/search-results?jobId=${id}`, {
      state: { jobId: id }
    });
  };

  return (
    <Card className={`cursor-pointer h-full min-h-[300px] overflow-hidden border-gray-200 hover:border-gray-300 hover:shadow-md transition-all ${className}`} onClick={handleCardClick}>
      <CardContent className="p-5 flex flex-col h-full relative">
        <div className="flex gap-4 items-start mb-3">
          <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 border flex-shrink-0">
            <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate leading-tight">{jobTitle}</h3>
            <p className="text-sm text-muted-foreground mb-2">{companyName}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm text-gray-500">{location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm text-gray-500">{employmentType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm text-gray-500">{salaryRange}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm text-gray-500">{postedDate}</span>
          </div>
        </div>
        
        {/* Contenedor con altura fija para los tags */}
        <div className="h-16 mb-3 overflow-hidden">
          {keyRequirements && keyRequirements.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {keyRequirements.map((req, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs h-6"
                >
                  {req}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-auto pt-3 border-t border-gray-100">
          {/* Versión adaptativa de los botones */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 w-full sm:w-auto"
              onClick={handleShare}
            >
              <Share2 className="h-3.5 w-3.5 mr-1.5" />
              <span className="hidden sm:inline">Compartir</span>
              <span className="inline sm:hidden">Compartir</span>
            </Button>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className={`text-xs h-8 flex-1 sm:flex-none ${isSaved ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700' : ''}`}
                onClick={handleSaveJob}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-spin mr-1.5">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                ) : (
                  <Bookmark className={`h-3.5 w-3.5 mr-1.5 ${isSaved ? 'fill-blue-600' : ''}`} />
                )}
                <span className="hidden sm:inline">{isSaved ? 'Guardado' : 'Guardar'}</span>
                <span className="inline sm:hidden">{isSaved ? 'Guardado' : 'Guardar'}</span>
              </Button>
              
              <Button
                variant={isApplied ? "outline" : "default"}
                size="sm"
                className={`text-xs h-8 flex-1 sm:flex-none ${isApplied ? "text-green-600 border-green-300 hover:bg-green-50" : ""}`}
                onClick={openApplyDialog}
              >
                {isApplied ? (
                  <>
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    <span className="hidden sm:inline">Actualizar CV</span>
                    <span className="inline sm:hidden">Actualizar</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    <span className="hidden sm:inline">Aplicar</span>
                    <span className="inline sm:hidden">Aplicar</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Dialog para compartir */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Compartir este trabajo</DialogTitle>
            <DialogDescription>
              <div className="mt-2 mb-2 p-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700">
                <Copy className="inline-block mr-1 h-4 w-4" />
                <span>Copiar enlace</span>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="shareUrl">Enlace</Label>
              <Input
                id="shareUrl"
                type="text"
                value={`${window.location.origin}/search-results?jobId=${id}`}
                readOnly
                disabled={true}
                className="min-h-[40px]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="sharePlatform">Red social</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    {shareOpen ? "Seleccionar plataforma" : "Seleccionar plataforma"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onClick={() => shareOnSocialMedia("facebook")}>
                    <Facebook className="mr-2 h-4 w-4" />
                    <span>Facebook</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => shareOnSocialMedia("twitter")}>
                    <Twitter className="mr-2 h-4 w-4" />
                    <span>Twitter</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => shareOnSocialMedia("linkedin")}>
                    <Linkedin className="mr-2 h-4 w-4" />
                    <span>LinkedIn</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => shareOnSocialMedia("whatsapp")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M22 4L12 14.01l-3-3"></path>
                    </svg>
                    <span>WhatsApp</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShareOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog para aplicar */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>{isApplied ? "Actualizar aplicación" : "Aplicar a"} {jobTitle}</DialogTitle>
            <DialogDescription>
              {isApplied ? (
                <div className="mt-2 mb-2 p-2 bg-green-50 border border-green-200 rounded-md text-green-700">
                  <Check className="inline-block mr-1 h-4 w-4" />
                  Ya has aplicado a este trabajo anteriormente. Puedes actualizar tu solicitud con un nuevo CV o carta de presentación.
                </div>
              ) : (
                <>Completa el formulario para enviar tu aplicación a {companyName}.</>
              )}
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
                disabled={isLoading}
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
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {resumeFile ? resumeFile.name : "Subir CV"}
                </Button>
                {resumeFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setResumeFile(null)}
                    disabled={isLoading}
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
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              disabled={isLoading || (!resumeFile && !isApplied)}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : isApplied ? (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Actualizar aplicación
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
    </Card>
  );
};

export default JobListingCard;
