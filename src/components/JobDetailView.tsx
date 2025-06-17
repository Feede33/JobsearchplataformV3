import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  BookmarkIcon,
  BriefcaseIcon,
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  MapPinIcon,
  ShareIcon,
  FileText,
} from "lucide-react";
import jobDetails from "@/data/jobDetails";
import ResumeAnalyzer from "./ResumeAnalyzer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JobDetailProps {
  jobId?: string;
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
}

interface ApplicationFormProps {
  jobId: string;
  jobTitle: string;
  company: string;
  onSubmit: () => void;
  resumeAnalysisResult?: any;
}

// Simple ApplicationForm component since we can't import it properly
const ApplicationForm: React.FC<ApplicationFormProps> = ({
  jobId,
  jobTitle,
  company,
  onSubmit,
  resumeAnalysisResult,
}) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">
          Application for {jobTitle} at {company}
        </h3>
        <p className="text-sm text-muted-foreground">
          Please fill out the form below to apply for this position.
        </p>
        
        {resumeAnalysisResult && (
          <div className="mt-2 p-3 bg-muted rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Análisis de CV</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Compatibilidad:</span>
              <Badge 
                variant={resumeAnalysisResult.score >= 80 ? "secondary" : 
                       resumeAnalysisResult.score >= 60 ? "outline" : "destructive"}
                className={resumeAnalysisResult.score >= 80 ? "bg-green-100 text-green-800" : 
                          resumeAnalysisResult.score >= 60 ? "bg-amber-100 text-amber-800" : ""}
              >
                {resumeAnalysisResult.score}%
              </Badge>
            </div>
          </div>
        )}
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="resume" className="text-sm font-medium">
            Resume
          </label>
          <input
            id="resume"
            type="file"
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="cover" className="text-sm font-medium">
            Cover Letter (Optional)
          </label>
          <textarea
            id="cover"
            className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
          />
        </div>
        <Button onClick={onSubmit} className="w-full">
          Submit Application
        </Button>
      </div>
    </div>
  );
};

const JobDetailView: React.FC<JobDetailProps> = ({
  jobId,
  onApply = () => {},
  onSave = () => {},
}) => {
  const params = useParams();
  const urlJobId = params.id;
  
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [resumeAnalysisResult, setResumeAnalysisResult] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>("application");

  useEffect(() => {
    // Usar el ID de la URL o el proporcionado como prop
    const currentJobId = urlJobId || jobId || "1";
    
    // Buscar el trabajo por ID en jobDetails
    const foundJob = jobDetails.find(j => j.id === currentJobId);
    if (foundJob) {
      setJob(foundJob);
    } else {
      // Si no se encuentra, usar el primer trabajo como fallback
      setJob(jobDetails[0]);
    }
  }, [jobId, urlJobId]);

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    onSave(job?.id);
  };

  const handleApplyClick = () => {
    setShowApplicationForm(true);
  };

  const handleAnalysisComplete = (result: any) => {
    setResumeAnalysisResult(result);
    setActiveTab("application");
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Si aún no se ha cargado el trabajo, mostrar un estado de carga
  if (!job) {
    return <div className="p-8 text-center">Cargando detalles del empleo...</div>;
  }

  return (
    <div className="bg-background w-full max-w-4xl mx-auto p-4 rounded-lg">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                <img
                  src={job.companyLogo}
                  alt={`${job.company} logo`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {job.title}
                </CardTitle>
                <CardDescription className="text-lg">
                  {job.company}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSaveJob}
                className={isSaved ? "text-primary bg-primary/10" : ""}
              >
                <BookmarkIcon className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <ShareIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPinIcon className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSignIcon className="h-4 w-4" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <BriefcaseIcon className="h-4 w-4" />
              <span>{job.employmentType}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>Posted {formatDate(job.postedDate)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {job.requirements && job.requirements.slice(0, 5).map((req: string, idx: number) => (
              <Badge key={idx}>
                {req.split(" ")[0]}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            <p className="text-muted-foreground">{job.description}</p>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {job.responsibilities && job.responsibilities.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {job.requirements && job.requirements.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Benefits</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {job.benefits && job.benefits.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">About the Company</h3>
            <div className="flex items-center gap-3 mb-3">
              <BuildingIcon className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{job.company}</span>
            </div>
            <p className="text-muted-foreground">
              {job.company} es una empresa líder en su sector, comprometida con la innovación y el desarrollo profesional de sus empleados. Ofrecemos un ambiente de trabajo colaborativo donde valoramos el talento, la creatividad y la iniciativa.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>
              Apply before{" "}
              {formatDate(
                new Date(
                  new Date(job.postedDate).setMonth(
                    new Date(job.postedDate).getMonth() + 1,
                  ),
                ).toISOString(),
              )}
            </span>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveJob}>
              {isSaved ? "Saved" : "Save Job"}
            </Button>

            <Dialog
              open={showApplicationForm}
              onOpenChange={setShowApplicationForm}
            >
              <DialogTrigger asChild>
                <Button onClick={handleApplyClick}>Apply Now</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Apply for {job.title}</DialogTitle>
                  <DialogDescription>
                    Complete the application form below to apply for this
                    position at {job.company}.
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="analyze">Analizar CV</TabsTrigger>
                    <TabsTrigger value="application">Formulario de aplicación</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="analyze" className="mt-4">
                    <ResumeAnalyzer 
                      jobData={job}
                      onComplete={handleAnalysisComplete}
                    />
                  </TabsContent>
                  
                  <TabsContent value="application" className="mt-4">
                    <ApplicationForm
                      jobId={job.id}
                      jobTitle={job.title}
                      company={job.company}
                      resumeAnalysisResult={resumeAnalysisResult}
                      onSubmit={() => {
                        onApply(job.id);
                        setShowApplicationForm(false);
                      }}
                    />
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default JobDetailView;
