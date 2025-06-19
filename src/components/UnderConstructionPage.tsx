import React from "react";
import { ArrowLeft, Construction, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UnderConstructionPageProps {
  title: string;
  description?: string;
}

const UnderConstructionPage: React.FC<UnderConstructionPageProps> = ({
  title,
  description = "Estamos trabajando para mejorar tu experiencia. Esta página estará disponible próximamente.",
}) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-100 p-4 rounded-full">
            <Construction className="h-16 w-16 text-yellow-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{description}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <Button onClick={() => navigate("/")} className="flex items-center">
            Ir al inicio
          </Button>
        </div>
        
        <div className="mt-12 flex items-center justify-center">
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded-full">
            <Hammer className="h-4 w-4" />
            <span className="text-sm font-medium">En construcción</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionPage; 