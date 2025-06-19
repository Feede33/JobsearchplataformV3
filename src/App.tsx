import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SavedJobsProvider } from "./contexts/SavedJobsContext";
import { SupabaseProvider } from "./lib/SupabaseContext";
import { Toaster } from "./components/ui/toaster";
import NotificationCenter from "./components/NotificationCenter";
import Footer from "./components/Footer";
import UnderConstructionPage from "./components/UnderConstructionPage";

// Lazy loaded components
const Home = lazy(() => import("./components/home"));
const JobDetailView = lazy(() => import("./components/JobDetailView"));
const ApplicationForm = lazy(() => import("./components/ApplicationForm"));
const UserProfileSection = lazy(() => import("./components/UserProfileSection"));
const AuthForm = lazy(() => import("./components/AuthForm"));
const SearchResultsPage = lazy(() => import("./components/SearchResultsPage"));
const ResumeAnalyzer = lazy(() => import("./components/ResumeAnalyzer"));
const CompanyJobManagement = lazy(() => import("./components/CompanyJobManagement"));
const CompanyProfileForm = lazy(() => import("./components/CompanyProfileForm"));
const CompanyApplicationsView = lazy(() => import("./components/CompanyApplicationsView"));
const SupabaseDiagnostic = lazy(() => import("./components/SupabaseDiagnostic"));
const AboutUs = lazy(() => import("./components/AboutUs"));
const Contact = lazy(() => import("./components/Contact"));
const TermsAndConditions = lazy(() => import("./components/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const CompanyPricing = lazy(() => import("./components/CompanyPricing"));
const CompanyConvert = lazy(() => import("./components/CompanyConvert"));
const FAQ = lazy(() => import("./components/FAQ"));
const Blog = lazy(() => import("./components/Blog"));
const BlogPost = lazy(() => import("./components/BlogPost"));

// Protected route component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isCompany, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (requiredRole === "company" && !isCompany && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Redirect if authenticated
const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Componente ResumeAnalyzerWrapper para proporcionar datos de trabajo por defecto
const ResumeAnalyzerWrapper = () => {
  const defaultJobData = {
    id: "general-resume-analysis",
    title: "Análisis General de CV",
    description: "Análisis de CV sin un puesto específico",
    requirements: [],
    skills: []
  };
  
  return <ResumeAnalyzer jobData={defaultJobData} />;
};

function App() {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <SavedJobsProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/job/:jobId" element={<JobDetailView />} />
              <Route 
                path="/auth" 
                element={
                  <RedirectIfAuthenticated>
                    <AuthForm />
                  </RedirectIfAuthenticated>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfileSection />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/apply/:jobId" 
                element={
                  <ProtectedRoute>
                    <ApplicationForm />
                  </ProtectedRoute>
                } 
              />
              <Route path="/search-results" element={<SearchResultsPage />} />
              <Route 
                path="/resume-analyzer" 
                element={
                  <ProtectedRoute>
                    <ResumeAnalyzerWrapper />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/company/jobs" 
                element={
                  <ProtectedRoute requiredRole="company">
                    <CompanyJobManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/company/profile" 
                element={
                  <ProtectedRoute requiredRole="company">
                    <CompanyProfileForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/company/applications/:jobId" 
                element={
                  <ProtectedRoute requiredRole="company">
                    <CompanyApplicationsView />
                  </ProtectedRoute>
                } 
              />
              <Route path="/supabase-diagnostic" element={<SupabaseDiagnostic />} />
              
              {/* Páginas de recursos e información */}
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/company-pricing" element={<CompanyPricing />} />
              <Route path="/faq" element={<FAQ />} />
              
              {/* Blog */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:postId" element={<BlogPost />} />
              
              {/* Ruta para convertir cuenta a empresarial */}
              <Route 
                path="/company/convert" 
                element={
                  <ProtectedRoute>
                    <CompanyConvert />
                  </ProtectedRoute>
                } 
              />
              
              {/* Ruta 404 */}
              <Route path="*" element={<UnderConstructionPage title="Página no encontrada" description="La página que estás buscando no existe o está en construcción." />} />
            </Routes>
            <Footer />
            <Toaster />
          </Suspense>
        </SavedJobsProvider>
      </AuthProvider>
    </SupabaseProvider>
  );
}

export default App;
