import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  LogOut,
  FolderGit2,
  Star,
  Code2,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserMenuDropdown({ onClose }) {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const collegeName = userData?.collegeName || userData?.collegeId || "College";

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      navigate('/login');
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  // Theme management
  const [currentTheme, setCurrentTheme] = React.useState(() => {
    return localStorage.getItem('theme') || 'system';
  });

  const applyTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  return (
    <>
      {/* Visible backdrop to dim the background and dismiss the sidebar */}
      <div 
        className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 ease-out animate-in fade-in cursor-default" 
        onClick={onClose}
      />

      {/* Floating Right Sidebar Panel */}
      <div className="fixed top-[110px] right-4 max-h-[calc(100vh-130px)] h-auto w-80 bg-ec-surface border border-ec-border rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-50 overflow-hidden animate-in slide-in-from-right duration-300 text-ec-text font-sans flex flex-col">
        
        {/* User Identity Section */}
        <div className="p-5 border-b border-ec-border shrink-0 bg-ec-muted/30">
          <div className="text-xl font-bold text-ec-highlight leading-tight">
            {collegeName}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-none p-3 space-y-4">
          
          {/* Main Navigation */}
          <div className="space-y-1">
            <button
              onClick={() => {
                onClose();
                navigate('/college/settings');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left font-medium text-ec-text hover:bg-ec-muted rounded-xl transition-colors cursor-pointer group border-transparent bg-transparent outline-none"
            >
              <User size={18} className="text-ec-icon group-hover:text-ec-highlight shrink-0" />
              <div className="min-w-0">
                <span className="block font-semibold">Account Preferences</span>
              </div>
            </button>


            {/* Premium Conceptual Links */}
            <div className="pt-2 select-none space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-left font-medium text-ec-text-sub rounded-xl transition-colors cursor-not-allowed opacity-70 pointer-events-none border-transparent bg-transparent outline-none">
                <FolderGit2 size={16} className="shrink-0" />
                <span>Alumni</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-left font-medium text-ec-text-sub rounded-xl transition-colors cursor-not-allowed opacity-70 pointer-events-none border-transparent bg-transparent outline-none">
                <Star size={16} className="shrink-0" />
                <span>Students</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-left font-medium text-ec-text-sub rounded-xl transition-colors cursor-not-allowed opacity-70 pointer-events-none border-transparent bg-transparent outline-none">
                <Code2 size={16} className="shrink-0" />
                <span>College Records</span>
              </button>
            </div>
          </div>

          {/* Horizontal Line */}
          <div className="h-[1px] bg-ec-border my-4 mx-2" />

          {/* Theme Options */}
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">
              Theme
            </div>
            
            <button onClick={() => applyTheme('dark')} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left font-medium text-ec-text hover:bg-ec-muted rounded-xl transition-colors cursor-pointer group border-transparent bg-transparent outline-none ${currentTheme === 'dark' ? 'bg-ec-muted text-ec-highlight' : ''}`}>
              <Moon size={18} className="text-ec-icon group-hover:text-ec-highlight shrink-0" />
              <span>Dark</span>
              {currentTheme === 'dark' && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
            </button>
            <button onClick={() => applyTheme('light')} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left font-medium text-ec-text hover:bg-ec-muted rounded-xl transition-colors cursor-pointer group border-transparent bg-transparent outline-none ${currentTheme === 'light' ? 'bg-ec-muted text-ec-highlight' : ''}`}>
              <Sun size={18} className="text-ec-icon group-hover:text-ec-highlight shrink-0" />
              <span>Light</span>
              {currentTheme === 'light' && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
            </button>
            <button onClick={() => applyTheme('system')} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left font-medium text-ec-text hover:bg-ec-muted rounded-xl transition-colors cursor-pointer group border-transparent bg-transparent outline-none ${currentTheme === 'system' ? 'bg-ec-muted text-ec-highlight' : ''}`}>
              <Monitor size={18} className="text-ec-icon group-hover:text-ec-highlight shrink-0" />
              <span>System</span>
              {currentTheme === 'system' && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
            </button>
          </div>

        </div>

        {/* Sign Out Button at Bottom (Sticky) */}
        <div className="p-4 border-t border-ec-border bg-ec-muted/30 mt-auto shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-bold text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-colors cursor-pointer outline-none border border-red-100 dark:border-red-500/20"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Sign out securely</span>
          </button>
        </div>

      </div>
    </>
  );
}
