import { supabase } from "./supabase";

/**
 * Tipos para recomendaciones de trabajos
 */
interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  type: string;
  requirements: string[];
  posted: string;
  score?: number;
  category?: string;
}

interface RecommendationOptions {
  userId?: string;
  location?: string;
  skills?: string[];
  limit?: number;
  categories?: string[];
}

/**
 * Obtiene trabajos recomendados personalizados para un usuario
 */
export const getPersonalizedJobRecommendations = async (
  options: RecommendationOptions = {}
): Promise<JobRecommendation[]> => {
  try {
    const { userId, location, skills, limit = 6, categories } = options;
    
    // En una implementación real, aquí consultaríamos la base de datos
    // y aplicaríamos algoritmos de recomendación basados en:
    // 1. Historial del usuario (búsquedas, clics, aplicaciones)
    // 2. Ubicación
    // 3. Habilidades
    // 4. Tendencias del mercado

    // Por ahora, simulamos recomendaciones con datos mock
    const mockRecommendations = generateMockRecommendations(userId, location, skills, categories);
    return mockRecommendations.slice(0, limit);
  } catch (error) {
    console.error("Error al obtener recomendaciones:", error);
    return [];
  }
};

/**
 * Obtiene trabajos destacados por categoría
 */
export const getFeaturedJobsByCategory = async (
  category: string,
  limit: number = 4
): Promise<JobRecommendation[]> => {
  try {
    // En implementación real, consultaríamos la base de datos
    const mockJobs = generateMockRecommendations(undefined, undefined, undefined, [category]);
    return mockJobs.slice(0, limit);
  } catch (error) {
    console.error(`Error al obtener trabajos destacados para ${category}:`, error);
    return [];
  }
};

/**
 * Obtiene las categorías de trabajo más populares
 */
export const getPopularJobCategories = async (): Promise<string[]> => {
  // En implementación real, consultaríamos la base de datos para obtener categorías populares
  return [
    "Desarrollo de Software",
    "Marketing Digital",
    "Diseño UX/UI",
    "Ciencia de Datos",
    "IT Infrastructure",
    "Recursos Humanos",
    "Finanzas y Administración",
    "Educación",
    "Ventas",
    "Atención al Cliente"
  ];
};

/**
 * Obtiene trabajos tendencia basados en actividad reciente
 */
export const getTrendingJobs = async (limit: number = 3): Promise<JobRecommendation[]> => {
  try {
    // En implementación real, consultaríamos la base de datos para obtener trabajos con más interacciones recientes
    const mockTrending = generateMockRecommendations();
    
    // Asegurar que siempre devolvemos suficientes trabajos para llenar el espacio
    const minItems = 8; // Mínimo de elementos para llenar la sección
    const actualLimit = Math.max(limit, minItems);
    
    // Ordenar por "tendencia" (simulado)
    return mockTrending
      .sort(() => 0.5 - Math.random()) // Mezcla aleatoria para simular tendencias diferentes
      .slice(0, actualLimit);
  } catch (error) {
    console.error("Error al obtener trabajos en tendencia:", error);
    return [];
  }
};

/**
 * Genera recomendaciones de trabajo simuladas para demostración
 * En una implementación real, esto vendría de la base de datos
 */
const generateMockRecommendations = (
  userId?: string,
  userLocation?: string,
  userSkills?: string[],
  categories?: string[]
): JobRecommendation[] => {
  // Base de trabajos mock
  const allJobs = [
    {
      id: "1",
      title: "Frontend Developer",
      company: "TechCorp",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp",
      location: "Montevideo",
      salary: "$80,000 - $120,000",
      type: "Full-time",
      requirements: ["React", "TypeScript", "3+ years experience"],
      posted: "2 days ago",
      category: "Desarrollo de Software",
      score: 0
    },
    {
      id: "2",
      title: "UX Designer",
      company: "DesignHub",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=DesignHub",
      location: "Remote",
      salary: "$70,000 - $90,000",
      type: "Contract",
      requirements: ["Figma", "User Research", "Prototyping"],
      posted: "1 week ago",
      category: "Diseño UX/UI",
      score: 0
    },
    {
      id: "3",
      title: "Backend Engineer",
      company: "DataSystems",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=DataSystems",
      location: "Canelones",
      salary: "$100,000 - $140,000",
      type: "Full-time",
      requirements: ["Node.js", "PostgreSQL", "AWS"],
      posted: "3 days ago",
      category: "Desarrollo de Software",
      score: 0
    },
    {
      id: "4",
      title: "Product Manager",
      company: "InnovateCo",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=InnovateCo",
      location: "Maldonado",
      salary: "$90,000 - $130,000",
      type: "Full-time",
      requirements: ["Agile", "Roadmapping", "5+ years experience"],
      posted: "Just now",
      category: "Gestión de Productos",
      score: 0
    },
    {
      id: "5",
      title: "DevOps Engineer",
      company: "CloudTech",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=CloudTech",
      location: "Colonia",
      salary: "$110,000 - $150,000",
      type: "Full-time",
      requirements: ["Kubernetes", "Docker", "CI/CD"],
      posted: "5 days ago",
      category: "Desarrollo de Software",
      score: 0
    },
    {
      id: "6",
      title: "Data Scientist",
      company: "AnalyticsPro",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnalyticsPro",
      location: "Montevideo",
      salary: "$95,000 - $135,000",
      type: "Part-time",
      requirements: ["Python", "Machine Learning", "SQL"],
      posted: "1 day ago",
      category: "Ciencia de Datos",
      score: 0
    },
    {
      id: "7",
      title: "Marketing Specialist",
      company: "GrowthLabs",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=GrowthLabs",
      location: "Remote",
      salary: "$60,000 - $85,000",
      type: "Full-time",
      requirements: ["SEO", "Content Marketing", "Analytics"],
      posted: "3 days ago",
      category: "Marketing Digital",
      score: 0
    },
    {
      id: "8",
      title: "Customer Support Representative",
      company: "ServiceFirst",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=ServiceFirst",
      location: "Montevideo",
      salary: "$35,000 - $45,000",
      type: "Full-time",
      requirements: ["Communication", "Problem Solving", "CRM Software"],
      posted: "1 week ago",
      category: "Atención al Cliente",
      score: 0
    },
    {
      id: "9",
      title: "Sales Executive",
      company: "RevenuePro",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=RevenuePro",
      location: "Punta del Este",
      salary: "$50,000 - $80,000 + commission",
      type: "Full-time",
      requirements: ["B2B Sales", "Negotiation", "CRM"],
      posted: "2 days ago",
      category: "Ventas",
      score: 0
    },
    {
      id: "10",
      title: "Mobile Developer",
      company: "AppWorks",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=AppWorks",
      location: "Remote",
      salary: "$85,000 - $110,000",
      type: "Full-time",
      requirements: ["React Native", "iOS", "Android"],
      posted: "4 days ago",
      category: "Desarrollo de Software",
      score: 0
    },
    {
      id: "11",
      title: "Content Writer",
      company: "MediaHub",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=MediaHub",
      location: "Remote",
      salary: "$45,000 - $65,000",
      type: "Contract",
      requirements: ["SEO Writing", "Copywriting", "Research"],
      posted: "1 week ago",
      category: "Marketing Digital",
      score: 0
    },
    {
      id: "12",
      title: "UI Designer",
      company: "CreativeStudio",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=CreativeStudio",
      location: "Montevideo",
      salary: "$70,000 - $90,000",
      type: "Full-time",
      requirements: ["Adobe XD", "Sketch", "UI/UX"],
      posted: "3 days ago",
      category: "Diseño UX/UI",
      score: 0
    },
    {
      id: "13",
      title: "Network Administrator",
      company: "TechInfra",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechInfra",
      location: "Montevideo",
      salary: "$65,000 - $85,000",
      type: "Full-time",
      requirements: ["Cisco", "Networking", "Firewall Management"],
      posted: "2 days ago",
      category: "IT Infrastructure",
      score: 0
    },
    {
      id: "14",
      title: "System Administrator",
      company: "CloudServices",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=CloudServices",
      location: "Remote",
      salary: "$70,000 - $90,000",
      type: "Full-time",
      requirements: ["Windows Server", "Linux", "Azure"],
      posted: "5 days ago",
      category: "IT Infrastructure",
      score: 0
    },
    {
      id: "15",
      title: "HR Manager",
      company: "PeopleCo",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=PeopleCo",
      location: "Montevideo",
      salary: "$75,000 - $95,000",
      type: "Full-time",
      requirements: ["Recruiting", "Employee Relations", "HR Policies"],
      posted: "1 week ago",
      category: "Recursos Humanos",
      score: 0
    },
    {
      id: "16",
      title: "Talent Acquisition Specialist",
      company: "TalentHub",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=TalentHub",
      location: "Remote",
      salary: "$55,000 - $70,000",
      type: "Full-time",
      requirements: ["Recruiting", "ATS Systems", "Interviewing"],
      posted: "3 days ago",
      category: "Recursos Humanos",
      score: 0
    },
    {
      id: "17",
      title: "Financial Analyst",
      company: "FinancePro",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=FinancePro",
      location: "Montevideo",
      salary: "$65,000 - $85,000",
      type: "Full-time",
      requirements: ["Financial Modeling", "Excel", "Data Analysis"],
      posted: "2 days ago",
      category: "Finanzas y Administración",
      score: 0
    },
    {
      id: "18",
      title: "Accountant",
      company: "AccountWorks",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=AccountWorks",
      location: "Maldonado",
      salary: "$55,000 - $75,000",
      type: "Full-time",
      requirements: ["Accounting", "Tax Preparation", "Financial Reporting"],
      posted: "1 week ago",
      category: "Finanzas y Administración",
      score: 0
    },
    {
      id: "19",
      title: "Online Course Instructor",
      company: "EduPlatform",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=EduPlatform",
      location: "Remote",
      salary: "$50,000 - $70,000",
      type: "Contract",
      requirements: ["Teaching", "Course Development", "Video Production"],
      posted: "3 days ago",
      category: "Educación",
      score: 0
    },
    {
      id: "20",
      title: "School Teacher",
      company: "LearnHub",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=LearnHub",
      location: "Montevideo",
      salary: "$45,000 - $60,000",
      type: "Full-time",
      requirements: ["Teaching License", "Curriculum Development", "Student Evaluation"],
      posted: "2 weeks ago",
      category: "Educación",
      score: 0
    },
  ];

  // Filtrar por categoría si se especifica
  let filteredJobs = [...allJobs];
  if (categories && categories.length > 0) {
    filteredJobs = filteredJobs.filter(job => 
      categories.some(category => job.category.toLowerCase().includes(category.toLowerCase()))
    );
  }

  // Si no hay trabajos después del filtro, devolver todos
  if (filteredJobs.length === 0) {
    filteredJobs = [...allJobs];
  }

  // Simular personalización
  if (userId) {
    // Aquí simularíamos reordenar basado en preferencias del usuario
    // Por ahora solo mezclamos para que cada usuario vea un orden diferente
    filteredJobs = filteredJobs.sort(() => 0.5 - Math.random());
  }

  // Dar prioridad a trabajos que coincidan con la ubicación del usuario
  if (userLocation) {
    filteredJobs.sort((a, b) => {
      const aMatchesLocation = a.location.toLowerCase().includes(userLocation.toLowerCase()) || 
                              a.location === "Remote";
      const bMatchesLocation = b.location.toLowerCase().includes(userLocation.toLowerCase()) || 
                              b.location === "Remote";
      
      if (aMatchesLocation && !bMatchesLocation) return -1;
      if (!aMatchesLocation && bMatchesLocation) return 1;
      return 0;
    });
  }

  // Dar prioridad a trabajos que coincidan con las habilidades del usuario
  if (userSkills && userSkills.length > 0) {
    filteredJobs.forEach(job => {
      job.score = 0;
      userSkills.forEach(skill => {
        if (job.requirements.some(req => req.toLowerCase().includes(skill.toLowerCase()))) {
          job.score! += 1;
        }
      });
    });
    
    filteredJobs.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  return filteredJobs;
};

/**
 * Registra interacción del usuario con un trabajo para mejorar recomendaciones futuras
 */
export const trackJobInteraction = async (
  userId: string,
  jobId: string,
  interactionType: 'view' | 'click' | 'apply' | 'save'
): Promise<void> => {
  try {
    // En implementación real, guardaríamos esta interacción en la base de datos
    // para usarla en el algoritmo de recomendación
    console.log(`Tracking interaction: User ${userId} - Job ${jobId} - Type: ${interactionType}`);
    
    // Guardar en Supabase
    await supabase.from("job_interactions").insert([
      {
        user_id: userId,
        job_id: jobId,
        interaction_type: interactionType,
        timestamp: new Date().toISOString(),
      },
    ]);
  } catch (error) {
    console.error("Error al registrar interacción:", error);
  }
}; 