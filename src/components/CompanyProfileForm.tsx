import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { toast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const INDUSTRY_OPTIONS = [
  "Tecnología",
  "Salud",
  "Educación",
  "Finanzas",
  "Retail",
  "Manufactura",
  "Servicios",
  "Medios y Comunicación",
  "Turismo",
  "Construcción",
  "Otro",
];

const COMPANY_SIZE_OPTIONS = [
  "1-10 empleados",
  "11-50 empleados",
  "51-200 empleados",
  "201-500 empleados",
  "501-1000 empleados",
  "1000+ empleados",
];

interface CompanyProfileFormProps {
  onComplete?: () => void;
}

const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({ onComplete }) => {
  const { user, isCompany } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    website: "",
    logo_url: "",
    description: "",
    location: "",
    size: "",
    founded_year: "",
    contact_email: "",
    contact_phone: "",
  });

  // Cargar perfil existente
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("company_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            // No se encontró el perfil
            setProfileExists(false);
          } else {
            throw error;
          }
        } else if (data) {
          setProfileExists(true);
          setFormData({
            company_name: data.company_name || "",
            industry: data.industry || "",
            website: data.website || "",
            logo_url: data.logo_url || "",
            description: data.description || "",
            location: data.location || "",
            size: data.size || "",
            founded_year: data.founded_year ? data.founded_year.toString() : "",
            contact_email: data.contact_email || user.email || "",
            contact_phone: data.contact_phone || "",
          });
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el perfil de la empresa.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isCompany) {
      fetchProfile();
    } else {
      navigate("/");
    }
  }, [user?.id, isCompany, navigate, user?.email]);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en selects
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar perfil
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    try {
      // Validar año de fundación
      const foundedYear = formData.founded_year ? parseInt(formData.founded_year, 10) : null;
      if (foundedYear && (isNaN(foundedYear) || foundedYear < 1800 || foundedYear > new Date().getFullYear())) {
        toast({
          title: "Error",
          description: "El año de fundación debe ser válido.",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      const profileData = {
        id: user.id,
        company_name: formData.company_name,
        industry: formData.industry,
        website: formData.website,
        logo_url: formData.logo_url,
        description: formData.description,
        location: formData.location,
        size: formData.size,
        founded_year: foundedYear,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        updated_at: new Date().toISOString(),
      };

      let response;
      if (profileExists) {
        // Actualizar perfil existente
        response = await supabase
          .from("company_profiles")
          .update(profileData)
          .eq("id", user.id);
      } else {
        // Crear nuevo perfil
        response = await supabase
          .from("company_profiles")
          .insert([{ ...profileData, created_at: new Date().toISOString() }]);
      }

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Perfil guardado",
        description: "El perfil de tu empresa ha sido actualizado exitosamente.",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el perfil de la empresa.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Perfil de Empresa</CardTitle>
        <CardDescription>
          Completa la información de tu empresa para poder publicar ofertas laborales
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!profileExists && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Perfil incompleto</AlertTitle>
            <AlertDescription>
              Completa tu perfil de empresa para poder publicar ofertas laborales.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company_name">Nombre de la empresa*</Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                placeholder="Nombre de tu empresa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industria*</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => handleSelectChange("industry", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar industria" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_OPTIONS.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Sitio web</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.tuempresa.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">URL del Logo</Label>
              <Input
                id="logo_url"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleChange}
                placeholder="https://www.tuempresa.com/logo.png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación*</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Ciudad, País"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Tamaño de la empresa</Label>
              <Select
                value={formData.size}
                onValueChange={(value) => handleSelectChange("size", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tamaño" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="founded_year">Año de fundación</Label>
              <Input
                id="founded_year"
                name="founded_year"
                type="number"
                value={formData.founded_year}
                onChange={handleChange}
                placeholder="Ej: 2010"
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">Email de contacto*</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleChange}
                required
                placeholder="contacto@tuempresa.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Teléfono de contacto</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="+1234567890"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descripción de la empresa*</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe brevemente tu empresa, su misión y valores..."
                className="min-h-[150px]"
              />
            </div>
          </div>

          <CardFooter className="px-0 flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar perfil"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanyProfileForm; 