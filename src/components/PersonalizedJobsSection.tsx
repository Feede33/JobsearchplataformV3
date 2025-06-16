import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import JobListingCard from "./JobListingCard";
import { getPersonalizedJobRecommendations } from "@/lib/jobRecommendations";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface PersonalizedJobsSectionProps {
  limit?: number;
}

const PersonalizedJobsSection = ({ limit = 6 }: PersonalizedJobsSectionProps) => {
  const { user, isAuthenticated } = useAuth();
  const [personalizedJobs, setPersonalizedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPersonalizedJobs = async () => {
      setIsLoading(true);
      
      // Opciones de personalización
      const options: any = {
        limit,
      };
      
      // Si el usuario está autenticado, añadir su ID y ubicación
      if (isAuthenticated && user) {
        options.userId = user.id;
        
        // Usar información del usuario si está disponible
        // Usamos una aserción de tipo para acceder a posibles metadatos
        const userWithMetadata = user as any;
        const userMetadata = userWithMetadata.user_metadata || {};
        
        options.location = userMetadata.location || "";
        options.skills = userMetadata.skills || [];
      }
      
      const jobs = await getPersonalizedJobRecommendations(options);
      setPersonalizedJobs(jobs);
      setIsLoading(false);
    };

    loadPersonalizedJobs();
  }, [isAuthenticated, user, limit]);

  // Función para manejar el clic en un trabajo
  const handleJobClick = (job: any) => {
    navigate("/search-results", { 
      state: { 
        jobId: job.id,
        searchTerm: job.title 
      } 
    });
  };

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">
          {isAuthenticated ? "Recomendado para ti" : "Trabajos destacados"}
        </h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        {isAuthenticated
          ? "Estas ofertas han sido seleccionadas específicamente para tu perfil y experiencia"
          : "Explora estas oportunidades destacadas basadas en las tendencias actuales del mercado"}
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(limit)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="w-full h-[220px] animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-md bg-muted"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted rounded"></div>
                      <div className="h-3 w-24 bg-muted rounded"></div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full bg-muted rounded"></div>
                    <div className="h-3 w-full bg-muted rounded"></div>
                    <div className="h-3 w-3/4 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personalizedJobs.map((job) => (
            <JobListingCard
              key={job.id}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalizedJobsSection; 