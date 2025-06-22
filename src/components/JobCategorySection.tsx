import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, FolderKanban, AlertCircle } from "lucide-react";
import JobListingCard from "./JobListingCard";
import CategoryJobListingCard from "./CategoryJobListingCard";
import { getFeaturedJobsByCategory } from "@/lib/jobRecommendations";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface JobCategorySectionProps {
  category?: string;
  title?: string;
  description?: string;
  limit?: number;
  customLayout?: string;
}

const JobCategorySection = ({
  category,
  title,
  description,
  limit = 6,
  customLayout
}: JobCategorySectionProps) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const navigate = useNavigate();

  // Usar título o categoría dependiendo de lo que esté disponible
  const displayTitle = title || category || "Empleos destacados";

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      setLoadError(false);
      
      try {
        // Si no hay categoría especificada, cargamos trabajos destacados generales
        const categoryToFetch = category || "destacados";
        console.log(`Cargando trabajos para categoría: ${categoryToFetch}`);
        
        const categoryJobs = await getFeaturedJobsByCategory(categoryToFetch, limit);
        
        if (categoryJobs && categoryJobs.length > 0) {
          setJobs(categoryJobs);
          console.log(`Cargados ${categoryJobs.length} trabajos para categoría ${categoryToFetch}`);
        } else {
          console.warn(`No se encontraron trabajos para categoría ${categoryToFetch}`);
          setLoadError(true);
        }
      } catch (error) {
        console.error(`Error al cargar trabajos para categoría:`, error);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, [category, limit]);

  const handleSeeAllClick = () => {
    navigate("/search-results", {
      state: {
        searchTerm: category || "",
        location: "",
        employmentType: "all",
        salaryMin: 0,
      },
    });
  };

  // Función para manejar el clic en un trabajo
  const handleJobClick = (job: any) => {
    navigate("/job/" + job.id, { 
      state: { 
        jobId: job.id,
        searchTerm: job.title 
      } 
    });
  };

  // Determinar el layout adecuado basado en el nombre de la categoría o el customLayout
  const getGridLayout = () => {
    if (customLayout) return customLayout;
    
    // Categorías que necesitan un layout especial (columnas más anchas)
    const specialCategories = ["Marketing Digital", "Diseño", "Ventas"];
    
    if (category && specialCategories.includes(category)) {
      return "grid grid-cols-1 md:grid-cols-2 gap-6";
    }
    
    // Layout por defecto - updated to match PersonalizedJobs section
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
  };

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  // Datos ficticios para mostrar cuando hay error
  const fallbackJobs = [
    {
      id: "fallback1",
      title: "Desarrollador Full Stack",
      company: "TechInnovate",
      logo: `https://api.dicebear.com/7.x/initials/svg?seed=TechInnovate`,
      location: "Remoto",
      salary: "$70,000 - $90,000",
      type: "Full-time",
      requirements: ["JavaScript", "React", "Node.js"],
      posted: "Reciente"
    },
    {
      id: "fallback2",
      title: "Especialista en Marketing Digital",
      company: "MarketGrowth",
      logo: `https://api.dicebear.com/7.x/initials/svg?seed=MarketGrowth`,
      location: "Montevideo",
      salary: "$50,000 - $65,000",
      type: "Full-time",
      requirements: ["SEO", "Google Ads", "Social Media"],
      posted: "Reciente"
    },
    {
      id: "fallback3", 
      title: "Diseñador UX/UI", 
      company: "DesignMakers", 
      logo: `https://api.dicebear.com/7.x/initials/svg?seed=DesignMakers`,
      location: "Híbrido",
      salary: "$60,000 - $80,000",
      type: "Full-time",
      requirements: ["Figma", "Adobe XD", "Diseño Responsive"],
      posted: "Reciente"
    },
    {
      id: "fallback4",
      title: "Analista de Datos",
      company: "DataInsight",
      logo: `https://api.dicebear.com/7.x/initials/svg?seed=DataInsight`,
      location: "Montevideo",
      salary: "$65,000 - $85,000",
      type: "Full-time",
      requirements: ["SQL", "Power BI", "Excel avanzado"],
      posted: "Reciente"
    }
  ];

  return (
    <div className="py-12 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <FolderKanban className="h-5 w-5 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">{displayTitle}</h3>
            </motion.div>
            
            {description && (
              <motion.p 
                className="text-muted-foreground mt-1 ml-7"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >{description}</motion.p>
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              className="flex items-center text-sm"
              onClick={handleSeeAllClick}
            >
              Ver todos <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </motion.div>
        </div>

        {isLoading ? (
          <div className={getGridLayout()}>
            {Array(limit)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="w-full min-h-[350px] animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-14 w-14 rounded-md bg-muted"></div>
                      <div className="space-y-2">
                        <div className="h-6 w-32 bg-muted rounded"></div>
                        <div className="h-4 w-24 bg-muted rounded"></div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="h-4 w-full bg-muted rounded"></div>
                      <div className="h-4 w-full bg-muted rounded"></div>
                      <div className="h-4 w-3/4 bg-muted rounded"></div>
                    </div>
                    <div className="h-20 my-4 bg-muted opacity-10 rounded"></div>
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex justify-between">
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted"></div>
                          <div className="h-8 w-8 rounded-full bg-muted"></div>
                        </div>
                        <div className="h-10 w-24 bg-muted rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : loadError || jobs.length === 0 ? (
          <>
            {/* Mensaje de error si no se pudieron cargar datos */}
            {loadError && (
              <motion.div 
                className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <p className="text-sm text-yellow-700">
                  Estamos trabajando para cargar las ofertas más recientes. Mientras tanto, te mostramos algunas posiciones disponibles.
                </p>
              </motion.div>
            )}
            
            {/* Mostrar datos de respaldo en caso de error o sin resultados */}
            <motion.div 
              className={getGridLayout()}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {fallbackJobs.slice(0, limit).map((job, index) => (
                <motion.div 
                  key={`fallback-${index}`}
                  variants={itemVariants}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05
                  }}
                >
                  <CategoryJobListingCard
                    id={job.id}
                    jobTitle={job.title}
                    companyName={job.company}
                    companyLogo={job.logo}
                    location={job.location}
                    salaryRange={job.salary}
                    employmentType={job.type}
                    keyRequirements={job.requirements}
                    postedDate={job.posted}
                    onClick={() => handleJobClick(job)}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <motion.div 
            className={getGridLayout()}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {jobs.map((job, index) => (
              <motion.div 
                key={job.id}
                variants={itemVariants}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05
                }}
              >
                <CategoryJobListingCard
                  id={job.id}
                  jobTitle={job.title}
                  companyName={job.company}
                  companyLogo={job.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${job.company}`}
                  location={job.location || "No especificada"}
                  salaryRange={job.salary || "Salario a convenir"}
                  employmentType={job.type || "Full-time"}
                  keyRequirements={job.requirements || []}
                  postedDate={job.posted || "Reciente"}
                  onClick={() => handleJobClick(job)}
                  className="h-full"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobCategorySection; 