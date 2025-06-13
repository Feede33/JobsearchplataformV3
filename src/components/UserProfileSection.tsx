import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  BriefcaseIcon,
  BookmarkIcon,
  TrashIcon,
  ExternalLinkIcon,
} from "lucide-react";

interface Application {
  id: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  appliedDate: string;
  status: "pending" | "reviewed" | "interview" | "rejected" | "accepted";
}

interface SavedJob {
  id: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  location: string;
  salary: string;
  employmentType: string;
  savedDate: string;
}

interface UserProfileSectionProps {
  applications?: Application[];
  savedJobs?: SavedJob[];
}

const UserProfileSection = ({
  applications = [
    {
      id: "1",
      jobTitle: "Frontend Developer",
      companyName: "Tech Solutions Inc.",
      companyLogo:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=techsolutions",
      appliedDate: "2023-05-15",
      status: "interview",
    },
    {
      id: "2",
      jobTitle: "UX Designer",
      companyName: "Creative Minds",
      companyLogo:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=creativeminds",
      appliedDate: "2023-05-10",
      status: "pending",
    },
    {
      id: "3",
      jobTitle: "Full Stack Developer",
      companyName: "WebDev Experts",
      companyLogo:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=webdevexperts",
      appliedDate: "2023-05-05",
      status: "rejected",
    },
  ],
  savedJobs = [
    {
      id: "1",
      jobTitle: "Senior React Developer",
      companyName: "InnovateTech",
      companyLogo:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=innovatetech",
      location: "San Francisco, CA",
      salary: "$120,000 - $150,000",
      employmentType: "Full-time",
      savedDate: "2023-05-12",
    },
    {
      id: "2",
      jobTitle: "Product Manager",
      companyName: "Growth Startup",
      companyLogo:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=growthstartup",
      location: "Remote",
      salary: "$110,000 - $130,000",
      employmentType: "Full-time",
      savedDate: "2023-05-08",
    },
    {
      id: "3",
      jobTitle: "DevOps Engineer",
      companyName: "Cloud Systems",
      companyLogo:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=cloudsystems",
      location: "Austin, TX",
      salary: "$130,000 - $160,000",
      employmentType: "Full-time",
      savedDate: "2023-05-03",
    },
  ],
}: UserProfileSectionProps) => {
  const [activeApplications, setActiveApplications] =
    useState<Application[]>(applications);
  const [activeSavedJobs, setActiveSavedJobs] = useState<SavedJob[]>(savedJobs);

  const removeApplication = (id: string) => {
    setActiveApplications(activeApplications.filter((app) => app.id !== id));
  };

  const removeSavedJob = (id: string) => {
    setActiveSavedJobs(activeSavedJobs.filter((job) => job.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "interview":
        return "bg-purple-100 text-purple-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=userprofile"
              alt="User Profile"
            />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-grow">
          <h1 className="text-2xl font-bold">John Peterson</h1>
          <p className="text-gray-600">Frontend Developer</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline">React</Badge>
            <Badge variant="outline">TypeScript</Badge>
            <Badge variant="outline">UI/UX</Badge>
            <Badge variant="outline">Tailwind CSS</Badge>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" className="mr-2">
              Edit Profile
            </Button>
            <Button variant="outline" size="sm">
              Upload Resume
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="applications" className="text-base">
            <BriefcaseIcon className="mr-2 h-4 w-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="saved" className="text-base">
            <BookmarkIcon className="mr-2 h-4 w-4" />
            Saved Jobs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {activeApplications.length > 0 ? (
              activeApplications.map((application) => (
                <Card key={application.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={application.companyLogo}
                          alt={application.companyName}
                        />
                        <AvatarFallback>
                          {application.companyName.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">
                          {application.jobTitle}
                        </CardTitle>
                        <CardDescription>
                          {application.companyName}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}
                      >
                        {application.status.charAt(0).toUpperCase() +
                          application.status.slice(1)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Applied on{" "}
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeApplication(application.id)}
                    >
                      <TrashIcon className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No applications yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start applying to jobs to track your applications here.
                </p>
                <div className="mt-6">
                  <Button>Browse Jobs</Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {activeSavedJobs.length > 0 ? (
              activeSavedJobs.map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={job.companyLogo}
                          alt={job.companyName}
                        />
                        <AvatarFallback>
                          {job.companyName.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">
                          {job.jobTitle}
                        </CardTitle>
                        <CardDescription>{job.companyName}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {job.salary}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <BriefcaseIcon className="h-4 w-4 mr-1" />
                        {job.employmentType}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Saved on {new Date(job.savedDate).toLocaleDateString()}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button className="flex items-center">
                      Apply Now <ExternalLinkIcon className="ml-1 h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSavedJob(job.id)}
                    >
                      <TrashIcon className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <BookmarkIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No saved jobs
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Save jobs you're interested in to apply later.
                </p>
                <div className="mt-6">
                  <Button>Browse Jobs</Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfileSection;
