import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  GoHome, 
  GoChecklist, 
  GoPeople, 
  GoMegaphone, 
  GoGear,
  GoBell,
  GoOrganization,
  GoSearch
} from 'react-icons/go';
import { useAuth } from '../../context/AuthContext';
import UserMenuDropdown from '../../components/college/UserMenuDropdown';

export default function CollegeDashboardLayout() {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setShowNotifications(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Overview', path: '/college', icon: GoHome, exact: true },
    { name: 'Requests', path: '/college/requests', icon: GoChecklist },
    { name: 'Directory', path: '/college/users', icon: GoPeople },
    { name: 'Broadcasts', path: '/college/broadcasts', icon: GoMegaphone },
  ];

  const adminName = userData?.name || "College Admin";
  const collegeName = userData?.collegeName || userData?.collegeId || "College";
  const collegeInitial = collegeName.charAt(0).toUpperCase();

  // Dashboard overview page (no tabs shown)
  const isDashboard = 
    location.pathname === '/college' || 
    location.pathname === '/college/';

  // Sub-routes where nav tabs are visible
  const isSubRoute = 
    location.pathname.startsWith('/college/requests') ||
    location.pathname.startsWith('/college/users') ||
    location.pathname.startsWith('/college/broadcasts');

  // Settings pages have their own header
  const isSettingsRoute = location.pathname.startsWith('/college/settings');

  return (
    <div className="min-h-screen bg-ec-root text-ec-text flex flex-col font-sans relative selection:bg-ec-accent/20">
      
      {/* ── TOP NAVBAR (Dynamic layout) ── */}
      <header className="w-full bg-ec-header flex flex-col shrink-0 select-none">
        
        {/* Row 1: Brand logo/title and notifications/profile */}
        <div className={`w-full h-16 flex items-center justify-between px-4 pt-2 pb-1 ${
          isSubRoute ? '' : 'border-b border-gray-200 dark:border-[#30363d]'
        }`}>
          
          {/* Brand Header */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Styled Hamburger Menu Button (Always visible) */}
            <button className="p-1.5 text-gray-400 dark:text-[#8b949e] hover:text-gray-900 dark:hover:text-[#f0f6fc] hover:bg-gray-100 dark:hover:bg-[#30363d]/60 rounded-lg transition-colors cursor-pointer bg-transparent border-transparent outline-none">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>
              </svg>
            </button>

            {isDashboard ? (
              /* Dashboard page - show "Dashboard" header like GitHub */
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/college')}>
                <div className="w-7 h-7 rounded-full bg-ec-accent/10 border border-ec-accent/20 flex items-center justify-center shrink-0">
                  <GoHome size={15} className="text-ec-accent" />
                </div>
                <span className="text-sm font-bold text-ec-highlight tracking-tight">
                  Dashboard
                </span>
              </div>
            ) : isSubRoute ? (
              /* Sub-route pages - show college name (as stored in DB, no uppercase) */
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/college')}>
                <div className="w-7 h-7 rounded-full bg-ec-accent/10 border border-ec-accent/20 flex items-center justify-center shrink-0">
                  <GoOrganization size={15} className="text-ec-accent" />
                </div>
                <span className="text-sm font-bold text-ec-highlight tracking-tight">
                  {collegeName}
                </span>
              </div>
            ) : (
              /* Settings pages */
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/college')}>
                <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-[#21262d] flex items-center justify-center border border-gray-200 dark:border-[#30363d] shrink-0">
                  <GoGear size={15} className="text-gray-600 dark:text-[#c9d1d9]" />
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-[#f0f6fc] tracking-tight">
                  Settings
                </span>
              </div>
            )}
          </div>

          {/* Center: Search Bar (UI only) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="w-full flex items-center gap-2 px-3 py-1.5 bg-ec-surface border border-ec-border rounded-lg text-ec-text-sub hover:border-ec-text-sub/40 transition-colors cursor-text group">
              <GoSearch size={14} className="text-ec-icon shrink-0" />
              <span className="text-[13px] text-ec-text-sub/60 flex-1">Type to search...</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-ec-text-sub bg-ec-muted/40 border border-ec-border rounded">/</kbd>
            </div>
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
              <div 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-7 h-7 rounded-full bg-[#f3f4f6] dark:bg-[#30363d] flex items-center justify-center text-gray-600 dark:text-[#c9d1d9] font-extrabold text-xs shadow-md border border-gray-200 dark:border-[#30363d] overflow-hidden cursor-pointer hover:border-ec-accent transition-all duration-200"
              >
                {userData?.photoURL ? (
                  <img src={userData.photoURL} alt="profile" className="w-full h-full object-cover" />
                ) : currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  collegeInitial
                )}
              </div>
            </div>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <UserMenuDropdown onClose={() => setShowUserMenu(false)} />
            )}
          </div>
        </div>

        {/* Row 2: Horizontal Nav Links (Show ONLY on sub-route pages, NOT on dashboard overview) */}
        {isSubRoute && (
          <div className="w-full h-10 flex items-center px-4 overflow-x-auto scrollbar-none border-b border-ec-border">
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
                    className={`flex items-center gap-1.5 px-3 h-full text-[13px] font-medium transition-all duration-150 border-b-2 relative translate-y-[1px] shrink-0 ${
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
        )}
      </header>

      {/* content area */}
      <main className="flex-1 pt-6 pb-6 px-4 sm:pt-8 sm:pb-8 sm:px-5 lg:pt-8 lg:pb-12 lg:px-8 z-10 bg-transparent">
        <div className="w-full h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
