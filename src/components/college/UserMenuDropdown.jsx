import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  LogOut,
  ArrowLeftRight,
  FolderGit2,
  Star,
  Code2,
  Building2,
  Shield,
  Heart,
  Palette,
  Accessibility
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserMenuDropdown({ onClose }) {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const adminName = userData?.name || "College Admin";
  const adminEmail = userData?.email || currentUser?.email || "admin@institution.edu";
  
  const collegeName = userData?.collegeName || userData?.collegeId || "College";
  const collegeInitial = collegeName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      navigate('/login');
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <>
      {/* Invisible backdrop to dismiss the dropdown on click outside */}
      <div 
        className="fixed inset-0 z-40 bg-transparent cursor-default" 
        onClick={onClose}
      />

      <div className="absolute right-0 top-10 w-[290px] bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-[#30363d] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-gray-700 dark:text-[#c9d1d9] font-sans">
        
        {/* User Identity Header */}
        <div className="p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#161b22]/30 transition-colors select-none">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-[#f3f4f6] dark:bg-[#30363d] flex items-center justify-center text-gray-600 dark:text-[#c9d1d9] font-extrabold text-sm shadow-sm border border-gray-200 dark:border-[#30363d] shrink-0 overflow-hidden select-none">
              {userData?.photoURL ? (
                <img src={userData.photoURL} alt="profile" className="w-full h-full object-cover" />
              ) : currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="profile" className="w-full h-full object-cover" />
              ) : (
                collegeInitial
              )}
            </div>
            
            {/* Details */}
            <div className="text-left min-w-0">
              <div className="text-xs font-bold text-gray-900 dark:text-[#f0f6fc] truncate leading-tight">
                {adminName}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-[#8b949e] truncate mt-0.5 font-medium leading-none">
                {adminEmail}
              </div>
            </div>
          </div>
          
          {/* Switch Profile Action */}
          <button 
            onClick={() => {
              onClose();
              navigate('');
            }}
            className="p-1.5 text-gray-400 dark:text-[#8b949e] hover:text-gray-900 dark:hover:text-[#f0f6fc] hover:bg-gray-100 dark:hover:bg-[#30363d] rounded-lg transition-all shrink-0 cursor-pointer border-transparent"
            title="Switch administrative nodes"
          >
            <ArrowLeftRight size={14} />
          </button>
        </div>

        {/* Faded Horizontal Divider */}
        <div className="h-[1px] bg-gray-100 dark:bg-[#30363d]" />

        {/* Status / Focusing line */}
        <div className="p-2 select-none">
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 dark:bg-[#161b22]/40 rounded-lg border border-gray-100 dark:border-[#30363d]/60">
            <span className="text-xs">🎯</span>
            <span className="text-[10.5px] font-bold text-gray-600 dark:text-[#c9d1d9] truncate">
              Focusing: Active Node Review
            </span>
          </div>
        </div>

        {/* Faded Horizontal Divider */}
        <div className="h-[1px] bg-gray-100 dark:bg-[#30363d]" />

        {/* ──────────────── SECTION A ──────────────── */}
        <div className="p-1.5 space-y-0.5">
          {/* 1. Profile (Ability to manage profile and edit it) */}
          <button
            onClick={() => {
              onClose();
              navigate('/college/settings');
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-left font-medium text-gray-700 dark:text-[#c9d1d9] hover:bg-gray-100 dark:hover:bg-[#30363d]/70 rounded-lg transition-colors cursor-pointer group border-transparent bg-transparent outline-none"
          >
            <User size={14} className="text-gray-400 dark:text-[#8b949e] group-hover:text-gray-900 dark:group-hover:text-[#f0f6fc] shrink-0" />
            <div className="min-w-0">
              <span className="block font-semibold">Your Profile</span>
            </div>
          </button>

          {/* Premium Conceptual Links */}
          <div className="pt-1 select-none">
            <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[11px] text-left font-medium text-gray-500 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#30363d]/40 rounded-lg transition-colors cursor-not-allowed opacity-70 border-transparent bg-transparent outline-none">
              <FolderGit2 size={13} className="shrink-0" />
              <span>Alumni</span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[11px] text-left font-medium text-gray-500 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#30363d]/40 rounded-lg transition-colors cursor-not-allowed opacity-70 border-transparent bg-transparent outline-none">
              <Star size={13} className="shrink-0" />
              <span>Students</span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[11px] text-left font-medium text-gray-500 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#30363d]/40 rounded-lg transition-colors cursor-not-allowed opacity-70 border-transparent bg-transparent outline-none">
              <Code2 size={13} className="shrink-0" />
              <span>College Records</span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[11px] text-left font-medium text-gray-500 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#30363d]/40 rounded-lg transition-colors cursor-not-allowed opacity-70 border-transparent bg-transparent outline-none">
              <Building2 size={13} className="shrink-0" />
              <span>Organizations</span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[11px] text-left font-medium text-gray-500 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#30363d]/40 rounded-lg transition-colors cursor-not-allowed opacity-70 border-transparent bg-transparent outline-none">
              <Shield size={13} className="shrink-0" />
              <span>Enterprises</span>
            </button>
          </div>
        </div>

        {/* Faded Horizontal Divider */}
        <div className="h-[1px] bg-gray-100 dark:bg-[#30363d]" />

        {/* ──────────────── SECTION B ──────────────── */}
        <div className="p-1.5 space-y-0.5">
          {/* 1. Settings (navigates to settings page) */}
          <button
            onClick={() => {
              onClose();
              navigate('/college/settings');
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-left font-medium text-gray-700 dark:text-[#c9d1d9] hover:bg-gray-100 dark:hover:bg-[#30363d]/70 rounded-lg transition-colors cursor-pointer group border-transparent bg-transparent outline-none"
          >
            <Settings size={14} className="text-gray-400 dark:text-[#8b949e] group-hover:text-gray-900 dark:group-hover:text-[#f0f6fc] shrink-0" />
            <div className="min-w-0">
              <span className="block font-semibold">Settings</span>
            </div>
          </button>

          {/* 2. Appearance (navigates to appearance settings page) */}
          <button
            onClick={() => {
              onClose();
              navigate('/college/appearance');
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-left font-medium text-gray-700 dark:text-[#c9d1d9] hover:bg-gray-100 dark:hover:bg-[#30363d]/70 rounded-lg transition-colors cursor-pointer group border-transparent bg-transparent outline-none"
          >
            <Palette size={14} className="text-gray-400 dark:text-[#8b949e] group-hover:text-gray-900 dark:group-hover:text-[#f0f6fc] shrink-0" />
            <div className="min-w-0">
              <span className="block font-semibold">Appearance</span>
            </div>
          </button>

          {/* 3. Conceptual Links */}
          <div className="pt-0.5 select-none">
            <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[11px] text-left font-medium text-gray-500 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#30363d]/40 rounded-lg transition-colors cursor-not-allowed opacity-70 border-transparent bg-transparent outline-none">
              <Accessibility size={13} className="shrink-0" />
              <span>Accessibility</span>
            </button>
            <div className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-medium text-gray-500 dark:text-[#8b949e] hover:bg-gray-100 dark:hover:bg-[#30363d]/40 rounded-lg transition-colors cursor-not-allowed opacity-70">
              <span className="shrink-0">Try Enterprise</span>
              <span className="text-[8.5px] font-[800] border border-gray-300 dark:border-[#30363d] px-1.5 py-0.5 rounded-full uppercase leading-none font-mono">
                Free
              </span>
            </div>
          </div>
        </div>

        {/* Faded Horizontal Divider */}
        <div className="h-[1px] bg-gray-100 dark:bg-[#30363d]" />

        {/* Sign Out Button at Bottom */}
        <div className="p-1.5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer text-left group border-transparent bg-transparent outline-none"
          >
            <LogOut size={14} className="text-red-400 group-hover:text-red-500 shrink-0" />
            <span>Sign out</span>
          </button>
        </div>

      </div>
    </>
  );
}
