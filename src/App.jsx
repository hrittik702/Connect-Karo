import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages Import
import Home from "./pages/Home/Home"; // Path check kar lena sahi ho
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import CollegeDashboard from "./pages/college/Dashboard";
import AlumniDashboard from "./pages/alumni/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";

// Role-Based Security Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) return <div>Loading Application...</div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (userData?.status === "blocked") return <h2 style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Your account is blocked by Admin.</h2>;
  if (userData?.role !== allowedRole) return <Navigate to="/login" replace />;

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ✅ Step 1: Root Path ab Landing Page par jayega */}
          <Route path="/" element={<Home />} />
          
          {/* ✅ Step 2: Login Page alag route par rahega */}
          <Route path="/login" element={<Login />} />

          {/* Secure Routes - Inme koi change nahi hai */}
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

          {/* Catch-all: Agar koi galat URL daale toh Home pe bhej do */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}