import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import JobDetailView from "./components/JobDetailView";
import ApplicationForm from "./components/ApplicationForm";
import UserProfileSection from "./components/UserProfileSection";
import AuthForm from "./components/AuthForm";
import SearchResultsPage from "./components/SearchResultsPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import routes from "tempo-routes";

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
          <Route path="/job/:id" element={<JobDetailView />} />
          <Route path="/apply/:id" element={<ApplicationForm />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfileSection />
              </ProtectedRoute>
            }
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
