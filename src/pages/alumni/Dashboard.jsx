import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase/config";
import { GraduationCap, LogOut, UserPlus, Briefcase, PenSquare } from "lucide-react";

export default function AlumniDashboard() {
  const { userData,dummyLogout } = useAuth();

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="min-h-screen bg-ec-root text-ec-text">
      {/* Header */}
      <header className="border-b border-ec-border bg-ec-surface px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-ec-accent flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-bold text-ec-highlight">Alumni Dashboard</h1>
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
          <h3 className="text-sm font-semibold text-ec-text-sub uppercase tracking-wide mb-3">Profile Details</h3>
          <div className="space-y-2">
            <p className="text-sm"><span className="text-ec-text-sub">Welcome back,</span> <span className="font-semibold text-ec-highlight">{userData?.name || "Alumni"}</span></p>
            <p className="text-sm"><span className="text-ec-text-sub">Batch:</span> <span className="text-ec-text">{userData?.batch || "N/A"}</span></p>
            <p className="text-sm"><span className="text-ec-text-sub">Current Company:</span> <span className="text-ec-text">{userData?.company || "Not Updated"}</span></p>
          </div>
        </div>
        
        {/* Networking Actions */}
        <div className="surface-card p-6">
          <h3 className="text-sm font-semibold text-ec-text-sub uppercase tracking-wide mb-4">Networking</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="surface rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-ec-accent/30 transition-all">
              <PenSquare size={18} className="text-ec-icon" />
              <span className="text-sm font-medium text-ec-text">Edit Professional Profile</span>
            </div>
            <div className="surface rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-ec-accent/30 transition-all">
              <UserPlus size={18} className="text-ec-icon" />
              <span className="text-sm font-medium text-ec-text">Connect with Students</span>
            </div>
            <div className="surface rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-ec-accent/30 transition-all">
              <Briefcase size={18} className="text-ec-icon" />
              <span className="text-sm font-medium text-ec-text">Post Job Referrals</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}