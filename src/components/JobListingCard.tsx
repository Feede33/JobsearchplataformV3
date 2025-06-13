import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, DollarSign, Clock } from "lucide-react";

interface JobListingCardProps {
  id?: string;
  companyLogo?: string;
  jobTitle?: string;
  companyName?: string;
  location?: string;
  salaryRange?: string;
  employmentType?: string;
  keyRequirements?: string[];
  postedDate?: string;
  onClick?: () => void;
}

const JobListingCard = ({
  id = "1",
  companyLogo = "https://api.dicebear.com/7.x/avataaars/svg?seed=company",
  jobTitle = "Software Engineer",
  companyName = "Tech Company Inc.",
  location = "San Francisco, CA",
  salaryRange = "$100,000 - $130,000",
  employmentType = "Full-time",
  keyRequirements = ["React", "TypeScript", "Node.js"],
  postedDate = "2 days ago",
  onClick = () => console.log("Job card clicked"),
}: JobListingCardProps) => {
  return (
    <Card
      className="w-full max-w-[350px] h-[220px] overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
            <img
              src={companyLogo}
              alt={`${companyName} logo`}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{jobTitle}</h3>
            <p className="text-sm text-muted-foreground">{companyName}</p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{location}</span>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{salaryRange}</span>
          </div>

          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{employmentType}</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {keyRequirements.slice(0, 3).map((req, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {req}
            </Badge>
          ))}
          {keyRequirements.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{keyRequirements.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>{postedDate}</span>
        </div>
        <Button size="sm" variant="outline">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobListingCard;
