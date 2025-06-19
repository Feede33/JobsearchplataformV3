import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const teamMembers = [
  {
    name: "Ana García",
    role: "CEO & Fundadora",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    bio: "Con más de 15 años de experiencia en RRHH y reclutamiento, Ana fundó JobSearch con la visión de transformar la forma en que las personas encuentran trabajo."
  },
  {
    name: "Carlos Rodríguez",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    bio: "Ingeniero de software con experiencia en startups de tecnología, Carlos lidera el desarrollo de nuestra plataforma con un enfoque en la innovación y la experiencia del usuario."
  },
  {
    name: "Laura Martínez",
    role: "Directora de Operaciones",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    bio: "Especialista en operaciones y estrategia empresarial, Laura asegura que JobSearch ofrezca una experiencia excepcional tanto a candidatos como a empresas."
  },
  {
    name: "Miguel Fernández",
    role: "Director de Marketing",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    bio: "Con un historial de éxito en marketing digital, Miguel dirige nuestras estrategias para conectar a los mejores talentos con las empresas adecuadas."
  }
];

const values = [
  {
    title: "Innovación",
    description: "Constantemente buscamos nuevas formas de mejorar la experiencia de búsqueda de empleo utilizando tecnología avanzada e inteligencia artificial."
  },
  {
    title: "Transparencia",
    description: "Creemos en la honestidad y la claridad en todos los aspectos de nuestro servicio, desde las descripciones de trabajo hasta las políticas de privacidad."
  },
  {
    title: "Inclusión",
    description: "Nos comprometemos a crear un entorno donde todos los candidatos tengan igualdad de oportunidades, independientemente de su origen o circunstancias."
  },
  {
    title: "Excelencia",
    description: "Nos esforzamos por ofrecer el mejor servicio posible a candidatos y empresas, superando constantemente las expectativas."
  }
];

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/70 text-white py-20">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Transformando el futuro del empleo</h1>
            <p className="text-xl mb-8">
              En JobSearch, nuestra misión es conectar el talento con oportunidades que cambien vidas, 
              impulsando el crecimiento profesional y empresarial en un mundo laboral en constante evolución.
            </p>
            <Button onClick={() => navigate("/contact")} size="lg">
              Contáctanos
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
      </section>

      {/* Historia Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Nuestra Historia</h2>
              <div className="space-y-4">
                <p>
                  JobSearch nació en 2019 con una simple pero poderosa idea: hacer que la búsqueda de empleo sea más humana, 
                  eficiente y accesible para todos. Fundada por Ana García, quien experimentó de primera mano las frustraciones 
                  del proceso tradicional de búsqueda de empleo, nuestra plataforma comenzó como un pequeño proyecto con grandes ambiciones.
                </p>
                <p>
                  En nuestros primeros años, nos centramos en crear una experiencia intuitiva para los candidatos, 
                  permitiéndoles destacar sus habilidades y encontrar oportunidades que realmente se alinearan con sus objetivos profesionales. 
                  A medida que crecíamos, expandimos nuestros servicios para incluir soluciones innovadoras para empresas, 
                  ayudándolas a encontrar el talento adecuado de manera más eficiente.
                </p>
                <p>
                  Hoy, JobSearch se ha convertido en una plataforma líder en el mercado laboral, 
                  con miles de historias de éxito de candidatos que encontraron su trabajo ideal y 
                  empresas que descubrieron talentos excepcionales que transformaron sus organizaciones.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Equipo de JobSearch" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Valores Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Nuestros Valores</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Los principios que guían cada decisión que tomamos y cada función que desarrollamos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-primary">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Nuestro Equipo</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Personas apasionadas por transformar la forma en que el mundo conecta talento con oportunidades.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Únete a nuestra misión</h2>
          <p className="max-w-2xl mx-auto text-lg mb-8">
            Ya sea que estés buscando el próximo paso en tu carrera o el talento que transformará tu empresa, 
            estamos aquí para ayudarte a tener éxito en el cambiante mundo laboral.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => navigate("/search-results")} 
              variant="secondary"
              size="lg"
            >
              Buscar Empleos
            </Button>
            <Button 
              onClick={() => navigate("/company-pricing")} 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              size="lg"
            >
              Para Empresas
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs; 