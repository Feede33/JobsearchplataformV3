import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SupabaseProvider } from "./lib/SupabaseContext";
import { checkAllBuckets } from "./lib/setupSupabaseStorage";
import { Toaster } from "@/components/ui/toaster";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

// Agregar listener global de errores para depuración en desarrollo
if (import.meta.env.DEV) {
  window.addEventListener('error', (event) => {
    console.error('Error capturado en navegador:', event.error);
    console.error('Mensaje:', event.message);
    console.error('Origen:', event.filename, 'línea:', event.lineno, 'columna:', event.colno);
  });
  
  // Capturar también errores de promesas no manejadas
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada no manejada:', event.reason);
  });
}

// Verificar los buckets de Supabase
checkAllBuckets()
  .then((result) => {
    if (!result.allExist) {
      console.warn('⚠️ Algunos buckets necesarios no existen. La funcionalidad de subida de archivos puede no funcionar correctamente.');
    }
  })
  .catch(error => console.error('Error al verificar buckets:', error));

// Componente principal con inicialización
const AppWithProviders = () => {
  return (
    <React.StrictMode>
      <BrowserRouter basename={basename}>
        <SupabaseProvider>
          <App />
          <Toaster />
        </SupabaseProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<AppWithProviders />);
