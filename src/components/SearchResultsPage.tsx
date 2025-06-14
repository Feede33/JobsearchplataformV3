import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { Filter, ArrowLeft } from "lucide-react";
import JobListingCard from "./JobListingCard";
import { Combobox, ComboboxOption } from "./ui/combobox";

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

interface SearchState {
  searchTerm: string;
  location: string;
  employmentType: string;
  salaryMin: number;
}

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
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
      requirements: ["Project Management", "Gantt Charts", "Stakeholder Communication"],
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
      requirements: ["Customer Service", "Ticketing Systems", "Problem Resolution"],
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
      requirements: ["Requirements Gathering", "Process Modeling", "Data Analysis"],
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

  // Obtenemos los parámetros de búsqueda o usamos valores por defecto
  // Utilizamos objetos vacíos para evitar errores si location.state es null
  const searchParams = location.state || {};
  
  const [searchTerm, setSearchTerm] = useState(searchParams.searchTerm || "");
  const [searchLocation, setSearchLocation] = useState("");
  const [employmentType, setEmploymentType] = useState(searchParams.employmentType || "all");
  const [salaryMin, setSalaryMin] = useState([searchParams.salaryMin || 30000]);
  const [showFilters, setShowFilters] = useState(true);
  
  // Estado para resultados filtrados, inicializamos con todos los trabajos
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  
  // Efecto para filtrar trabajos basados en la búsqueda
  useEffect(() => {
    try {
      console.log("Filtrando trabajos con:", { 
        searchTerm, 
        searchLocation, 
        employmentType, 
        salaryMin
      });
      
      let results = [...mockJobs];
      
      // Filtrar por término de búsqueda (título o empresa)
      if (searchTerm) {
        results = results.filter(
          job => 
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            job.company.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Filtrar por ubicación basado en el input de texto
      if (searchLocation) {
        results = results.filter(
          job => job.location.toLowerCase().includes(searchLocation.toLowerCase())
        );
      }
      
      // Filtrar por tipo de empleo
      if (employmentType && employmentType !== "all") {
        const empType = employmentType.toLowerCase();
        results = results.filter(
          job => job.type.toLowerCase().includes(empType)
        );
      }
      
      // Filtrar por salario mínimo
      if (salaryMin[0] > 0) {
        results = results.filter(job => {
          try {
            const salaryText = job.salary;
            const minSalary = parseInt(salaryText.split('$')[1].split(' ')[0].replace(',', ''));
            return minSalary >= salaryMin[0];
          } catch (e) {
            console.error("Error al procesar salario:", e);
            return true;
          }
        });
      }
      
      console.log("Resultados filtrados:", results.length);
      setFilteredJobs(results);
    } catch (error) {
      console.error("Error al filtrar trabajos:", error);
      setFilteredJobs([]);
    }
  }, [searchTerm, searchLocation, employmentType, salaryMin]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container-fluid mx-auto px-6 py-4 flex items-center max-w-[1800px]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold text-primary">Resultados de Búsqueda</h1>
        </div>
      </header>

      <div className="container-fluid mx-auto px-6 py-8 max-w-[1800px]">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filtros (izquierda) - adaptado */}
          <div className="w-full lg:w-1/5">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Filtros</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {showFilters ? "Ocultar" : "Mostrar"}
                  </Button>
                </div>
                
                {showFilters && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Término de Búsqueda
                      </label>
                      <div className="relative">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          <path d="m21 21-4.34-4.34"/>
                          <circle cx="11" cy="11" r="8"/>
                        </svg>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Título, palabras clave o empresa"
                          className="w-full p-2 pl-10 border rounded-md text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Ubicación
                      </label>
                      <Combobox
                        options={uruguayDepartments}
                        value={searchLocation}
                        onChange={setSearchLocation}
                        placeholder="Seleccionar departamento"
                        emptyMessage="No se encontraron departamentos"
                        className="text-sm"
                        popoverClassName=""
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                            <path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z"/>
                            <path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2"/>
                            <path d="M18 22v-3"/>
                            <circle cx="10" cy="10" r="3"/>
                          </svg>
                        }
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Tipo de Empleo
                      </label>
                      <Select
                        value={employmentType}
                        onValueChange={setEmploymentType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="full-time">Tiempo completo</SelectItem>
                          <SelectItem value="part-time">Medio tiempo</SelectItem>
                          <SelectItem value="contract">Contrato</SelectItem>
                          <SelectItem value="internship">Pasantía</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Salario Mínimo: ${salaryMin[0].toLocaleString()}
                      </label>
                      <Slider
                        defaultValue={[30000]}
                        max={200000}
                        step={5000}
                        value={salaryMin}
                        onValueChange={setSalaryMin}
                        className="py-4"
                      />
                    </div>
                    
                    <Button className="w-full" onClick={() => {
                      // Reajustar filtros a los valores iniciales
                      setSearchTerm("");
                      setSearchLocation("");
                      setEmploymentType("all");
                      setSalaryMin([30000]);
                    }}>
                      Reiniciar Filtros
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Resultados (centro) - rediseñados */}
          <div className="w-full lg:w-3/5">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {filteredJobs.length} empleos encontrados
              </h2>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevancia</SelectItem>
                  <SelectItem value="date">Fecha (Reciente)</SelectItem>
                  <SelectItem value="salary-high">Salario (Mayor)</SelectItem>
                  <SelectItem value="salary-low">Salario (Menor)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobListingCard
                    key={job.id}
                    id={job.id.toString()}
                    jobTitle={job.title}
                    companyName={job.company}
                    companyLogo={job.logo}
                    location={job.location}
                    salaryRange={job.salary}
                    employmentType={job.type}
                    keyRequirements={job.requirements}
                    postedDate={job.posted}
                    onClick={() => navigate(`/job/${job.id}`)}
                    className="h-full transition-all hover:shadow-lg hover:border-primary/20 hover:-translate-y-1"
                  />
                ))
              ) : (
                <div className="text-center p-12 bg-gray-50 rounded-lg col-span-full">
                  <h3 className="text-lg font-medium text-gray-900">
                    No se encontraron empleos
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Intenta con diferentes términos de búsqueda o filtros.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => navigate("/")}>Volver a la página principal</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Barra lateral derecha (nueva) */}
          <div className="hidden lg:block lg:w-1/5">
            <div className="space-y-6">
              {/* Empleos destacados */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Empleos destacados</h3>
                  <div className="space-y-4">
                    {mockJobs.slice(0, 3).map(job => (
                      <div key={`featured-${job.id}`} className="flex items-start gap-3 pb-3 border-b last:border-0">
                        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                          <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium line-clamp-1">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">{job.company}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Estadísticas del mercado */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Insights del mercado</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Salario promedio</p>
                      <p className="font-medium">$85.000</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Habilidades más demandadas</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">React</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">TypeScript</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Node.js</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Consejos para postulantes */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Consejos útiles</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Actualiza tu CV para destacar experiencias relevantes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Personaliza tu carta de presentación para cada empleo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Investiga la empresa antes de la entrevista</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage; 