import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Palette, 
  Accessibility, 
  Bell, 
  CreditCard, 
  Mail, 
  Key, 
  Tv, 
  Check, 
  Building2, 
  LogOut, 
  Database 
} from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';

export default function CollegeSettings() {
  const { currentUser, userData, logout } = useAuth();
  const collegeId = userData?.collegeId || '';
  const navigate = useNavigate();
  const location = useLocation();

  // Active sub-route name
  const activeTab = location.pathname.split('/').pop() || 'profile';

  // College institutional details state
  const [collegeDetails, setCollegeDetails] = useState(null);
  const [collegeLoading, setCollegeLoading] = useState(true);

  // Modal / Toast message states
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const adminName = userData?.name || "College Admin";
  const adminEmail = userData?.email || currentUser?.email || "admin@institution.edu";

  // Resolve default profile picture college letters
  const institutionName = userData?.collegeName || userData?.collegeId || "College";
  const collegeInitial = institutionName.charAt(0).toUpperCase();
  const profilePhotoURL = userData?.photoURL || '';

  // Load Institutional Details
  useEffect(() => {
    if (!collegeId) return;

    if (collegeId.toLowerCase().includes('dummy') || userData?.id === 'dummy_12345') {
      const dummyData = {
        name: 'Rajkiya Engineering College, Ambedkar Nagar',
        domain: 'recabn.ac.in',
        collegeCode: '0737',
        adminEmail: 'admin@demo.edu',
        adminPhone: '+91 98765 43210',
        address: 'Ambedkar Nagar, Uttar Pradesh India',
        status: 'Active',
        createdAt: new Date().toISOString()
      };
      setCollegeDetails(dummyData);
      setCollegeLoading(false);
      return;
    }

    const fetchCollegeSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('colleges')
          .select('*')
          .eq('id', collegeId)
          .single();
          
        if (error) throw error;
        
        const mapped = {
          ...data,
          collegeCode: data.id,
          adminPhone: data.admin_phone,
          adminEmail: data.admin_email,
          createdAt: data.created_at
        };
        
        setCollegeDetails(mapped);
      } catch (err) {
        console.error("Fetch settings details failed:", err);
      } finally {
        setCollegeLoading(false);
      }
    };

    fetchCollegeSettings();

    const channel = supabase
      .channel('college-settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'colleges', filter: `id=eq.${collegeId}` }, () => {
        fetchCollegeSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collegeId, userData]);

  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-5 md:gap-6 font-sans selection:bg-ec-accent/20 select-none pb-12 animate-in fade-in duration-300">
      
      {/* ── LEFT SIDEBAR NAVIGATION (GitHub style) ── */}
      <aside className="w-full md:w-[260px] shrink-0 space-y-6">
        
        {/* User profile brief card */}
        <div className="flex items-center gap-3 px-2 pb-2 border-b border-ec-border/100">
          {/* Avatar preview */}
          <div className="w-10 h-10 rounded-full bg-[#f3f4f6] dark:bg-[#30363d] flex items-center justify-center text-gray-600 dark:text-[#c9d1d9] font-semibold text-sm border border-gray-200 dark:border-[#30363d] overflow-hidden shrink-0 shadow-sm">
            {profilePhotoURL ? (
              <img src={profilePhotoURL} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              collegeInitial
            )}
          </div>
          <div className="text-left min-w-0">
            <h3 className="text-[13px] font-semibold text-ec-highlight leading-tight truncate">
              {adminName}
            </h3>
            <span className="block text-[11px] text-ec-text-sub font-medium truncate mt-0.5">
              Personal settings
            </span>
          </div>
        </div>

        {/* Sidebar menu list */}
        <nav className="space-y-6">
          
          {/* Section 1: User Settings */}
          <div className="space-y-0.5">
            <NavLink
              to="/college/settings/profile"
              className={({ isActive }) => 
                `w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                  isActive
                    ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60 font-semibold'
                    : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight font-normal'
                }`
              }
            >
              <User size={16} className={activeTab === 'profile' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Public profile</span>
            </NavLink>

            <NavLink
              to="/college/settings/account"
              className={({ isActive }) => 
                `w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                  isActive
                    ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60 font-semibold'
                    : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight font-normal'
                }`
              }
            >
              <Settings size={16} className={activeTab === 'account' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Account</span>
            </NavLink>

            <NavLink
              to="/college/settings/appearance"
              className={({ isActive }) => 
                `w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                  isActive
                    ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60 font-semibold'
                    : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight font-normal'
                }`
              }
            >
              <Palette size={16} className={activeTab === 'appearance' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Appearance</span>
            </NavLink>

            <NavLink
              to="/college/settings/institution"
              className={({ isActive }) => 
                `w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                  isActive
                    ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60 font-semibold'
                    : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight font-normal'
                }`
              }
            >
              <Building2 size={16} className={activeTab === 'institution' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Institution Details</span>
            </NavLink>

            <NavLink
              to="/college/settings/accessibility"
              className={({ isActive }) => 
                `w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                  isActive
                    ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60 font-semibold'
                    : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight font-normal'
                }`
              }
            >
              <Accessibility size={16} className={activeTab === 'accessibility' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Accessibility</span>
            </NavLink>

            <NavLink
              to="/college/settings/notifications"
              className={({ isActive }) => 
                `w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                  isActive
                    ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60 font-semibold'
                    : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight font-normal'
                }`
              }
            >
              <Bell size={16} className={activeTab === 'notifications' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Notifications</span>
            </NavLink>

            <NavLink
              to="/college/settings/supabase"
              className={({ isActive }) => 
                `w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                  isActive
                    ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60 font-semibold'
                    : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight font-normal'
                }`
              }
            >
              <Database size={16} className={activeTab === 'supabase' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Supabase Sandbox</span>
            </NavLink>
          </div>

          {/* Section 2: Access & Licensing */}
          <div className="space-y-1">
            <span className="block px-3 text-[10px] font-[800] uppercase tracking-wider text-ec-text-sub select-none">
              Access & Security
            </span>

            <NavLink
              to="/college/settings/billing"
              className={({ isActive }) => 
                `w-full flex items-center justify-between px-3 py-2 text-[13px] rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                  isActive
                    ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60 font-semibold'
                    : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight font-normal'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <CreditCard size={16} className={activeTab === 'billing' ? 'text-ec-accent' : 'text-ec-icon'} />
                <span>Billing & licensing</span>
              </div>
              <span className="text-[8px] font-semibold border border-ec-border px-1.5 py-0.5 rounded-full uppercase leading-none font-mono">
                Free
              </span>
            </NavLink>

            <NavLink
              to="/college/settings/emails"
              className={({ isActive }) => 
                `w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                  isActive
                    ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60 font-semibold'
                    : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight font-normal'
                }`
              }
            >
              <Mail size={16} className={activeTab === 'emails' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Emails</span>
            </NavLink>

            <NavLink
              to="/college/settings/security"
              className={({ isActive }) => 
                `w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                  isActive
                    ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60 font-semibold'
                    : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight font-normal'
                }`
              }
            >
              <Key size={16} className={activeTab === 'security' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Security & keys</span>
            </NavLink>

            <NavLink
              to="/college/settings/sessions"
              className={({ isActive }) => 
                `w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                  isActive
                    ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60 font-semibold'
                    : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight font-normal'
                }`
              }
            >
              <Tv size={16} className={activeTab === 'sessions' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Active sessions</span>
            </NavLink>
          </div>

        </nav>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 min-w-0">
        
        {/* Global Action Banner Alert */}
        {message.text && (
          <div className={`p-4 rounded-xl text-xs font-semibold border flex items-center gap-2 mb-6 animate-in fade-in duration-200 ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
              : 'bg-red-500/10 text-red-400 border-red-500/25'
          }`}>
            <Check size={14} />
            <span>{message.text}</span>
          </div>
        )}

        {/* ── TAB CONTENT OUTLET ── */}
        <Outlet context={{ showToast, setShowLogoutModal, collegeDetails, collegeLoading, setCollegeDetails }} />

      </main>

      {/* ── LOGOUT CONFIRMATION MODAL ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setShowLogoutModal(false)}
          />
          
          <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-ec-border bg-ec-surface p-6 text-left shadow-2xl transition-all animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 animate-pulse">
                <LogOut size={22} className="rotate-180" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ec-highlight">
                  Terminate Active Session?
                </h3>
                <p className="text-xs text-ec-text-sub mt-1">
                  You are about to sign out of the Connect-Karo Admin Portal.
                </p>
              </div>
            </div>

            <div className="mt-4 text-xs text-ec-text leading-relaxed">
              This will clear your local administrative session token. You will need to input your credentials to log back in.
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-xs font-semibold text-ec-text-sub hover:text-ec-highlight bg-ec-surface border border-ec-border hover:bg-ec-muted rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-lg shadow-red-500/15 transition-all cursor-pointer border-transparent"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
