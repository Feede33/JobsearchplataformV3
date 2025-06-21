import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, TrendingUp, Clock } from "lucide-react";
import { getTrendingJobs } from "@/lib/jobRecommendations";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface TrendingJobsSectionProps {
  limit?: number;
  title?: string;
}

const TrendingJobsSection = ({ 
  limit = 3,
  title = "Trabajos en tendencia"
}: TrendingJobsSectionProps) => {
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
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1
    }
  };

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="h-full border rounded-lg p-4 sm:p-6 bg-white shadow-sm flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="flex items-center gap-2 mb-4 sm:mb-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </motion.div>

          {isLoading ? (
            <div className="space-y-3 flex-grow">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse"></div>
                ))}
            </div>
          ) : (
            <motion.div 
              className="space-y-3 flex-grow"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {trendingJobs.slice(0, 8).map((job) => (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="overflow-hidden hover:border-primary/30 hover:shadow-md transition-all cursor-pointer h-[110px]"
                    onClick={() => handleJobClick(job)}
                  >
                    <CardContent className="p-3 h-full flex flex-col justify-between">
                      {/* Fila superior: logo, título y empresa */}
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-md overflow-hidden border flex-shrink-0">
                          <img
                            src={job.logo}
                            alt={`${job.company} logo`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-sm truncate leading-tight">{job.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                            <span className="truncate max-w-[150px]">{job.company}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Fila inferior: ubicación, tipo y fecha */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                          <span className="truncate max-w-[120px]">{job.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs py-0 h-5 whitespace-nowrap flex items-center">
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
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TrendingJobsSection; 