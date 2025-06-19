import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Building2, Briefcase, Users, Mail, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Import the supabase client directly

const industries = [
  "Tecnología",
  "Salud",
  "Educación",
  "Finanzas",
  "Marketing y Publicidad",
  "Retail",
  "Manufactura",
  "Construcción",
  "Transporte y Logística",
  "Hostelería y Turismo",
  "Consultoría",
  "Medios de Comunicación",
  "Energía",
  "Agricultura",
  "Otro"
];

const companySizes = [
  "1-10 empleados",
  "11-50 empleados",
  "51-200 empleados",
  "201-500 empleados",
  "501-1000 empleados",
  "1001+ empleados"
];

const CompanyConvert = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    description: "",
    website: "",
    contactEmail: user?.email || "",
    contactPhone: "",
    location: "",
    isSubmitting: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.industry || !formData.companySize) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({ ...prev, isSubmitting: true }));

    try {
      if (!user?.id) {
        throw new Error("Usuario no autenticado");
      }

      // 1. Actualizar el rol del usuario a "company"
      const { error: userUpdateError } = await supabase
        .from('profiles')
        .update({ role: 'company' })
        .eq('id', user.id);

      if (userUpdateError) throw userUpdateError;

      // 2. Crear el perfil de empresa
      const { error: companyError } = await supabase
        .from('company_profiles')
        .insert([
          {
            user_id: user.id,
            name: formData.companyName,
            industry: formData.industry,
            size: formData.companySize,
            description: formData.description || null,
            website: formData.website || null,
            contact_email: formData.contactEmail,
            contact_phone: formData.contactPhone || null,
            location: formData.location || null,
          }
        ]);

      if (companyError) throw companyError;

      // Refrescar los datos del usuario para actualizar el estado de autenticación
      await refreshUser();

      toast({
        title: "¡Cuenta actualizada!",
        description: "Tu cuenta ha sido convertida a cuenta empresarial."
      });

      // Redirigir al usuario al panel de empresa
      navigate("/company/profile");
    } catch (error) {
      console.error("Error al convertir la cuenta:", error);
      toast({
        title: "Error",
        description: "No se pudo completar la conversión de la cuenta. Por favor, inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setFormData(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Convertir a Cuenta Empresarial</CardTitle>
            <CardDescription className="mt-2">
              Completa el siguiente formulario para convertir tu cuenta personal en una cuenta empresarial
              y comenzar a publicar ofertas de trabajo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Building2 className="mr-2 h-5 w-5" />
                    Información de la Empresa
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nombre de la Empresa *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Nombre de tu empresa"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industria *</Label>
                      <Select 
                        value={formData.industry} 
                        onValueChange={(value) => handleSelectChange("industry", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una industria" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companySize">Tamaño de la Empresa *</Label>
                      <Select 
                        value={formData.companySize} 
                        onValueChange={(value) => handleSelectChange("companySize", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Número de empleados" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Sitio Web</Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://www.ejemplo.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción de la Empresa</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Cuéntanos sobre tu empresa, su misión y valores..."
                      rows={4}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    Información de Contacto
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email de Contacto *</Label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        placeholder="contacto@empresa.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Teléfono de Contacto</Label>
                      <Input
                        id="contactPhone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        placeholder="+34 XXX XXX XXX"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ciudad, País"
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              disabled={formData.isSubmitting}
            >
              {formData.isSubmitting ? "Procesando..." : "Convertir a Cuenta Empresarial"}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Al convertir tu cuenta, aceptas nuestros <a href="/terms" className="underline">Términos y Condiciones</a> y 
              nuestra <a href="/privacy" className="underline">Política de Privacidad</a> para empresas.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CompanyConvert; 