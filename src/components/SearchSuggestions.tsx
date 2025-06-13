import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Briefcase } from "lucide-react";

interface SearchSuggestionsProps {
  type: "job" | "location";
  onSelect: (value: string) => void;
  searchTerm: string;
}

const SearchSuggestions = ({
  type,
  onSelect,
  searchTerm,
}: SearchSuggestionsProps) => {
  const jobSuggestions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "UX Designer",
    "UI Designer",
    "Product Manager",
    "Data Scientist",
    "DevOps Engineer",
    "Software Engineer",
    "React Developer",
    "Node.js Developer",
    "Python Developer",
    "Java Developer",
    "Mobile Developer",
    "QA Engineer",
  ];

  const locationSuggestions = [
    "Remote",
    "San Francisco, CA",
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Seattle, WA",
    "Boston, MA",
    "Austin, TX",
    "Denver, CO",
    "Miami, FL",
    "Atlanta, GA",
    "Portland, OR",
    "Washington, DC",
    "Philadelphia, PA",
    "San Diego, CA",
  ];

  const suggestions = type === "job" ? jobSuggestions : locationSuggestions;
  const filteredSuggestions = suggestions
    .filter((suggestion) =>
      suggestion.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .slice(0, 8);

  if (filteredSuggestions.length === 0) {
    return null;
  }

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg border">
      <CardContent className="p-2">
        <div className="space-y-1">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
              onClick={() => onSelect(suggestion)}
            >
              {type === "job" ? (
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              ) : (
                <MapPin className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">{suggestion}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchSuggestions;
