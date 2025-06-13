import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import JobDetailView from "./components/JobDetailView";
import ApplicationForm from "./components/ApplicationForm";
import UserProfileSection from "./components/UserProfileSection";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/job/:id" element={<JobDetailView />} />
          <Route path="/apply/:id" element={<ApplicationForm />} />
          <Route path="/profile" element={<UserProfileSection />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
