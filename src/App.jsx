import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages Import
import Login from "./pages/auth/Login";
// (Maan lijiye baaki pages aapne in locations pe banaye hain)
import AdminDashboard from "./pages/admin/Dashboard";
import CollegeDashboard from "./pages/college/Dashboard";
import AlumniDashboard from "./pages/alumni/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";

// Security Component - Ye check karta hai ki user allowed hai ya nahi
const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser, userData } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (userData?.status === "blocked") return <h2>Your account is blocked.</h2>;
  if (userData?.role !== allowedRole) return <Navigate to="/login" replace />; // Ya unauthorized page

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Secure Routes for Teams */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRole="root_admin"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/college/*" element={
            <ProtectedRoute allowedRole="college_admin"><CollegeDashboard /></ProtectedRoute>
          } />
          <Route path="/alumni/*" element={
            <ProtectedRoute allowedRole="alumni"><AlumniDashboard /></ProtectedRoute>
          } />
          <Route path="/student/*" element={
            <ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>
          } />

        </Routes>
      </Router>
    </AuthProvider>
  );
}