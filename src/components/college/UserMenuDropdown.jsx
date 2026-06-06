import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  FolderGit2,
  Star,
  Code2,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function UserMenuDropdown({ onClose }) {
  const { userData } = useAuth();
  const navigate = useNavigate();

  // Theme management
  const [currentTheme, setCurrentTheme] = React.useState(() => {
    return localStorage.getItem("connect_karo_theme") || "light";
  });

  const applyTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem("connect_karo_theme", theme);
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // System preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
    // Dispatch custom event to notify useSystemTheme hook
    window.dispatchEvent(new CustomEvent("connect-karo-theme-change", { detail: theme }));
  };

  return (
    <>
      {/* Visible backdrop to dim the background and dismiss the sidebar */}
      <div
        className="fixed inset-0 z-50 transition-opacity duration-300 ease-out animate-in fade-in cursor-default"
        onClick={onClose}
      />

      {/* Floating Right Sidebar Panel */}
      <div className="fixed top-[58px] right-2 max-h-[calc(100vh-80px)] h-auto w-48 bg-white dark:bg-[#242424] border border-ec-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-right duration-150 text-gray-900 dark:text-ec-text font-sans flex flex-col">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-none p-2.5 space-y-0.5">
          {/* Main Navigation */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                onClose();
                navigate("/college/settings");
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-left font-medium text-gray-600 dark:text-ec-text-sub hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer group border-transparent bg-transparent outline-none"
            >
              <User
                size={14}
                className="text-gray-500 dark:text-ec-icon group-hover:text-gray-900 dark:group-hover:text-white shrink-0"
              />
              <span>Account Preferences</span>
            </button>

            {/* Premium Conceptual Links */}
            <div className="space-y-0.5 select-none">
              <button className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-left font-medium text-gray-400 dark:text-[#a3a3a3]/40 rounded-lg transition-colors cursor-not-allowed pointer-events-none border-transparent bg-transparent outline-none">
                <FolderGit2 size={14} className="shrink-0" />
                <span>Alumni</span>
              </button>
              <button className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-left font-medium text-gray-400 dark:text-[#a3a3a3]/40 rounded-lg transition-colors cursor-not-allowed pointer-events-none border-transparent bg-transparent outline-none">
                <Star size={14} className="shrink-0" />
                <span>Students</span>
              </button>
              <button className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-left font-medium text-gray-400 dark:text-[#a3a3a3]/40 rounded-lg transition-colors cursor-not-allowed pointer-events-none border-transparent bg-transparent outline-none">
                <Code2 size={14} className="shrink-0" />
                <span>College Records</span>
              </button>
            </div>
          </div>

          {/* Horizontal Line */}
          <hr className="border-ec-border my-1.5" />

          {/* Theme Options */}
          <div className="space-y-0.5">
            <div className="px-2.5 py-1 text-[11px] font-semibold text-gray-500 dark:text-ec-text-sub select-none">
              Theme
            </div>

            <button
              onClick={() => applyTheme("dark")}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-left font-medium rounded-lg transition-colors cursor-pointer group border-transparent bg-transparent outline-none ${
                currentTheme === "dark"
                  ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-semibold"
                  : "text-gray-600 dark:text-ec-text-sub hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Moon
                size={14}
                className={`shrink-0 ${currentTheme === "dark" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-ec-icon group-hover:text-gray-900 dark:group-hover:text-white"}`}
              />
              <span>Dark</span>
              {currentTheme === "dark" && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              )}
            </button>
            <button
              onClick={() => applyTheme("light")}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-left font-medium rounded-lg transition-colors cursor-pointer group border-transparent bg-transparent outline-none ${
                currentTheme === "light"
                  ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-semibold"
                  : "text-gray-600 dark:text-ec-text-sub hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Sun
                size={14}
                className={`shrink-0 ${currentTheme === "light" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-ec-icon group-hover:text-gray-900 dark:group-hover:text-white"}`}
              />
              <span>Light</span>
              {currentTheme === "light" && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              )}
            </button>
            <button
              onClick={() => applyTheme("system")}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-left font-medium rounded-lg transition-colors cursor-pointer group border-transparent bg-transparent outline-none ${
                currentTheme === "system"
                  ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-semibold"
                  : "text-gray-600 dark:text-ec-text-sub hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Monitor
                size={14}
                className={`shrink-0 ${currentTheme === "system" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-ec-icon group-hover:text-gray-900 dark:group-hover:text-white"}`}
              />
              <span>System</span>
              {currentTheme === "system" && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
