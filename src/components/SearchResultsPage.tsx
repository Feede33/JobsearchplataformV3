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
} from "lucide-react";
import JobListingCard from "./JobListingCard";
import { Combobox, ComboboxOption } from "./ui/combobox";
import { Input } from "./ui/input";

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

  // Obtenemos los parámetros de búsqueda o usamos valores por defecto
  // Utilizamos objetos vacíos para evitar errores si location.state es null
  const searchParams = location.state || {};

  const [searchTerm, setSearchTerm] = useState(searchParams.searchTerm || "");
  const [searchLocation, setSearchLocation] = useState(searchParams.location || "");
  const [employmentType, setEmploymentType] = useState(
    searchParams.employmentType || "all",
  );
  const [salaryMin, setSalaryMin] = useState([searchParams.salaryMin || 30000]);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevancia");
  const [datePosted, setDatePosted] = useState("all");
  const [experienceLevel, setExperienceLevel] = useState("all");

  // Estado para resultados filtrados, inicializamos con todos los trabajos
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const [selectedJob, setSelectedJob] = useState(mockJobs[0]);

  // Formatear valor de salario para mostrar
  const formatSalary = (value) => {
    return `$${value.toLocaleString()}`;
  };

  // Efecto para filtrar trabajos basados en la búsqueda
  useEffect(() => {
    try {
      console.log("Filtrando trabajos con:", {
        searchTerm,
        searchLocation,
        employmentType,
        salaryMin,
        selectedCategory,
        datePosted,
      });

      let results = [...mockJobs];

      // Filtrar por término de búsqueda (título o empresa)
      if (searchTerm) {
        results = results.filter(
          (job) =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      // Filtrar por ubicación basado en el input de texto
      if (searchLocation && searchLocation !== "all") {
        results = results.filter((job) =>
          job.location.toLowerCase().includes(searchLocation.toLowerCase()),
        );
      }

      // Filtrar por tipo de empleo
      if (employmentType && employmentType !== "all") {
        const empType = employmentType.toLowerCase();
        results = results.filter((job) =>
          job.type.toLowerCase().includes(empType),
        );
      }

      // Filtrar por categoría
      if (selectedCategory && selectedCategory !== "all") {
        results = results.filter((job) =>
          job.areas.includes(selectedCategory.toLowerCase())
        );
      }

      // Filtrar por fecha de publicación
      if (datePosted && datePosted !== "all") {
        if (datePosted === "hoy") {
          results = results.filter((job) => 
            job.posted === "Just now" || job.posted.includes("day ago")
          );
        } else if (datePosted === "semana") {
          results = results.filter((job) => 
            !job.posted.includes("week") || parseInt(job.posted.split(" ")[0]) <= 1 
          );
        }
      }

      // Filtrar por salario mínimo
      if (salaryMin[0] > 0) {
        results = results.filter((job) => {
          try {
            const salaryText = job.salary;
            const minSalary = parseInt(
              salaryText.split("$")[1].split(" ")[0].replace(",", ""),
            );
            return minSalary >= salaryMin[0];
          } catch (e) {
            console.error("Error al procesar salario:", e);
            return true;
          }
        });
      }

      // Ordenar resultados si es necesario
      if (sortBy === "fecha") {
        results.sort((a, b) => {
          if (a.posted.includes("Just now")) return -1;
          if (b.posted.includes("Just now")) return 1;
          
          const aTime = parseInt(a.posted.split(" ")[0]) || 0;
          const bTime = parseInt(b.posted.split(" ")[0]) || 0;
          
          return aTime - bTime;
        });
      }

      console.log("Resultados filtrados:", results.length);
      setFilteredJobs(results);

      // Si hay resultados y el trabajo seleccionado no está en los resultados filtrados, seleccionar el primero
      if (
        results.length > 0 &&
        (!selectedJob || !results.find((job) => job.id === selectedJob.id))
      ) {
        setSelectedJob(results[0]);
      } else if (results.length === 0) {
        setSelectedJob(null);
      }
    } catch (error) {
      console.error("Error al filtrar trabajos:", error);
      setFilteredJobs([]);
    }
  }, [searchTerm, searchLocation, employmentType, salaryMin, selectedCategory, datePosted, sortBy]);

  const resetFilters = () => {
    setSearchLocation("");
    setEmploymentType("all");
    setSalaryMin([30000]);
    setSelectedCategory("all");
    setDatePosted("all");
    setExperienceLevel("all");
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
        <div className="flex gap-6">
          {/* Left sidebar - Filters and Job listings */}
          <div className="flex-1 max-w-md">
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
                      value={searchLocation} 
                      onValueChange={setSearchLocation}
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
                      value={employmentType} 
                      onValueChange={setEmploymentType}
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
                        value={salaryMin}
                        onValueChange={setSalaryMin}
                        min={30000}
                        max={150000}
                        step={5000}
                      />
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>{formatSalary(30000)}</span>
                        <span>{formatSalary(salaryMin[0])}</span>
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

            <div className="space-y-3">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow border bg-white ${
                      selectedJob?.id === job.id
                        ? "border-blue-500 shadow-md"
                        : "border-gray-200"
                    }`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          {job.id <= 2 && (
                            <div className="flex gap-2 mb-2">
                              <Badge
                                variant="destructive"
                                className="text-xs px-2 py-0.5"
                              >
                                Se precisa Urgente
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700"
                              >
                                Empleo destacado
                              </Badge>
                            </div>
                          )}
                          <h3 className="font-semibold text-base text-gray-900 mb-1">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-1 mb-1">
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-700">
                              {job.company}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                            <MapPin className="h-3 w-3" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{job.posted}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
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
          <div className="flex-1">
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
                    <Button variant="ghost" size="sm">
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </Button>
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

                  <Button className="w-full mb-4 bg-blue-700 hover:bg-blue-800">
                    Postularme a {selectedJob.title}
                  </Button>

                  <div className="flex gap-2 mb-6">
                    <Button variant="outline" size="sm" title="Guardar trabajo">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      Guardar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      title="Compartir trabajo"
                    >
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                      </svg>
                      Compartir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      title="Reportar trabajo"
                    >
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      Reportar
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
    </div>
  );
};

export default SearchResultsPage;
