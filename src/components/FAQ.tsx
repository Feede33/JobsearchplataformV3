import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Helmet } from "react-helmet";

type FAQItem = {
  question: string;
  answer: React.ReactNode;
  category: "general" | "jobseekers" | "companies";
};

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems: FAQItem[] = [
    // Preguntas generales
    {
      question: "¿Qué es JobSearch?",
      answer: (
        <p>
          JobSearch es una plataforma que conecta a profesionales con empresas que buscan talento. 
          Ofrecemos herramientas avanzadas para la búsqueda de empleo, análisis de CV, 
          y gestión de candidaturas para los candidatos, así como soluciones de publicación 
          y gestión de ofertas para empresas.
        </p>
      ),
      category: "general",
    },
    {
      question: "¿Cómo funciona la plataforma?",
      answer: (
        <p>
          Para candidatos: Regístrate, completa tu perfil, sube tu CV y comienza a buscar empleos 
          que se ajusten a tus habilidades y preferencias. Puedes guardar ofertas, aplicar a puestos 
          y recibir recomendaciones personalizadas.
          <br /><br />
          Para empresas: Crea una cuenta empresarial, configura el perfil de tu empresa, 
          y comienza a publicar ofertas de trabajo. Podrás gestionar aplicaciones, 
          comunicarte con candidatos y encontrar el talento adecuado para tus necesidades.
        </p>
      ),
      category: "general",
    },
    {
      question: "¿Es gratuito usar JobSearch?",
      answer: (
        <p>
          Para candidatos: Sí, el uso básico de la plataforma es completamente gratuito. 
          Puedes crear tu perfil, buscar empleos y aplicar sin costo alguno.
          <br /><br />
          Para empresas: Ofrecemos diferentes planes con distintas características. 
          Puedes consultar nuestros <a href="/company-pricing" className="text-blue-600 hover:underline">planes y precios</a> para más información.
        </p>
      ),
      category: "general",
    },
    
    // Preguntas para buscadores de empleo
    {
      question: "¿Cómo puedo mejorar mi perfil para atraer a más reclutadores?",
      answer: (
        <div>
          <p>Para mejorar tu visibilidad y atractivo en la plataforma:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Completa tu perfil al 100%, incluyendo foto profesional</li>
            <li>Detalla tus habilidades técnicas y blandas</li>
            <li>Mantén actualizado tu CV</li>
            <li>Incluye logros cuantificables en tus experiencias previas</li>
            <li>Solicita recomendaciones de antiguos compañeros o supervisores</li>
            <li>Utiliza palabras clave relevantes para tu sector</li>
          </ul>
        </div>
      ),
      category: "jobseekers",
    },
    {
      question: "¿Cómo funciona el analizador de CV?",
      answer: (
        <p>
          Nuestro analizador de CV utiliza tecnología de inteligencia artificial para evaluar 
          tu currículum y proporcionar recomendaciones personalizadas. El sistema compara tu CV 
          con la descripción del puesto al que deseas aplicar y te ofrece sugerencias para 
          mejorar tus posibilidades. También identifica habilidades faltantes y proporciona 
          consejos para destacar tu experiencia relevante.
        </p>
      ),
      category: "jobseekers",
    },
    {
      question: "¿Puedo ver el estado de mis aplicaciones?",
      answer: (
        <p>
          Sí, puedes hacer seguimiento del estado de todas tus aplicaciones desde la sección 
          "Mi Perfil". Allí encontrarás información sobre si tu aplicación está pendiente, 
          en revisión, si has sido seleccionado para una entrevista o si ha sido rechazada. 
          También recibirás notificaciones cuando haya actualizaciones importantes.
        </p>
      ),
      category: "jobseekers",
    },
    {
      question: "¿Cómo puedo guardar ofertas para verlas más tarde?",
      answer: (
        <p>
          Para guardar una oferta, simplemente haz clic en el icono de "guardar" o "favorito" 
          que aparece en cada tarjeta de oferta de trabajo. Puedes acceder a todas tus ofertas 
          guardadas desde la sección "Empleos Guardados" en tu perfil. Esta función te permite 
          organizar las ofertas que te interesan y revisarlas cuando tengas más tiempo.
        </p>
      ),
      category: "jobseekers",
    },
    
    // Preguntas para empresas
    {
      question: "¿Cómo puedo publicar una oferta de trabajo?",
      answer: (
        <p>
          Para publicar una oferta de trabajo, primero debes tener una cuenta empresarial. 
          Una vez que hayas iniciado sesión, ve a la sección "Gestionar Ofertas" en tu panel 
          de empresa y haz clic en "Crear Nueva Oferta". Completa el formulario con los detalles 
          del puesto, requisitos, responsabilidades y beneficios. Puedes previsualizar la oferta 
          antes de publicarla y editarla en cualquier momento.
        </p>
      ),
      category: "companies",
    },
    {
      question: "¿Qué diferencias hay entre los planes para empresas?",
      answer: (
        <p>
          Ofrecemos tres planes principales: Básico, Profesional y Empresarial. Las diferencias 
          principales están en el número de ofertas que puedes publicar, la visibilidad de tus 
          anuncios, el acceso a herramientas avanzadas de filtrado de candidatos, y las opciones 
          de personalización. Puedes ver una comparativa detallada en nuestra página de 
          <a href="/company-pricing" className="text-blue-600 hover:underline"> planes y precios</a>.
        </p>
      ),
      category: "companies",
    },
    {
      question: "¿Cómo puedo convertir mi cuenta personal en una cuenta de empresa?",
      answer: (
        <p>
          Si ya tienes una cuenta personal y deseas convertirla en una cuenta empresarial, 
          simplemente ve a la sección "Convertir a Cuenta Empresarial" en tu perfil. Deberás 
          proporcionar información adicional sobre tu empresa, como el nombre, sector, tamaño, 
          y datos de contacto. Una vez completado este proceso, tendrás acceso a todas las 
          funcionalidades para empresas.
        </p>
      ),
      category: "companies",
    },
    {
      question: "¿Cómo gestiono las aplicaciones que recibo?",
      answer: (
        <p>
          Todas las aplicaciones que recibas para tus ofertas de trabajo aparecerán en la 
          sección "Aplicaciones" de tu panel de empresa. Allí podrás filtrar candidatos, 
          revisar sus perfiles y CV, cambiar el estado de sus aplicaciones, y contactar 
          directamente con ellos. También puedes añadir notas internas y valoraciones para 
          cada candidato.
        </p>
      ),
      category: "companies",
    },
  ];

  const filteredFAQs = activeCategory === "all" 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Preguntas Frecuentes | JobSearch</title>
        <meta name="description" content="Respuestas a las preguntas más frecuentes sobre JobSearch, tanto para candidatos como para empresas." />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Preguntas Frecuentes</h1>
        
        <div className="max-w-3xl mx-auto mb-10">
          <p className="text-lg text-gray-600 text-center">
            Encuentra respuestas a las preguntas más comunes sobre nuestra plataforma. 
            Si no encuentras lo que buscas, no dudes en <a href="/contact" className="text-blue-600 hover:underline">contactarnos</a>.
          </p>
        </div>

        {/* Filtros de categoría */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 text-sm font-medium border ${
                activeCategory === "all"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              } rounded-l-lg`}
            >
              Todas
            </button>
            <button
              onClick={() => setActiveCategory("general")}
              className={`px-4 py-2 text-sm font-medium border-t border-b border-r ${
                activeCategory === "general"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveCategory("jobseekers")}
              className={`px-4 py-2 text-sm font-medium border-t border-b border-r ${
                activeCategory === "jobseekers"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Candidatos
            </button>
            <button
              onClick={() => setActiveCategory("companies")}
              className={`px-4 py-2 text-sm font-medium border-t border-b border-r ${
                activeCategory === "companies"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              } rounded-r-lg`}
            >
              Empresas
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          {filteredFAQs.map((faq, index) => (
            <div key={index} className="py-6">
              <button
                onClick={() => toggleQuestion(index)}
                className="flex justify-between items-center w-full text-left focus:outline-none"
              >
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <span className="ml-6 flex-shrink-0">
                  {activeIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-blue-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </span>
              </button>
              {activeIndex === index && (
                <div className="mt-4 text-base text-gray-600 prose max-w-none">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sección de contacto */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">¿No encuentras lo que buscas?</h2>
          <p className="text-gray-600 mb-6">
            Estamos aquí para ayudarte. Ponte en contacto con nuestro equipo de soporte y 
            te responderemos lo antes posible.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Contactar con Soporte
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 