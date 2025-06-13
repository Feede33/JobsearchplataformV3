import React, { useState } from "react";
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
} from "lucide-react";

interface JobDetailProps {
  job?: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    employmentType: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    benefits: string[];
    postedDate: string;
    companyLogo: string;
  };
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
}

interface ApplicationFormProps {
  jobId: string;
  jobTitle: string;
  company: string;
  onSubmit: () => void;
}

// Simple ApplicationForm component since we can't import it properly
const ApplicationForm: React.FC<ApplicationFormProps> = ({
  jobId,
  jobTitle,
  company,
  onSubmit,
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
  job = {
    id: "1",
    title: "Senior Frontend Developer",
    company: "Tech Innovations Inc.",
    location: "San Francisco, CA (Remote)",
    salary: "$120,000 - $150,000",
    employmentType: "Full-time",
    description:
      "We are looking for an experienced Frontend Developer to join our growing team. You will be responsible for building and maintaining user interfaces for our web applications, ensuring high performance and responsiveness.",
    responsibilities: [
      "Develop and maintain responsive web applications using React",
      "Collaborate with backend developers to integrate frontend with APIs",
      "Optimize applications for maximum speed and scalability",
      "Implement UI/UX designs with attention to detail",
      "Write clean, maintainable code and perform code reviews",
    ],
    requirements: [
      "5+ years of experience in frontend development",
      "Strong proficiency in JavaScript, HTML, CSS, and React",
      "Experience with state management libraries (Redux, MobX, etc.)",
      "Knowledge of modern frontend build pipelines and tools",
      "Excellent problem-solving skills and attention to detail",
    ],
    benefits: [
      "Competitive salary and equity options",
      "Comprehensive health, dental, and vision insurance",
      "Flexible work hours and remote work options",
      "401(k) matching program",
      "Professional development budget",
    ],
    postedDate: "2023-06-15",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=techcompany",
  },
  onApply = () => {},
  onSave = () => {},
}) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    onSave(job.id);
  };

  const handleApplyClick = () => {
    setShowApplicationForm(true);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
            <Badge>React</Badge>
            <Badge>JavaScript</Badge>
            <Badge>TypeScript</Badge>
            <Badge>Frontend</Badge>
            <Badge>UI/UX</Badge>
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
              {job.responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {job.requirements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Benefits</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {job.benefits.map((item, index) => (
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
              Tech Innovations Inc. is a leading software development company
              specializing in creating cutting-edge web and mobile applications.
              With a team of talented developers, designers, and product
              managers, we deliver high-quality solutions to clients across
              various industries.
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
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Apply for {job.title}</DialogTitle>
                  <DialogDescription>
                    Complete the application form below to apply for this
                    position at {job.company}.
                  </DialogDescription>
                </DialogHeader>
                <ApplicationForm
                  jobId={job.id}
                  jobTitle={job.title}
                  company={job.company}
                  onSubmit={() => {
                    onApply(job.id);
                    setShowApplicationForm(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default JobDetailView;
