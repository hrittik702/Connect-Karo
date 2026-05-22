import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  GoHome, 
  GoChecklist, 
  GoPeople, 
  GoMegaphone, 
  GoGear,
  GoBell,
  GoOrganization
} from 'react-icons/go';
import { useAuth } from '../../context/AuthContext';

export default function CollegeDashboardLayout() {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setShowNotifications(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Overview', path: '/college', icon: GoHome, exact: true },
    { name: 'Requests', path: '/college/requests', icon: GoChecklist },
    { name: 'Directory', path: '/college/users', icon: GoPeople },
    { name: 'Broadcasts', path: '/college/broadcasts', icon: GoMegaphone },
    { name: 'Settings', path: '/college/settings', icon: GoGear },
  ];

  const adminName = userData?.name || "College Admin";

  return (
    <div className="min-h-screen bg-ec-root text-ec-text flex flex-col font-sans relative selection:bg-ec-accent/20">
      
      {/* ── TOP NAVBAR (2-Liner layout) ── */}
      <header className="w-full bg-ec-header flex flex-col shrink-0 select-none">
        
        {/* Row 1: Brand logo/title and notifications/profile */}
        <div className="w-full h-16 flex items-center justify-between px-4 pt-3 pb-1">
          {/* Brand Header */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-full bg-ec-accent/10 border border-ec-accent/20 flex items-center justify-center">
              <GoOrganization size={16} className="text-ec-accent" />
            </div>
            <span className="text-[17.5px] font-bold text-ec-highlight tracking-wide uppercase">
              College<span className="text-ec-accent"> Portal</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 relative shrink-0">
            {/* Notification Alert Trigger */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-1.5 text-ec-text-sub transition-all rounded-full z-50 ${
                showNotifications ? 'bg-white text-gray-900 border border-gray-200' : 'hover:bg-ec-muted/50'
              }`}
              aria-label="Campus warnings"
            >
              <GoBell size={16} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-ec-accent border border-ec-surface animate-pulse"></span>
            </button>

            {/* Notification Deck (Light Theme per root admin layout specs) */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent cursor-default" 
                  onClick={() => setShowNotifications(false)}
                />
                
                <div className="absolute right-0 top-10 w-80 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] p-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200 text-gray-600">
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

            {/* College Admin Identity Card (Profile Picture Only) */}
            <div className="pl-2 select-none z-10">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-ec-accent to-emerald-400 flex items-center justify-center text-ec-root font-bold text-xs shadow-md border border-ec-border/40 overflow-hidden cursor-pointer">
                {userData?.photoURL ? (
                  <img src={userData.photoURL} alt="profile" className="w-full h-full object-cover" />
                ) : currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  adminName.charAt(0).toUpperCase()
                )}
              </div>
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

      {/* content area */}
      <main className="flex-1 pt-10 pb-6 px-4 sm:pt-12 sm:pb-8 sm:px-6 lg:pt-16 lg:pb-12 lg:px-8 z-10 bg-transparent">
        <div className="max-w-7xl mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
