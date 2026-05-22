import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── MASTER PUBLIC & OTHER DASHBOARDS IMPORTS ──
import Home from "../pages/Home/Home";
import Login from "../pages/auth/Login";
import AlumniDashboard from "../pages/alumni/Dashboard";
import StudentDashboard from "../pages/student/Dashboard";

// ── COLLEGE ADMIN IMPORTS ──
import CollegeDashboardLayout from "../pages/college/DashboardLayout";
import CollegeDashboardOverview from "../pages/college/DashboardOverview";
import CollegeRequestList from "../pages/college/requests/RequestList";
import CollegeUserList from "../pages/college/users/UserList";
import CollegeBroadcastList from "../pages/college/broadcasts/BroadcastList";
import CollegeSettings from "../pages/college/settings/CollegeSettings";

// ── ✅ ACTUAL ROOT ADMIN IMPORTS (PRODUCTION READY) ──
import DashboardLayout from "../pages/admin/DashboardLayout";
import DashboardOverview from "../pages/admin/DashboardOverview";
import CollegeList from "../pages/admin/colleges/CollegeList";
import AddCollege from "../pages/admin/colleges/AddCollege";
import BillingOverview from "../pages/admin/billing/BillingOverview";
import TicketManager from "../pages/admin/support/TicketManager";
import AnnouncementPanel from "../pages/admin/broadcast/AnnouncementPanel";

// Enterprise Role-Based Security Guard
const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-ec-root flex items-center justify-center text-ec-text-sub text-sm font-sans font-medium tracking-wide">
        Loading Application...
      </div>
    );
  }
  
  if (!currentUser) return <Navigate to="/login" replace />;
  
  if (userData?.status === "blocked") {
    return (
      <div className="min-h-screen bg-ec-root flex items-center justify-center font-sans">
        <h2 className="text-red-400 text-center text-lg font-bold bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-xl shadow-xl">
          Your account is blocked by Admin.
        </h2>
      </div>
    );
  }
  
  if (userData?.role !== allowedRole) return <Navigate to="/login" replace />;

  return children;
};

// 🚧 Secondary Infrastructure Placeholder Component
const UnderConstruction = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center p-8 border-2 border-dashed border-ec-border rounded-xl bg-ec-surface/30 animate-in fade-in duration-300 select-none">
    <div className="w-14 h-14 mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center text-xl border border-yellow-500/20">
      🚧
    </div>
    <h2 className="text-base font-bold text-ec-highlight mb-1">{title}</h2>
    <p className="text-xs text-ec-text-sub max-w-sm leading-relaxed">
      Yeh feature pipeline abhi development phase mein hai. Core database aur UI structures lock hote hi ise live kar diya jayega.
    </p>
  </div>
);

// ── MAIN ARCHITECTURE ROUTE MAP ──
export default function AppRoutes() {
  return (
    <Routes>
      {/* 🔓 Public Landing Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* 🔐 Root Admin Secure Control Tower (Nested Routing) */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRole="root_admin">
            <DashboardLayout /> 
          </ProtectedRoute>
        }
      >
        {/* /admin -> By default system overview dashboard open hoga */}
        <Route index element={<DashboardOverview />} />
        
        {/* College Management Grid & Form Pipeline */}
        <Route path="colleges" element={<CollegeList />} />
        <Route path="colleges/add" element={<AddCollege />} />
        <Route path="colleges/:id" element={<UnderConstruction title="Dedicated College View (360° Control Panel)" />} />
        
        {/* Helpdesk Global Escalation Hub */}
        <Route path="support" element={<TicketManager />} />


        {/* Commercial Billing & SaaS Node Contracts */}
        <Route path="billing" element={<BillingOverview />} />
        
        {/* Network-wide Announcement Engine */}
        <Route path="broadcast" element={<AnnouncementPanel />} />
        
        {/* System Node Cryptography & Security Settings */}
        <Route path="settings" element={<UnderConstruction title="Root Credentials & Security Framework" />} />
        <Route path="settings/logs" element={<UnderConstruction title="System Audit Logs & Threat Detection Trace" />} />
      </Route>

      {/* 🔐 College Admin Control Console (Nested Routing) */}
      <Route 
        path="/college" 
        element={
          <ProtectedRoute allowedRole="college_admin">
            <CollegeDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CollegeDashboardOverview />} />
        <Route path="requests" element={<CollegeRequestList />} />
        <Route path="users" element={<CollegeUserList />} />
        <Route path="broadcasts" element={<CollegeBroadcastList />} />
        <Route path="settings" element={<CollegeSettings />} />
      </Route>
      <Route path="/alumni/*" element={
        <ProtectedRoute allowedRole="alumni"><AlumniDashboard /></ProtectedRoute>
      } />
      <Route path="/student/*" element={
        <ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>
      } />

      {/* 🛸 Catch-all Edge Route Recovery Block */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}