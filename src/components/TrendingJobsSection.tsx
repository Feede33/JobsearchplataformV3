import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, TrendingUp, Clock } from "lucide-react";
import { getTrendingJobs } from "@/lib/jobRecommendations";
import { useNavigate } from "react-router-dom";

interface TrendingJobsSectionProps {
  limit?: number;
}

const TrendingJobsSection = ({ limit = 3 }: TrendingJobsSectionProps) => {
  const [trendingJobs, setTrendingJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrendingJobs = async () => {
      setIsLoading(true);
      const jobs = await getTrendingJobs(limit);
      setTrendingJobs(jobs);
      setIsLoading(false);
    };

    loadTrendingJobs();
  }, [limit]);

  const handleJobClick = (job: any) => {
    navigate("/search-results", { 
      state: { 
        jobId: job.id,
        searchTerm: job.title 
      } 
    });
  };

  return (
    <div className="h-full border rounded-lg p-4 sm:p-6 bg-white shadow-sm flex flex-col">
      <div className="flex items-center gap-2 mb-4 sm:mb-5">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Trabajos en tendencia</h3>
      </div>

      {isLoading ? (
        <div className="space-y-3 flex-grow">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse"></div>
            ))}
        </div>
      ) : (
        <div className="space-y-3 flex-grow">
          {trendingJobs.slice(0, 8).map((job) => (
            <Card
              key={job.id}
              className="overflow-hidden hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer h-[110px]"
              onClick={() => handleJobClick(job)}
            >
              <CardContent className="p-3 h-full flex flex-col justify-between">
                {/* Fila superior: logo, título y empresa */}
                <div className="flex items-start gap-2">
                  <div className="h-10 w-10 rounded-md overflow-hidden border flex-shrink-0">
                    <img
                      src={job.logo}
                      alt={`${job.company} logo`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm truncate pr-1">{job.title}</h4>
                    <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                      <span className="truncate max-w-[150px]">{job.company}</span>
                    </div>
                  </div>
                </div>
                
                {/* Fila inferior: ubicación, tipo y fecha */}
                <div className="flex flex-wrap items-center justify-between gap-y-2 ml-12 mt-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate max-w-[120px]">{job.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs py-0 h-5 whitespace-nowrap">
                      <Briefcase className="h-3 w-3 mr-1 flex-shrink-0" />
                      {job.type}
                    </Badge>
                    <Badge variant="secondary" className="text-xs py-0 h-5 whitespace-nowrap">
                      {job.posted}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingJobsSection; 