import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase/config";
import { Shield, Settings, LogOut, Building2, Cog } from "lucide-react";

export default function AdminDashboard() {
  const { userData, dummyLogout } = useAuth(); // dummyLogout ko destructure karein

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="min-h-screen bg-ec-root text-ec-text">
      {/* Header */}
      <header className="border-b border-ec-border bg-ec-surface px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500 flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-bold text-ec-highlight">Root Admin Dashboard</h1>
          </div>
          <button 
            onClick={dummyLogout} 
            className="btn text-sm text-red-400 hover:text-red-300 hover:border-red-500/30"
          >
            <LogOut size={15} className="text-ec-icon" />
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* User Info Card */}
        <div className="surface-card p-6 mb-6">
          <h3 className="text-sm font-semibold text-ec-text-sub uppercase tracking-wide mb-3">Account Details</h3>
          <div className="space-y-2">
            <p className="text-sm"><span className="text-ec-text-sub">Welcome,</span> <span className="font-semibold text-ec-highlight">{userData?.name || "Super Admin"}</span></p>
            <p className="text-sm"><span className="text-ec-text-sub">Email:</span> <span className="text-ec-text">{userData?.email}</span></p>
            <p className="text-sm"><span className="text-ec-text-sub">Role:</span> <span className="badge text-xs">{userData?.role}</span></p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="surface-card p-6">
          <h3 className="text-sm font-semibold text-ec-text-sub uppercase tracking-wide mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="surface rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-ec-accent/30 transition-all">
              <Building2 size={18} className="text-ec-icon" />
              <span className="text-sm font-medium text-ec-text">Manage All Colleges</span>
            </div>
            <div className="surface rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-ec-accent/30 transition-all">
              <Cog size={18} className="text-ec-icon" />
              <span className="text-sm font-medium text-ec-text">System Settings</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}