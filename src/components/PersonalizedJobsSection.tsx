import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPersonalizedJobRecommendations, getFeaturedJobs } from "@/lib/jobRecommendations";
import { useAuth } from "@/contexts/AuthContext";
import JobListingCard from "./JobListingCard";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, Briefcase, LightbulbIcon } from "lucide-react";
import { motion } from "framer-motion";

interface PersonalizedJobsSectionProps {
  title?: string;
  subtitle?: string;
  limit?: number;
}

const PersonalizedJobsSection = ({
  title,
  subtitle,
  limit = 4,
}: PersonalizedJobsSectionProps) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Establecer título y subtítulo basados en si el usuario está autenticado o no
  const displayTitle = title || (isAuthenticated ? "Trabajos recomendados para ti" : "Ofertas destacadas");
  const displaySubtitle = subtitle || (isAuthenticated 
    ? "Seleccionados según tu perfil y búsquedas recientes" 
    : "Descubre las mejores oportunidades disponibles");

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        let jobData = [];
        
        if (isAuthenticated && user?.id) {
          // Intentar obtener recomendaciones personalizadas
          jobData = await getPersonalizedJobRecommendations(user.id, limit, true);
        }
        
        // Si no hay datos personalizados o el usuario no está autenticado, cargamos trabajos destacados
        if (jobData.length === 0) {
          jobData = await getFeaturedJobs(limit);
        }
        
        // Si aún así no hay datos, mostramos un mensaje amigable en la consola
        if (jobData.length === 0) {
          console.info("No hay trabajos disponibles para mostrar.");
        }
        
        setJobs(jobData);
      } catch (error) {
        console.error("Error al cargar trabajos:", error);
        // En caso de error, intentamos cargar trabajos destacados como fallback
        try {
          const fallbackJobs = await getFeaturedJobs(limit);
          setJobs(fallbackJobs);
        } catch (fallbackError) {
          console.error("Error en fallback:", fallbackError);
          setJobs([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, [user, limit, isAuthenticated]);

  // Función para manejar el clic en un trabajo
  const handleJobClick = (job: any) => {
    navigate("/job/" + job.id, { 
      state: { 
        jobId: job.id,
        searchTerm: job.title 
      } 
    });
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

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Si está cargando, mostrar esqueletos de carga
  if (isLoading) {
    return (
      <div className="py-12 px-4 bg-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-5 rounded bg-blue-200 animate-pulse"></div>
            <div className="h-8 w-64 bg-blue-200 animate-pulse rounded"></div>
          </div>
          <div className="h-5 w-96 bg-blue-100 animate-pulse rounded mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(limit).fill(0).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-12 w-12 rounded-md bg-gray-200 animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-4/5 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-3/5 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Mostrar un mensaje si no hay trabajos disponibles
  if (jobs.length === 0) {
    return (
      <div className="py-12 px-4 bg-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="p-8 bg-white rounded-lg shadow-sm text-center">
            <LightbulbIcon className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
            <h3 className="text-xl font-semibold mb-2">No hay ofertas disponibles en este momento</h3>
            <p className="text-muted-foreground mb-6">
              Estamos actualizando nuestro catálogo de empleos. Por favor, vuelve más tarde para encontrar nuevas oportunidades.
            </p>
            <Button onClick={() => navigate("/search-results")}>
              Explorar todas las ofertas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 bg-blue-50">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-1">
              {isAuthenticated ? (
                <Sparkles className="h-5 w-5 text-blue-600" />
              ) : (
                <Briefcase className="h-5 w-5 text-blue-600" />
              )}
              <h2 className="text-2xl font-bold">{displayTitle}</h2>
            </div>
            <p className="text-muted-foreground">{displaySubtitle}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              onClick={() => navigate("/search-results")}
              className="hidden md:flex items-center gap-2"
            >
              Ver todos <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {jobs.map((job, index) => (
            <motion.div
              key={job.id || index}
              variants={cardVariants}
              transition={{ delay: index * 0.05 }}
              whileHover={{ 
                y: -5, 
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              }}
            >
              <JobListingCard 
                id={job.id}
                companyLogo={job.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${job.company || 'Company'}`}
                jobTitle={job.title}
                companyName={job.company}
                location={job.location || 'No especificada'}
                salaryRange={job.salary || 'Salario a convenir'}
                employmentType={job.type || 'Full-time'}
                postedDate={job.posted_date || job.posted || 'Reciente'}
                onClick={() => handleJobClick(job)}
                className="h-full"
                keyRequirements={job.requirements || []}
              />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-6 flex justify-center md:hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button 
            variant="outline" 
            onClick={() => navigate("/search-results")}
            className="w-full"
          >
            Ver todos los trabajos
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default PersonalizedJobsSection; 