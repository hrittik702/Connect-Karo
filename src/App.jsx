import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes"; 
import useSystemTheme from "./hooks/useSystemTheme";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  useSystemTheme();

  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
      <SpeedInsights />
      <Analytics />
    </AuthProvider>
  );
}