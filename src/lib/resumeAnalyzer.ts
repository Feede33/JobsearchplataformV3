import { supabase, logEvent } from "./supabase";

// Palabras clave comunes por categoría de trabajo
const keywordsByCategory: Record<string, string[]> = {
  "tecnologia": [
    "javascript", "react", "node.js", "typescript", "python", "java", "aws", "cloud", 
    "docker", "kubernetes", "devops", "fullstack", "frontend", "backend", "api", 
    "microservicios", "agile", "scrum", "ci/cd", "testing", "git"
  ],
  "marketing": [
    "seo", "sem", "google analytics", "redes sociales", "content marketing", "email marketing",
    "inbound marketing", "crm", "hubspot", "analytics", "kpis", "campañas", "branding",
    "copywriting", "estrategia digital", "marketing automation"
  ],
  "finanzas": [
    "contabilidad", "excel", "sap", "erp", "análisis financiero", "presupuestos", "auditoría",
    "impuestos", "tesorería", "costos", "inversiones", "fintech", "compliance", "riesgo",
    "reporting", "forecast", "balance", "estados financieros"
  ],
  "recursos humanos": [
    "reclutamiento", "selección", "onboarding", "capacitación", "desarrollo", "compensaciones",
    "beneficios", "clima laboral", "evaluación de desempeño", "gestión del talento",
    "relaciones laborales", "hris", "people analytics", "cultura organizacional"
  ],
  "diseño": [
    "photoshop", "illustrator", "indesign", "figma", "sketch", "adobe xd", "ui", "ux",
    "diseño web", "diseño gráfico", "responsive", "prototipado", "wireframes", "user testing",
    "accesibilidad", "motion graphics", "design thinking"
  ],
  "ventas": [
    "negociación", "cierre de ventas", "prospección", "crm", "salesforce", "gestión de cuentas",
    "kpis comerciales", "b2b", "b2c", "inside sales", "field sales", "pipeline", "forecast",
    "customer success", "cross-selling", "up-selling"
  ],
  "general": [
    "comunicación", "trabajo en equipo", "liderazgo", "organización", "resolución de problemas",
    "gestión de proyectos", "office", "excel", "word", "powerpoint", "idiomas", "inglés",
    "adaptabilidad", "proactividad", "orientación a resultados"
  ]
};

// Estructura para las sugerencias de mejora
interface ResumeSuggestion {
  type: 'missing_keyword' | 'format_issue' | 'content_improvement' | 'strength';
  message: string;
  severity: 'high' | 'medium' | 'low';
  section?: string;
}

interface AnalysisResult {
  score: number; // 0-100
  matchPercentage: number; // 0-100
  keywordMatches: string[];
  missingKeywords: string[];
  suggestions: ResumeSuggestion[];
  strengths: string[];
}

/**
 * Analiza un CV en formato texto para un trabajo específico
 */
export const analyzeResume = async (
  resumeText: string,
  jobData: any
): Promise<AnalysisResult> => {
  try {
    // Normalizar texto para búsqueda (minúsculas, sin acentos)
    const normalizedText = resumeText
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Determinar categoría del trabajo
    const jobCategory = jobData.category?.toLowerCase() || 'general';
    
    // Obtener palabras clave relevantes para esta categoría
    let relevantKeywords = [...keywordsByCategory['general']];
    
    if (keywordsByCategory[jobCategory]) {
      relevantKeywords = [...relevantKeywords, ...keywordsByCategory[jobCategory]];
    }
    
    // Si hay requisitos específicos en el trabajo, extraerlos
    if (jobData.requirements) {
      const jobRequirements = Array.isArray(jobData.requirements) 
        ? jobData.requirements 
        : typeof jobData.requirements === 'object' && jobData.requirements.items 
          ? jobData.requirements.items 
          : [];
      
      // Extraer palabras clave de los requisitos
      const requirementKeywords = jobRequirements
        .map((req: string) => req.toLowerCase())
        .flatMap((req: string) => req.split(/\s+/))
        .filter((word: string) => word.length > 3); // Filtrar palabras muy cortas
      
      relevantKeywords = [...relevantKeywords, ...requirementKeywords];
    }
    
    // Eliminar duplicados
    relevantKeywords = [...new Set(relevantKeywords)];
    
    // Contar coincidencias de palabras clave
    const keywordMatches: string[] = [];
    const missingKeywords: string[] = [];
    
    relevantKeywords.forEach(keyword => {
      if (normalizedText.includes(keyword.toLowerCase())) {
        keywordMatches.push(keyword);
      } else {
        missingKeywords.push(keyword);
      }
    });
    
    // Calcular porcentaje de coincidencia
    const matchPercentage = relevantKeywords.length > 0
      ? (keywordMatches.length / relevantKeywords.length) * 100
      : 0;
    
    // Iniciar sugerencias
    const suggestions: ResumeSuggestion[] = [];
    const strengths: string[] = [];
    
    // Sugerencias basadas en palabras clave faltantes
    if (missingKeywords.length > 0) {
      // Tomar solo las 5 más importantes para no sobrecargar al usuario
      const topMissingKeywords = missingKeywords.slice(0, 5);
      
      suggestions.push({
        type: 'missing_keyword',
        message: `Considera incluir estas palabras clave importantes: ${topMissingKeywords.join(', ')}`,
        severity: 'high'
      });
    }
    
    // Verificar longitud del CV
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount < 200) {
      suggestions.push({
        type: 'content_improvement',
        message: 'Tu CV parece demasiado corto. Considera expandir tus experiencias y logros.',
        severity: 'high'
      });
    } else if (wordCount > 1000) {
      suggestions.push({
        type: 'content_improvement',
        message: 'Tu CV es bastante extenso. Considera hacerlo más conciso enfocándote en las experiencias más relevantes.',
        severity: 'medium'
      });
    } else {
      strengths.push('La longitud de tu CV es adecuada.');
    }
    
    // Verificar si hay secciones comunes
    const hasSections = {
      education: /educaci[oó]n|formaci[oó]n acad[eé]mica|estudios/i.test(resumeText),
      experience: /experiencia|laboral|profesional/i.test(resumeText),
      skills: /habilidades|competencias|skills|aptitudes/i.test(resumeText),
      contact: /contacto|tel[eé]fono|email|correo/i.test(resumeText)
    };
    
    if (!hasSections.education) {
      suggestions.push({
        type: 'format_issue',
        message: 'No se detectó una sección de educación. Considera añadirla.',
        severity: 'medium',
        section: 'education'
      });
    } else {
      strengths.push('Incluyes información sobre tu formación académica.');
    }
    
    if (!hasSections.experience) {
      suggestions.push({
        type: 'format_issue',
        message: 'No se detectó una sección de experiencia laboral. Considera añadirla.',
        severity: 'high',
        section: 'experience'
      });
    } else {
      strengths.push('Incluyes información sobre tu experiencia laboral.');
    }
    
    if (!hasSections.skills) {
      suggestions.push({
        type: 'format_issue',
        message: 'No se detectó una sección de habilidades o competencias. Considera añadirla.',
        severity: 'medium',
        section: 'skills'
      });
    } else {
      strengths.push('Incluyes una sección de habilidades o competencias.');
    }
    
    // Verificar si hay fechas
    const hasYears = /\b20\d{2}\b|\b19\d{2}\b/g.test(resumeText);
    if (!hasYears) {
      suggestions.push({
        type: 'format_issue',
        message: 'No se detectaron fechas o años en tu CV. Considera añadir fechas a tus experiencias y educación.',
        severity: 'medium'
      });
    } else {
      strengths.push('Incluyes fechas en tu CV, lo que ayuda a contextualizar tu trayectoria.');
    }
    
    // Verificar si hay logros cuantificables
    const hasQuantifiableAchievements = /\d+%|\baument[oó]\b|\breduj[oe]\b|\bmejoró\b|\blogr[oó]\b/i.test(resumeText);
    if (!hasQuantifiableAchievements) {
      suggestions.push({
        type: 'content_improvement',
        message: 'Considera incluir logros cuantificables (ej: "aumenté ventas en 20%") para destacar tus contribuciones.',
        severity: 'medium'
      });
    } else {
      strengths.push('Incluyes logros cuantificables que demuestran tu impacto.');
    }
    
    // Calcular puntuación general (0-100)
    let score = 0;
    
    // La coincidencia de palabras clave representa 40% de la puntuación
    score += matchPercentage * 0.4;
    
    // Las secciones representan 30% de la puntuación
    const sectionsScore = Object.values(hasSections).filter(Boolean).length / Object.keys(hasSections).length * 100;
    score += sectionsScore * 0.3;
    
    // Otros factores representan 30% de la puntuación
    let otherFactorsScore = 0;
    if (wordCount >= 200 && wordCount <= 1000) otherFactorsScore += 33;
    if (hasYears) otherFactorsScore += 33;
    if (hasQuantifiableAchievements) otherFactorsScore += 34;
    
    score += otherFactorsScore * 0.3;
    
    // Redondear puntuación
    score = Math.round(score);
    
    return {
      score,
      matchPercentage: Math.round(matchPercentage),
      keywordMatches,
      missingKeywords: missingKeywords.slice(0, 10), // Limitar a 10 para no sobrecargar
      suggestions,
      strengths
    };
  } catch (error) {
    console.error("Error al analizar CV:", error);
    return {
      score: 0,
      matchPercentage: 0,
      keywordMatches: [],
      missingKeywords: [],
      suggestions: [{
        type: 'format_issue',
        message: 'No se pudo analizar el CV correctamente. Por favor, verifica el formato.',
        severity: 'high'
      }],
      strengths: []
    };
  }
};

/**
 * Extrae el texto de un archivo de CV
 */
export const extractTextFromResume = async (file: File): Promise<string> => {
  try {
    // Para archivos PDF, podríamos usar una biblioteca como pdf.js
    // Para archivos DOCX, podríamos usar una biblioteca como mammoth.js
    // Por ahora, simularemos la extracción para demostración
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string || '';
        
        // Simulación simple - en una implementación real usaríamos
        // bibliotecas específicas según el tipo de archivo
        if (file.type === 'application/pdf') {
          // Simulación de extracción de texto de PDF
          resolve(`Contenido extraído del PDF: ${content.slice(0, 100)}...`);
        } else if (file.type === 'application/msword' || 
                  file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          // Simulación de extracción de texto de DOC/DOCX
          resolve(`Contenido extraído del DOCX: ${content.slice(0, 100)}...`);
        } else {
          // Para texto plano
          resolve(content);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };
      
      if (file.type.includes('text/')) {
        reader.readAsText(file);
      } else {
        // Para archivos binarios, en una implementación real
        // usaríamos bibliotecas específicas
        reader.readAsArrayBuffer(file);
      }
    });
  } catch (error) {
    console.error("Error al extraer texto del CV:", error);
    throw new Error('No se pudo extraer el texto del CV');
  }
};

/**
 * Guarda un análisis de CV en la base de datos
 */
export const saveResumeAnalysis = async (
  userId: string,
  jobId: string | number,
  analysisResult: AnalysisResult
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Convertir jobId a número si es string
    const numericJobId = typeof jobId === 'string' ? parseInt(jobId, 10) : jobId;
    
    if (isNaN(numericJobId)) {
      return { success: false, error: "ID de trabajo inválido" };
    }
    
    const { error } = await supabase.from("resume_analyses").insert([
      {
        user_id: userId,
        job_id: numericJobId,
        score: analysisResult.score,
        match_percentage: analysisResult.matchPercentage,
        keyword_matches: analysisResult.keywordMatches,
        missing_keywords: analysisResult.missingKeywords,
        suggestions: analysisResult.suggestions,
        strengths: analysisResult.strengths,
        created_at: new Date().toISOString()
      }
    ]);

    if (error) {
      console.error("Error al guardar análisis de CV:", error);
      return { success: false, error: error.message };
    }

    // Registrar evento
    await logEvent({
      user_id: userId,
      event_type: "resume_analyzed",
      details: { job_id: numericJobId, score: analysisResult.score }
    });

    return { success: true };
  } catch (error) {
    console.error("Error al guardar análisis de CV:", error);
    return { success: false, error: "Error al guardar el análisis del CV" };
  }
};

/**
 * Obtiene análisis de CV previos para un usuario
 */
export const getPreviousResumeAnalyses = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from("resume_analyses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error al obtener análisis de CV:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error al obtener análisis de CV:", error);
    return [];
  }
}; 