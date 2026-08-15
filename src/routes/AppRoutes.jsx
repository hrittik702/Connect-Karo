import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth, db } from "../firebase/config";
import { doc, onSnapshot, getDoc, getDocFromServer } from "firebase/firestore";

// ── MASTER PUBLIC & OTHER DASHBOARDS IMPORTS ──
import Home from "../pages/Home/Home";
import Login from "../pages/auth/Login";
import AlumniDashboardLayout from "../pages/alumni/DashboardLayout"; // Fixed design token layout shell frame
import AlumniDashboardOverview from "../pages/alumni/Dashboard"; // Core analytical overview cards matrix
import InteractionChatRoom from "../pages/alumni/mentorship/InteractionChatRoom"; // Unified Chat Workspace
import ReferralDashboard from "../pages/alumni/jobs/ReferralDashboard"; // Corporate jobs spreadsheet ATS
import StudentDashboard from "../pages/student/Dashboard";

// ── COLLEGE ADMIN IMPORTS ──
import CollegeDashboardLayout from "../pages/college/DashboardLayout";
import CollegeDashboardOverview from "../pages/college/DashboardOverview";
import CollegeRequestList from "../pages/college/requests/RequestList";
import CollegeUserList from "../pages/college/users/UserList";
import CollegeBroadcastList from "../pages/college/broadcasts/BroadcastList";
import CollegeSettings from "../pages/college/settings/CollegeSettings";
import AppearanceSettings from "../components/AppearanceSettings";

// ── ACTUAL ROOT ADMIN IMPORTS (PRODUCTION READY) ──
import DashboardLayout from "../pages/admin/DashboardLayout";
import DashboardOverview from "../pages/admin/DashboardOverview";
import CollegeList from "../pages/admin/colleges/CollegeList";
import AddCollege from "../pages/admin/colleges/AddCollege";
import BillingOverview from "../pages/admin/billing/BillingOverview";
import TicketManager from "../pages/admin/support/TicketManager";
import AnnouncementPanel from "../pages/admin/broadcast/AnnouncementPanel";
import CollegeDetails from "../pages/admin/colleges/CollegeDetails";

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

  if (userData?.status === "pending") {
    return (
      <div className="min-h-screen bg-ec-root flex items-center justify-center font-sans p-6">
        <div className="text-center p-8 border border-yellow-500/20 rounded-xl bg-yellow-500/10 max-w-md shadow-xl flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-yellow-500/15 flex items-center justify-center text-yellow-500 mb-4 animate-pulse">
            ⚠️
          </div>
          <h2 className="text-yellow-400 text-lg font-bold mb-2">
            Registration Pending Approval
          </h2>
          <p className="text-xs text-ec-text-sub leading-relaxed mb-6">
            Hi {userData.name || 'there'}, your registration request for <strong className="text-ec-highlight">{userData.collegeName || 'your college'}</strong> is currently pending verification. Please wait for the institutional administrator to approve your credentials.
          </p>
          <button 
            onClick={() => auth.signOut()} 
            className="px-5 py-2.5 bg-ec-surface hover:bg-ec-muted text-ec-text border border-ec-border hover:border-ec-accent/40 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Sign Out & Return
          </button>
        </div>
      </div>
    );
  }
  
  if (userData?.role !== allowedRole) return <Navigate to="/login" replace />;

  return children;
};

// Real-time Guard for Suspended Colleges
const CollegeStatusGuard = ({ children }) => {
  const { userData } = useAuth();
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const rawId = userData?.collegeId || "";
    if (!rawId) {
      setLoading(false);
      return;
    }

    if (rawId.toLowerCase() === "dummy_college_01") {
      setStatus("active");
      setLoading(false);
      return;
    }

    let unsub = null;

    const initListener = async () => {
      try {
        let activeId = rawId.trim();
        let docRef = doc(db, "colleges", activeId);
        let snap = await getDoc(docRef);

        if (!snap.exists()) {
          activeId = rawId.trim().toUpperCase();
          docRef = doc(db, "colleges", activeId);
          snap = await getDoc(docRef);
        }

        if (!snap.exists()) {
          activeId = rawId.trim().toLowerCase();
          docRef = doc(db, "colleges", activeId);
          snap = await getDoc(docRef);
        }

        unsub = onSnapshot(docRef, async (snapshot) => {
          if (snapshot.exists()) {
            let currentStatus = snapshot.data().status || "active";
            
            if (currentStatus === "suspended" && snapshot.metadata.fromCache) {
              try {
                const serverSnap = await getDocFromServer(docRef);
                if (serverSnap.exists()) {
                  currentStatus = serverSnap.data().status || "active";
                }
              } catch (err) {
                console.warn("Could not verify status from server, using cached status:", err);
              }
            }

            setStatus(currentStatus);
            if (currentStatus === "suspended") {
              auth.signOut().then(() => {
                navigate("/login?error=suspended", { replace: true });
              });
            }
          } else {
            setStatus("active");
          }
          setLoading(false);
        }, (err) => {
          console.error("College status sync failed:", err);
          setLoading(false);
        });
      } catch (err) {
        console.error("Error setting up status listener:", err);
        setLoading(false);
      }
    };

    initListener();

    return () => {
      if (unsub) unsub();
    };
  }, [userData?.collegeId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ec-root flex items-center justify-center text-ec-text-sub text-sm font-sans font-medium tracking-wide">
        Verifying Institutional Nodes...
      </div>
    );
  }

  if (status === "suspended") {
    return null;
  }

  return children;
};

// Secondary Infrastructure Placeholder Component
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
      {/* Public Landing Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Root Admin Dashboard Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRole="root_admin">
            <DashboardLayout /> 
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="colleges" element={<CollegeList />} />
        <Route path="colleges/add" element={<AddCollege />} />
        <Route path="colleges/:id" element={<CollegeDetails />} />
        <Route path="support" element={<TicketManager />} />
        <Route path="billing" element={<BillingOverview />} />
        <Route path="broadcast" element={<AnnouncementPanel />} />
        <Route path="settings" element={<UnderConstruction title="Root Credentials & Security Framework" />} />
        <Route path="settings/logs" element={<UnderConstruction title="System Audit Logs & Threat Detection Trace" />} />
      </Route>

      {/* College Admin Dashboard Routes */}
      <Route 
        path="/college" 
        element={
          <ProtectedRoute allowedRole="college_admin">
            <CollegeStatusGuard>
              <CollegeDashboardLayout />
            </CollegeStatusGuard>
          </ProtectedRoute>
        }
      >
        <Route index element={<CollegeDashboardOverview />} />
        <Route path="requests" element={<CollegeRequestList />} />
        <Route path="users" element={<CollegeUserList />} />
        <Route path="broadcasts" element={<CollegeBroadcastList />} />
        <Route path="settings" element={<CollegeSettings />} />
        <Route path="appearance" element={<AppearanceSettings />} />
      </Route>

      {/* 🔐 ALUMNI DASHBOARD MODULE ROUTES */}
      <Route 
        path="/alumni" 
        element={
          <ProtectedRoute allowedRole="alumni">
            <CollegeStatusGuard>
              <AlumniDashboardLayout /> 
            </CollegeStatusGuard>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AlumniDashboardOverview />} />
        
        {/* 🌟 APKA BADLAV: Dono links par ab direct naya full-screen WhatsApp chat chalu hoga */}
        <Route path="mentorship" element={<InteractionChatRoom />} />
        <Route path="chat" element={<InteractionChatRoom />} />
        
        <Route path="jobs" element={<ReferralDashboard />} />
        
        {/* Construction fallbacks */}
        <Route path="directory" element={<UnderConstruction title="Graduate Index Peer Discovery Database Grid" />} />
        <Route path="events" element={<UnderConstruction title="Asynchronous Dual Webinar Scheduling Interface" />} />
        <Route path="settings" element={<UnderConstruction title="Personal Identity Credentials Configuration Editor" />} />
      </Route>

      {/* Student Dashboard Routes */}
      <Route path="/student/*" element={
        <ProtectedRoute allowedRole="student">
          <CollegeStatusGuard>
            <StudentDashboard />
          </CollegeStatusGuard>
        </ProtectedRoute>
      } />

      {/* Catch-all Route Recovery */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}