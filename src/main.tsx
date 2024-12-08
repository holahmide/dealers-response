import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";

import AppRoutes from "./router.tsx";
import { AppProvider } from "./context/provider.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <Router>
        <AppRoutes />
        <ToastContainer />
      </Router>
    </AppProvider>
  </StrictMode>
);
