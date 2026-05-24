import { useEffect, useState } from 'react';

/**
 * Custom hook that syncs the app's theme with local storage preference
 * ('dark' | 'light' | 'system') and handles OS-level changes when in system mode.
 */
export default function useSystemTheme() {
  const [activeTheme, setActiveTheme] = useState(() => {
    if (typeof window === 'undefined') return 'system';
    return localStorage.getItem('connect_karo_theme') || 'system';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (themeMode) => {
      const isDarkOS = mediaQuery.matches;
      if (themeMode === 'dark' || (themeMode === 'system' && isDarkOS)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Re-apply the active accent to switch to its correct light/dark variant
      const currentAccent = localStorage.getItem('connect_karo_accent') || 'emerald';
      applyAccentColor(currentAccent);
    };

    // Apply initially
    applyTheme(activeTheme);

    // OS preference listener
    const handleOSChange = () => {
      const currentPreference = localStorage.getItem('connect_karo_theme') || 'system';
      if (currentPreference === 'system') {
        applyTheme('system');
      }
    };

    // Event listener for manual theme changes
    const handleManualThemeChange = (e) => {
      const newTheme = e.detail || 'system';
      setActiveTheme(newTheme);
      applyTheme(newTheme);
    };

    // Event listener for manual accent changes
    const handleManualAccentChange = (e) => {
      applyAccentColor(e.detail);
    };

    mediaQuery.addEventListener('change', handleOSChange);
    window.addEventListener('connect-karo-theme-change', handleManualThemeChange);
    window.addEventListener('connect-karo-accent-change', handleManualAccentChange);

    return () => {
      mediaQuery.removeEventListener('change', handleOSChange);
      window.removeEventListener('connect-karo-theme-change', handleManualThemeChange);
      window.removeEventListener('connect-karo-accent-change', handleManualAccentChange);
    };
  }, [activeTheme]);

  return activeTheme;
}

// Map of custom accent colors matching the premium GitHub aesthetics
export const ACCENT_COLORS = {
  emerald: {
    light: '45, 164, 66',
    dark: '63, 185, 80',
    hoverLight: '34, 139, 54',
    hoverDark: '87, 203, 102',
    name: 'Emerald (Default)',
    colorClass: 'bg-[#2da442] dark:bg-[#3fb950]'
  },
  blue: {
    light: '9, 105, 218',
    dark: '47, 129, 247',
    hoverLight: '5, 80, 174',
    hoverDark: '88, 166, 255',
    name: 'Ocean Blue',
    colorClass: 'bg-[#0969da] dark:bg-[#2f81f7]'
  },
  purple: {
    light: '130, 80, 223',
    dark: '163, 113, 247',
    hoverLight: '106, 60, 196',
    hoverDark: '187, 149, 251',
    name: 'Star Purple',
    colorClass: 'bg-[#8250df] dark:bg-[#a371f7]'
  },
  orange: {
    light: '209, 76, 13',
    dark: '247, 129, 98',
    hoverLight: '173, 60, 8',
    hoverDark: '255, 166, 142',
    name: 'Sunset Orange',
    colorClass: 'bg-[#d14c0d] dark:bg-[#f78162]'
  }
};

export function applyAccentColor(accentKey) {
  const accent = ACCENT_COLORS[accentKey] || ACCENT_COLORS.emerald;
  const isDark = document.documentElement.classList.contains('dark');
  
  // Set active variables to CSS
  document.documentElement.style.setProperty('--ec-accent', isDark ? accent.dark : accent.light);
  document.documentElement.style.setProperty('--ec-accent-hover', isDark ? accent.hoverDark : accent.hoverLight);

  // Store in LocalStorage
  localStorage.setItem('connect_karo_accent', accentKey);
}