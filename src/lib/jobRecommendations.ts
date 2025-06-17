import { supabase } from "./supabase";

/**
 * Tipos para recomendaciones de trabajos
 */
interface JobRecommendation {
  id: string | number;
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
  is_featured?: boolean;
  is_remote?: boolean;
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
  userId?: string,
  limit: number = 6,
  createNotifications: boolean = false
): Promise<any[]> => {
  try {
    // Si no hay usuario, devolver trabajos destacados genéricos
    if (!userId) {
      return await getFeaturedJobs(limit);
    }

    // Obtener perfil de usuario para ver sus habilidades e intereses
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Obtener historial de interacciones del usuario
    const { data: interactions } = await supabase
      .from('user_events')
      .select('*')
      .eq('user_id', userId)
      .eq('event_type', 'job_interaction')
      .order('created_at', { ascending: false })
      .limit(20);

    // Extraer IDs de trabajos con los que el usuario ha interactuado
    const interactedJobIds = interactions
      ? interactions.map(i => i.event_details?.job_id).filter(Boolean)
      : [];

    // Obtener categorías de trabajos con las que el usuario ha interactuado
    const { data: savedJobs } = await supabase
      .from('saved_jobs')
      .select('job_data')
      .eq('user_id', userId);

    const categories = savedJobs
      ? [...new Set(savedJobs.map(job => job.job_data?.category).filter(Boolean))]
      : [];

    // Obtener trabajos recomendados basados en categorías de interés
    let recommendedJobs: any[] = [];
    
    if (categories.length > 0) {
      // Obtener trabajos de categorías similares
      const { data: categoryJobs } = await supabase
        .from('jobs')
        .select('*')
        .in('category', categories)
        .order('score', { ascending: false })
        .limit(limit * 2);
        
      if (categoryJobs) {
        recommendedJobs = categoryJobs;
      }
    }

    // Si no hay suficientes trabajos recomendados por categoría, obtener trabajos populares
    if (recommendedJobs.length < limit) {
      const { data: popularJobs } = await supabase
        .from('jobs')
        .select('*')
        .order('score', { ascending: false })
        .limit(limit * 2);
        
      if (popularJobs) {
        // Combinar con los trabajos ya recomendados, evitando duplicados
        const existingIds = recommendedJobs.map(job => job.id);
        const newJobs = popularJobs.filter(job => !existingIds.includes(job.id));
        recommendedJobs = [...recommendedJobs, ...newJobs];
      }
    }

    // Filtrar trabajos con los que el usuario ya ha interactuado
    recommendedJobs = recommendedJobs.filter(job => !interactedJobIds.includes(job.id));

    // Limitar al número solicitado
    recommendedJobs = recommendedJobs.slice(0, limit);

    // Si se solicita crear notificaciones y hay trabajos recomendados
    if (createNotifications && recommendedJobs.length > 0) {
      try {
        // Importar la función para crear notificaciones
        const { createNotification, notifyJobMatch } = await import('./jobInteractions');
        
        // Obtener las notificaciones existentes para no duplicar
        const { data: existingNotifications } = await supabase
          .from('notifications')
          .select('data')
          .eq('user_id', userId)
          .eq('type', 'job_match')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Últimos 7 días
        
        // Extraer IDs de trabajos ya notificados
        const notifiedJobIds = existingNotifications 
          ? existingNotifications.map(n => n.data?.jobId).filter(Boolean)
          : [];
        
        // Crear notificaciones solo para trabajos que no han sido notificados recientemente
        for (const job of recommendedJobs.slice(0, 3)) { // Limitar a 3 notificaciones máximo
          if (!notifiedJobIds.includes(job.id)) {
            await notifyJobMatch(userId, job);
          }
        }
      } catch (notifError) {
        console.error('Error al crear notificaciones de trabajos recomendados:', notifError);
        // No interrumpimos el flujo si fallan las notificaciones
      }
    }

    return recommendedJobs;
  } catch (error) {
    console.error('Error al obtener recomendaciones personalizadas:', error);
    return await getFeaturedJobs(limit);
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
    // Intentar usar la función de Supabase
    try {
      const { data, error } = await supabase
        .rpc('get_jobs_by_category', { 
          p_category: category,
          p_limit: limit
        });
      
      if (data && !error && data.length > 0) {
        console.log(`Usando datos de Supabase para categoría ${category}`);
        return data.map(job => formatJobData(job));
      }
    } catch (err) {
      console.warn(`Error al obtener trabajos por categoría ${category}:`, err);
    }
    
    // Intentar consulta directa a la tabla
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('category', category)
        .order('is_featured', { ascending: false })
        .limit(limit);
      
      if (data && !error && data.length > 0) {
        console.log(`Usando datos de la tabla jobs para categoría ${category}`);
        return data.map(job => formatJobData(job));
      }
    } catch (err) {
      console.warn(`Error al consultar tabla jobs para categoría ${category}:`, err);
    }
    
    // Fallback a datos mock
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
  try {
    // Intentar obtener categorías únicas de la tabla jobs
    const { data, error } = await supabase
      .from('jobs')
      .select('category')
      .order('category');
    
    if (data && !error && data.length > 0) {
      // Extraer categorías únicas
      const categories = [...new Set(data.map(job => job.category))];
      return categories;
    }
  } catch (err) {
    console.warn('Error al obtener categorías:', err);
  }
  
  // Fallback a categorías predefinidas
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
    // Intentar usar la función de Supabase
    try {
      const { data, error } = await supabase
        .rpc('get_trending_jobs', { p_limit: limit });
      
      if (data && !error && data.length > 0) {
        console.log('Usando datos de tendencias de Supabase');
        return data.map(job => formatJobData(job));
      }
    } catch (err) {
      console.warn('Error al obtener trabajos en tendencia:', err);
    }
    
    // Intentar consulta directa ordenando por fecha
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(Math.max(limit, 8)); // Asegurar suficientes elementos
      
      if (data && !error && data.length > 0) {
        console.log('Usando datos recientes como tendencias');
        return data.map(job => formatJobData(job));
      }
    } catch (err) {
      console.warn('Error al consultar tabla jobs para tendencias:', err);
    }
    
    // Fallback a datos mock
    const mockTrending = generateMockRecommendations();
    const minItems = 8; // Mínimo de elementos para llenar la sección
    const actualLimit = Math.max(limit, minItems);
    return mockTrending
      .sort(() => 0.5 - Math.random())
      .slice(0, actualLimit);
  } catch (error) {
    console.error("Error al obtener trabajos en tendencia:", error);
    return [];
  }
};

/**
 * Formatea datos de trabajo desde Supabase al formato de la aplicación
 */
const formatJobData = (job: any): JobRecommendation => {
  // Convertir requirements de string JSON a array si es necesario
  let requirements: string[] = [];
  if (job.requirements) {
    if (typeof job.requirements === 'string') {
      try {
        requirements = JSON.parse(job.requirements);
      } catch (e) {
        requirements = [job.requirements];
      }
    } else if (Array.isArray(job.requirements)) {
      requirements = job.requirements;
    } else if (typeof job.requirements === 'object') {
      requirements = Object.values(job.requirements);
    }
  }
  
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    logo: job.logo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${job.company}`,
    location: job.location,
    salary: job.salary || 'No especificado',
    type: job.type || 'Full-time',
    requirements: requirements,
    posted: job.posted_date || 'Recently',
    category: job.category,
    score: job.score || 0,
    is_featured: job.is_featured || false,
    is_remote: job.is_remote || false
  };
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
    {
      id: "21",
      title: "AI Research Scientist",
      company: "NeuralTech",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=NeuralTech",
      location: "Montevideo",
      salary: "$120,000 - $160,000",
      type: "Full-time",
      requirements: ["PhD/Masters", "PyTorch/TensorFlow", "Research Experience"],
      posted: "Just now",
      category: "Ciencia de Datos",
      score: 0
    },
    {
      id: "22",
      title: "E-commerce Manager",
      company: "RetailFuture",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=RetailFuture",
      location: "Punta del Este",
      salary: "$70,000 - $95,000",
      type: "Full-time",
      requirements: ["Shopify/WooCommerce", "Analytics", "Digital Marketing"],
      posted: "2 days ago",
      category: "Marketing Digital",
      score: 0
    },
    {
      id: "23",
      title: "Blockchain Developer",
      company: "CryptoInnovate",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoInnovate",
      location: "Remote",
      salary: "$100,000 - $140,000",
      type: "Contract",
      requirements: ["Solidity", "Web3.js", "Smart Contracts"],
      posted: "3 days ago",
      category: "Desarrollo de Software",
      score: 0
    },
    {
      id: "24",
      title: "Sustainability Consultant",
      company: "GreenFuture",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=GreenFuture",
      location: "Montevideo",
      salary: "$65,000 - $90,000",
      type: "Full-time",
      requirements: ["ESG", "Environmental Science", "Sustainability"],
      posted: "1 week ago",
      category: "Consultoría",
      score: 0
    },
    {
      id: "25",
      title: "Game Developer",
      company: "PlayVerse",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=PlayVerse",
      location: "Montevideo",
      salary: "$75,000 - $110,000",
      type: "Full-time",
      requirements: ["Unity/Unreal", "C#/C++", "Game Design"],
      posted: "4 days ago",
      category: "Desarrollo de Software",
      score: 0
    },
    {
      id: "26",
      title: "Arquitecto de Software",
      company: "SystemArchitects",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=SystemArchitects",
      location: "Montevideo",
      salary: "$110,000 - $150,000",
      type: "Full-time",
      requirements: ["System Design", "Microservices", "Design Patterns"],
      posted: "Just now",
      category: "Desarrollo de Software",
      score: 0
    },
    {
      id: "27",
      title: "Community Manager",
      company: "SocialBoost",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=SocialBoost",
      location: "Remote",
      salary: "$45,000 - $65,000",
      type: "Full-time",
      requirements: ["Social Media", "Content Creation", "Community Building"],
      posted: "5 days ago",
      category: "Marketing Digital",
      score: 0
    },
    {
      id: "28",
      title: "Especialista en Ciberseguridad",
      company: "SecureDefense",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=SecureDefense",
      location: "Montevideo",
      salary: "$90,000 - $130,000",
      type: "Full-time",
      requirements: ["Penetration Testing", "CISSP/CEH", "Security Tools"],
      posted: "Just now",
      category: "IT Infrastructure",
      score: 0
    },
    {
      id: "29",
      title: "Analista de Datos",
      company: "DataInsight",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=DataInsight",
      location: "Canelones",
      salary: "$65,000 - $85,000",
      type: "Full-time",
      requirements: ["SQL", "Power BI/Tableau", "Python/R"],
      posted: "3 days ago",
      category: "Ciencia de Datos",
      score: 0
    },
    {
      id: "30",
      title: "Ingeniero DevSecOps",
      company: "SecureFlow",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=SecureFlow",
      location: "Remote",
      salary: "$95,000 - $135,000",
      type: "Full-time",
      requirements: ["CI/CD", "Docker/Kubernetes", "Security Automation"],
      posted: "2 days ago",
      category: "IT Infrastructure",
      score: 0
    }
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

/**
 * Obtiene trabajos destacados
 */
export const getFeaturedJobs = async (limit: number = 6): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_featured', true)
      .order('score', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error al obtener trabajos destacados:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error inesperado al obtener trabajos destacados:', error);
    return [];
  }
}; 