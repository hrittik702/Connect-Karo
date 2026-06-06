import React, { useState, useEffect } from "react";
import {
  Outlet,
  NavLink,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import {
  GoChecklist,
  GoPeople,
  GoMegaphone,
  GoGear,
  GoBell,
  GoOrganization,
  GoSearch,
} from "react-icons/go";
import { useAuth } from "../../context/AuthContext";
import UserMenuDropdown from "../../components/college/UserMenuDropdown";
import "./college.css";
import logoImg from "../../assets/connect-karo-logo.png";

// Custom SVG icon matching the Sidebar Control icon (rounded square with vertical dashed divider)
const SidebarControlIcon = ({ size = 17 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="9" y1="3" x2="9" y2="21" strokeDasharray="3 3" />
  </svg>
);

export default function CollegeDashboardLayout() {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarMode, setSidebarMode] = useState(() => {
    return localStorage.getItem("sidebar_mode") || "hover";
  });
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebar_mode", sidebarMode);
    const root = document.documentElement;
    root.classList.remove(
      "sidebar-expanded",
      "sidebar-collapsed",
      "sidebar-hover",
    );
    root.classList.add(`sidebar-${sidebarMode}`);
  }, [sidebarMode]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [subSidebarSearch, setSubSidebarSearch] = useState(
    searchParams.get("search") || "",
  );

  // Synchronize local sub-sidebar search with query param changes
  useEffect(() => {
    setSubSidebarSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // Debouncer to update URL search parameter
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentSearch =
        new URLSearchParams(window.location.search).get("search") || "";
      if (subSidebarSearch === currentSearch) return;

      const newParams = new URLSearchParams(window.location.search);
      if (subSidebarSearch) {
        newParams.set("search", subSidebarSearch);
      } else {
        newParams.delete("search");
      }
      setSearchParams(newParams, { replace: true });
    }, 300);
    return () => clearTimeout(handler);
  }, [subSidebarSearch]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setShowNotifications(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.classList.add("college-panel");
    return () => {
      document.documentElement.classList.remove("college-panel");
    };
  }, []);

  const navItems = [
    { name: "Overview", path: "/college", icon: GoOrganization, exact: true },
    { name: "Requests", path: "/college/requests", icon: GoChecklist },
    { name: "Directory", path: "/college/users", icon: GoPeople },
    { name: "Broadcasts", path: "/college/broadcasts", icon: GoMegaphone },
  ];

  const adminName = userData?.name || "College Admin";
  const collegeName = userData?.collegeName || userData?.collegeId || "College";
  const collegeInitial = collegeName.charAt(0).toUpperCase();

  // Helper to abbreviate college name before comma if it contains one (made crash-safe)
  const getAbbreviatedCollegeName = (name) => {
    if (!name) return "";
    const nameStr = String(name);
    if (nameStr.includes(",")) {
      const parts = nameStr.split(",");
      const beforeComma = parts[0].trim();
      const afterComma = parts.slice(1).join(",").trim();

      const words = beforeComma.split(/[\s-]+/);
      const initials = words
        .filter((word) => {
          const lower = word.toLowerCase();
          return (
            lower !== "of" &&
            lower !== "and" &&
            lower !== "the" &&
            lower !== "in" &&
            lower !== "for" &&
            lower !== "a" &&
            lower !== "an"
          );
        })
        .map((word) => word.charAt(0).toUpperCase())
        .join("");

      return `${initials}, ${afterComma}`;
    }
    return nameStr;
  };

  const displayName = getAbbreviatedCollegeName(collegeName);

  // Dashboard overview page (no tabs shown)
  const isDashboard =
    location.pathname === "/college" || location.pathname === "/college/";

  // Sub-routes where nav tabs are visible
  const isSubRoute =
    location.pathname.startsWith("/college/requests") ||
    location.pathname.startsWith("/college/users") ||
    location.pathname.startsWith("/college/broadcasts");

  // Settings pages have their own header
  const isSettingsRoute = location.pathname.startsWith("/college/settings");

  // Determine active breadcrumb label
  const getActiveRouteLabel = () => {
    const path = location.pathname;
    if (path.startsWith("/college/requests")) return "Requests";
    if (path.startsWith("/college/users")) return "Directory";
    if (path.startsWith("/college/broadcasts")) return "Broadcasts";
    if (path.startsWith("/college/settings")) return "Settings";
    return "Overview";
  };
  const activeRouteLabel = getActiveRouteLabel();

  // Determine sub-sidebar visibility
  const hasSubSidebar =
    location.pathname.startsWith("/college/requests") ||
    location.pathname.startsWith("/college/users") ||
    location.pathname.startsWith("/college/broadcasts");

  // Spacing layout offset
  const paddingLeftValue = isMobile ? "56px" : hasSubSidebar ? "296px" : "56px";

  const getPaddingLeft = () => {
    if (isMobile) return 56;
    const gap = 37; // constant relative gap between sidebar and content
    if (sidebarMode === "expanded") {
      return 160 + gap; // 277px
    }
    return 48 + gap; // 85px
  };

  const getSubSidebarContent = () => {
    const path = location.pathname;

    return null;
  };

  return (
    <div className="h-screen overflow-hidden bg-ec-root text-ec-text flex flex-col font-sans relative selection:bg-ec-accent/20">
      {/* ── TOP NAVBAR (Continuous header wrapper) ── */}
      <header className="w-full h-[50px] bg-ec-header/80 backdrop-blur-md border-b border-ec-border sticky top-0 z-40 flex flex-col shrink-0 select-none shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Row 1: Brand details and identity tools */}
        <div className="w-full h-[94px] flex items-center justify-between px-4 pt-2 pb-1">
          {/* Supabase style top-left breadcrumbs branding */}
          <div className="flex items-center gap-2.5 shrink-0 select-none">
            {/* Logo Image */}
            <div
              className="flex items-center gap-2 cursor-pointer shrink-0"
              onClick={() => navigate("/college")}
            >
              <img
                src={logoImg}
                alt="Connect Karo"
                className="h-5 w-auto object-contain"
              />
            </div>

            {/* Slash Separator */}
            <span className="text-gray-300 dark:text-gray-700 text-sm font-light select-none">
              /
            </span>

            {/* College Identity */}
            <div
              className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-ec-muted/50 transition-colors cursor-pointer"
              onClick={() => navigate("/college")}
            >
              <GoOrganization size={15} className="text-ec-text-sub" />
              <span className="text-xs font-semibold text-ec-highlight tracking-tight truncate max-w-[120px]">
                {displayName}
              </span>
            </div>

            {/* Slash Separator */}
            <span className="text-gray-300 dark:text-gray-700 text-sm font-light select-none">
              /
            </span>

            {/* Active Route Breadcrumb */}
            <div className="text-xs font-semibold text-ec-highlight capitalize">
              {activeRouteLabel}
            </div>
          </div>

          {/* Right-aligned Search Bar (UI only) */}
          <div className="hidden md:flex w-64 lg:w-60 lg:h-7 ml-auto mr-4">
            <div className="w-full flex items-center gap-2 px-3 py-1.5 bg-ec-surface border border-ec-border rounded-lg text-ec-text-sub hover:border-ec-text-sub/40 transition-colors cursor-default group">
              <GoSearch size={14} className="text-ec-icon shrink-0" />
              <span className="text-[13px] text-ec-text-sub/60 flex-1">
                Type to search...
              </span>
              {/* <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-ec-text-sub bg-ec-muted/40 border border-ec-border rounded">/</kbd> */}
            </div>
          </div>

          <div className="flex items-center gap-2.5 relative shrink-0">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-1.5 text-ec-text-sub transition-all rounded-full z-50 ${
                showNotifications
                  ? "bg-ec-surface text-ec-highlight border border-ec-border shadow-sm"
                  : "hover:bg-ec-muted/50"
              }`}
              aria-label="Campus warnings"
            >
              <GoBell size={18} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-ec-accent border border-ec-surface animate-pulse"></span>
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-transparent cursor-default"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-10 w-80 max-w-[calc(100vw-2rem)] bg-ec-surface border border-ec-border rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] p-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200 text-ec-text">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-ec-border">
                    <span className="font-bold text-ec-highlight text-xs tracking-tight">
                      Institutional Bulletins
                    </span>
                    <span className="text-[9px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                      Live Sync
                    </span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-none">
                    <div className="p-2.5 bg-ec-root rounded-lg border border-ec-border">
                      <p className="text-ec-highlight font-semibold text-[11.5px] mb-0.5">
                        Registration Stream Online
                      </p>
                      <p className="text-[10.5px] text-ec-text-sub leading-normal">
                        Student credentials linked to this college are synced in
                        real-time.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="pl-2 select-none z-10">
              <div
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-7 h-7 rounded-full bg-ec-muted flex items-center justify-center text-ec-text font-extrabold text-sm shadow-md border border-ec-border overflow-hidden cursor-pointer hover:border-ec-accent transition-all duration-200"
              >
                {userData?.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  collegeInitial
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── WORKSPACE BOTTOM GRID ── */}
      <div className="flex-1 flex flex-row relative min-h-[calc(100vh-94px)]">
        {/* ── PERMANENT EXPANDABLE SIDEBAR ── */}
        <aside className="fixed top-[50px] bottom-0 left-0 bg-ec-header border-r border-ec-border flex flex-col z-[35] select-none transition-all duration-300 ease-out w-12 hover:w-40 overflow-hidden group/sidebar">
          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-none text-left">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.exact}
                  className={`flex items-center gap-3 px-1.5 py-1.5 rounded-sm text-[12.5px] font-medium transition-all duration-300 relative overflow-hidden group/nav ${
                    isActive
                      ? "bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white font-semibold"
                      : "text-gray-500 dark:text-ec-text-sub hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  title={item.name}
                >
                  <item.icon
                    size={18}
                    className={`shrink-0 transition-all duration-300 group-hover/nav:scale-105 ${
                      isActive
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-400 dark:text-ec-icon group-hover/nav:text-gray-900 dark:group-hover/nav:text-white"
                    }`}
                  />
                  <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 min-w-max delay-75">
                    {item.name}
                  </span>
                </NavLink>
              );
            })}

            <div className="py-1" />
            <hr className="border-ec-border" />
            <div className="py-1" />

            <NavLink
              to="/college/settings"
              className={`flex items-center gap-3 px-1.5 py-1.5 rounded-sm text-[12.5px] font-medium transition-all duration-300 relative overflow-hidden group/nav ${
                location.pathname.startsWith("/college/settings")
                  ? "bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white font-semibold"
                  : "text-gray-500 dark:text-ec-text-sub hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
              }`}
              title="Settings"
            >
              <GoGear
                size={18}
                className={`shrink-0 transition-all duration-300 group-hover/nav:scale-105 ${
                  location.pathname.startsWith("/college/settings")
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-400 dark:text-ec-icon group-hover/nav:text-gray-900 dark:group-hover/nav:text-white"
                }`}
              />
              <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 min-w-max delay-75">
                Settings
              </span>
            </NavLink>
          </div>
        </aside>

        {/* ── CENTRAL SUB-SIDEBAR PANEL ── */}
        {hasSubSidebar && getSubSidebarContent()}

        {/* ── CONTENT AREA ── */}
        <main
          className="flex-1 pt-6 pb-6 px-3 sm:pt-8 sm:pb-8 sm:px-5 lg:pt-6 lg:pb-12 lg:px-8 z-10 bg-transparent transition-all duration-[350ms] ease-out overflow-y-auto"
          style={{ paddingLeft: getPaddingLeft() }}
        >
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {showUserMenu && (
        <UserMenuDropdown onClose={() => setShowUserMenu(false)} />
      )}

      {/* Floating Sidebar Control Button & Menu */}
      <div className="fixed bottom-2 left-2.5 z-[45] select-none">
        <button
          onClick={() => setShowSidebarMenu(!showSidebarMenu)}
          className="w-7 h-7 rounded-md bg-ec-surface border-none border-ec-border flex items-center justify-center text-ec-icon hover:text-white hover:bg-white/5 transition-colors cursor-pointer outline-none"
          title="Sidebar control"
        >
          <SidebarControlIcon size={13} />
        </button>

        {showSidebarMenu && (
          <>
            <div
              className="fixed inset-0 z-40 bg-transparent cursor-default"
              onClick={() => setShowSidebarMenu(false)}
            />
            <div className="absolute  bottom-9 left-3 w-48 bg-white dark:bg-[#242424] border border-gray-200 dark:border-[#303030] rounded-sm shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 text-left">
              <div className="px-2.5 py-1 text-[11px] font-semibold text-gray-500 dark:text-ec-text-sub">
                Sidebar Control
              </div>
              <hr className="border-gray-200 dark:border-[#303030] my-1.5" />
              <div className="space-y-0.5">
                {[
                  { label: "Expanded", value: "expanded" },
                  { label: "Collapsed", value: "collapsed" },
                  { label: "Expand on hover", value: "hover" },
                ].map((opt) => {
                  const isSelected = sidebarMode === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSidebarMode(opt.value);
                        setShowSidebarMenu(false);
                      }}
                      className={`w-full flex items-center text-xs py-1.5 px-2.5 rounded-sm transition-colors cursor-pointer text-left ${
                        isSelected
                          ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-medium"
                          : "text-gray-600 dark:text-ec-text-sub hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      {isSelected ? (
                        <span className="w-4 inline-flex items-center justify-start text-gray-900 dark:text-white font-bold select-none text-[13px] leading-none pr-1">
                          •
                        </span>
                      ) : (
                        <span className="w-4 inline-flex shrink-0 select-none" />
                      )}
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
