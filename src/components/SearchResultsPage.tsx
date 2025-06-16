import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Filter,
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  Building2,
  CheckCircle,
  Search,
  Sliders,
  X,
  Bookmark,
  Send,
  Check,
  Upload,
  FileText,
  Share2,
  MoreVertical,
  Copy,
  Printer,
  Flag,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import JobListingCard from "./JobListingCard";
import { Combobox, ComboboxOption } from "./ui/combobox";
import { Input } from "./ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { saveJob, unsaveJob, isJobSaved, applyToJob, hasAppliedToJob, uploadResume } from "@/lib/jobInteractions";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Datos para filtros
const uruguayDepartments = [
  { label: "Montevideo", value: "montevideo" },
  { label: "Canelones", value: "canelones" },
  { label: "Maldonado", value: "maldonado" },
  { label: "Colonia", value: "colonia" },
  { label: "Salto", value: "salto" },
  { label: "Paysandú", value: "paysandu" },
  { label: "Rivera", value: "rivera" },
  { label: "Artigas", value: "artigas" },
  { label: "Tacuarembó", value: "tacuarembo" },
  { label: "Cerro Largo", value: "cerro-largo" },
  { label: "Treinta y Tres", value: "treinta-y-tres" },
  { label: "Rocha", value: "rocha" },
  { label: "Lavalleja", value: "lavalleja" },
  { label: "Florida", value: "florida" },
  { label: "San José", value: "san-jose" },
  { label: "Flores", value: "flores" },
  { label: "Soriano", value: "soriano" },
  { label: "Río Negro", value: "rio-negro" },
  { label: "Durazno", value: "durazno" },
];

const employmentTypes = [
  { label: "Todos", value: "all" },
  { label: "Tiempo completo", value: "full-time" },
  { label: "Tiempo parcial", value: "part-time" },
  { label: "Contrato", value: "contract" },
  { label: "Freelance", value: "freelance" },
];

const jobCategories = [
  { label: "Todas", value: "all" },
  { label: "Tecnología", value: "technology" },
  { label: "Marketing", value: "marketing" },
  { label: "Diseño", value: "design" },
  { label: "Ventas", value: "sales" },
  { label: "Finanzas", value: "finance" },
  { label: "Recursos Humanos", value: "human resources" },
  { label: "Atención al cliente", value: "customer service" },
];

interface SearchState {
  searchTerm: string;
  location: string;
  employmentType: string;
  salaryMin: number;
}

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Obtener el jobId de los parámetros de búsqueda o del state
  const jobIdFromParams = searchParams.get('jobId');
  const jobIdFromState = location.state?.jobId;
  const searchTermFromState = location.state?.searchTerm || '';
  
  const jobId = jobIdFromParams || jobIdFromState;

  // Trabajos de ejemplo
  const mockJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp",
      location: "Montevideo",
      salary: "$80,000 - $120,000",
      type: "Full-time",
      requirements: ["React", "TypeScript", "3+ years experience"],
      posted: "2 days ago",
      areas: ["technology"],
    },
    {
      id: 2,
      title: "UX Designer",
      company: "DesignHub",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=DesignHub",
      location: "Remote",
      salary: "$70,000 - $90,000",
      type: "Contract",
      requirements: ["Figma", "User Research", "Prototyping"],
      posted: "1 week ago",
      areas: ["design", "technology"],
    },
    {
      id: 3,
      title: "Backend Engineer",
      company: "DataSystems",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=DataSystems",
      location: "Canelones",
      salary: "$100,000 - $140,000",
      type: "Full-time",
      requirements: ["Node.js", "PostgreSQL", "AWS"],
      posted: "3 days ago",
      areas: ["technology"],
    },
    {
      id: 4,
      title: "Product Manager",
      company: "InnovateCo",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=InnovateCo",
      location: "Maldonado",
      salary: "$90,000 - $130,000",
      type: "Full-time",
      requirements: ["Agile", "Roadmapping", "5+ years experience"],
      posted: "Just now",
      areas: ["technology", "marketing", "sales"],
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudTech",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=CloudTech",
      location: "Colonia",
      salary: "$110,000 - $150,000",
      type: "Full-time",
      requirements: ["Kubernetes", "Docker", "CI/CD"],
      posted: "5 days ago",
      areas: ["technology"],
    },
    {
      id: 6,
      title: "Data Scientist",
      company: "AnalyticsPro",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnalyticsPro",
      location: "Montevideo",
      salary: "$95,000 - $135,000",
      type: "Part-time",
      requirements: ["Python", "Machine Learning", "SQL"],
      posted: "1 day ago",
      areas: ["technology", "finance"],
    },
    {
      id: 7,
      title: "Java Developer",
      company: "SoftSolutions",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=SoftSolutions",
      location: "Salto",
      salary: "$85,000 - $115,000",
      type: "Full-time",
      requirements: ["Java", "Spring", "Microservices"],
      posted: "3 days ago",
      areas: ["technology"],
    },
    {
      id: 8,
      title: "Mobile Developer",
      company: "AppFactory",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=AppFactory",
      location: "Paysandú",
      salary: "$75,000 - $100,000",
      type: "Contract",
      requirements: ["React Native", "iOS", "Android"],
      posted: "1 week ago",
      areas: ["technology"],
    },
    {
      id: 9,
      title: "Marketing Specialist",
      company: "BrandGenius",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=BrandGenius",
      location: "Montevideo",
      salary: "$65,000 - $85,000",
      type: "Full-time",
      requirements: ["Digital Marketing", "Social Media", "SEO/SEM"],
      posted: "4 days ago",
      areas: ["marketing"],
    },
    {
      id: 10,
      title: "Financial Analyst",
      company: "CapitalGroup",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=CapitalGroup",
      location: "Montevideo",
      salary: "$75,000 - $95,000",
      type: "Full-time",
      requirements: ["Financial Modeling", "Excel", "Data Analysis"],
      posted: "2 weeks ago",
      areas: ["finance"],
    },
    {
      id: 11,
      title: "HR Manager",
      company: "TalentForce",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=TalentForce",
      location: "Punta del Este",
      salary: "$90,000 - $110,000",
      type: "Full-time",
      requirements: ["Recruitment", "Employee Relations", "HR Policies"],
      posted: "1 week ago",
      areas: ["human resources"],
    },
    {
      id: 12,
      title: "Content Writer",
      company: "WordCraft",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=WordCraft",
      location: "Remote",
      salary: "$50,000 - $70,000",
      type: "Part-time",
      requirements: ["Copywriting", "SEO Content", "Editing"],
      posted: "3 days ago",
      areas: ["marketing", "content"],
    },
    {
      id: 13,
      title: "Cybersecurity Analyst",
      company: "SecureNet",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=SecureNet",
      location: "Montevideo",
      salary: "$100,000 - $130,000",
      type: "Full-time",
      requirements: ["Network Security", "Penetration Testing", "CISSP"],
      posted: "Just now",
      areas: ["technology", "security"],
    },
    {
      id: 14,
      title: "Sales Representative",
      company: "RevenuePro",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=RevenuePro",
      location: "Colonia",
      salary: "$60,000 - $90,000 + commission",
      type: "Full-time",
      requirements: ["B2B Sales", "CRM Software", "Negotiation"],
      posted: "5 days ago",
      areas: ["sales"],
    },
    {
      id: 15,
      title: "Project Coordinator",
      company: "OrganizeWell",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=OrganizeWell",
      location: "Montevideo",
      salary: "$70,000 - $85,000",
      type: "Contract",
      requirements: [
        "Project Management",
        "Gantt Charts",
        "Stakeholder Communication",
      ],
      posted: "1 week ago",
      areas: ["management", "operations"],
    },
    {
      id: 16,
      title: "QA Engineer",
      company: "QualityAssure",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=QualityAssure",
      location: "Tacuarembó",
      salary: "$75,000 - $100,000",
      type: "Full-time",
      requirements: ["Automated Testing", "Manual Testing", "Test Planning"],
      posted: "4 days ago",
      areas: ["technology", "quality"],
    },
    {
      id: 17,
      title: "Graphic Designer",
      company: "VisualArts",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=VisualArts",
      location: "Remote",
      salary: "$60,000 - $80,000",
      type: "Contract",
      requirements: ["Adobe Creative Suite", "Typography", "Brand Identity"],
      posted: "2 days ago",
      areas: ["design", "creative"],
    },
    {
      id: 18,
      title: "Customer Support Specialist",
      company: "HelpDesk",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=HelpDesk",
      location: "Maldonado",
      salary: "$45,000 - $55,000",
      type: "Full-time",
      requirements: [
        "Customer Service",
        "Ticketing Systems",
        "Problem Resolution",
      ],
      posted: "6 days ago",
      areas: ["customer service"],
    },
    {
      id: 19,
      title: "Business Analyst",
      company: "InsightSolutions",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=InsightSolutions",
      location: "Montevideo",
      salary: "$80,000 - $110,000",
      type: "Full-time",
      requirements: [
        "Requirements Gathering",
        "Process Modeling",
        "Data Analysis",
      ],
      posted: "3 days ago",
      areas: ["business", "technology"],
    },
    {
      id: 20,
      title: "Full Stack Engineer",
      company: "OmniTech",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=OmniTech",
      location: "Canelones",
      salary: "$90,000 - $135,000",
      type: "Full-time",
      requirements: ["React", "Node.js", "MongoDB", "DevOps"],
      posted: "Just now",
      areas: ["technology"],
    },
  ];

  // Estado para filtros
  const [searchTerm, setSearchTerm] = useState(searchTermFromState || "");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [salaryRange, setSalaryRange] = useState([0, 150000]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  
  // Seleccionar el primer trabajo por defecto, o buscar el trabajo específico si hay jobId
  const getInitialSelectedJob = () => {
    if (jobId) {
      const foundJob = mockJobs.find(job => job.id.toString() === jobId);
      return foundJob || mockJobs[0];
    }
    return filteredJobs.length > 0 ? filteredJobs[0] : mockJobs[0];
  };
  
  const [selectedJob, setSelectedJob] = useState(getInitialSelectedJob());
  
  // Estado para aplicaciones y guardados
  const { user, isAuthenticated } = useAuth();
  const [isJobSaved, setIsJobSaved] = useState(false);
  const [isAppliedToCurrentJob, setIsAppliedToCurrentJob] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Nuevo estado para el menú de opciones y diálogo de compartir
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Scroll to job with jobId if present
  useEffect(() => {
    if (jobId) {
      // Filtrar para destacar este trabajo específico
      const job = mockJobs.find(job => job.id.toString() === jobId);
      if (job) {
        setSearchTerm(job.title);
        // Aplicar filtros automáticamente para mostrar este trabajo
        applyFilters(job.title, job.location.toLowerCase(), job.type.toLowerCase(), job.areas[0]);
        
        // Asegurarse de seleccionar este trabajo para el panel de detalles
        setSelectedJob(job);
        
        // Scroll al elemento después de renderizar
        setTimeout(() => {
          // Primero, eliminar cualquier resaltado existente
          document.querySelectorAll('.job-card-selected').forEach(el => {
            el.classList.remove('job-card-selected', 'bg-blue-50', 'border-blue-200');
          });
          
          const element = document.getElementById(`job-${jobId}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            // Destacar visualmente el elemento
            element.classList.add('job-card-selected', 'bg-blue-50', 'border-blue-200');
          }
        }, 500);
      }
    }
  }, [jobId]);
  
  // Función para aplicar filtros específicos
  const applyFilters = (term: string, loc: string, type: string, category: string) => {
    setSearchTerm(term);
    setSelectedLocation(loc);
    setSelectedEmploymentType(type === "all" ? "all" : type);
    setSelectedCategory(category === "all" ? "all" : category);
    
    // También actualizar los trabajos filtrados
    let filtered = [...mockJobs];
    
    if (term) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(term.toLowerCase()) ||
          job.company.toLowerCase().includes(term.toLowerCase()) ||
          job.requirements.some((req) =>
            req.toLowerCase().includes(term.toLowerCase())
          )
      );
    }
    
    if (loc && loc !== "all") {
      filtered = filtered.filter(
        (job) => job.location.toLowerCase().includes(loc.toLowerCase())
      );
    }
    
    if (type && type !== "all") {
      filtered = filtered.filter(
        (job) => job.type.toLowerCase().includes(type.toLowerCase())
      );
    }
    
    if (category && category !== "all") {
      filtered = filtered.filter(
        (job) => job.areas.includes(category.toLowerCase())
      );
    }
    
    setFilteredJobs(filtered);
  };

  // Formatear valor de salario para mostrar
  const formatSalary = (value) => {
    return `$${value.toLocaleString()}`;
  };

  const resetFilters = () => {
    setSelectedLocation("");
    setSelectedEmploymentType("all");
    setSalaryRange([0, 150000]);
    setSelectedCategory("all");
  };

  // Función para manejar cambios en archivos de CV
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
  
  // Función para guardar/eliminar trabajo de favoritos
  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      navigate("/auth", { state: { returnUrl: window.location.pathname, action: "save-job", jobId: selectedJob.id.toString() } });
      return;
    }
    
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      if (!isJobSaved) {
        // Crear un objeto con los datos del trabajo
        const jobData = {
          id: selectedJob.id.toString(),
          jobTitle: selectedJob.title,
          companyName: selectedJob.company,
          companyLogo: selectedJob.logo,
          location: selectedJob.location,
          salary: selectedJob.salary,
          employmentType: selectedJob.type,
          postedDate: selectedJob.posted
        };
        
        // Intentamos guardar el trabajo con los datos completos
        const { success, error } = await saveJob(user.id, selectedJob.id.toString(), jobData);
        
        if (success) {
          setIsJobSaved(true);
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
        const { success, error } = await unsaveJob(user.id, selectedJob.id.toString());
        
        if (success) {
          setIsJobSaved(false);
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
  
  // Función para aplicar a un trabajo
  const handleApply = async () => {
    if (!user || isAppliedToCurrentJob) return;
    
    setIsLoading(true);
    
    try {
      // Crear objeto con los datos del trabajo para guardarlos
      const jobData = {
        id: selectedJob.id.toString(),
        jobTitle: selectedJob.title,
        companyName: selectedJob.company,
        companyLogo: selectedJob.logo,
        location: selectedJob.location,
        salary: selectedJob.salary,
        employmentType: selectedJob.type
      };
      
      const { success, error } = await applyToJob(user.id, selectedJob.id.toString(), {
        coverLetter,
        resumeFile: resumeFile || undefined,
        jobData // Añadimos los datos del trabajo
      });
      
      if (success) {
        setIsAppliedToCurrentJob(true);
        setApplyDialogOpen(false);
        setCoverLetter("");
        setResumeFile(null);
        toast({
          title: "Aplicación enviada",
          description: "Tu aplicación ha sido enviada correctamente",
        });
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
  
  // Efecto para verificar si el usuario ha guardado o aplicado al trabajo seleccionado
  useEffect(() => {
    const checkInteractions = async () => {
      if (isAuthenticated && user && selectedJob) {
        const jobId = selectedJob.id.toString();
        
        try {
          // Renombramos la función importada para evitar conflicto con el estado
          const { isJobSaved: checkJobSaved } = await import("@/lib/jobInteractions");
          const { hasAppliedToJob: checkJobApplied } = await import("@/lib/jobInteractions");
          
          // Verificar si el trabajo está guardado
          const saved = await checkJobSaved(user.id, jobId);
          setIsJobSaved(saved);
          
          // Verificar si ya aplicó al trabajo
          const applied = await checkJobApplied(user.id, jobId);
          setIsAppliedToCurrentJob(applied);
        } catch (error) {
          console.error("Error al verificar interacciones:", error);
        }
      }
    };
    
    checkInteractions();
  }, [isAuthenticated, user, selectedJob]);

  // Función para manejar el clic en una tarjeta de trabajo
  const handleJobCardClick = (job) => {
    // Actualizar el trabajo seleccionado para el panel de detalles
    setSelectedJob(job);
    
    // Actualizar la URL con el ID del trabajo seleccionado sin recargar la página
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('jobId', job.id.toString());
    
    // Reemplazar la URL actual con la nueva que incluye el ID del trabajo
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, '', newUrl);
    
    // Destacar visualmente el elemento seleccionado
    setTimeout(() => {
      // Primero, eliminar cualquier resaltado existente
      document.querySelectorAll('.job-card-selected').forEach(el => {
        el.classList.remove('job-card-selected', 'bg-blue-50', 'border-blue-200');
      });
      
      // Luego, resaltar el elemento seleccionado
      const element = document.getElementById(`job-${job.id}`);
      if (element) {
        element.classList.add('job-card-selected', 'bg-blue-50', 'border-blue-200');
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  // Función para manejar el clic en el botón de compartir
  const handleShareClick = () => {
    setShareDialogOpen(true);
  };
  
  // Función para manejar el clic en el botón de menú
  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Función para copiar el enlace al portapapeles
  const copyToClipboard = () => {
    const jobUrl = `${window.location.origin}/search-results?jobId=${selectedJob.id}`;
    navigator.clipboard.writeText(jobUrl).then(
      () => {
        toast({
          title: "Enlace copiado",
          description: "El enlace ha sido copiado al portapapeles",
        });
      },
      (err) => {
        console.error("No se pudo copiar el enlace: ", err);
        toast({
          title: "Error",
          description: "No se pudo copiar el enlace",
          variant: "destructive",
        });
      }
    );
  };
  
  // Función para imprimir la oferta de trabajo
  const printJob = () => {
    window.print();
  };
  
  // Función para reportar una oferta de trabajo
  const reportJob = () => {
    toast({
      title: "Oferta reportada",
      description: "Gracias por ayudarnos a mantener la calidad de las ofertas",
    });
    setMenuOpen(false);
  };
  
  // Función para compartir en redes sociales
  const shareOnSocialMedia = (platform: string) => {
    const jobUrl = `${window.location.origin}/search-results?jobId=${selectedJob.id}`;
    const jobTitle = selectedJob.title;
    const text = `Oferta de trabajo: ${jobTitle} en ${selectedJob.company}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(jobUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`He encontrado esta oferta de trabajo que podría interesarte: ${jobUrl}`)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${jobUrl}`)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
    
    setShareDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <h1 className="text-xl font-bold text-primary">JobSearch</h1>
            </div>

            {/* Top filter bar similar to Computrabajo */}
            <div className="hidden md:flex items-center gap-2">
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-8 flex items-center gap-1"
              >
                <Sliders className="h-3 w-3" />
                {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar - Filters and Job listings */}
          <div className="w-full lg:w-2/5 xl:w-1/3">
            {/* Mobile filters button */}
            <div className="md:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
              </Button>
            </div>
            
            {/* Filter panel */}
            {showFilters && (
              <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filtros</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-xs"
                  >
                    Limpiar filtros
                  </Button>
                </div>

                <div className="space-y-5">
                  {/* Search term */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Búsqueda</label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Título, empresa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ubicación</label>
                    <Select 
                      value={selectedLocation} 
                      onValueChange={setSelectedLocation}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Cualquier ubicación</SelectItem>
                        <SelectItem value="Remote">Remoto</SelectItem>
                        {uruguayDepartments.map((dept) => (
                          <SelectItem key={dept.value} value={dept.label}>
                            {dept.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Employment Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de empleo</label>
                    <Select 
                      value={selectedEmploymentType} 
                      onValueChange={setSelectedEmploymentType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Categories */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categoría</label>
                    <Select 
                      value={selectedCategory} 
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Salary Range */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Salario mínimo</label>
                    <div>
                      <Slider
                        value={salaryRange}
                        onValueChange={setSalaryRange}
                        min={0}
                        max={150000}
                        step={5000}
                      />
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>{formatSalary(0)}</span>
                        <span>{formatSalary(salaryRange[0])}</span>
                        <span>{formatSalary(150000)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-semibold">{filteredJobs.length}</span>{" "}
                Ofertas de trabajo encontradas
              </p>
            </div>

            <div>
              {filteredJobs.length > 0 ? (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <div 
                      id={`job-${job.id}`} 
                      key={job.id} 
                      className={job.id.toString() === selectedJob?.id.toString() ? 'job-card-selected bg-blue-50 border-blue-200 rounded-lg' : ''}
                      onClick={() => handleJobCardClick(job)}
                    >
                      <JobListingCard
                        id={job.id.toString()}
                        companyLogo={job.logo}
                        jobTitle={job.title}
                        companyName={job.company}
                        location={job.location}
                        salaryRange={job.salary}
                        employmentType={job.type}
                        keyRequirements={job.requirements}
                        postedDate={job.posted}
                        onClick={() => handleJobCardClick(job)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-white rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No se encontraron empleos
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Intenta con diferentes términos de búsqueda o filtros.
                  </p>
                  <Button onClick={() => navigate("/")}>
                    Volver a la página principal
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Job detail */}
          <div className="w-full lg:w-3/5 xl:w-2/3 mt-6 lg:mt-0">
            {selectedJob && (
              <Card className="sticky top-4 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <img
                          src={selectedJob.logo}
                          alt={selectedJob.company}
                          className="w-8 h-8 rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = "flex";
                            }
                          }}
                        />
                        <Building2
                          className="h-6 w-6 text-blue-600"
                          style={{ display: "none" }}
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {selectedJob.title}
                        </h2>
                        <p className="text-gray-600">{selectedJob.company}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <Button variant="ghost" size="sm" onClick={handleMenuClick}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      
                      {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                          <div className="py-1">
                            <button 
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={copyToClipboard}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copiar enlace
                            </button>
                            <button 
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={printJob}
                            >
                              <Printer className="h-4 w-4 mr-2" />
                              Imprimir oferta
                            </button>
                            <button 
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={reportJob}
                            >
                              <Flag className="h-4 w-4 mr-2" />
                              Reportar oferta
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {selectedJob.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      Empresa verificada
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Publicado {selectedJob.posted}
                    </span>
                  </div>

                  <Button 
                    className="w-full mb-4 bg-blue-700 hover:bg-blue-800"
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate("/auth", { 
                          state: { 
                            returnUrl: window.location.pathname, 
                            action: "apply-job", 
                            jobId: selectedJob.id.toString() 
                          } 
                        });
                        return;
                      }
                      
                      if (!user || isAppliedToCurrentJob) return;
                      setApplyDialogOpen(true);
                    }}
                    disabled={isLoading || isAppliedToCurrentJob}
                  >
                    {isAppliedToCurrentJob ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Ya aplicaste a {selectedJob.title}
                      </>
                    ) : (
                      <>Postularme a {selectedJob.title}</>
                    )}
                  </Button>

                  <div className="flex gap-2 mb-6">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`text-xs h-8 ${isJobSaved ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700' : ''}`}
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
                        <Bookmark className={`h-3.5 w-3.5 mr-1.5 ${isJobSaved ? 'fill-blue-600' : ''}`} />
                      )}
                      {isJobSaved ? 'Guardado' : 'Guardar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      title="Compartir trabajo"
                      onClick={handleShareClick}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Compartir
                    </Button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{selectedJob.type}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      <span className="text-gray-600">
                        {selectedJob.salary}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        {selectedJob.location === "Remote"
                          ? "Trabajo remoto"
                          : "Presencial"}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Requisitos del puesto:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.requirements.map((req, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Descripción del trabajo
                    </h4>

                    {selectedJob.id <= 5 ? (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Estamos buscando un/a{" "}
                          {selectedJob.title.toLowerCase()} talentoso/a para
                          unirse a nuestro equipo en {selectedJob.company}. Esta
                          es una excelente oportunidad para desarrollar tu
                          carrera en un ambiente dinámico y colaborativo.
                        </p>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">
                            Responsabilidades principales:
                          </h5>
                          <ul className="text-sm text-gray-700 space-y-1 ml-4">
                            <li>
                              • Desarrollar y mantener aplicaciones de alta
                              calidad
                            </li>
                            <li>• Colaborar con equipos multidisciplinarios</li>
                            <li>
                              • Participar en revisiones de código y mejores
                              prácticas
                            </li>
                            <li>
                              • Contribuir a la arquitectura y diseño de
                              soluciones
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">
                            Lo que ofrecemos:
                          </h5>
                          <ul className="text-sm text-gray-700 space-y-1 ml-4">
                            <li>• Salario competitivo: {selectedJob.salary}</li>
                            <li>• Modalidad de trabajo: {selectedJob.type}</li>
                            <li>• Oportunidades de crecimiento profesional</li>
                            <li>• Ambiente de trabajo colaborativo</li>
                            <li>• Beneficios adicionales</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {selectedJob.company} está en búsqueda de un/a{" "}
                          {selectedJob.title.toLowerCase()} para incorporarse a
                          nuestro equipo. Buscamos una persona proactiva, con
                          ganas de aprender y crecer profesionalmente.
                        </p>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">
                            Requisitos:
                          </h5>
                          <ul className="text-sm text-gray-700 space-y-1 ml-4">
                            {selectedJob.requirements.map((req, index) => (
                              <li key={index}>• {req}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">
                            Condiciones:
                          </h5>
                          <ul className="text-sm text-gray-700 space-y-1 ml-4">
                            <li>• Ubicación: {selectedJob.location}</li>
                            <li>• Tipo de contrato: {selectedJob.type}</li>
                            <li>• Rango salarial: {selectedJob.salary}</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Apply Job Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Aplicar a {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Completa el formulario para enviar tu aplicación a {selectedJob?.company}.
              {isAppliedToCurrentJob && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md text-green-700">
                  <Check className="inline-block mr-1 h-4 w-4" />
                  Ya has aplicado a este trabajo anteriormente.
                </div>
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
                disabled={isLoading || isAppliedToCurrentJob}
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
                  disabled={isLoading || isAppliedToCurrentJob}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isAppliedToCurrentJob}
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
                    disabled={isLoading || isAppliedToCurrentJob}
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
              disabled={isLoading || isAppliedToCurrentJob || !resumeFile}
            >
              {isLoading ? (
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

      {/* Diálogo para compartir */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartir esta oferta de trabajo</DialogTitle>
            <DialogDescription>
              Comparte esta oferta con tu red profesional o amigos
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="link">Enlace de la oferta</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="link" 
                  value={selectedJob ? `${window.location.origin}/search-results?jobId=${selectedJob.id}` : ''} 
                  readOnly 
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  size="sm" 
                  variant="secondary"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Compartir en redes sociales</Label>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => shareOnSocialMedia('facebook')}
                  className="flex-1"
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => shareOnSocialMedia('twitter')}
                  className="flex-1"
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => shareOnSocialMedia('linkedin')}
                  className="flex-1"
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => shareOnSocialMedia('email')}
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => shareOnSocialMedia('whatsapp')}
                  className="flex-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                  </svg>
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => setShareDialogOpen(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchResultsPage;
