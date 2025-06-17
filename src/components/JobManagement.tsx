import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "./ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useNavigate } from "react-router-dom";

// Categorías de trabajo disponibles
const JOB_CATEGORIES = [
  "Desarrollo de Software",
  "Diseño UX/UI",
  "Marketing Digital",
  "Ventas",
  "Atención al Cliente",
  "Gestión de Productos",
  "Ciencia de Datos",
  "Recursos Humanos",
  "Finanzas",
  "Operaciones",
  "Otros",
];

// Tipos de trabajo disponibles
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];

interface Job {
  id: number;
  title: string;
  company: string;
  logo?: string;
  location: string;
  salary?: string;
  type: string;
  requirements?: string[] | any;
  description: string;
  posted_date?: string;
  category: string;
  is_featured: boolean;
  is_remote: boolean;
  created_at: string;
  updated_at?: string;
}

const JobManagement: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Estado para el formulario
  const [formData, setFormData] = useState<Omit<Job, "id">>({
    title: "",
    company: "",
    logo: "",
    location: "",
    salary: "",
    type: "Full-time",
    requirements: [],
    description: "",
    category: "Desarrollo de Software",
    is_featured: false,
    is_remote: false,
  });

  // Verificar si el usuario es administrador
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase.auth.getSession();
        
        if (data.session) {
          const role = data.session.user.app_metadata.role;
          setIsAdmin(role === "admin");
          
          if (role !== "admin") {
            toast({
              title: "Acceso denegado",
              description: "No tienes permisos de administrador para acceder a esta página.",
              variant: "destructive",
            });
            navigate("/");
          }
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };

    checkAdminStatus();
  }, [navigate]);

  // Cargar trabajos
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .order("id", { ascending: false });

        if (error) {
          throw error;
        }

        setJobs(data || []);
      } catch (error) {
        console.error("Error al cargar trabajos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los trabajos.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en checkboxes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Manejar cambios en selects
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en requirements (array de strings)
  const handleRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const requirementsArray = e.target.value
      .split(",")
      .map((req) => req.trim())
      .filter((req) => req !== "");
    setFormData((prev) => ({ ...prev, requirements: requirementsArray }));
  };

  // Crear o actualizar trabajo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Preparar datos para enviar
      const jobData = {
        ...formData,
        posted_date: selectedJob ? selectedJob.posted_date : "Just now",
        updated_at: new Date().toISOString(),
      };

      let response;

      if (selectedJob) {
        // Actualizar trabajo existente
        response = await supabase
          .from("jobs")
          .update(jobData)
          .eq("id", selectedJob.id);
      } else {
        // Crear nuevo trabajo
        response = await supabase.from("jobs").insert([jobData]);
      }

      if (response.error) {
        throw response.error;
      }

      toast({
        title: selectedJob ? "Trabajo actualizado" : "Trabajo creado",
        description: `El trabajo "${formData.title}" ha sido ${
          selectedJob ? "actualizado" : "creado"
        } exitosamente.`,
      });

      // Recargar trabajos y resetear formulario
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .order("id", { ascending: false });
      setJobs(data || []);
      resetForm();
    } catch (error) {
      console.error("Error al guardar trabajo:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el trabajo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar trabajo
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este trabajo?")) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("jobs").delete().eq("id", id);

      if (error) {
        throw error;
      }

      toast({
        title: "Trabajo eliminado",
        description: "El trabajo ha sido eliminado exitosamente.",
      });

      // Actualizar lista de trabajos
      setJobs(jobs.filter((job) => job.id !== id));
      
      // Si el trabajo eliminado es el seleccionado, resetear formulario
      if (selectedJob && selectedJob.id === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Error al eliminar trabajo:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el trabajo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Editar trabajo
  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      logo: job.logo || "",
      location: job.location,
      salary: job.salary || "",
      type: job.type,
      requirements: job.requirements || [],
      description: job.description,
      category: job.category,
      is_featured: job.is_featured,
      is_remote: job.is_remote,
    });
  };

  // Resetear formulario
  const resetForm = () => {
    setSelectedJob(null);
    setFormData({
      title: "",
      company: "",
      logo: "",
      location: "",
      salary: "",
      type: "Full-time",
      requirements: [],
      description: "",
      category: "Desarrollo de Software",
      is_featured: false,
      is_remote: false,
    });
  };

  if (!isAdmin) {
    return <div className="container mx-auto p-6">Verificando permisos...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Administración de Trabajos</h1>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Lista de Trabajos</TabsTrigger>
          <TabsTrigger value="form">
            {selectedJob ? "Editar Trabajo" : "Crear Trabajo"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="grid gap-4">
            {loading && <p>Cargando trabajos...</p>}
            
            {!loading && jobs.length === 0 && (
              <p>No hay trabajos disponibles. ¡Crea el primero!</p>
            )}

            {jobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <CardHeader className="bg-muted">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <div className="flex gap-2">
                      {job.is_featured && (
                        <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">
                          Destacado
                        </span>
                      )}
                      {job.is_remote && (
                        <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded">
                          Remoto
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {job.company} • {job.location} • {job.type}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Categoría:</p>
                      <p>{job.category}</p>
                    </div>
                    <div>
                      <p className="font-medium">Salario:</p>
                      <p>{job.salary || "No especificado"}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-medium">Descripción:</p>
                    <p className="line-clamp-2">{job.description}</p>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    ID: {job.id} • Creado: {new Date(job.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(job)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(job.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedJob ? "Editar Trabajo" : "Crear Nuevo Trabajo"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título*</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Ej: Frontend Developer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa*</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      placeholder="Ej: TechCorp"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo">URL del Logo</Label>
                    <Input
                      id="logo"
                      name="logo"
                      value={formData.logo}
                      onChange={handleChange}
                      placeholder="https://..."
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
                      placeholder="Ej: Montevideo o Remote"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary">Salario</Label>
                    <Input
                      id="salary"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      placeholder="Ej: $80,000 - $120,000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Trabajo*</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría*</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requisitos (separados por comas)</Label>
                    <Textarea
                      id="requirements"
                      name="requirements"
                      value={
                        Array.isArray(formData.requirements)
                          ? formData.requirements.join(", ")
                          : ""
                      }
                      onChange={handleRequirementsChange}
                      placeholder="Ej: React, TypeScript, 3+ years experience"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Descripción*</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      placeholder="Descripción detallada del trabajo..."
                      className="min-h-[150px]"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("is_featured", checked === true)
                      }
                    />
                    <Label htmlFor="is_featured">Trabajo Destacado</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_remote"
                      checked={formData.is_remote}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("is_remote", checked === true)
                      }
                    />
                    <Label htmlFor="is_remote">Trabajo Remoto</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading
                      ? "Guardando..."
                      : selectedJob
                      ? "Actualizar Trabajo"
                      : "Crear Trabajo"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobManagement; 