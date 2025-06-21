import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Filter,
  User,
  LogOut,
  ChevronRight,
  Settings,
  FolderKanban,
  Menu,
  X,
  Building,
  FileText,
  Home as HomeIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import JobListingCard from "./JobListingCard";
import SearchSuggestions from "./SearchSuggestions";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PersonalizedJobsSection from "./PersonalizedJobsSection";
import JobCategorySection from "./JobCategorySection";
import TrendingJobsSection from "./TrendingJobsSection";
import { getPopularJobCategories } from "@/lib/jobRecommendations";
import { supabase } from "@/lib/supabase";
import NotificationCenter from './NotificationCenter';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [salaryRange, setSalaryRange] = useState([30000]);
  const [showFilters, setShowFilters] = useState(false);
  const [showJobSuggestions, setShowJobSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [popularCategories, setPopularCategories] = useState<string[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [isJobLoading, setIsJobLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const jobInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const jobSuggestionsRef = useRef<HTMLDivElement>(null);
  const locationSuggestionsRef = useRef<HTMLDivElement>(null);

  // Detectar si el dispositivo es móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Control de clics fuera de los componentes de sugerencias
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Para las sugerencias de trabajo
      if (
        jobInputRef.current && 
        !jobInputRef.current.contains(event.target as Node) &&
        jobSuggestionsRef.current && 
        !jobSuggestionsRef.current.contains(event.target as Node)
      ) {
        setShowJobSuggestions(false);
      }

      // Para las sugerencias de ubicación
      if (
        locationInputRef.current && 
        !locationInputRef.current.contains(event.target as Node) &&
        locationSuggestionsRef.current && 
        !locationSuggestionsRef.current.contains(event.target as Node)
      ) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Verificar si el usuario es administrador
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated || !user) {
        setIsAdmin(false);
        return;
      }
      
      try {
        // Verificar si el usuario tiene rol de admin en JWT
        const { data: { user: userData } } = await supabase.auth.getUser();
        const isUserAdmin = userData?.app_metadata?.role === 'admin';
        
        setIsAdmin(isUserAdmin);
      } catch (error) {
        console.error("Error al verificar rol de administrador:", error);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [isAuthenticated, user]);

  // Cargar categorías populares
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getPopularJobCategories();
        console.log("Categorías cargadas:", categories);
        setPopularCategories(categories);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        // Establecer categorías por defecto en caso de error
        setPopularCategories([
          "Desarrollo de Software",
          "Marketing Digital",
          "Diseño UX/UI",
          "Ventas",
          "Atención al Cliente"
        ]);
      } finally {
        setCategoriesLoaded(true);
      }
    };
    
    loadCategories();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mostrar indicador de carga
    setIsJobLoading(true);
    setIsLocationLoading(true);
    
    try {
      // Recopilar términos de búsqueda
      const searchParams = new URLSearchParams();
      if (searchTerm) searchParams.append("query", searchTerm);
      if (location) searchParams.append("location", location);
      
      // Navegar a la página de resultados con los parámetros
      navigate(`/search-results?${searchParams.toString()}`);
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
    } finally {
      // Ocultar indicador de carga
      setIsJobLoading(false);
      setIsLocationLoading(false);
    }
  };

  const handleJobSuggestionSelect = (value: string) => {
    setSearchTerm(value);
    setShowJobSuggestions(false);
  };

  const handleLocationSuggestionSelect = (value: string) => {
    setLocation(value);
    setShowLocationSuggestions(false);
  };
  
  const handleJobInputFocus = () => {
    setIsJobLoading(true);
    setTimeout(() => {
      setShowJobSuggestions(true);
      setIsJobLoading(false);
    }, 300);
  };
  
  const handleLocationInputFocus = () => {
    setIsLocationLoading(true);
    setTimeout(() => {
      setShowLocationSuggestions(true);
      setIsLocationLoading(false);
    }, 300);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Determinar qué categoría mostrar para la sección destacada
  const getFeaturedCategory = () => {
    if (popularCategories.length > 0) {
      return popularCategories[0];
    }
    return "Desarrollo de Software"; // Categoría por defecto
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">JobSearch</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                <HomeIcon className="h-4 w-4" />
                <span>Inicio</span>
              </Link>
              <Link to="/search-results" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>Empleos</span>
              </Link>
              <Link to="/company-pricing" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span>Empresas</span>
              </Link>
              <Link to="/blog" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Blog</span>
              </Link>
            </nav>

            {/* User Account Area */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <NotificationCenter />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user?.avatar || ""} alt={user?.email || "Usuario"} />
                          <AvatarFallback>{(user?.email?.charAt(0) || "U").toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => navigate("/admin")}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Admin</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar Sesión</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate("/auth")}
                    className="hidden md:flex"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={() => navigate("/auth?action=register")}
                    className="hidden md:flex"
                  >
                    Registrarse
                  </Button>
                </>
              )}
              
              {/* Mobile Menu */}
              <div className="md:hidden">
                <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                  {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Mobile Menu Panel */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="flex items-center gap-2 px-2 py-1 hover:bg-muted rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <HomeIcon className="h-4 w-4" />
                  <span>Inicio</span>
                </Link>
                <Link 
                  to="/search-results" 
                  className="flex items-center gap-2 px-2 py-1 hover:bg-muted rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Empleos</span>
                </Link>
                <Link 
                  to="/company-pricing" 
                  className="flex items-center gap-2 px-2 py-1 hover:bg-muted rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Building className="h-4 w-4" />
                  <span>Empresas</span>
                </Link>
                <Link 
                  to="/blog" 
                  className="flex items-center gap-2 px-2 py-1 hover:bg-muted rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FileText className="h-4 w-4" />
                  <span>Blog</span>
                </Link>
                
                {!isAuthenticated && (
                  <div className="pt-2 flex flex-col space-y-2">
                    <Button variant="outline" onClick={() => {
                      navigate("/auth");
                      setShowMobileMenu(false);
                    }}>
                      Iniciar Sesión
                    </Button>
                    <Button onClick={() => {
                      navigate("/auth?action=register");
                      setShowMobileMenu(false);
                    }}>
                      Registrarse
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Animation */}
      <motion.section 
        className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-16 px-4 md:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="max-w-2xl"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Encuentra tu próximo empleo ideal</h1>
            <p className="text-xl md:text-2xl mb-8">Conectamos a profesionales como tú con las mejores oportunidades laborales</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8">
                  <Link to="/search-results">Buscar Empleo</Link>
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10 font-semibold px-8">
                  <Link to="/company/jobs">Publicar Empleo</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Job Search Stats with Staggered Animation */}
      <motion.section 
        className="py-12 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "10,000+", label: "Ofertas Disponibles" },
              { number: "5,000+", label: "Empresas Registradas" },
              { number: "15,000+", label: "Profesionales Contratados" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm text-center"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <motion.p 
                  className="text-3xl font-bold text-blue-600 mb-2"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                >
                  {stat.number}
                </motion.p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Job Categories Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <JobCategorySection 
          title="Categorías Destacadas"
          description="Explora oportunidades en las áreas más demandadas"
          category={getFeaturedCategory()}
        />
      </motion.div>

      {/* Personalized Jobs Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <PersonalizedJobsSection />
      </motion.div>

      {/* Trending Jobs Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <TrendingJobsSection />
      </motion.div>

      {/* Call to Action */}
      <motion.section 
        className="bg-blue-700 text-white py-16 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto max-w-6xl text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ y: 30 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            ¿Listo para dar el siguiente paso en tu carrera?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ y: 30 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Únete a miles de profesionales que ya han encontrado su empleo ideal en nuestra plataforma
          </motion.p>
          
          <motion.div
            initial={{ y: 30 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8">
              <Link to="/auth">Crear Cuenta Gratis</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
