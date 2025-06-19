import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Briefcase, User, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AuthFormProps {
  onClose?: () => void;
}

const AuthForm = ({ onClose }: AuthFormProps) => {
  const { login, signup, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isCompany: false,
  });
  
  // Check URL for company parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type');
    
    if (type === 'company') {
      setActiveTab('signup');
      setSignupData(prev => ({ ...prev, isCompany: true }));
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login(loginData.email, loginData.password);
      if (result.success) {
        onClose?.();
        navigate("/");
      } else {
        setError(result.error || "Credenciales inválidas");
      }
    } catch (err: any) {
      setError(err.message || "Error en el inicio de sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (signupData.password !== signupData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signup(
        signupData.name,
        signupData.email,
        signupData.password,
        signupData.isCompany
      );
      if (result.success) {
        onClose?.();
        navigate("/");
      } else {
        setError(result.error || "No se pudo crear la cuenta");
      }
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Bienvenido a JobSearch
          </CardTitle>
          <CardDescription>
            Inicia sesión o crea una nueva cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Ingresa tu email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading || authLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              {/* Selector de tipo de cuenta */}
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">Tipo de cuenta:</div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg hover:border-primary transition-all ${
                      !signupData.isCompany ? "bg-primary/10 border-primary" : "bg-background border-input"
                    }`}
                    onClick={() => setSignupData({ ...signupData, isCompany: false })}
                  >
                    <User className="h-8 w-8 mb-2" />
                    <span className="font-medium">Candidato</span>
                    <span className="text-xs text-gray-500 mt-1">Busca empleo</span>
                  </button>
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg hover:border-primary transition-all ${
                      signupData.isCompany ? "bg-primary/10 border-primary" : "bg-background border-input"
                    }`}
                    onClick={() => setSignupData({ ...signupData, isCompany: true })}
                  >
                    <Briefcase className="h-8 w-8 mb-2" />
                    <span className="font-medium">Empresa</span>
                    <span className="text-xs text-gray-500 mt-1">Publica ofertas</span>
                  </button>
                </div>
                
                {/* Información adicional para empresas */}
                {signupData.isCompany && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">Beneficios para empresas:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Publica ofertas de trabajo ilimitadas</li>
                          <li>Gestiona candidaturas desde un panel centralizado</li>
                          <li>Perfil de empresa destacado</li>
                          <li>Acceso a herramientas de selección avanzadas</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">
                    {signupData.isCompany ? "Nombre de la empresa" : "Nombre completo"}
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder={signupData.isCompany ? "Ingresa el nombre de tu empresa" : "Ingresa tu nombre completo"}
                    value={signupData.name}
                    onChange={(e) =>
                      setSignupData({ ...signupData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Ingresa tu email"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Crea una contraseña"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">
                    Confirmar contraseña
                  </Label>
                  <Input
                    id="signup-confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    value={signupData.confirmPassword}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || authLoading}
                  variant={signupData.isCompany ? "default" : "default"}
                >
                  {isLoading 
                    ? "Procesando..." 
                    : signupData.isCompany 
                      ? "Registrar empresa" 
                      : "Registrar cuenta"
                  }
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <div className="text-center w-full">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
            >
              {activeTab === "login"
                ? "¿No tienes una cuenta? Regístrate"
                : "¿Ya tienes una cuenta? Inicia sesión"}
            </button>
          </div>
          {activeTab === "login" && (
            <div className="text-center w-full">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:underline flex items-center justify-center mx-auto"
                      onClick={() => {
                        setActiveTab("signup");
                        setSignupData({ ...signupData, isCompany: true });
                      }}
                    >
                      <Briefcase className="h-4 w-4 mr-1" />
                      Registrar empresa
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-60 text-sm">
                      Crea una cuenta de empresa para publicar ofertas de trabajo y gestionar candidaturas
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
