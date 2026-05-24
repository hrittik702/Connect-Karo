import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor, 
  Check, 
  Sparkles, 
  Eye,
  Building2,
  Bell
} from 'lucide-react';
import { ACCENT_COLORS } from '../hooks/useSystemTheme';

export default function AppearanceSettings() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('connect_karo_theme') || 'system';
  });
  
  const [accent, setAccent] = useState(() => {
    return localStorage.getItem('connect_karo_accent') || 'emerald';
  });

  const [toast, setToast] = useState('');

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem('connect_karo_theme', selectedTheme);
    window.dispatchEvent(new CustomEvent('connect-karo-theme-change', { detail: selectedTheme }));
    showToast(`Visual theme switched to ${selectedTheme.toUpperCase()}`);
  };

  const handleAccentChange = (accentKey) => {
    setAccent(accentKey);
    localStorage.setItem('connect_karo_accent', accentKey);
    window.dispatchEvent(new CustomEvent('connect-karo-accent-change', { detail: accentKey }));
    showToast(`App accent updated to ${ACCENT_COLORS[accentKey]?.name || accentKey}`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast('');
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12 relative">
      
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-ec-border pb-5 select-none">
        <div>
          <h2 className="text-xl font-bold text-ec-highlight tracking-tight flex items-center gap-2">
            <Palette className="text-ec-accent animate-pulse" size={22} />
            Visual & Appearance Settings
          </h2>
          <p className="text-xs text-ec-text-sub mt-1">
            Personalize your workspace layout, active core theme, and color accents.
          </p>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#24292f] dark:bg-[#1f2428] text-white border border-[#30363d] rounded-xl px-4 py-3 shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom-5 duration-200">
          <Sparkles size={14} className="text-ec-accent shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Options Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Theme card selection */}
          <div className="surface-card p-6 bg-ec-surface border border-ec-border rounded-xl space-y-5">
            <div className="flex items-center gap-2 border-b border-ec-border/40 pb-3">
              <Sun className="text-ec-accent" size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider text-ec-highlight">
                1. Core Theme Mode
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Light Theme Card */}
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer outline-none bg-transparent ${
                  theme === 'light'
                    ? 'border-ec-accent bg-ec-accent/5 ring-1 ring-ec-accent/30'
                    : 'border-ec-border hover:border-ec-text-sub/30'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                  <Sun size={20} />
                </div>
                <div className="text-center">
                  <span className="block text-xs font-bold text-ec-highlight">Light Mode</span>
                  <span className="block text-[10px] text-ec-text-sub mt-0.5">Classic clean presentation</span>
                </div>
                {theme === 'light' && (
                  <div className="w-4 h-4 rounded-full bg-ec-accent flex items-center justify-center text-white text-[9px] font-bold">
                    <Check size={10} strokeWidth={3} />
                  </div>
                )}
              </button>

              {/* Dark Theme Card */}
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer outline-none bg-transparent ${
                  theme === 'dark'
                    ? 'border-ec-accent bg-ec-accent/5 ring-1 ring-ec-accent/30'
                    : 'border-ec-border hover:border-ec-text-sub/30'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-[#c9d1d9]">
                  <Moon size={20} />
                </div>
                <div className="text-center">
                  <span className="block text-xs font-bold text-ec-highlight">Dark Mode</span>
                  <span className="block text-[10px] text-ec-text-sub mt-0.5">Sleek obsidian layouts</span>
                </div>
                {theme === 'dark' && (
                  <div className="w-4 h-4 rounded-full bg-ec-accent flex items-center justify-center text-white text-[9px] font-bold">
                    <Check size={10} strokeWidth={3} />
                  </div>
                )}
              </button>

              {/* System Auto Card */}
              <button
                onClick={() => handleThemeChange('system')}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer outline-none bg-transparent ${
                  theme === 'system'
                    ? 'border-ec-accent bg-ec-accent/5 ring-1 ring-ec-accent/30'
                    : 'border-ec-border hover:border-ec-text-sub/30'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-[#0d1117] border border-ec-border flex items-center justify-center text-ec-highlight">
                  <Monitor size={20} />
                </div>
                <div className="text-center">
                  <span className="block text-xs font-bold text-ec-highlight">System Auto</span>
                  <span className="block text-[10px] text-ec-text-sub mt-0.5">Sync with your OS profile</span>
                </div>
                {theme === 'system' && (
                  <div className="w-4 h-4 rounded-full bg-ec-accent flex items-center justify-center text-white text-[9px] font-bold">
                    <Check size={10} strokeWidth={3} />
                  </div>
                )}
              </button>

            </div>
          </div>

          {/* Accent Hue selection */}
          <div className="surface-card p-6 bg-ec-surface border border-ec-border rounded-xl space-y-5">
            <div className="flex items-center gap-2 border-b border-ec-border/40 pb-3">
              <Sparkles className="text-ec-accent" size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider text-ec-highlight">
                2. Theme Accent Hues
              </h3>
            </div>

            <p className="text-xs text-ec-text-sub leading-normal">
              Change the primary visual accent color across the platform dashboards. This color applies to active routes, highlight borders, primary triggers, and visual callouts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {Object.keys(ACCENT_COLORS).map((key) => {
                const color = ACCENT_COLORS[key];
                const isActive = accent === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleAccentChange(key)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer outline-none bg-transparent ${
                      isActive
                        ? 'border-ec-accent bg-ec-accent/5 ring-1 ring-ec-accent/30'
                        : 'border-ec-border hover:border-ec-text-sub/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-5 h-5 rounded-full ${color.colorClass} border border-black/10 shrink-0`} />
                      <span className="text-xs font-bold text-ec-highlight truncate">
                        {color.name}
                      </span>
                    </div>

                    {isActive && (
                      <div className="w-4 h-4 rounded-full bg-ec-accent flex items-center justify-center text-white">
                        <Check size={9} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Visual Preview Column */}
        <div className="space-y-6">
          <div className="surface-card p-6 bg-ec-surface border border-ec-border rounded-xl space-y-4 sticky top-6">
            <div className="flex items-center gap-2 border-b border-ec-border/40 pb-3">
              <Eye className="text-ec-accent" size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider text-ec-highlight">
                Live Preview
              </h3>
            </div>

            <p className="text-[11px] text-ec-text-sub leading-normal">
              Observe below how selected haptic accent configurations populate custom dashboard widgets:
            </p>

            {/* Simulated Live Interface Widget */}
            <div className="rounded-xl border border-ec-border p-3.5 space-y-3.5 bg-ec-root/60 select-none">
              
              {/* Simulated Header */}
              <div className="flex items-center justify-between border-b border-ec-border/60 pb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-ec-accent/15 flex items-center justify-center">
                    <Building2 size={11} className="text-ec-accent" />
                  </div>
                  <span className="text-[9.5px] font-bold text-ec-highlight uppercase">
                    Preview <span className="text-ec-accent">Node</span>
                  </span>
                </div>
                <div className="relative">
                  <Bell size={11} className="text-ec-text-sub" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-ec-accent" />
                </div>
              </div>

              {/* Sample Tab controls */}
              <div className="flex gap-2">
                <span className="text-[9.5px] font-bold text-ec-highlight border-b-2 border-ec-accent pb-1 cursor-pointer">
                  Tab Active
                </span>
                <span className="text-[9.5px] font-semibold text-ec-text-sub pb-1 cursor-pointer hover:text-ec-highlight">
                  Tab Inactive
                </span>
              </div>

              {/* Sample primary button */}
              <button className="w-full py-2 bg-ec-accent hover:bg-ec-accent-hover text-white text-[10.5px] font-bold rounded-lg shadow-md shadow-ec-accent/10 transition-all cursor-not-allowed">
                Action Trigger Callout
              </button>

              {/* Sample alert bubble */}
              <div className="p-2.5 rounded-lg border border-ec-accent/20 bg-ec-accent/5 flex items-center gap-2">
                <Sparkles size={11} className="text-ec-accent" />
                <span className="text-[9.5px] font-bold text-ec-accent">
                  Interactive state is active
                </span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <span className="inline-block text-[9.5px] font-bold text-ec-text-sub bg-ec-root/40 border border-ec-border/60 px-2.5 py-1 rounded-full uppercase leading-none">
                Interactive Preview
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
