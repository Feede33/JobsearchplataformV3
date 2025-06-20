import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Briefcase, Loader2, Building, Tag, Clock } from "lucide-react";
import { useSearchSuggestions } from "@/lib/useSupabaseData";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface SearchSuggestionsProps {
  type: "job" | "location";
  onSelect: (value: string) => void;
  searchTerm: string;
  loading?: boolean;
}

const SearchSuggestions = ({
  type,
  onSelect,
  searchTerm,
  loading = false,
}: SearchSuggestionsProps) => {
  // Usar el hook para obtener sugerencias dinámicas
  const { jobTitles, locations, fetchJobTitles, fetchLocations, loading: hookLoading } = useSearchSuggestions();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Debounce del término de búsqueda para evitar demasiadas consultas
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Cargar búsquedas recientes del localStorage al iniciar
  useEffect(() => {
    const storageKey = `recent_${type}_searches`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setRecentSearches(Array.isArray(parsed) ? parsed.slice(0, 5) : []);
      }
    } catch (e) {
      console.error("Error al cargar búsquedas recientes:", e);
    }
  }, [type]);

  // Guardar una búsqueda reciente
  const saveRecentSearch = useCallback((term: string) => {
    if (!term) return;
    
    const storageKey = `recent_${type}_searches`;
    try {
      // Obtener búsquedas existentes
      const saved = localStorage.getItem(storageKey);
      let searches = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(searches)) searches = [];
      
      // Añadir la nueva búsqueda al inicio y eliminar duplicados
      searches = [term, ...searches.filter(s => s !== term)].slice(0, 5);
      
      // Guardar en localStorage
      localStorage.setItem(storageKey, JSON.stringify(searches));
      
      // Actualizar estado
      setRecentSearches(searches);
    } catch (e) {
      console.error("Error al guardar búsqueda reciente:", e);
    }
  }, [type]);
  
  // Actualizar sugerencias cuando cambia el término de búsqueda debounced
  useEffect(() => {
    // Si el término de búsqueda es menor a 2 caracteres, mostrar sugerencias predeterminadas
    if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
      // Usar sugerencias precargadas o fallbacks
      setSuggestions(type === "job" ? jobTitles : locations);
      return;
    }
    
    const updateSuggestions = async () => {
      setIsLoading(true);
      try {
        let results: string[] = [];
        
        if (type === "job") {
          // Si es búsqueda de trabajo, obtener títulos filtrados
          results = await fetchJobTitles(debouncedSearchTerm);
        } else {
          // Si es búsqueda de ubicación, obtener ubicaciones filtradas
          results = await fetchLocations(debouncedSearchTerm);
        }
        
        // Si no hay resultados, usar fallbacks filtrados
        if (results.length === 0) {
          results = (type === "job" ? fallbackJobSuggestions : fallbackLocationSuggestions)
            .filter(item => item.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
        }
        
        setSuggestions(results);
      } catch (error) {
        console.error("Error al obtener sugerencias:", error);
        
        // Fallback a sugerencias estáticas si hay error
        setSuggestions((type === "job" ? fallbackJobSuggestions : fallbackLocationSuggestions)
          .filter(item => item.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    updateSuggestions();
  }, [type, debouncedSearchTerm, fetchJobTitles, fetchLocations, jobTitles, locations]);

  // Fallback estático para casos donde la base de datos no devuelve resultados
  const fallbackJobSuggestions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "UX Designer",
    "UI Designer",
    "Product Manager",
    "Data Scientist",
    "DevOps Engineer",
    "Software Engineer",
    "React Developer",
    "Node.js Developer",
    "Python Developer",
    "Java Developer",
    "Mobile Developer",
    "QA Engineer",
    "Project Manager",
  ];

  const fallbackLocationSuggestions = [
    "Montevideo",
    "Buenos Aires",
    "Santiago",
    "Lima",
    "Bogotá",
    "Ciudad de México",
    "São Paulo",
    "Remote",
    "Maldonado",
    "Punta del Este",
    "Colonia",
    "Canelones",
  ];

  // Determinar si mostrar mensaje de "sin resultados"
  const showNoResults = suggestions.length === 0 && !isLoading && !loading && !hookLoading && searchTerm.length >= 2;
  
  // Resaltar la parte coincidente del texto
  const highlightMatch = (text: string, query: string) => {
    if (!query || query.length < 2) return <span>{text}</span>;
    
    try {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i');
      const parts = text.split(regex);
      
      return (
        <span>
          {parts.map((part, i) => 
            regex.test(part) ? <span key={i} className="font-semibold text-primary">{part}</span> : part
          )}
        </span>
      );
    } catch (e) {
      return <span>{text}</span>;
    }
  };
  
  // Manejar la selección de una sugerencia
  const handleSelectSuggestion = (suggestion: string) => {
    // Guardar en búsquedas recientes
    saveRecentSearch(suggestion);
    // Llamar al callback de selección
    onSelect(suggestion);
  };

  return (
    <Card 
      className="w-full shadow-lg border z-[999]" 
      style={{
        position: 'relative', 
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', 
        background: 'white'
      }}
    >
      <CardContent className="p-2">
        {loading || isLoading || hookLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="ml-2 text-sm">Buscando...</span>
          </div>
        ) : showNoResults ? (
          <div className="p-3 text-sm text-gray-500 text-center">
            No se encontraron resultados para "{searchTerm}"
          </div>
        ) : (
          <>
            {/* Mostrar búsquedas recientes si no hay término de búsqueda */}
            {(!searchTerm || searchTerm.length < 2) && recentSearches.length > 0 && (
              <div className="mb-2">
                <div className="px-3 py-1 text-xs text-gray-500 font-medium">
                  <Clock className="inline-block h-3 w-3 mr-1" /> Búsquedas recientes
                </div>
                <div className="space-y-1">
                  {recentSearches.map((term, idx) => (
                    <button
                      key={`recent-${idx}`}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                      onClick={() => handleSelectSuggestion(term)}
                    >
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t mt-2 pt-1"></div>
              </div>
            )}
          
            {/* Sugerencias filtradas */}
            <div className="space-y-1">
              {suggestions
                .filter((suggestion, index, self) => 
                  // Eliminar duplicados exactos
                  self.indexOf(suggestion) === index
                )
                .slice(0, 8) // Limitar a 8 sugerencias para no ocupar demasiado espacio
                .map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    {type === "job" ? (
                      suggestion.includes("Developer") || suggestion.includes("Engineer") ? (
                        <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      ) : suggestion.includes("Designer") || suggestion.includes("UX") ? (
                        <Tag className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      )
                    ) : (
                      <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="truncate">
                      {highlightMatch(suggestion, debouncedSearchTerm)}
                    </span>
                  </button>
                ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchSuggestions;
