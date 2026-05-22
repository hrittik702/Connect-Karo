import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  Radio, 
  Settings, 
  Building2,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CollegeDashboardLayout() {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowNotifications(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Overview', path: '/college', icon: LayoutDashboard, exact: true },
    { name: 'Verification Requests', path: '/college/requests', icon: UserCheck },
    { name: 'Verified Directory', path: '/college/users', icon: Users },
    { name: 'Root Broadcasts', path: '/college/broadcasts', icon: Radio },
  ];

  const adminName = userData?.name || "College Admin";
  const collegeId = userData?.collegeId || "";

  return (
    <div className="min-h-screen bg-ec-root text-ec-text flex overflow-hidden selection:bg-ec-accent/20 font-sans relative">
      
      {/* Sidebar Mobile Overlay backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── LEFT SIDEBAR ── */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-ec-surface/95 md:bg-ec-surface/90 backdrop-blur-xl border-r border-ec-border transform transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-ec-border bg-ec-surface/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ec-accent/10 border border-ec-accent/20 flex items-center justify-center">
              <Building2 size={18} className="text-ec-accent" />
            </div>
            <span className="text-[14px] font-bold text-ec-highlight tracking-wide uppercase">
              College<span className="text-ec-accent">Portal</span>
            </span>
          </div>
          <button 
            className="ml-auto md:hidden text-ec-text-sub hover:text-ec-highlight transition-colors p-1" 
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-none">
          <div className="text-[10px] font-semibold text-ec-text-sub uppercase tracking-[0.15em] px-3 mb-3 opacity-60">
            Node Console
          </div>
          
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-all duration-200 border ${
                  isActive
                    ? 'bg-ec-accent/10 text-ec-accent border-ec-accent/20 shadow-[0_0_15px_rgba(16,185,129,0.03)]'
                    : 'text-ec-text-sub border-transparent hover:text-ec-highlight hover:bg-ec-muted/40'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-ec-accent' : 'text-ec-icon'} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Settings Button */}
        <div className="p-4 border-t border-ec-border bg-ec-surface/40">
          <NavLink 
            to="/college/settings"
            className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium border transition-all duration-200 ${
              isActive
                ? 'bg-ec-accent/10 text-ec-accent border-ec-accent/20 shadow-[0_0_15px_rgba(16,185,129,0.03)]'
                : 'text-ec-text-sub border-transparent hover:text-ec-highlight hover:bg-ec-muted/40'
            }`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>

      {/* ── RIGHT MAIN PANEL ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Glow decoration */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-ec-accent/5 blur-[140px] pointer-events-none z-0" />
        
        {/* Top Header Operations Bar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-ec-surface/60 backdrop-blur-md border-b border-ec-border z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-ec-text-sub hover:text-ec-highlight transition-colors p-1"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-[14px] font-medium text-ec-highlight hidden sm:block select-none">
              Institutional Admin Node • <span className="text-ec-text font-normal">Active Session</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 relative">
            
            {/* Notification Alert Trigger */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 text-ec-text-sub transition-all rounded-full z-50 ${
                showNotifications ? 'bg-white text-gray-900 border border-gray-200' : 'hover:bg-ec-muted/50'
              }`}
              aria-label="Campus warnings"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-ec-accent border border-ec-surface animate-pulse"></span>
            </button>

            {/* Notification Deck (Light Theme per root admin layout specs) */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent cursor-default" 
                  onClick={() => setShowNotifications(false)}
                />
                
                <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] p-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200 text-gray-600">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                    <span className="font-bold text-gray-900 text-xs tracking-tight">Institutional Bulletins</span>
                    <span className="text-[9px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Live Sync</span>
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-none">
                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-gray-900 font-semibold text-[11.5px] mb-0.5">Registration Stream Online</p>
                      <p className="text-[10.5px] text-gray-500 leading-normal">Student credentials linked to this college are synced in real-time.</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* College Admin Identity Card */}
            <div className="flex items-center gap-2.5 pl-4 border-l border-ec-border select-none z-10">
              <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-ec-accent to-emerald-400 flex items-center justify-center text-ec-root font-bold text-sm shadow-lg shadow-ec-accent/10">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-[12.5px] font-semibold text-ec-highlight leading-tight truncate max-w-[120px]">
                  {adminName}
                </div>
                <div className="text-[9px] text-ec-accent font-medium tracking-wider uppercase mt-0.5">
                  ID: {collegeId}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth z-10 bg-transparent">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}
