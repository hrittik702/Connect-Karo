import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, Menu, X, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Alumni", href: "/alumni" },
    { label: "Mentorship", href: "/student/mentorship" },
    { label: "Jobs", href: "/student/jobs" },
    { label: "Events", href: "/student/events" },
  ];

  return (
    <div
      className="nav-island-wrapper fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        padding: scrolled ? "10px 16px 0" : "0px",
      }}
    >
      <nav className="nav-island" data-scrolled={scrolled}>
        <div className="nav-island-inner">
          {/* Brand & Links */}
          <div className="flex items-center gap-4 min-w-0">
            <Link to="/" className="nav-island-logo">
              <span className="text-white font-extrabold text-sm">C</span>
            </Link>

            <Link
              to="/"
              className={`nav-island-brand text-ec-highlight font-bold transition-all duration-300 ${
                scrolled ? "nav-island-brand--show" : "max-w-[120px] opacity-100 transform-none"
              }`}
            >
              Connect<span className="text-ec-accent">Karo</span>
            </Link>

            <div className={`nav-island-links ${scrolled ? "nav-island-links--hide" : ""}`}>
              {navItems.map((item) => (
                <Link key={item.label} to={item.href} className="nav-island-link">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Search, Notifications & Profile */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`nav-island-search ${
                scrolled ? "nav-island-search--compact" : ""
              } ${searchFocused && !scrolled ? "nav-island-search--focused" : ""}`}
            >
              <Search size={14} className="nav-island-search-icon text-ec-icon" />
              <input
                type="text"
                placeholder={scrolled ? "Search..." : "Search ConnectKaro..."}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="nav-island-search-input bg-transparent border-none outline-none text-xs text-ec-text w-full"
              />
              <kbd className={`nav-island-kbd ${scrolled ? "nav-island-kbd--hide" : ""}`}>/</kbd>
            </div>

            {userData && (
              <button className="p-2 rounded-full hover:bg-ec-muted/50 text-ec-icon hover:text-ec-text transition-colors active:scale-95">
                <Bell size={18} />
              </button>
            )}

            {userData ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full overflow-hidden border border-ec-border bg-ec-muted flex items-center justify-center text-xs font-bold text-ec-text uppercase">
                  {userData.name ? userData.name.substring(0, 2) : "U"}
                </div>
                <button
                  onClick={logout}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ec-border hover:bg-ec-muted text-xs text-ec-text font-semibold transition-all"
                >
                  <LogOut size={13} className="text-ec-icon" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className={`nav-island-signup ${scrolled ? "nav-island-signup--pill" : ""}`}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
