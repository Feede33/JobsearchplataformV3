import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPersonalizedJobRecommendations } from "@/lib/jobRecommendations";
import { useAuth } from "@/contexts/AuthContext";
import JobListingCard from "./JobListingCard";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface PersonalizedJobsSectionProps {
  title?: string;
  subtitle?: string;
  limit?: number;
}

const PersonalizedJobsSection = ({
  title = "Trabajos recomendados para ti",
  subtitle = "Basado en tu perfil y búsquedas recientes",
  limit = 4,
}: PersonalizedJobsSectionProps) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true);
      try {
        // Usar la nueva versión de la función con el parámetro para crear notificaciones
        const recommendations = await getPersonalizedJobRecommendations(
          user?.id, 
          limit,
          true // Activar creación de notificaciones
        );
        setJobs(recommendations);
      } catch (error) {
        console.error("Error al cargar recomendaciones:", error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [user, limit]);

  // Función para manejar el clic en un trabajo
  const handleJobClick = (job: any) => {
    navigate("/search-results", { 
      state: { 
        jobId: job.id,
        searchTerm: job.title 
      } 
    });
  };

  if (isLoading) {
    return (
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{subtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(limit)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // No mostrar nada si no hay trabajos recomendados
  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate("/search-results")}
          className="hidden md:flex items-center gap-2"
        >
          Ver todos <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {jobs.map((job) => (
          <JobListingCard 
            key={job.id} 
            id={job.id}
            companyLogo={job.logo || ''}
            jobTitle={job.title}
            companyName={job.company}
            location={job.location || ''}
            salaryRange={job.salary || ''}
            employmentType={job.type || 'Full-time'}
            postedDate={job.posted_date || ''}
            onClick={() => handleJobClick(job)}
          />
        ))}
      </div>
      
      <div className="mt-6 flex justify-center md:hidden">
        <Button 
          variant="outline" 
          onClick={() => navigate("/search-results")}
          className="w-full"
        >
          Ver todos los trabajos
        </Button>
      </div>
    </div>
  );
};

export default PersonalizedJobsSection; 