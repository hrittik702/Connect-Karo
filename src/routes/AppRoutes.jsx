import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Path updated (../)

// Pages Import (Paths updated to point back to src folder)
import Home from "../pages/Home/Home";
import Login from "../pages/auth/Login";
// AdminDashboard import hata diya kyunki ab modular routes hain
import CollegeDashboard from "../pages/college/Dashboard";
import AlumniDashboard from "../pages/alumni/Dashboard";
import StudentDashboard from "../pages/student/Dashboard";

// Role-Based Security Component (Wahi same aapka code)
const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-ec-root flex items-center justify-center text-ec-text-sub text-sm">Loading Application...</div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (userData?.status === "blocked") return <div className="min-h-screen bg-ec-root flex items-center justify-center"><h2 className="text-red-400 text-center text-lg">Your account is blocked by Admin.</h2></div>;
  if (userData?.role !== allowedRole) return <Navigate to="/login" replace />;

  return children;
};

// 🚧 Temporary Components: Jab tak actual files nahi banti, error na aaye isliye ye dummy components hain
const AdminLayoutPlaceholder = () => (
  <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center pt-10">
    <h1 className="text-2xl font-bold mb-4 text-blue-400">Admin Command Center Layout</h1>
    {/* Outlet bahut zaroori hai nested routes ko render karne ke liye */}
    <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <Outlet /> 
    </div>
  </div>
);

const UnderConstruction = ({ title }) => (
  <div className="text-center p-8">
    <h2 className="text-xl font-semibold text-yellow-400">{title}</h2>
    <p className="mt-2 text-gray-400">🚧 Page is Under Construction 🚧</p>
  </div>
);

// Master Routes
export default function AppRoutes() {
  return (
    <Routes>
      {/* ✅ Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* ✅ Root Admin Modules (Nested Routing Setup) */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRole="root_admin">
            {/* Future me isko <DashboardLayout /> se replace karenge */}
            <AdminLayoutPlaceholder /> 
          </ProtectedRoute>
        }
      >
        {/* /admin hit karne pe by default Dashboard Overview khulega */}
        <Route index element={<UnderConstruction title="Dashboard Overview (Metrics & Graphs)" />} />
        
        {/* College Management */}
        <Route path="colleges" element={<UnderConstruction title="Master College List" />} />
        <Route path="colleges/add" element={<UnderConstruction title="Add New College Form" />} />
        <Route path="colleges/:id" element={<UnderConstruction title="Dedicated College View" />} />
        
        {/* Helpdesk & Support */}
        <Route path="support" element={<UnderConstruction title="Ticket Manager" />} />
        
        {/* Billing & Subscriptions */}
        <Route path="billing" element={<UnderConstruction title="Billing & Plans Overview" />} />
        
        {/* Broadcast */}
        <Route path="broadcast" element={<UnderConstruction title="Global Announcement Panel" />} />
        
        {/* Settings */}
        <Route path="settings" element={<UnderConstruction title="Root Settings" />} />
        <Route path="settings/logs" element={<UnderConstruction title="Security & Audit Logs" />} />
      </Route>

      {/* ✅ Other Secure Routes */}
      <Route path="/college/*" element={
        <ProtectedRoute allowedRole="college_admin"><CollegeDashboard /></ProtectedRoute>
      } />
      <Route path="/alumni/*" element={
        <ProtectedRoute allowedRole="alumni"><AlumniDashboard /></ProtectedRoute>
      } />
      <Route path="/student/*" element={
        <ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>
      } />

      {/* ✅ Catch-all: Agar koi galat URL daale toh Home pe bhej do */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}