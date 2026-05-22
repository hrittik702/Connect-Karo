import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  GoHome, 
  GoOrganization, 
  GoIssueOpened, 
  GoCreditCard, 
  GoMegaphone, 
  GoGear,
  GoBell,
  GoAlert
} from 'react-icons/go';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Enterprise UI States
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [error, setError] = useState('');

  // Close notifications on route transition
  useEffect(() => {
    setShowNotifications(false);
  }, [location.pathname]);

  // Master Route Declaration
  const navItems = [
    { name: 'Overview', path: '/admin', icon: GoHome, exact: true },
    { name: 'Colleges', path: '/admin/colleges', icon: GoOrganization },
    { name: 'Helpdesk', path: '/admin/support', icon: GoIssueOpened },
    { name: 'Billing', path: '/admin/billing', icon: GoCreditCard },
    { name: 'Broadcast', path: '/admin/broadcast', icon: GoMegaphone },
    { name: 'Settings', path: '/admin/settings', icon: GoGear },
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
      setError('Super Admin sign out failed. Please try again.');
    }
  };

  // Safe Fallback Resolution for Identity Data
  const adminEmail = currentUser?.email || 'admin@defensotech.com';
  const adminName = userData?.fullName || currentUser?.displayName || adminEmail.split('@')[0];

  return (
    <div className="min-h-screen bg-ec-root text-ec-text flex flex-col font-sans relative selection:bg-ec-accent/20">
      
      {/* ── TOP NAVBAR (2-Liner layout) ── */}
      <header className="w-full bg-ec-header flex flex-col shrink-0 select-none">
        
        {/* Row 1: Brand logo/title and notifications/profile */}
        <div className="w-full h-16 flex items-center justify-between px-4 pt-3 pb-1">
          {/* Brand Header */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-full bg-ec-accent/10 border border-ec-accent/20 flex items-center justify-center">
              <GoGear size={16} className="text-ec-accent" />
            </div>
            <span className="text-[17.5px] font-bold text-ec-highlight tracking-wide uppercase">
              Root<span className="text-ec-accent"> Admin</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 relative shrink-0">
            {/* Error Indicator */}
            {error && (
              <span className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded animate-pulse">
                {error}
              </span>
            )}

            {/* Notification Alert Trigger */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-1.5 text-ec-text-sub transition-all rounded-full z-50 ${
                showNotifications ? 'bg-white text-gray-900 border border-gray-200' : 'hover:bg-ec-muted/50'
              }`}
              aria-label="System notifications"
            >
              <GoBell size={16} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-ec-accent border border-ec-surface animate-pulse"></span>
            </button>

            {/* Notification Deck (Light Theme) */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent cursor-default" 
                  onClick={() => setShowNotifications(false)}
                />
                
                <div className="absolute right-0 top-10 w-80 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] p-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200 text-gray-600">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                    <span className="font-bold text-gray-900 text-xs tracking-tight">System Alerts</span>
                    <span className="text-[9px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Live Sync</span>
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-none">
                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100/70 transition-colors">
                      <p className="text-gray-900 font-semibold text-[11.5px] mb-0.5">Database Cluster Synced</p>
                      <p className="text-[10.5px] text-gray-500 leading-relaxed">All core security nodes verified across active network pipelines.</p>
                    </div>
                    <div className="p-2.5 bg-orange-50/60 rounded-lg border border-orange-100 hover:bg-orange-50 transition-colors">
                      <p className="text-orange-900 font-semibold text-[11.5px] mb-0.5">Pending Support Tickets</p>
                      <p className="text-[10.5px] text-orange-700/90 leading-relaxed">2 colleges have raised critical queries regarding identity uploads.</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Root Admin Identity Card (Profile Picture Only) */}
            <div className="pl-2 select-none z-10">
              <button 
                onClick={() => setShowLogoutModal(true)}
                className="w-7 h-7 rounded-full bg-gradient-to-tr from-ec-accent to-emerald-400 flex items-center justify-center text-ec-root font-bold text-xs shadow-md border border-ec-border/40 overflow-hidden cursor-pointer"
                title="Sign Out"
              >
                {adminName.charAt(0).toUpperCase()}
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Horizontal Nav Links */}
        <div className="w-full h-12 flex items-center px-4 overflow-x-auto scrollbar-none border-b border-ec-border">
          <nav className="flex items-center gap-1.5 h-full">
            {navItems.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.exact}
                  className={`flex items-center gap-1.5 px-2.5 h-full text-[13.5px] font-medium transition-all duration-150 border-b-2 relative translate-y-[1px] shrink-0 ${
                    isActive
                      ? 'border-[#f78162] text-ec-highlight font-semibold'
                      : 'border-transparent text-ec-text-sub hover:text-ec-highlight hover:border-ec-border/30'
                  }`}
                >
                  <item.icon size={16} className={isActive ? 'text-[#f78162]' : 'text-ec-icon'} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-10 pb-6 px-4 sm:pt-12 sm:pb-8 sm:px-6 lg:pt-16 lg:pb-12 lg:px-8 z-10 bg-transparent">
        <div className="max-w-7xl mx-auto h-full">
          <Outlet />
        </div>
      </main>

      {/* ── LIGHT THEME DOUBLE CONFIRMATION MODAL ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div 
            className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3 mb-3 text-red-500">
              <GoAlert size={22} className="shrink-0" />
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