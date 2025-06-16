import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import JobListingCard from "./JobListingCard";
import { getFeaturedJobsByCategory } from "@/lib/jobRecommendations";
import { useNavigate } from "react-router-dom";

interface JobCategorySectionProps {
  category: string;
  description?: string;
  limit?: number;
  customLayout?: string;
}

const JobCategorySection = ({
  category,
  description,
  limit = 6,
  customLayout
}: JobCategorySectionProps) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      const categoryJobs = await getFeaturedJobsByCategory(category, limit);
      setJobs(categoryJobs);
      setIsLoading(false);
    };

    loadJobs();
  }, [category, limit]);

  const handleSeeAllClick = () => {
    navigate("/search-results", {
      state: {
        searchTerm: category,
        location: "",
        employmentType: "all",
        salaryMin: 0,
      },
    });
  };

  // Función para manejar el clic en un trabajo
  const handleJobClick = (job: any) => {
    navigate("/search-results", { 
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
    
    if (specialCategories.includes(category)) {
      return "grid grid-cols-1 md:grid-cols-2 gap-6";
    }
    
    // Layout por defecto
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{category}</h3>
          {description && <p className="text-muted-foreground text-sm mt-1">{description}</p>}
        </div>
        <Button
          variant="ghost"
          className="flex items-center text-sm"
          onClick={handleSeeAllClick}
        >
          Ver todos <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {isLoading ? (
        <div className={getGridLayout()}>
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
        <div className={getGridLayout()}>
          {jobs.map((job) => (
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
              className="h-full flex flex-col"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobCategorySection; 