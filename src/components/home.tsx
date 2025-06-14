import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Filter,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import JobListingCard from "./JobListingCard";
import SearchSuggestions from "./SearchSuggestions";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [salaryRange, setSalaryRange] = useState([30000]);
  const [showFilters, setShowFilters] = useState(false);
  const [showJobSuggestions, setShowJobSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const jobInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const jobSuggestionsRef = useRef<HTMLDivElement>(null);
  const locationSuggestionsRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        jobSuggestionsRef.current &&
        !jobSuggestionsRef.current.contains(event.target as Node) &&
        !jobInputRef.current?.contains(event.target as Node)
      ) {
        setShowJobSuggestions(false);
      }
      if (
        locationSuggestionsRef.current &&
        !locationSuggestionsRef.current.contains(event.target as Node) &&
        !locationInputRef.current?.contains(event.target as Node)
      ) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mock job data for demonstration
  const mockJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp",
      location: "Montevideo",
      salary: "$80,000 - $120,000",
      type: "Full-time",
      requirements: ["React", "TypeScript", "3+ years experience"],
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "UX Designer",
      company: "DesignHub",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=DesignHub",
      location: "Remote",
      salary: "$70,000 - $90,000",
      type: "Contract",
      requirements: ["Figma", "User Research", "Prototyping"],
      posted: "1 week ago",
    },
    {
      id: 3,
      title: "Backend Engineer",
      company: "DataSystems",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=DataSystems",
      location: "Canelones",
      salary: "$100,000 - $140,000",
      type: "Full-time",
      requirements: ["Node.js", "PostgreSQL", "AWS"],
      posted: "3 days ago",
    },
    {
      id: 4,
      title: "Product Manager",
      company: "InnovateCo",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=InnovateCo",
      location: "Maldonado",
      salary: "$90,000 - $130,000",
      type: "Full-time",
      requirements: ["Agile", "Roadmapping", "5+ years experience"],
      posted: "Just now",
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudTech",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=CloudTech",
      location: "Colonia",
      salary: "$110,000 - $150,000",
      type: "Full-time",
      requirements: ["Kubernetes", "Docker", "CI/CD"],
      posted: "5 days ago",
    },
    {
      id: 6,
      title: "Data Scientist",
      company: "AnalyticsPro",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnalyticsPro",
      location: "Montevideo",
      salary: "$95,000 - $135,000",
      type: "Part-time",
      requirements: ["Python", "Machine Learning", "SQL"],
      posted: "1 day ago",
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowJobSuggestions(false);
    setShowLocationSuggestions(false);
    
    // Navegar a la página de resultados de búsqueda con los parámetros de búsqueda
    navigate('/search-results', { 
      state: { 
        searchTerm, 
        location, 
        employmentType: employmentType || "all", 
        salaryMin: salaryRange[0] 
      } 
    });
  };

  const handleJobSuggestionSelect = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowJobSuggestions(false);
  };

  const handleLocationSuggestionSelect = (suggestion: string) => {
    setLocation(suggestion);
    setShowLocationSuggestions(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1
              className="text-2xl font-bold text-primary cursor-pointer"
              onClick={() => navigate("/")}
            >
              JobSearch
            </h1>
            <nav className="ml-10 hidden md:flex space-x-6">
              <button
                onClick={() => navigate("/")}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Find Jobs
              </button>
              <a
                href="#"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Companies
              </a>
              <a
                href="#"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Resources
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {user?.name}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
                <Button size="sm">Post a Job</Button>
              </>
            )}
          </div>
        </div>
      </header>
      {/* Search Section */}
      <section className="bg-primary/5 py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Find Your Dream Job
          </h2>

          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-4 p-6 bg-white rounded-lg shadow-lg border">
              <div className="relative flex-1" ref={jobSuggestionsRef}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  ref={jobInputRef}
                  placeholder="Job title, keywords, or company"
                  className="pl-10 h-12 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowJobSuggestions(true)}
                  onMouseEnter={() => setShowJobSuggestions(true)}
                />
                {showJobSuggestions && (
                  <SearchSuggestions
                    type="job"
                    searchTerm={searchTerm}
                    onSelect={handleJobSuggestionSelect}
                  />
                )}
              </div>

              <div className="relative flex-1" ref={locationSuggestionsRef}>
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  ref={locationInputRef}
                  placeholder="Ciudad o departamento"
                  className="pl-10 h-12 text-base w-full"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onMouseEnter={() => setShowLocationSuggestions(true)}
                />
                {showLocationSuggestions && (
                  <SearchSuggestions
                    type="location"
                    searchTerm={location}
                    onSelect={handleLocationSuggestionSelect}
                  />
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="md:w-auto w-full h-12 px-8 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md transition-colors"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Jobs
              </Button>
            </div>

            <div className="flex items-center justify-between mb-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>

              <span className="text-sm text-muted-foreground">
                {mockJobs.length} jobs found
              </span>
            </div>

            {showFilters && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Employment Type
                      </label>
                      <Select
                        value={employmentType}
                        onValueChange={setEmploymentType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Salary Range (min: ${salaryRange[0].toLocaleString()})
                      </label>
                      <Slider
                        defaultValue={[30000]}
                        max={200000}
                        step={5000}
                        value={salaryRange}
                        onValueChange={setSalaryRange}
                        className="py-4"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </section>
      {/* Job Listings */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Featured Jobs</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockJobs.map((job) => (
              <JobListingCard
                key={job.id}
                id={job.id.toString()}
                jobTitle={job.title}
                companyName={job.company}
                companyLogo={job.logo}
                location={job.location}
                salaryRange={job.salary}
                employmentType={job.type}
                keyRequirements={job.requirements}
                postedDate={job.posted}
                onClick={() => navigate(`/job/${job.id}`)}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-muted py-10 mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">JobSearch</h3>
              <p className="text-sm text-muted-foreground">
                Find your dream job with our powerful job search platform.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-3">For Job Seekers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:underline">
                    Browse Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Career Advice
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Resume Builder
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3">For Employers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:underline">
                    Post a Job
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Talent Solutions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="hover:text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="hover:text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="hover:text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} JobSearch. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
