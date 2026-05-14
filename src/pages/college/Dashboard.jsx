import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase/config";
import { Building2, LogOut, UserCheck, UserX, Users } from "lucide-react";

export default function CollegeDashboard() {
  const { userData, dummyLogout } = useAuth();

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="min-h-screen bg-ec-root text-ec-text">
      {/* Header */}
      <header className="border-b border-ec-border bg-ec-surface px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-bold text-ec-highlight">College Admin Dashboard</h1>
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
            <p className="text-sm"><span className="text-ec-text-sub">Welcome,</span> <span className="font-semibold text-ec-highlight">{userData?.name || "College Admin"}</span></p>
            <p className="text-sm"><span className="text-ec-text-sub">College ID:</span> <span className="text-ec-text">{userData?.collegeId}</span></p>
          </div>
        </div>
        
        {/* Management Actions */}
        <div className="surface-card p-6">
          <h3 className="text-sm font-semibold text-ec-text-sub uppercase tracking-wide mb-4">College Management</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="surface rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-ec-accent/30 transition-all">
              <UserCheck size={18} className="text-ec-icon" />
              <span className="text-sm font-medium text-ec-text">Approve New Students</span>
            </div>
            <div className="surface rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-ec-accent/30 transition-all">
              <Users size={18} className="text-ec-icon" />
              <span className="text-sm font-medium text-ec-text">Approve Alumni Profiles</span>
            </div>
            <div className="surface rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-ec-accent/30 transition-all">
              <UserX size={18} className="text-ec-icon" />
              <span className="text-sm font-medium text-ec-text">Block/Remove Users</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}