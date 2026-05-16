import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Ticket, 
  CreditCard, 
  Radio, 
  Settings, 
  LogOut,
  ShieldCheck,
  Bell,
  Menu,
  X,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Enterprise UI States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [error, setError] = useState('');

  // Clean memory leaks & close panels on route transition
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowNotifications(false);
  }, [location.pathname]);

  // Master Route Declaration
  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Colleges', path: '/admin/colleges', icon: Building2 },
    { name: 'Helpdesk', path: '/admin/support', icon: Ticket },
    { name: 'Billing', path: '/admin/billing', icon: CreditCard },
    { name: 'Broadcast', path: '/admin/broadcast', icon: Radio },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  // Secure Auth Termination Pipeline
  const handleLogout = async () => {
    try {
      setError('');
      setShowLogoutModal(false);
      if (logout) {
        await logout();
      }
      navigate('/login', { replace: true });
    } catch (err) {
      console.error("Critical Logout Failure:", err);
      setError('Firebase session terminate nahi ho saki. Kripya refresh karke dobara check karein.');
    }
  };

  // Safe Fallback Resolution for Identity Data
  const adminEmail = currentUser?.email || 'admin@defensotech.com';
  const adminName = userData?.fullName || currentUser?.displayName || adminEmail.split('@')[0];

  return (
    <div className="min-h-screen bg-ec-root text-ec-text flex overflow-hidden selection:bg-ec-accent/20 font-sans relative">
      
      {/* ═══════════════════════════════════════════
       * SIDEBAR SYSTEM (Liquid Glass Shell)
       * ═══════════════════════════════════════════ */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-ec-surface/95 md:bg-ec-surface/90 backdrop-blur-xl border-r border-ec-border transform transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Control Header */}
        <div className="h-16 flex items-center px-6 border-b border-ec-border bg-ec-surface/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ec-accent/10 border border-ec-accent/20 flex items-center justify-center">
              <ShieldCheck size={18} className="text-ec-accent" />
            </div>
            <span className="text-[15px] font-bold text-ec-highlight tracking-wide uppercase">
              Root<span className="text-ec-accent">Admin</span>
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

        {/* Dynamic Route Map */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-none">
          <div className="text-[10px] font-semibold text-ec-text-sub uppercase tracking-[0.15em] px-3 mb-3 opacity-60">
            Command Center
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

        {/* Error Interface Hook */}
        {error && (
          <div className="mx-3 my-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2 text-xs text-red-400 animate-pulse">
            <AlertCircle size={14} className="shrink-0" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        {/* System Core Exit Action */}
        <div className="p-4 border-t border-ec-border bg-ec-surface/40">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════
       * MAIN EXECUTIVE PANEL VIEW
       * ═══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Ambient Premium Blur Layer */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-ec-accent/5 blur-[140px] pointer-events-none z-0" />
        
        {/* Topbar Operations Deck */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-ec-surface/60 backdrop-blur-md border-b border-ec-border z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-ec-text-sub hover:text-ec-highlight transition-colors p-1"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-[15px] font-medium text-ec-highlight hidden sm:block capitalize select-none">
              System Active: <span className="text-ec-text font-normal">{adminName}</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Notification Trigger Button */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 text-ec-text-sub transition-all rounded-full z-50 ${
                showNotifications ? 'bg-white text-gray-900 border border-gray-200' : 'hover:bg-ec-muted/50'
              }`}
              aria-label="System notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-ec-accent border border-ec-surface animate-pulse"></span>
            </button>

            {/* ✅ LIGHT THEME NOTIFICATION DECK WITH CLICK OUTSIDE SHIELD */}
            {showNotifications && (
              <>
                {/* Global Click Outside Transparent Shield */}
                <div 
                  className="fixed inset-0 z-40 bg-transparent cursor-default" 
                  onClick={() => setShowNotifications(false)}
                />
                
                {/* Fixed Enterprise Normal Width Panel */}
                <div className="absolute right-0 top-12 w-96 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] p-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200 text-gray-600">
                  <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-gray-100">
                    <span className="font-bold text-gray-900 text-[14px] tracking-tight">System Alerts</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-mono font-bold uppercase tracking-wider">Live Sync</span>
                  </div>
                  
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-none">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100/70 transition-colors">
                      <p className="text-gray-900 font-semibold text-[12.5px] mb-1">Database Cluster Synced</p>
                      <p className="text-[11.5px] text-gray-500 leading-relaxed">All core security nodes verified across active network pipelines.</p>
                    </div>
                    <div className="p-3 bg-orange-50/60 rounded-lg border border-orange-100 hover:bg-orange-50 transition-colors">
                      <p className="text-orange-900 font-semibold text-[12.5px] mb-1">Pending Support Tickets</p>
                      <p className="text-[11.5px] text-orange-700/90 leading-relaxed">2 colleges have raised critical queries regarding identity uploads.</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Executive Identity Unit */}
            <div className="flex items-center gap-2.5 pl-4 border-l border-ec-border select-none z-10">
              <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-ec-accent to-emerald-400 flex items-center justify-center text-ec-root font-bold text-sm shadow-lg shadow-ec-accent/10">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-[13px] font-semibold text-ec-highlight leading-tight truncate max-w-[120px]">
                  {adminName}
                </div>
                <div className="text-[10px] text-ec-accent font-medium tracking-wider uppercase mt-0.5">
                  {userData?.role ? userData.role.replace('_', ' ') : 'Super Admin'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Sandbox Execution Zone */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth z-10 bg-transparent">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ═══════════════════════════════════════════
       * LIGHT THEME DOUBLE CONFIRMATION MODAL
       * ═══════════════════════════════════════════ */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div 
            className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3 mb-3 text-red-500">
              <AlertCircle size={24} strokeWidth={2.5} />
              <h3 className="text-[17px] font-bold text-gray-900">Confirm Sign Out</h3>
            </div>
            
            <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
              Kya aap sach me ConnectKaro Super Admin control terminal se sign out karna chahte hain? Saari active management processes close ho jayengi.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowLogoutModal(false)} 
                className="px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:text-gray-900 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout} 
                className="px-4 py-2.5 text-[13px] font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-md shadow-red-500/20"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}