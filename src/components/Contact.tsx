import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";

const contactTopics = [
  "Soporte técnico",
  "Información sobre planes",
  "Colaboraciones",
  "Reportar un problema",
  "Prensa y medios",
  "Otro"
];

const faqs = [
  {
    question: "¿Cómo puedo crear una cuenta empresarial?",
    answer: "Para crear una cuenta empresarial, primero regístrate como usuario normal y luego ve a tu perfil. Allí encontrarás la opción para convertir tu cuenta en una cuenta empresarial. Deberás proporcionar información adicional sobre tu empresa."
  },
  {
    question: "¿Cuánto tiempo tarda en procesarse una aplicación a un empleo?",
    answer: "El tiempo de procesamiento depende completamente de la empresa que publicó la oferta. Algunas empresas revisan las aplicaciones diariamente, mientras que otras pueden tardar semanas. Puedes ver el estado de tus aplicaciones en tu perfil de usuario."
  },
  {
    question: "¿Cómo puedo destacar mi perfil para los reclutadores?",
    answer: "Para destacar tu perfil, asegúrate de completar toda la información relevante, incluyendo experiencia, educación y habilidades. Sube un CV actualizado y utiliza palabras clave relevantes para tu industria. También puedes utilizar nuestro Analizador de CV para obtener recomendaciones personalizadas."
  },
  {
    question: "¿Puedo cambiar mi plan empresarial después de suscribirme?",
    answer: "Sí, puedes cambiar tu plan en cualquier momento desde el panel de control de tu cuenta empresarial. Si actualizas a un plan superior, se aplicará un prorrateo. Si cambias a un plan inferior, el cambio se aplicará al final del ciclo de facturación actual."
  },
  {
    question: "¿Cómo puedo eliminar mi cuenta?",
    answer: "Para eliminar tu cuenta, ve a la configuración de tu perfil y selecciona la opción 'Eliminar cuenta'. Ten en cuenta que esta acción es irreversible y todos tus datos serán eliminados permanentemente de nuestra plataforma."
  }
];

interface FormData {
  name: string;
  email: string;
  topic: string;
  message: string;
  isSubmitting: boolean;
}

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    topic: "",
    message: "",
    isSubmitting: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, topic: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.topic || !formData.message) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos del formulario.",
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({ ...prev, isSubmitting: true }));

    // Simulación de envío de formulario
    try {
      // Aquí iría la lógica para enviar el formulario a un backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Mensaje enviado",
        description: "Hemos recibido tu mensaje. Te responderemos lo antes posible.",
      });
      
      setFormData({
        name: "",
        email: "",
        topic: "",
        message: "",
        isSubmitting: false
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive"
      });
      setFormData(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Contacta con Nosotros</h1>
            <p className="text-xl">
              Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="topic">Asunto</Label>
                  <Select 
                    value={formData.topic} 
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tema" />
                    </SelectTrigger>
                    <SelectContent>
                      {contactTopics.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="¿En qué podemos ayudarte?"
                    rows={5}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={formData.isSubmitting}
                >
                  {formData.isSubmitting ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Información de contacto</h2>
              
              <div className="space-y-8">
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Correo electrónico</h3>
                        <p className="text-gray-600">info@jobsearch.com</p>
                        <p className="text-gray-600">soporte@jobsearch.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Teléfono</h3>
                        <p className="text-gray-600">+34 912 345 678</p>
                        <p className="text-gray-600">Lun-Vie: 9:00 - 18:00</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Dirección</h3>
                        <p className="text-gray-600">
                          Calle Gran Vía 28<br />
                          28013 Madrid, España
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Horario de atención</h3>
                        <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                        <p className="text-gray-600">Sábado y Domingo: Cerrado</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-8">
                  <h3 className="font-medium mb-3">Síguenos en redes sociales</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-600 hover:text-primary">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-primary">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-primary">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-primary">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">Nuestra ubicación</h2>
          <div className="h-96 rounded-lg overflow-hidden shadow-md">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.6174373048794!2d-3.7035723846361145!3d40.41957367936409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287d383707c1%3A0xcf8e199e3a4af48c!2sGran%20V%C3%ADa%2C%2028%2C%2028013%20Madrid!5e0!3m2!1ses!2ses!4v1650000000000!5m2!1ses!2ses" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de ubicación de JobSearch"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Preguntas frecuentes</h2>
            
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="mt-12 text-center">
              <p className="mb-4 text-gray-600">
                ¿No encuentras respuesta a tu pregunta?
              </p>
              <Button className="flex items-center mx-auto">
                Ver todas las preguntas frecuentes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
