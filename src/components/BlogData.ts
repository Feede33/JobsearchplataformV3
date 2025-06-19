// Tipo para los artículos del blog
export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content?: string; // Contenido completo (solo necesario en la vista de detalle)
  author: string;
  date: string;
  category: string;
  tags: string[];
  image: string;
  readTime: number;
};

// Datos de ejemplo para los artículos del blog
export const blogPosts: BlogPost[] = [
  {
    id: "consejos-entrevista-trabajo",
    title: "10 Consejos para Destacar en una Entrevista de Trabajo",
    excerpt: "Aprende cómo prepararte para una entrevista de trabajo y causar una buena impresión con estos consejos prácticos.",
    author: "María González",
    date: "2023-06-15",
    category: "Consejos para Candidatos",
    tags: ["entrevistas", "preparación", "candidatos"],
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    readTime: 5,
  },
  {
    id: "optimizar-cv-ats",
    title: "Cómo Optimizar tu CV para Sistemas ATS",
    excerpt: "Descubre las técnicas para que tu currículum pase los filtros automatizados de selección y llegue a manos de los reclutadores.",
    author: "Carlos Rodríguez",
    date: "2023-07-22",
    category: "Consejos para Candidatos",
    tags: ["cv", "currículum", "ats", "candidatos"],
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    readTime: 7,
  },
  {
    id: "tendencias-reclutamiento-2023",
    title: "Tendencias de Reclutamiento para 2023",
    excerpt: "Análisis de las principales tendencias en reclutamiento y selección que están definiendo el mercado laboral este año.",
    author: "Ana Martínez",
    date: "2023-08-05",
    category: "Recursos para Empresas",
    tags: ["reclutamiento", "tendencias", "empresas"],
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    readTime: 6,
  },
  {
    id: "habilidades-blandas-demandadas",
    title: "Las Habilidades Blandas Más Demandadas en 2023",
    excerpt: "Descubre qué habilidades blandas están buscando los empleadores y cómo desarrollarlas para mejorar tu perfil profesional.",
    author: "Pedro Sánchez",
    date: "2023-09-12",
    category: "Desarrollo Profesional",
    tags: ["habilidades blandas", "desarrollo profesional", "candidatos"],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    readTime: 8,
  },
  {
    id: "retener-talento-tech",
    title: "Estrategias para Retener Talento en el Sector Tech",
    excerpt: "Consejos prácticos para que las empresas tecnológicas puedan retener a sus mejores profesionales en un mercado altamente competitivo.",
    author: "Laura Gómez",
    date: "2023-10-03",
    category: "Recursos para Empresas",
    tags: ["retención", "talento", "tech", "empresas"],
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    readTime: 6,
  },
  {
    id: "trabajo-remoto-productividad",
    title: "Cómo Mantener la Productividad en el Trabajo Remoto",
    excerpt: "Guía completa con consejos y herramientas para mantener altos niveles de productividad mientras trabajas desde casa.",
    author: "Javier López",
    date: "2023-11-18",
    category: "Desarrollo Profesional",
    tags: ["trabajo remoto", "productividad", "teletrabajo"],
    image: "https://images.unsplash.com/photo-1584931423298-c576fda54bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    readTime: 5,
  },
]; 