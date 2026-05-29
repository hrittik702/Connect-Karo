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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setShowNotifications(false);
    setShowUserMenu(false);
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Overview', path: '/college', icon: GoOrganization, exact: true },
    { name: 'Requests', path: '/college/requests', icon: GoChecklist },
    { name: 'Directory', path: '/college/users', icon: GoPeople },
    { name: 'Broadcasts', path: '/college/broadcasts', icon: GoMegaphone },
  ];

  const adminName = userData?.name || "College Admin";
  const collegeName = userData?.collegeName || userData?.collegeId || "College";
  const collegeInitial = collegeName.charAt(0).toUpperCase();

  // Helper to abbreviate college name before comma if it contains one
  const getAbbreviatedCollegeName = (name) => {
    if (!name) return "";
    if (name.includes(',')) {
      const parts = name.split(',');
      const beforeComma = parts[0].trim();
      const afterComma = parts.slice(1).join(',').trim();
      
      const words = beforeComma.split(/[\s-]+/);
      const initials = words
        .filter(word => {
          const lower = word.toLowerCase();
          return lower !== 'of' && lower !== 'and' && lower !== 'the' && lower !== 'in' && lower !== 'for' && lower !== 'a' && lower !== 'an';
        })
        .map(word => word.charAt(0).toUpperCase())
        .join('');
        
      return `${initials}, ${afterComma}`;
    }
    return name;
  };

  const displayName = getAbbreviatedCollegeName(collegeName);

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
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 text-ec-text-sub hover:text-ec-highlight hover:bg-ec-muted/50 rounded-lg border border-ec-border transition-all cursor-pointer bg-ec-surface outline-none shadow-sm flex items-center justify-center"
              aria-label="Open navigation menu"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>
              </svg>
            </button>

            {isDashboard ? (
              /* Dashboard page - show "Dashboard" header like GitHub */
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/college')}>
                <div className="w-9 h-9 rounded-full bg-ec-accent/10 border border-ec-accent/20 flex items-center justify-center shrink-0">
                  <GoOrganization size={18} className="text-ec-accent" />
                </div>
                <span className="text-sm font-bold text-ec-highlight tracking-tight">
                  Dashboard
                </span>
              </div>
            ) : isSubRoute ? (
              /* Sub-route pages - show college name (as stored in DB, no uppercase) */
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/college')}>
                <div className="w-9 h-9 rounded-full bg-ec-accent/10 border border-ec-accent/20 flex items-center justify-center shrink-0">
                  <GoOrganization size={18} className="text-ec-accent" />
                </div>
                <span className="text-sm font-bold text-ec-highlight tracking-tight">
                  {displayName}
                </span>
              </div>
            ) : (
              /* Settings pages */
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/college')}>
                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#21262d] flex items-center justify-center border border-gray-200 dark:border-[#30363d] shrink-0">
                  <GoGear size={18} className="text-gray-600 dark:text-[#c9d1d9]" />
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-[#f0f6fc] tracking-tight">
                  Settings
                </span>
              </div>
            )}
          </div>

          {/* Right-aligned Search Bar (UI only) */}
          <div className="hidden md:flex w-64 lg:w-80 ml-auto mr-4">
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
                className="w-9 h-9 rounded-full bg-[#f3f4f6] dark:bg-[#30363d] flex items-center justify-center text-gray-600 dark:text-[#c9d1d9] font-extrabold text-sm shadow-md border border-gray-200 dark:border-[#30363d] overflow-hidden cursor-pointer hover:border-ec-accent transition-all duration-200"
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

      {/* ── LEFT DRAWER / SIDEBAR (Smooth transition overlap card) ── */}
      <div className={`fixed inset-0 z-50 overflow-hidden pointer-events-none transition-all duration-300 ${
        isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 delay-100'
      }`}>
        {/* Backdrop (Whitish/semi-transparent overlay, no blur) */}
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className={`absolute inset-0 bg-white/35 dark:bg-black/25 transition-opacity duration-300 ease-out ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Drawer Panel (Rounded-r-2xl Overlap Card) */}
        <div className={`absolute inset-y-0 left-0 w-80 max-w-[calc(100vw-3rem)] bg-ec-header border-r border-ec-border shadow-2xl rounded-r-2xl flex flex-col z-50 transition-transform duration-300 ease-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Header of Drawer */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-ec-border shrink-0">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { navigate('/college'); setIsSidebarOpen(false); }}>
              <div className="w-9 h-9 rounded-full bg-[#f3f4f6] dark:bg-[#30363d] flex items-center justify-center text-gray-600 dark:text-[#c9d1d9] font-extrabold text-sm shadow border border-gray-200 dark:border-[#30363d] overflow-hidden shrink-0">
                {userData?.photoURL ? (
                  <img src={userData.photoURL} alt="logo" className="w-full h-full object-cover" />
                ) : currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="logo" className="w-full h-full object-cover" />
                ) : (
                  collegeInitial
                )}
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 text-ec-text-sub hover:text-ec-highlight hover:bg-ec-muted/50 rounded-lg border border-ec-border hover:border-ec-border transition-colors cursor-pointer outline-none flex items-center justify-center"
              aria-label="Close navigation menu"
            >
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Content / Nav Items */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-none">
            <div className="px-3 mb-2 text-[11px] font-semibold text-ec-text-sub/50 uppercase tracking-wider">
              Navigation
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
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-ec-accent/10 text-ec-highlight border border-ec-accent/20 font-semibold'
                      : 'text-ec-text-sub hover:text-ec-highlight hover:bg-ec-muted/40 border border-transparent'
                  }`}
                >
                  <item.icon size={18} className={isActive ? 'text-[#f78162]' : 'text-ec-icon'} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}

            <div className="py-2" />

            <div className="px-3 mb-2 text-[11px] font-semibold text-ec-text-sub/50 uppercase tracking-wider">
              Management
            </div>
            <NavLink
              to="/college/settings"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                location.pathname.startsWith('/college/settings')
                  ? 'bg-ec-accent/10 text-ec-highlight border border-ec-accent/20 font-semibold'
                  : 'text-ec-text-sub hover:text-ec-highlight hover:bg-ec-muted/40 border border-transparent'
              }`}
            >
              <GoGear size={18} className={location.pathname.startsWith('/college/settings') ? 'text-[#f78162]' : 'text-ec-icon'} />
              <span>Settings</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
