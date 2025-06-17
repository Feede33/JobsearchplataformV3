import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SavedJobsProvider } from "./contexts/SavedJobsContext";
import { SupabaseProvider } from "./lib/SupabaseContext";
import { Toaster } from "./components/ui/toaster";
import NotificationCenter from "./components/NotificationCenter";

// Lazy loaded components
const Home = lazy(() => import("./components/home"));
const JobDetailView = lazy(() => import("./components/JobDetailView"));
const ApplicationForm = lazy(() => import("./components/ApplicationForm"));
const UserProfileSection = lazy(() => import("./components/UserProfileSection"));
const AuthForm = lazy(() => import("./components/AuthForm"));
const SearchResultsPage = lazy(() => import("./components/SearchResultsPage"));
const SupabaseDiagnostic = lazy(() => import("./components/SupabaseDiagnostic"));
const JobManagement = lazy(() => import("./components/JobManagement"));

// Empty routes array instead of external import
const tempoRoutes: any[] = [];

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    <span className="ml-3 text-lg font-medium">Cargando...</span>
  </div>
);

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/job/:id" element={<Navigate to="/search-results" replace />} />
          <Route path="/apply/:id" element={<Navigate to="/search-results" replace />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/supabase-diagnostic" element={<SupabaseDiagnostic />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfileSection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute>
                <JobManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/notifications" element={<div className="p-10"><NotificationCenter /></div>} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(tempoRoutes)}
      </>
    </Suspense>
  );
}

function App() {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <SavedJobsProvider>
          <AppRoutes />
          <Toaster />
        </SavedJobsProvider>
      </AuthProvider>
    </SupabaseProvider>
  );
}

export default App;
