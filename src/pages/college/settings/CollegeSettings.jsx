import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, NavLink, useLocation } from "react-router-dom";
import {
  User,
  Settings,
  Palette,
  Accessibility,
  Bell,
  CreditCard,
  Mail,
  Key,
  Tv,
  Check,
  X,
  Building2,
  LogOut,
  Database,
} from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../context/AuthContext";

export default function CollegeSettings() {
  const { currentUser, userData, logout } = useAuth();
  const collegeId = userData?.collegeId || "";
  const navigate = useNavigate();
  const location = useLocation();

  // Active sub-route name
  const activeTab = location.pathname.split("/").pop() || "profile";

  // College institutional details state
  const [collegeDetails, setCollegeDetails] = useState(null);
  const [collegeLoading, setCollegeLoading] = useState(true);

  // Modal / Toast message states
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const adminName = userData?.name || "College Admin";
  const adminEmail =
    userData?.email || currentUser?.email || "admin@institution.edu";

  // Resolve default profile picture college letters
  const institutionName =
    userData?.collegeName || userData?.collegeId || "College";
  const collegeInitial = institutionName.charAt(0).toUpperCase();
  const profilePhotoURL = userData?.photoURL || "";

  // Load Institutional Details
  useEffect(() => {
    if (!collegeId) return;

    if (
      collegeId.toLowerCase().includes("dummy") ||
      userData?.id === "dummy_12345"
    ) {
      const dummyData = {
        name: "Rajkiya Engineering College, Ambedkar Nagar",
        domain: "recabn.ac.in",
        collegeCode: "0737",
        adminEmail: "admin@demo.edu",
        adminPhone: "+91 98765 43210",
        address: "Ambedkar Nagar, Uttar Pradesh India",
        status: "Active",
        createdAt: new Date().toISOString(),
      };
      setCollegeDetails(dummyData);
      setCollegeLoading(false);
      return;
    }

    const fetchCollegeSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("colleges")
          .select("*")
          .eq("id", collegeId)
          .single();

        if (error) throw error;

        const mapped = {
          ...data,
          collegeCode: data.id,
          adminPhone: data.admin_phone,
          adminEmail: data.admin_email,
          createdAt: data.created_at,
        };

        setCollegeDetails(mapped);
      } catch (err) {
        console.error("Fetch settings details failed:", err);
      } finally {
        setCollegeLoading(false);
      }
    };

    fetchCollegeSettings();

    const channel = supabase
      .channel("college-settings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "colleges",
          filter: `id=eq.${collegeId}`,
        },
        () => {
          fetchCollegeSettings();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collegeId, userData]);

  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 3000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };
  const sections = [
    {
      title: "",
      items: [
        { name: "Public profile", path: "/college/settings/profile", icon: User, key: "profile" },
        { name: "Account", path: "/college/settings/account", icon: Settings, key: "account" },
        { name: "Institution Details", path: "/college/settings/institution", icon: Building2, key: "institution" },
        { name: "Accessibility", path: "/college/settings/accessibility", icon: Accessibility, key: "accessibility" },
        { name: "Notifications", path: "/college/settings/notifications", icon: Bell, key: "notifications" }
      ]
    },
    {
      title: "Access & Security",
      items: [
        { name: "Billing & licensing", path: "/college/settings/billing", icon: CreditCard, key: "billing", showFreeBadge: true },
        { name: "Emails", path: "/college/settings/emails", icon: Mail, key: "emails" },
        { name: "Security & keys", path: "/college/settings/security", icon: Key, key: "security" },
        { name: "Active sessions", path: "/college/settings/sessions", icon: Tv, key: "sessions" },
        { name: "Supabase sandbox", path: "/college/settings/supabase", icon: Database, key: "supabase" }
      ]
    }
  ];

  return (
    <div className="w-full md:h-[calc(100vh-160px)] flex flex-col md:flex-row gap-5 md:gap-6 font-sans selection:bg-ec-accent/20 select-none md:pb-4 animate-in fade-in duration-300 md:overflow-hidden">
      {/* ── LEFT SIDEBAR NAVIGATION (GitHub style) ── */}
      <aside className="hidden md:block w-full md:w-[200px] shrink-0 md:space-y-6 md:h-full md:overflow-y-hidden">
        {/* User profile brief card */}
        <div className="flex items-center gap-3 px-2 pb-2 border-b border-ec-border/100">
          {/* Avatar preview */}
          <div className="w-10 h-10 rounded-full bg-ec-muted flex items-center justify-center text-ec-text font-semibold text-sm border border-ec-border overflow-hidden shrink-0 shadow-sm">
            {profilePhotoURL ? (
              <img
                src={profilePhotoURL}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              collegeInitial
            )}
          </div>
          <div className="text-left min-w-0">
            <h3 className="text-[13px] font-semibold text-ec-highlight leading-tight truncate">
              {adminName}
            </h3>
            <span className="block text-[11px] text-ec-text-sub font-medium truncate mt-0.5">
              Personal settings
            </span>
          </div>
        </div>

        {/* Sidebar menu list */}
        <nav className="space-y-4 text-left">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-0.5">
              {section.title && (
                <span className="block px-1.5 pb-1 text-[10px] font-[800] uppercase tracking-wider text-ec-text-sub select-none mt-4">
                  {section.title}
                </span>
              )}
              {section.items.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between px-1.5 py-1.5 rounded-sm text-[12.5px] font-medium transition-all duration-300 relative overflow-hidden group/nav border border-transparent bg-transparent outline-none cursor-pointer ${
                      isActive
                        ? "bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white font-semibold"
                        : "text-gray-500 dark:text-ec-text-sub hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <item.icon
                          size={18}
                          className={`shrink-0 transition-all duration-300 group-hover/nav:scale-105 ${
                            isActive
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-400 dark:text-ec-icon group-hover/nav:text-gray-900 dark:group-hover/nav:text-white"
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.showFreeBadge && (
                        <span className="text-[8px] font-semibold border border-ec-border px-1.5 py-0.5 rounded-full uppercase leading-none font-mono">
                          Free
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── MOBILE HORIZONTAL SCROLL NAVIGATION (md:hidden tabs) ── */}
      <div className="md:hidden w-full overflow-x-auto scrollbar-none border-b border-ec-border pb-1 shrink-0 mb-3">
        <nav className="flex items-center gap-1.5 px-1 min-w-max">
          {[
            {
              name: "Profile",
              path: "/college/settings/profile",
              icon: User,
              activeKey: "profile",
            },
            {
              name: "Account",
              path: "/college/settings/account",
              icon: Settings,
              activeKey: "account",
            },
            {
              name: "Institution",
              path: "/college/settings/institution",
              icon: Building2,
              activeKey: "institution",
            },
            {
              name: "Accessibility",
              path: "/college/settings/accessibility",
              icon: Accessibility,
              activeKey: "accessibility",
            },
            {
              name: "Notifications",
              path: "/college/settings/notifications",
              icon: Bell,
              activeKey: "notifications",
            },
            {
              name: "Supabase",
              path: "/college/settings/supabase",
              icon: Database,
              activeKey: "supabase",
            },
            {
              name: "Billing",
              path: "/college/settings/billing",
              icon: CreditCard,
              activeKey: "billing",
            },
            {
              name: "Emails",
              path: "/college/settings/emails",
              icon: Mail,
              activeKey: "emails",
            },
            {
              name: "Security",
              path: "/college/settings/security",
              icon: Key,
              activeKey: "security",
            },
            {
              name: "Sessions",
              path: "/college/settings/sessions",
              icon: Tv,
              activeKey: "sessions",
            },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.activeKey;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all shrink-0 ${
                  isActive
                    ? "bg-ec-accent/10 border-ec-accent/20 text-ec-highlight font-bold"
                    : "border-transparent text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight"
                }`}
              >
                <Icon
                  size={14}
                  className={isActive ? "text-ec-accent" : "text-ec-icon"}
                />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 min-w-0 md:h-full md:overflow-y-auto md:pr-2 border border-ec-border bg-ec-surface/20 rounded-lg p-6">
        {/* Global Action Banner Alert */}
        {message.text && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold border flex items-center gap-2 mb-6 animate-in fade-in duration-200 ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                : "bg-red-500/10 text-red-400 border-red-500/25"
            }`}
          >
            {message.type === "success" ? <Check size={14} /> : <X size={14} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* ── TAB CONTENT OUTLET ── */}
        <Outlet
          context={{
            showToast,
            setShowLogoutModal,
            collegeDetails,
            collegeLoading,
            setCollegeDetails,
          }}
        />
      </main>

      {/* ── LOGOUT CONFIRMATION MODAL ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setShowLogoutModal(false)}
          />

          <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-ec-border bg-ec-surface p-6 text-left shadow-2xl transition-all animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 animate-pulse">
                <LogOut size={22} className="rotate-180" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ec-highlight">
                  Terminate Active Session?
                </h3>
                <p className="text-xs text-ec-text-sub mt-1">
                  You are about to sign out of the Connect-Karo Admin Portal.
                </p>
              </div>
            </div>

            <div className="mt-4 text-xs text-ec-text leading-relaxed">
              This will clear your local administrative session token. You will
              need to input your credentials to log back in.
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-xs font-semibold text-ec-text-sub hover:text-ec-highlight bg-ec-surface border border-ec-border hover:bg-ec-muted rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-lg shadow-red-500/15 transition-all cursor-pointer border-transparent"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
