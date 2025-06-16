import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import JobDetailView from "./components/JobDetailView";
import ApplicationForm from "./components/ApplicationForm";
import UserProfileSection from "./components/UserProfileSection";
import AuthForm from "./components/AuthForm";
import SearchResultsPage from "./components/SearchResultsPage";
import SupabaseDiagnostic from "./components/SupabaseDiagnostic";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SavedJobsProvider } from "./contexts/SavedJobsContext";

// Empty routes array instead of external import
const tempoRoutes: any[] = [];

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

function AppRoutes() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
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
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(tempoRoutes)}
      </>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <SavedJobsProvider>
        <AppRoutes />
      </SavedJobsProvider>
    </AuthProvider>
  );
}

export default App;
