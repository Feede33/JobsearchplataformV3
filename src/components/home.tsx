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
  const [jobs, setJobs] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const jobInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const jobSuggestionsRef = useRef<HTMLDivElement>(null);
  const locationSuggestionsRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        jobSuggestionsRef.current &&
        !jobSuggestionsRef.current.contains(event.target as Node) &&
        !jobInputRef.current?.contains(event.target as Node)
      ) {
        setShowJobSuggestions(false);
      }
      if (
        locationSuggestionsRef.current &&
        !locationSuggestionsRef.current.contains(event.target as Node) &&
        !locationInputRef.current?.contains(event.target as Node)
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
      const categories = await getPopularJobCategories();
      setPopularCategories(categories);
    };
    
    loadCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowJobSuggestions(false);
    setShowLocationSuggestions(false);

    // Navegar a la página de resultados de búsqueda con los parámetros de búsqueda
    navigate("/search-results", {
      state: {
        searchTerm: searchTerm.trim(),
        location: location.trim(),
        employmentType: employmentType || "all",
        salaryMin: salaryRange[0],
      },
    });
  };

  const handleJobSuggestionSelect = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowJobSuggestions(false);
  };

  const handleLocationSuggestionSelect = (suggestion: string) => {
    setLocation(suggestion);
    setShowLocationSuggestions(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1
              className="text-2xl font-bold text-primary cursor-pointer"
              onClick={() => navigate("/")}
            >
              JobSearch
            </h1>
            <nav className="ml-10 hidden md:flex space-x-6">
              <button
                onClick={() => navigate("/")}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Find Jobs
              </button>
              <a
                href="#"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Companies
              </a>
              <a
                href="#"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Resources
              </a>
              {isAdmin && (
                <button
                  onClick={() => navigate("/admin/jobs")}
                  className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1"
                >
                  <Settings className="h-4 w-4" />
                  Admin Panel
                </button>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NotificationCenter />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">Mi Perfil</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Salir</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/auth")}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/auth?tab=signup")}
                >
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Encuentra el trabajo perfecto para ti
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Miles de empleos en las mejores empresas te están esperando
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={jobInputRef}
                    type="text"
                    placeholder="Cargo, habilidad o empresa"
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (e.target.value.length >= 2) {
                        setShowJobSuggestions(true);
                      } else {
                        setShowJobSuggestions(false);
                      }
                    }}
                    onClick={() => {
                      if (searchTerm.length >= 2) {
                        setShowJobSuggestions(true);
                      }
                    }}
                  />
                </div>
                {showJobSuggestions && (
                  <div
                    ref={jobSuggestionsRef}
                    className="absolute z-10 w-full mt-1"
                  >
                    <SearchSuggestions
                      type="job"
                      searchTerm={searchTerm}
                      onSelect={handleJobSuggestionSelect}
                    />
                  </div>
                )}
              </div>
              <div className="md:col-span-4 relative">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={locationInputRef}
                    type="text"
                    placeholder="Ciudad o país"
                    className="pl-10"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (e.target.value.length >= 2) {
                        setShowLocationSuggestions(true);
                      } else {
                        setShowLocationSuggestions(false);
                      }
                    }}
                    onClick={() => {
                      if (location.length >= 2) {
                        setShowLocationSuggestions(true);
                      }
                    }}
                  />
                </div>
                {showLocationSuggestions && (
                  <div
                    ref={locationSuggestionsRef}
                    className="absolute z-10 w-full mt-1"
                  >
                    <SearchSuggestions
                      type="location"
                      searchTerm={location}
                      onSelect={handleLocationSuggestionSelect}
                    />
                  </div>
                )}
              </div>
              <div className="md:col-span-3">
                <Button type="submit" className="w-full h-10">
                  Buscar
                </Button>
              </div>
            </div>

            <div className="mt-4 flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-xs flex items-center"
              >
                <Filter className="h-3 w-3 mr-1" />
                {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
              </Button>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Tipo de empleo
                  </label>
                  <Select
                    value={employmentType}
                    onValueChange={setEmploymentType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Cualquier tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Tiempo completo</SelectItem>
                      <SelectItem value="part-time">Medio tiempo</SelectItem>
                      <SelectItem value="contract">Contrato</SelectItem>
                      <SelectItem value="internship">Pasantía</SelectItem>
                      <SelectItem value="remote">Remoto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Salario mínimo anual (USD)
                  </label>
                  <div className="pt-4 px-2">
                    <Slider
                      value={salaryRange}
                      min={0}
                      max={150000}
                      step={5000}
                      onValueChange={setSalaryRange}
                    />
                    <div className="mt-2 text-sm">
                      {salaryRange[0] === 0
                        ? "Cualquier salario"
                        : `$${salaryRange[0].toLocaleString()}`}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
      
      {/* Sección de trabajos personalizada */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          {/* Trabajos personalizados o destacados */}
          <PersonalizedJobsSection limit={6} />
          
          {/* Trabajos en tendencia */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              {popularCategories.length > 0 && (
                <div className="border rounded-lg p-6 bg-white shadow-sm">
                  <JobCategorySection 
                    category={popularCategories[0]} 
                    description="Los trabajos más demandados en esta categoría"
                    limit={4}
                    customLayout="grid grid-cols-1 md:grid-cols-2 gap-6"
                  />
                </div>
              )}
            </div>
            <div className="lg:col-span-1">
              <TrendingJobsSection limit={8} />
            </div>
          </div>
          
          {/* Categorías adicionales - con espaciado mejorado */}
          <div className="grid grid-cols-1 gap-10">
            {popularCategories.slice(1, 3).map((category) => (
              <div key={category} className="border-t pt-8">
                <JobCategorySection
                  category={category}
                  limit={4}
                />
              </div>
            ))}
          </div>
          
          {/* Categorías adicionales completas - con espaciado mejorado */}
          <div className="mt-12">
            {popularCategories.slice(3).map((category) => (
              <div key={category} className="border-t pt-8 mb-10">
                <JobCategorySection
                  category={category}
                  limit={4}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
