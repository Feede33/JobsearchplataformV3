import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const pricingPlans = [
  {
    name: "Básico",
    price: "29",
    description: "Ideal para pequeñas empresas que están comenzando su proceso de contratación.",
    features: [
      "Hasta 3 ofertas de trabajo activas",
      "Acceso a base de datos de candidatos (limitado)",
      "Filtros de búsqueda básicos",
      "Soporte por email"
    ],
    cta: "Comenzar Gratis",
    popular: false
  },
  {
    name: "Profesional",
    price: "99",
    description: "Perfecto para empresas en crecimiento con necesidades de contratación regulares.",
    features: [
      "Hasta 10 ofertas de trabajo activas",
      "Acceso completo a base de datos de candidatos",
      "Filtros de búsqueda avanzados",
      "Destacado en resultados de búsqueda",
      "Análisis de rendimiento de ofertas",
      "Soporte prioritario"
    ],
    cta: "Probar 14 días gratis",
    popular: true
  },
  {
    name: "Enterprise",
    price: "299",
    description: "Solución completa para grandes empresas con altos volúmenes de contratación.",
    features: [
      "Ofertas de trabajo ilimitadas",
      "Acceso VIP a base de datos de candidatos",
      "Herramientas de IA para preselección",
      "Integración con sistemas ATS",
      "Páginas de carrera personalizadas",
      "Analítica avanzada y reportes",
      "Gestor de cuenta dedicado"
    ],
    cta: "Contactar Ventas",
    popular: false
  }
];

const CompanyPricing = () => {
  const { isAuthenticated, isCompany } = useAuth();
  const navigate = useNavigate();

  const handlePlanSelection = (plan: string) => {
    if (!isAuthenticated) {
      navigate("/auth?type=company");
    } else if (!isCompany) {
      navigate("/profile?convert=true");
    } else {
      // Aquí iría la lógica para procesar la selección del plan
      console.log(`Plan seleccionado: ${plan}`);
      // Por ahora, simplemente mostramos un alert
      alert(`Has seleccionado el plan ${plan}. Esta funcionalidad estará disponible próximamente.`);
    }
  };

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Planes para Empresas
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Encuentra el plan perfecto para tu empresa y comienza a contratar al mejor talento hoy mismo.
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`flex flex-col justify-between ${
                plan.popular ? "border-primary shadow-lg" : "border-gray-200"
              }`}
            >
              <CardHeader>
                {plan.popular && (
                  <div className="mb-4">
                    <span className="px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full">
                      Más popular
                    </span>
                  </div>
                )}
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">{plan.price}€</span>
                  <span className="ml-1 text-xl font-semibold">/mes</span>
                </div>
                <CardDescription className="mt-4 text-gray-500">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex">
                      <Check className="h-5 w-5 text-green-500 shrink-0" />
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handlePlanSelection(plan.name)}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 border-t border-gray-200 pt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Preguntas frecuentes sobre nuestros planes</h2>
          <div className="mt-6 text-left">
            <dl className="space-y-8">
              <div>
                <dt className="text-lg font-medium text-gray-900">¿Puedo cambiar de plan en cualquier momento?</dt>
                <dd className="mt-2 text-gray-500">
                  Sí, puedes actualizar o cambiar tu plan en cualquier momento. Los cambios se aplicarán inmediatamente y se ajustará el cobro prorrateado.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-medium text-gray-900">¿Qué métodos de pago aceptan?</dt>
                <dd className="mt-2 text-gray-500">
                  Aceptamos todas las principales tarjetas de crédito y débito, así como transferencias bancarias para planes anuales.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-medium text-gray-900">¿Ofrecen descuentos para ONGs o startups?</dt>
                <dd className="mt-2 text-gray-500">
                  Sí, tenemos programas especiales para organizaciones sin fines de lucro y startups en etapas tempranas. Contacta con nuestro equipo de ventas para más información.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-medium text-gray-900">¿Hay algún contrato de permanencia?</dt>
                <dd className="mt-2 text-gray-500">
                  No, todos nuestros planes son mensuales y puedes cancelar en cualquier momento. También ofrecemos planes anuales con descuento para quienes prefieran ese modelo.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPricing; 