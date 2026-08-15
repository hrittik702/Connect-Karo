import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  Menu, X, LayoutDashboard, UserCheck, 
  Briefcase, Users, Calendar, Settings, Edit3, Search, Bell, LogOut, QrCode, Clock
} from 'lucide-react';

export default function DashboardLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileBadgeOpen, setIsMobileBadgeOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Dynamic Global Search Box State
  const [searchFilter, setSearchFilter] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  // Mouse coordinate state to power the card shine style
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  const [alumniProfile] = useState({
    name: "Rahul Sharma",
    branch: "Information Technology",
    batch: "Class of 2018",
    designation: "Senior Software Engineer",
    company: "Google",
    alumniId: "CK-2018-0994",
    photo_url: ""
  });

  const [alerts, setAlerts] = useState([
    { id: 1, text: "Anjali Singh sent you a new chat query request.", time: "4 hours ago", unread: true },
    { id: 2, text: "Your corporate job board referral post was approved.", time: "2 days ago", unread: false }
  ]);

  const navigationItems = [
    { name: 'Dashboard Home', path: '/alumni/dashboard', icon: LayoutDashboard },
    { name: 'Student Messages', path: '/alumni/mentorship', icon: UserCheck },
    { name: 'Job Board', path: '/alumni/jobs', icon: Briefcase },
    { name: 'Alumni Directory', path: '/alumni/directory', icon: Users },
    { name: 'Campus Events', path: '/alumni/events', icon: Calendar },
    { name: 'Account Settings', path: '/alumni/settings', icon: Settings },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleNavigationTransition = (targetPath) => {
    setIsDrawerOpen(false);
    navigate(targetPath);
  };

  const hasUnreadAlerts = alerts.some(a => a.unread);

  // Condition Check: Kya user abhi chat/messages page par khada hai?
  const isChatRoute = location.pathname.includes('mentorship') || location.pathname.includes('chat') || location.pathname.includes('interaction');
  
  // Condition Check: Profile card STRICTLY sirf dashboard home page par dikhane ke liye
  const isDashboardHome = location.pathname === '/alumni/dashboard' || location.pathname === '/alumni/dashboard/';

  return (
    <div className="min-h-screen bg-ec-root text-ec-text relative font-sans flex flex-col transition-colors duration-300">
      
      {/* ── TOP NAVIGATION HEADER BAR ── */}
      <div className="sticky top-0 z-40 w-full p-0 transition-all duration-300">
        <header className={`w-full border-b border-ec-border bg-ec-surface/85 backdrop-blur-md transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
          <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className="p-2 rounded-md hover:bg-ec-muted/50 text-ec-text-sub hover:text-ec-text transition-colors focus:outline-none cursor-pointer"
              >
                {isDrawerOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              
              {/* 🟢 FIXED FEATURE: BRAND CLICK ROUTE TO DASHBOARD HOME */}
              <button 
                onClick={() => navigate('/alumni/dashboard')}
                className="flex items-center gap-2 select-none cursor-pointer focus:outline-none bg-transparent border-none p-0 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-ec-accent flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
                  <span>CK</span>
                </div>
                <span className="font-bold text-sm tracking-tight hidden sm:block text-ec-highlight hover:text-ec-accent transition-colors">Connect-Karo</span>
              </button>
            </div>

            {/* 🔍 FIXED FEATURE: SEARCH BAR CONFIGURED TO HIDE AUTOMATICALLY ON CHAT PAGES */}
            {!isChatRoute ? (
              <div className="hidden md:flex items-center border border-ec-border focus-within:border-ec-accent/60 rounded-lg px-3 py-1.5 w-64 bg-transparent transition-all duration-200 animate-fade-in">
                <Search size={14} className="text-ec-icon mr-2 flex-shrink-0" />
                <input 
                  type="text" 
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search layout keys..." 
                  className="bg-transparent border-none outline-none text-xs w-full text-ec-text placeholder-ec-text-sub/40 focus:ring-0 p-0"
                />
                {searchFilter && (
                  <X size={12} className="text-ec-text-sub hover:text-ec-text cursor-pointer ml-1" onClick={() => setSearchFilter("")} />
                )}
              </div>
            ) : (
              <div className="hidden md:block w-64 h-1" /> /* Balanced Layout Spacer element when hidden */
            )}

            <div className="flex items-center gap-4 relative">
              {/* Notification Button */}
              <div ref={notificationRef} className="relative">
                <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="text-ec-icon hover:text-ec-text transition-all relative p-2 rounded-full hover:bg-ec-muted/50 cursor-pointer focus:outline-none"
                >
                  <Bell size={18} />
                  {hasUnreadAlerts && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-ec-accent rounded-full animate-pulse" />
                  )}
                </button>

                {/* Dropdown Menu Window */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-ec-surface border border-ec-border rounded-xl shadow-2xl overflow-hidden z-50 animate-scale-in">
                    <div className="p-3 border-b border-ec-border bg-ec-surface flex justify-between items-center">
                      <span className="text-xs font-bold text-ec-highlight">Recent Updates</span>
                      {hasUnreadAlerts && (
                        <button 
                          onClick={() => setAlerts(prev => prev.map(a => ({...a, unread: false})))}
                          className="text-[10px] text-ec-accent font-bold hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="divide-y divide-ec-border/40 max-h-64 overflow-y-auto">
                      {alerts.map((alert) => (
                        <div key={alert.id} className={`p-3.5 text-left transition-colors ${alert.unread ? 'bg-ec-accent/5' : 'hover:bg-ec-muted/20'}`}>
                          <p className="text-xs font-medium text-ec-text leading-normal">{alert.text}</p>
                          <div className="flex items-center gap-1 mt-1.5 text-[9px] text-ec-text-sub font-semibold">
                            <Clock size={10} />
                            <span>{alert.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Profile Bubble Trigger */}
              <button 
                onClick={() => { if(isDashboardHome) setIsMobileBadgeOpen(true) }} 
                className={`flex items-center gap-3 group focus:outline-none ${isDashboardHome ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold group-hover:text-ec-accent transition-colors">{alumniProfile.name}</p>
                  <p className="text-[10px] text-ec-text-sub font-medium">{alumniProfile.batch}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-ec-muted border border-ec-border p-[1px] overflow-hidden group-hover:border-ec-accent transition-all duration-200 shadow-sm">
                  <img src={alumniProfile.photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                </div>
              </button>
            </div>

          </div>
        </header>
      </div>

      {/* ── SIDEBAR DRAWER SLIDEOUT MENU ── */}
      {isDrawerOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden" onClick={() => setIsDrawerOpen(false)} />}
      
      <aside className={`fixed top-16 left-0 bottom-0 z-50 w-64 bg-ec-surface border-r border-ec-border transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="p-4 flex flex-col gap-1 h-full">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleNavigationTransition(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-left transition-all duration-200 focus:outline-none cursor-pointer ${isActive ? 'bg-ec-accent/12 text-ec-accent shadow-sm' : 'text-ec-text-sub hover:text-ec-text hover:bg-ec-muted/50'}`}
              >
                <Icon size={18} className={isActive ? 'text-ec-accent' : 'text-ec-icon'} />
                <span>{item.name}</span>
              </button>
            );
          })}
          <div className="mt-auto pt-4 border-t border-ec-border">
            <button onClick={() => navigate('/login')} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors focus:outline-none cursor-pointer">
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* ── MAIN GRID LAYOUT CONTROLLER (ISOLATED BADGE DISPLAYS) ── */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start z-10">
        
        {/* 🟢 FIXED FEATURE: PROFILE CARD SHOWS UP *ONLY* ON THE DASHBOARD HOME PAGE */}
        {isDashboardHome ? (
          <>
            <div 
              className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24 w-full animate-fade-in"
              onMouseMove={handleMouseMove}
            >
              <AlumniCardIdentity 
                alumniProfile={alumniProfile} 
                onNavigate={handleNavigationTransition} 
                mouseCoords={mouseCoords}
              />
            </div>

            <main className="col-span-1 lg:col-span-3 w-full">
              <Outlet context={{ searchFilter }} />
            </main>
          </>
        ) : (
          /* For all other pages (Chat, Referrals, Settings) layout becomes full-width (4 columns) */
          <div className="col-span-1 lg:col-span-4 w-full animate-fade-in">
            <Outlet context={{ searchFilter }} />
          </div>
        )}

      </div>

      {/* ── MOBILE CARD PANEL PANEL DRAWER CONTROLLER ── */}
      {isMobileBadgeOpen && isDashboardHome && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsMobileBadgeOpen(false)} />
          <div className="relative w-full max-w-md bg-ec-surface border-t border-ec-border rounded-t-2xl p-6 shadow-xl" onMouseMove={handleMouseMove}>
            <div className="w-12 h-1 bg-ec-muted rounded-full mx-auto mb-5 cursor-pointer" onClick={() => setIsMobileBadgeOpen(false)}/>
            <button onClick={() => setIsMobileBadgeOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-full bg-ec-muted/50 text-ec-text-sub hover:text-ec-text focus:outline-none cursor-pointer">
              <X size={16} />
            </button>
            <div className="pt-1">
              <AlumniCardIdentity alumniProfile={alumniProfile} onNavigate={handleNavigationTransition} onActionCallback={() => setIsMobileBadgeOpen(false)} mouseCoords={mouseCoords} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

{/* ── ALUMNI SHINE PROFILE IDENTITY CARD COMPONENT ── */}
function AlumniCardIdentity({ alumniProfile, onNavigate, onActionCallback, mouseCoords }) {
  const handleUpdateProfileClick = (e) => {
    e.preventDefault();
    if (onActionCallback) onActionCallback();
    onNavigate('/alumni/settings'); 
  };

  return (
    <div className="surface-card p-6 border border-ec-border/60 bg-gradient-to-b from-ec-surface to-ec-surface/90 flex flex-col items-center text-center relative overflow-hidden select-none rounded-[16px] shadow-xl group transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-2xl">
      <div 
        className="absolute pointer-events-none rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
        style={{
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, var(--ec-accent, #10b981) 0%, transparent 70%)',
          left: `${mouseCoords.x - 90}px`,
          top: `${mouseCoords.y - 90}px`,
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-ec-accent via-emerald-400 to-teal-500 shadow-md" />
      <div className="relative mt-2 group-hover:scale-105 transition-transform duration-500 ease-out">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-ec-accent to-emerald-400 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="w-24 h-24 rounded-full border-2 border-ec-border/80 p-[3px] overflow-hidden bg-ec-root relative z-10 group-hover:border-ec-accent shadow-md transition-colors duration-300">
          <img src={alumniProfile.photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} alt="Alumni Face" className="w-full h-full object-cover rounded-full" />
        </div>
      </div>
      <h3 className="font-black text-lg mt-4 tracking-tight text-ec-highlight group-hover:text-ec-accent transition-colors duration-300">
        {alumniProfile.name}
      </h3>
      <span className="mt-2 select-none px-3 py-1 bg-ec-accent/10 border border-ec-accent/20 text-ec-accent rounded-full text-[11px] font-black tracking-wide uppercase shadow-sm">
        {alumniProfile.batch}
      </span>
      <div className="w-full border-t border-dashed border-ec-border/60 my-5" />
      <div className="w-full text-left space-y-4 text-xs px-1">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-ec-text-sub font-bold">College Department</p>
          <p className="font-bold text-ec-highlight mt-0.5">{alumniProfile.branch}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-ec-text-sub font-bold">Current Work Role</p>
          <p className="font-extrabold text-ec-accent text-sm mt-0.5">{alumniProfile.designation}</p>
          <p className="text-ec-text-sub font-semibold mt-0.5">{alumniProfile.company}</p>
        </div>
        <div className="pt-2">
          <div className="bg-ec-root/60 border border-ec-border/80 rounded-xl p-3 flex items-center justify-between shadow-inner relative overflow-hidden hover:bg-ec-root/90 transition-all duration-300">
            <div className="space-y-1 z-10">
              <p className="text-[9px] uppercase tracking-widest text-ec-text-sub font-black flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ec-accent animate-pulse" /> Verified Alumni Access
              </p>
              <p className="font-mono text-xs font-black tracking-wider text-ec-highlight">{alumniProfile.alumniId}</p>
            </div>
            <div className="w-10 h-10 bg-ec-surface border border-ec-border rounded-lg flex items-center justify-center text-ec-highlight shadow-md z-10">
              <QrCode size={22} strokeWidth={1.8} />
            </div>
          </div>
        </div>
      </div>
      <button onClick={handleUpdateProfileClick} className="w-full mt-6 text-xs font-bold gap-2 py-3 flex items-center justify-center rounded-xl text-ec-text bg-ec-muted/40 border border-ec-border/40 hover:bg-ec-accent hover:text-white hover:border-transparent hover:shadow-md transition-all duration-300 active:scale-[0.98] focus:outline-none cursor-pointer">
        <Edit3 size={14} /> Update Profile
      </button>
    </div>
  );
}