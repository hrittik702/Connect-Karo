import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "../../components/common/AppLayout";
import {
  Home as HomeIcon,
  Users,
  Brain,
  Briefcase,
  PlusCircle,
  CheckCircle2,
  Clock,
  Circle,
  Star,
  Calendar,
  MessageSquare,
  ThumbsUp,
  Heart,
  Share2,
  Plus,
  Award,
  BookOpen
} from "lucide-react";

export default function StudentDashboard() {
  const { userData } = useAuth();

  // Local state for basic interactions
  const [connectionsHelpCount] = useState({
    sarah: 12,
    marcus: 28,
    elena: 8,
  });

  const [requestedIds, setRequestedIds] = useState(new Set());
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [postLikes, setPostLikes] = useState({
    mixer: 24,
    robinhood: 56,
  });

  const handleRequest = (id) => {
    if (requestedIds.has(id)) {
      requestedIds.delete(id);
    } else {
      requestedIds.add(id);
    }
    setRequestedIds(new Set(requestedIds));
  };

  const handleLike = (postKey) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postKey)) {
      newLiked.delete(postKey);
      setPostLikes({
        ...postLikes,
        [postKey]: postLikes[postKey] - 1,
      });
    } else {
      newLiked.add(postKey);
      setPostLikes({
        ...postLikes,
        [postKey]: postLikes[postKey] + 1,
      });
    }
    setLikedPosts(newLiked);
  };

  const trendingSkills = [
    "React 18",
    "System Design",
    "Figma",
    "Product Discovery",
    "Growth Marketing",
  ];

  const topCompanies = [
    {
      name: "Stripe",
      alumniCount: 12,
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBKkVOuEONMozrsENLyYtvfg-nl06mlViQqsIRZRfonLWDWUlt_nbas8PlPBJUQv3FkgsSQ1NUsfx4Ya5zKntlhicBCOyjCR80bUuVK7h6_A8yCshXf1Cjc1X6oPC0I84o4hA10BuKdbqf8G4t98W5rRbApK2t0nXWBxkvIwXnp_3Go6WV_Il7VqIL0SOjJGQU05PNGkgrgck3Go3zYU0hcuTGAaGdAa8R5zXwZRL5hI6nzJ71bwx5DjDdCRPObGvOdqIGsDYrr2Ta",
    },
    {
      name: "Figma",
      alumniCount: 8,
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBf8iShESYoBSb2quZ1f2rF2RAuzjpwE_Hz3cdDIE0O0il4kVgCS50f3i0GVYPdYSgySZqQGXtCGnBNvlVxoUZKp315f8kfeyVgmxYidHrjlSuxTyA3YgYbJL-C_aCkkFi2h3HLYiTqe0mhYes94xYmzbeBp632voINIPmQ0STYwNOwMx0pYLnE6MFT9lZ0CPLbh9rhn9Uj2uk2v8hVAy7AV2SKtqSYXdG_Azzdg0GLbhtgbOhKRPPlyBgnjULPz4E2xOPmcvn8ShcM",
    },
  ];

  const upcomingEvents = [
    {
      month: "OCT",
      day: "24",
      title: "Interview Prep Workshop",
      time: "6:00 PM • Zoom",
      isPrimary: true,
    },
    {
      month: "OCT",
      day: "28",
      title: "Alumni Panel: FinTech",
      time: "5:00 PM • Auditorium",
      isPrimary: false,
    },
  ];

  return (
    <AppLayout>

      {/* Main Grid Layout */}
      <main className="flex-1 pt-24 pb-12 px-6 max-w-[1280px] mx-auto w-full">
        <div className="grid grid-cols-12 gap-6">

          {/* Left Sidebar (Col span 12 on mobile, 3 on tablet/desktop) */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-2 space-y-6">

            {/* Profile Card */}
            <div className="surface-card p-6 flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="h-20 w-20 rounded-full border-2 border-ec-accent p-0.5 overflow-hidden">
                  <img
                    alt="Student Avatar"
                    className="rounded-full w-full h-full object-cover bg-ec-muted"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOoabCP5FGS2p7_ef8RVKFdIHjIHVuYItyIGHEcycod0ukeWl30Vj2t8CIBwAkecmW8uR8v0xgQGsFginOVfS5XwS2UybS4EPoiJZOKod4cNbiHaaYrlVLWU1CkCgrpTGHxZs9-IQej_K8c06Noh_R0k9lthrmQqsLA78EgtfxHSRCxR_VnEWsA353SDkhyhsVYxmSAmCpJKta3eWlSnsSIxvvUPDfIxAKQ8ps9TP99qTzEj0fbbplhYkUnaG4yuTlkcLqwft1qIQl"
                  />
                </div>
              </div>
              <h2 className="text-base font-bold text-ec-highlight">
                {userData?.name || "Alex Jordan"}
              </h2>
              <p className="text-xs text-ec-text-sub font-medium">
                {userData?.classYear ? `Class of ${userData.classYear}` : "Class of 2024"}
              </p>
              <p className="text-xs text-ec-accent font-semibold mt-1">
                {userData?.major || "Computer Science Major"}
              </p>

              {/* Progress */}
              <div className="w-full mt-6 pt-6 border-t border-ec-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-ec-text-sub font-medium">Career Readiness</span>
                  <span className="text-xs font-bold text-ec-accent">75%</span>
                </div>
                <div className="w-full bg-ec-muted rounded-full h-2">
                  <div className="bg-ec-accent h-2 rounded-full transition-all duration-500" style={{ width: "75%" }}></div>
                </div>
                <p className="text-[11px] text-ec-text-sub mt-2">Complete your profile to 100%</p>
              </div>
            </div>

            {/* Side Navigation Items */}
            <div className="flex flex-col gap-1">
              <Link
                to="/student"
                className="flex items-center gap-3 px-4 py-3 bg-ec-accent/10 border border-ec-accent/20 text-ec-accent rounded-xl font-semibold transition-all"
              >
                <HomeIcon size={18} />
                <span className="text-sm">Home</span>
              </Link>
              <Link
                to="/student/connections"
                className="flex items-center gap-3 px-4 py-3 text-ec-text-sub hover:text-ec-text hover:bg-ec-muted rounded-xl transition-all hover:translate-x-1"
              >
                <Users size={18} />
                <span className="text-sm">Connections</span>
              </Link>
              <Link
                to="/student/mentorship"
                className="flex items-center gap-3 px-4 py-3 text-ec-text-sub hover:text-ec-text hover:bg-ec-muted rounded-xl transition-all hover:translate-x-1"
              >
                <Brain size={18} />
                <span className="text-sm">Mentorship</span>
              </Link>
              <Link
                to="/student/jobs"
                className="flex items-center gap-3 px-4 py-3 text-ec-text-sub hover:text-ec-text hover:bg-ec-muted rounded-xl transition-all hover:translate-x-1"
              >
                <Briefcase size={18} />
                <span className="text-sm">Career Hub</span>
              </Link>
            </div>

            {/* Quick Action Button */}
            <button className="btn-primary w-full flex items-center justify-center gap-2">
              <PlusCircle size={16} />
              <span>Find a Mentor</span>
            </button>
          </aside>

          {/* Center Content (Col span 12 on mobile, 9 on tablet, 7 on desktop) */}
          <section className="col-span-12 md:col-span-9 lg:col-span-7 space-y-8">

            {/* Career Progress */}
            <div className="surface-card p-6">
              <h2 className="text-lg font-bold text-ec-highlight mb-6">Career Progress</h2>
              <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-8">

                {/* SVG Progress Circle */}
                <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      className="text-ec-muted"
                      cx="64"
                      cy="64"
                      fill="transparent"
                      r="54"
                      stroke="currentColor"
                      strokeWidth="10"
                    ></circle>
                    <circle
                      className="text-ec-accent transition-all duration-1000 ease-out"
                      cx="64"
                      cy="64"
                      fill="transparent"
                      r="54"
                      stroke="currentColor"
                      strokeDasharray="339.3"
                      strokeDashoffset="84.8"
                      strokeWidth="10"
                    ></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-extrabold text-ec-accent">75%</span>
                    <span className="text-[10px] text-ec-text-sub font-medium uppercase tracking-wide">Complete</span>
                  </div>
                </div>

                {/* Progress Checklist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
                  <div className="flex items-center gap-3 bg-ec-muted/20 p-3 rounded-lg border border-ec-border/30">
                    <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={18} />
                    <div>
                      <p className="text-xs font-bold text-ec-highlight">Resume</p>
                      <p className="text-[11px] text-ec-text-sub">Reviewed & Ready</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-ec-muted/20 p-3 rounded-lg border border-ec-border/30">
                    <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={18} />
                    <div>
                      <p className="text-xs font-bold text-ec-highlight">Skills Profile</p>
                      <p className="text-[11px] text-ec-text-sub">Up to date</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-ec-muted/20 p-3 rounded-lg border border-ec-border/30">
                    <Clock className="text-amber-500 flex-shrink-0" size={18} />
                    <div>
                      <p className="text-xs font-bold text-ec-highlight">Mentorship</p>
                      <p className="text-[11px] text-ec-text-sub">3 Connections Pending</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-ec-muted/20 p-3 rounded-lg border border-ec-border/30">
                    <Circle className="text-ec-icon flex-shrink-0" size={18} />
                    <div>
                      <p className="text-xs font-bold text-ec-highlight">Applications</p>
                      <p className="text-[11px] text-ec-text-sub">Action Needed</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Recommended Alumni */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-ec-highlight">Recommended Alumni</h3>
                <Link to="/student/connections" className="text-xs text-ec-accent hover:text-ec-accent-hover font-semibold hover:underline">
                  View All
                </Link>
              </div>

              {/* Horizontal Scroll / Bento Style Cards */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">

                {/* Alumnus 1 */}
                <div className="min-w-[280px] w-[280px] surface-card p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative">
                        <img
                          alt="Sarah Chen"
                          className="h-14 w-14 rounded-full bg-ec-muted object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlaRixMnYZhirRX7i50oyC_jSETEL0rPLosbigpjy-IFMw9x0-KueaVPv43ClgLCmgEnXpNkAZoEBYBApnMc-nuqpe8O-RKPTbtsQhVePKZKsKw2ncAZBw6_l28ieYizCArUg7yMhhmJHSYyzAq5UyyZkRajugyq-nk39OKraHNJ0HGTurppy-ssiTJUpw0t-4KXTug8R3u-bXwrzTmFTMh_X5R_RXIcdROgTQsORr5VFWTG8opB3DeEouwVj2t5GYtBUSZQZ-34eQ"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 h-3.5 w-3.5 rounded-full border-2 border-ec-surface"></div>
                      </div>
                      <span className="badge text-[10px] font-semibold">Mentorship Available</span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-1">
                        <h4 className="text-sm font-bold text-ec-highlight leading-tight">Sarah Chen</h4>
                        <Award size={14} className="text-ec-accent fill-ec-accent" />
                      </div>
                      <p className="text-xs text-ec-text-sub mt-0.5">
                        Senior SWE @ Airbnb <span className="text-[10px]">('18, CS)</span>
                      </p>
                      <p className="text-[11px] text-ec-text-sub mt-2 flex items-center gap-1.5">
                        <Users size={12} className="text-ec-icon" />
                        <span>{connectionsHelpCount.sarah} Students Helped</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="bg-ec-muted/40 text-ec-text-sub px-2 py-0.5 rounded text-[10px] font-bold">
                        Distributed Systems
                      </span>
                      <span className="bg-ec-muted/40 text-ec-text-sub px-2 py-0.5 rounded text-[10px] font-bold">
                        Career Pivot
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRequest("sarah")}
                    className={`w-full py-2 rounded-lg text-xs font-semibold border transition-all ${requestedIds.has("sarah")
                      ? "bg-ec-muted border-ec-border text-ec-text-sub"
                      : "border-ec-accent text-ec-accent hover:bg-ec-accent/5"
                      }`}
                  >
                    {requestedIds.has("sarah") ? "Request Sent" : "Request Connection"}
                  </button>
                </div>

                {/* Alumnus 2 */}
                <div className="min-w-[280px] w-[280px] surface-card p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative">
                        <img
                          alt="Marcus Thorne"
                          className="h-14 w-14 rounded-full bg-ec-muted object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuApzpCwWdVgkWwisdyDGjxbwOqsNfzFQuKWn9poeYsXSqwCrWvvXVZsd6K4iy7_FOLNCPCOGukB01ZQEN_QnYIi3hEOtCr24OTA9TqWvz2uadQdJMM2hJmWZ-qlySHeEzRYsb2-02Dv8xpEZ30t08nPqe0FIhP_Hgbwf4Gpb3Lvz1PqjGukrihpqGE1FPF9ayemDf4mEoqCPlcbPHuitrNqKT_bMdcdauukGTHE0bTQTn-0zs4rVt6oRZEtl20NTjrxi0WzLCvUDm5u"
                        />
                      </div>
                      <span className="bg-ec-muted text-ec-text-sub border border-ec-border px-3 py-1 rounded-full text-[10px] font-semibold">
                        Accepting Referral
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-1">
                        <h4 className="text-sm font-bold text-ec-highlight leading-tight">Marcus Thorne</h4>
                        <Award size={14} className="text-ec-accent fill-ec-accent" />
                      </div>
                      <p className="text-xs text-ec-text-sub mt-0.5">
                        Product Lead @ Meta <span className="text-[10px]">('15, Business)</span>
                      </p>
                      <p className="text-[11px] text-ec-text-sub mt-2 flex items-center gap-1.5">
                        <Users size={12} className="text-ec-icon" />
                        <span>{connectionsHelpCount.marcus} Students Helped</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="bg-ec-muted/40 text-ec-text-sub px-2 py-0.5 rounded text-[10px] font-bold">
                        Product Mgmt
                      </span>
                      <span className="bg-ec-muted/40 text-ec-text-sub px-2 py-0.5 rounded text-[10px] font-bold">
                        Fintech
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRequest("marcus")}
                    className={`w-full py-2 rounded-lg text-xs font-semibold border transition-all ${requestedIds.has("marcus")
                      ? "bg-ec-muted border-ec-border text-ec-text-sub"
                      : "border-ec-accent text-ec-accent hover:bg-ec-accent/5"
                      }`}
                  >
                    {requestedIds.has("marcus") ? "Referral Requested" : "Request Referral"}
                  </button>
                </div>

                {/* Alumnus 3 */}
                <div className="min-w-[280px] w-[280px] surface-card p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative">
                        <img
                          alt="Elena Rodriguez"
                          className="h-14 w-14 rounded-full bg-ec-muted object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRuHH8HsWqDCP7s4CGEtd7Moi9OUvTrJdXM-i3fNsZ9mnATpcEkJU3BBhiROM9SvT3Narqexr6kVvkpdDU3S9PPS9GKb5hkNGqS15g5BwXuY68JCWXbCgGksr8ayTOFzvoPiFaPMv7WZjqy46gKdF5kwqyE1wt95L02Ztk3taMZSmS2ZeSpl0AcSZrtB2Wh6xLtfl-j1cfAwS8K6Ul7AR2m3G9BtcF_mJ5ehnWfL2Bn_KWL2Uo0vYLA0osVZhn53v6kctTRP4a9Z3c"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 h-3.5 w-3.5 rounded-full border-2 border-ec-surface"></div>
                      </div>
                      <span className="badge text-[10px] font-semibold">Mentorship Available</span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-1">
                        <h4 className="text-sm font-bold text-ec-highlight leading-tight">Elena Rodriguez</h4>
                        <Award size={14} className="text-ec-accent fill-ec-accent" />
                      </div>
                      <p className="text-xs text-ec-text-sub mt-0.5">
                        Data Scientist @ Stripe <span className="text-[10px]">('19, Math)</span>
                      </p>
                      <p className="text-[11px] text-ec-text-sub mt-2 flex items-center gap-1.5">
                        <Users size={12} className="text-ec-icon" />
                        <span>{connectionsHelpCount.elena} Students Helped</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="bg-ec-muted/40 text-ec-text-sub px-2 py-0.5 rounded text-[10px] font-bold">
                        Machine Learning
                      </span>
                      <span className="bg-ec-muted/40 text-ec-text-sub px-2 py-0.5 rounded text-[10px] font-bold">
                        Python
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRequest("elena")}
                    className={`w-full py-2 rounded-lg text-xs font-semibold border transition-all ${requestedIds.has("elena")
                      ? "bg-ec-muted border-ec-border text-ec-text-sub"
                      : "border-ec-accent text-ec-accent hover:bg-ec-accent/5"
                      }`}
                  >
                    {requestedIds.has("elena") ? "Request Sent" : "Request Connection"}
                  </button>
                </div>

              </div>
            </div>

            {/* Available Mentors */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-ec-highlight">Available Mentors</h3>
                <Link to="/student/mentorship" className="text-xs text-ec-accent hover:text-ec-accent-hover font-semibold hover:underline">
                  View Directory
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mentor 1 */}
                <div className="bg-ec-surface rounded-2xl p-6 bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-xl">
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        alt="David Kim"
                        className="h-12 w-12 rounded-full object-cover bg-ec-muted"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoEwQyZ3HN9BljrPbcxbDHTUOWjZkY4Vkl1mIQdrW0_yQx8jfI5J57LqGACp86RN2LWZ0YP5So91l6BIuH4pepoLDU33i2wDxqP4xoTTc4ZV2QJQUOkd53O_T9n-gTzeoaT4wT5SgiNk7bzkJtQyaxJoT2FfCuyBQledh0nGvesCuh8VGGKQR4eeiUxKFCzj-nJ2n3-zAB_f4BtCTKNIkM1RXK8eIs5-EnZrYucoLmUzt-IzU50KTD0_W2Up3ADy0Fq0dI9M-djgAz"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-ec-highlight leading-tight">David Kim</h4>
                        <p className="text-xs text-ec-text-sub mt-0.5">UX Research Manager @ Google</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-ec-accent font-semibold">
                            <Star size={13} className="text-amber-500 fill-amber-500" />
                            <span>4.9</span>
                          </span>
                          <span className="text-xs text-ec-text-sub flex items-center gap-1">
                            <Users size={12} className="text-ec-icon" />
                            <span>42 Helped</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-ec-muted/30 p-3 rounded-lg mb-4 flex items-center gap-2 text-ec-text-sub">
                      <Calendar size={14} className="text-ec-icon" />
                      <span className="text-xs">
                        Next available: <strong className="text-ec-highlight">Tomorrow, 3:00 PM</strong>
                      </span>
                    </div>
                  </div>

                  <button className="btn-primary w-full py-2 text-xs font-semibold">
                    Book Session
                  </button>
                </div>

                {/* Mentor 2 */}
                <div className="bg-ec-surface border border-ec-border rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        alt="Amanda Lee"
                        className="h-12 w-12 rounded-full object-cover bg-ec-muted"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2bpFWGbg0Y9uMklkjWLelK5hNG2CAEGbzniW7jTju0FviAMGzDiuz7oKFSF2lnEZOG646EReL83oYl8StiC-0j1I4xpOj3kwKmM8Bz5fb6GS-o0r64icQ9m3wzMy2av1VsICAaVd-Z7BYivhouUuFOq8pBTfHsHVgYekuJArPIuRslQfwOnKwQf0aQeAPDquvc2el1DOANrDpZiX4bHdTt5w1lNS2kLQfF19ySvFPiYAZBaGDLfkIo4Smh2cx1rB6pWyEro3d1syu"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-ec-highlight leading-tight">Amanda Lee</h4>
                        <p className="text-xs text-ec-text-sub mt-0.5">Engineering Manager @ Stripe</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-ec-accent font-semibold">
                            <Star size={13} className="text-amber-500 fill-amber-500" />
                            <span>5.0</span>
                          </span>
                          <span className="text-xs text-ec-text-sub flex items-center gap-1">
                            <Users size={12} className="text-ec-icon" />
                            <span>19 Helped</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-ec-muted/30 p-3 rounded-lg mb-4 flex items-center gap-2 text-ec-text-sub">
                      <Calendar size={14} className="text-ec-icon" />
                      <span className="text-xs">
                        Next available: <strong className="text-ec-highlight">Thu, 10:00 AM</strong>
                      </span>
                    </div>
                  </div>

                  <button className="btn-primary w-full py-2 text-xs font-semibold">
                    Book Session
                  </button>
                </div>
              </div>
            </div>

            {/* Jobs & Referrals */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-ec-highlight">Referral Opportunities & Jobs</h3>
                <Link to="/student/jobs" className="text-xs text-ec-accent hover:text-ec-accent-hover font-semibold hover:underline">
                  View Job Board
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Job 1 */}
                <div className="bg-ec-surface border border-ec-border rounded-xl p-5 hover:border-ec-accent/55 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-ec-muted/50 p-2 rounded-lg group-hover:bg-ec-accent/10 transition-colors">
                      <img
                        alt="Google"
                        className="h-8 w-8 object-contain"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZkdE0k0fTWPX9VALLgyfs1gk_VvdsVj-kFp5c5JEnFxg6VWDyDG1vO2jDhFad6GxYColnfM3kWDg_Lmn62rNph9BTH7TfyJ6N-84rujUBgVsZZ-GXWpy-qpZk4SewXUNr0P1ZFM4nnYBEqGMdyxW1Q14rd6z25lQzilWqcVAmh44aM4eBm6r-UK9192VpZSuVgqHBcr3Z3vj0Nn2Es0P08mk3XA7qClFbw7PGBDAeDXfxlbJaie7M0y3W2E6aieTl0dCJQLk1mURk"
                      />
                    </div>
                    <span className="badge text-[10px] bg-ec-accent/10 text-ec-accent flex items-center gap-1">
                      <Award size={12} className="fill-ec-accent/20" />
                      <span>Alumni Referral</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-ec-highlight group-hover:text-ec-accent transition-colors">
                    Software Engineering Intern
                  </h4>
                  <p className="text-xs text-ec-text-sub mt-0.5">Google • Mountain View, CA</p>

                  <div className="mt-4 flex items-center gap-2 border-t border-ec-border/40 pt-3">
                    <div className="flex -space-x-2">
                      <img
                        alt="Alumni Avatar"
                        className="h-6 w-6 rounded-full border-2 border-ec-surface object-cover bg-ec-muted"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0Uz2MqWpaMTaCS1C7ojjQjiVYc8tnMw8aso25OGVWfPkFQlaCtA8i4_VAkI0Kk0yq8HJnAjj1pb3Ao8Tbyj8i2PUYa9D9CvA80o_atK3Lnzq68_DajN10-YY-RDZApoGLsNfNYCOPvCqQEFUeWJJlzCIl0A2L3Ottf1LnLBU6AXYZdiU1syyqu92lO8XAFULHPjkhkvvc9hzfTJJVJOTJJNp3hDcyXn0RrhogWdSET-L-Rct1o0zlkZlSU5kOAUqVR1yIHUgsiJKB"
                      />
                      <img
                        alt="Alumni Avatar"
                        className="h-6 w-6 rounded-full border-2 border-ec-surface object-cover bg-ec-muted"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxJbw5yJXoDzYSzfGbAC5RhhQXRgQPkt7Ym3ow8-r_cbRWVVA97wjszNo99a93UZj-YrSade0u51mlAM68uLX0E_oe8YwAs8ozeqel-ECWGlQMLfT0jdaG7iOQcNd44lCBJHKQxSsFGegDm6EHmxEvn_xii_LEBoAVd2qcMeuUmqYtogKSxpU8A1ji9wJS6-ofA8U7vrIASryeIvND977heoYvS37Nue1mmpHP0O71vfdf5nmlxbnKM9Cr70AZBJRJid1RmTRRQxS4"
                      />
                    </div>
                    <span className="text-[10px] text-ec-text-sub font-medium">2 Alumni work here</span>
                  </div>
                </div>

                {/* Job 2 */}
                <div className="bg-ec-surface border border-ec-border rounded-xl p-5 hover:border-ec-accent/55 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-ec-muted/50 p-2 rounded-lg group-hover:bg-ec-accent/10 transition-colors">
                      <img
                        alt="Notion"
                        className="h-8 w-8 object-contain"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoEwQyZ3HN9BljrPbcxbDHTUOWjZkY4Vkl1mIQdrW0_yQx8jfI5J57LqGACp86RN2LWZ0YP5So91l6BIuH4pepoLDU33i2wDxqP4xoTTc4ZV2QJQUOkd53O_T9n-gTzeoaT4wT5SgiNk7bzkJtQyaxJoT2FfCuyBQledh0nGvesCuh8VGGKQR4eeiUxKFCzj-nJ2n3-zAB_f4BtCTKNIkM1RXK8eIs5-EnZrYucoLmUzt-IzU50KTD0_W2Up3ADy0Fq0dI9M-djgAz"
                      />
                    </div>
                    <span className="badge text-[10px] bg-ec-accent/10 text-ec-accent flex items-center gap-1">
                      <Award size={12} className="fill-ec-accent/20" />
                      <span>Alumni Referral</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-ec-highlight group-hover:text-ec-accent transition-colors">
                    Product Designer
                  </h4>
                  <p className="text-xs text-ec-text-sub mt-0.5">Notion • San Francisco, CA</p>

                  <div className="mt-4 flex items-center gap-2 border-t border-ec-border/40 pt-3">
                    <div className="flex -space-x-2">
                      <img
                        alt="Alumni Avatar"
                        className="h-6 w-6 rounded-full border-2 border-ec-surface object-cover bg-ec-muted"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF2cwMjz34eL6ZYxxBr-e56G1DDHx_76vj33tCgnUtHNGAe0k-HIO6QNzvrzH9bAGzJ144X-jC50qtm9p98S6M3vBKbu2jIuZV4HqxkIjDE6Y90NDm2Q8mkNw5OomNxFQecLBTHyFeITecmdctJa-YOoeGngFrFLnrOVxj5_f65v7GSLttStv6yam-6rzZLL6QPWTqA5XoIts4_1yzeEj1XFPIstd9dKLeZjMpmn8l4l7R2tiiBThLmnYeCl4r81ptx0HR74LNWQsc"
                      />
                    </div>
                    <span className="text-[10px] text-ec-text-sub font-medium">1 Alumnus works here</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Community Feed */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-ec-highlight mt-8">Community Feed</h3>

              {/* Post 1 */}
              <div className="bg-ec-surface border border-ec-border rounded-xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    alt="Microsoft Logo"
                    className="h-10 w-10 rounded-lg bg-ec-muted/20 border border-ec-border p-1 object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo0nSvl5ORxb-uSlKKQdfRFPUsyESFnHY5YIUNAxtMwxLCRz_w-9kc_tPVrpZ_KCnbdQezHU5O4I3Pj9MsfDepEM7mZuNcLi7fklB8CW5xaZB4n9qum6-HSWraW-Z_Q6juI6DVGdS3AoOOYuASNW4t1RFXX0Lm0GXnYHZdDZcRBekrh38o6KHQQ7Upt2hXeF-VHNG2oNo559_fh3sVmmncFkCnSXzpHPi6I4J6ibEg733HRa-OOuOtsbK8lqDlgZI_F5QdryTs7-hf"
                  />
                  <div>
                    <p className="text-xs font-bold text-ec-highlight">Microsoft Alumni Hub</p>
                    <p className="text-[10px] text-ec-text-sub">2 hours ago</p>
                  </div>
                </div>

                <p className="text-xs text-ec-text leading-relaxed">
                  We're hosting a virtual mixer for graduating seniors interested in Cloud Infrastructure roles. Don't miss out!
                </p>

                <div className="w-full h-48 overflow-hidden rounded-lg border border-ec-border/50">
                  <img
                    className="w-full h-full object-cover"
                    alt="Microsoft Mixer Event"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQitk82O-v_SaDLcZdy8UGpBPfE2v1oqDdad-LECM93gebRDVFGmetz69xDTZjCd-JcvfHeVVUNA_gfBnLOIkQ-HYNMGQKASdwd6la3X-Q7gCgk9jEd411tvCZapG6lvYC2QAgQ0SgZgFr86tTD5YPicsxFFKsq7e9fL0kDAHQZ3DvLncUNwqiMmfKO3qmK7C2jVz9RrR0XGHjhjqM2n2uGUImaNbx-n9LLvmMorzJ4OBtaI5xOYY5Gx4brq_Mh0-skQmZRomtw7kQ"
                  />
                </div>

                <div className="flex items-center gap-4 text-ec-text-sub border-t border-ec-border/40 pt-3">
                  <button
                    onClick={() => handleLike("mixer")}
                    className={`flex items-center gap-1.5 text-xs transition-colors hover:text-ec-accent ${likedPosts.has("mixer") ? "text-ec-accent font-semibold" : ""
                      }`}
                  >
                    <ThumbsUp size={15} className={likedPosts.has("mixer") ? "fill-ec-accent/25" : ""} />
                    <span>{postLikes.mixer}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-xs transition-colors hover:text-ec-accent">
                    <MessageSquare size={15} />
                    <span>8 Comments</span>
                  </button>
                </div>
              </div>

              {/* Post 2 */}
              <div className="bg-ec-surface border border-ec-border rounded-xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    alt="Kevin Profile"
                    className="h-10 w-10 rounded-full object-cover bg-ec-muted border border-ec-border"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKwsUll_0VwGaSkuhJ6fUior93RHiyOt8tgrdh26QB7B9U0jDZbVeoi56IiG522nMPTUE389uyJHlw6eRXsfvvI9weLRQeIVma7ejzG2dDUdQ5M3Z9J2wHjCYdpwomnk8URJUcp4Rc_St093PQrvpa08Y4Zts4OmnsU2sIkSZDoRkgJiQ2mC8w7UkpBU0L9i78y_a0WNamK5c4QcNUx5rNgL5UF0PCF2XnvlWaaPMCJuSlM2EBoyL8gpxI8kGDbhV0GMFp9Gat0db0"
                  />
                  <div>
                    <p className="text-xs font-bold text-ec-highlight">Kevin Zhao (Alumnus)</p>
                    <p className="text-[10px] text-ec-text-sub">5 hours ago</p>
                  </div>
                </div>

                <p className="text-xs text-ec-text italic leading-relaxed">
                  "Just landed a role at Robinhood! Big thanks to my mentor Sarah for the mock interviews. Happy to pay it forward to anyone applying this season."
                </p>

                <div className="flex items-center gap-4 text-ec-text-sub border-t border-ec-border/40 pt-3">
                  <button
                    onClick={() => handleLike("robinhood")}
                    className={`flex items-center gap-1.5 text-xs transition-colors hover:text-ec-accent ${likedPosts.has("robinhood") ? "text-ec-accent font-semibold" : ""
                      }`}
                  >
                    <Heart size={15} className={likedPosts.has("robinhood") ? "fill-ec-accent/25 text-ec-accent" : ""} />
                    <span>{postLikes.robinhood}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-xs transition-colors hover:text-ec-accent">
                    <Share2 size={15} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

          </section>

          {/* Right Sidebar (Col span 12 on mobile, 3 on desktop) */}
          <aside className="col-span-12 lg:col-span-3 space-y-6">

            {/* Trending Skills */}
            <div className="surface-card p-5">
              <h3 className="text-sm font-bold text-ec-highlight mb-4">Trending Skills</h3>
              <div className="flex flex-wrap gap-2">
                {trendingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-ec-muted/50 rounded-full text-xs text-ec-text-sub border border-ec-border/60 hover:bg-ec-accent/10 hover:text-ec-accent hover:border-ec-accent/20 transition-all cursor-pointer font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Companies */}
            <div className="surface-card p-5">
              <h3 className="text-sm font-bold text-ec-highlight mb-4">Top Companies</h3>
              <div className="space-y-4">
                {topCompanies.map((company) => (
                  <div key={company.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        alt={company.name}
                        className="h-9 w-9 rounded-lg bg-ec-muted/20 object-contain p-1 border border-ec-border"
                        src={company.logo}
                      />
                      <div>
                        <p className="text-xs font-bold text-ec-highlight">{company.name}</p>
                        <p className="text-[10px] text-ec-text-sub font-medium">{company.alumniCount} Active Alums</p>
                      </div>
                    </div>
                    <button className="text-ec-accent hover:text-ec-accent-hover p-1 rounded-full hover:bg-ec-accent/10 transition-colors">
                      <Plus size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="surface-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-ec-highlight">Events</h3>
                <Calendar size={15} className="text-ec-text-sub cursor-pointer hover:text-ec-text transition-colors" />
              </div>

              <div className="space-y-4">
                {upcomingEvents.map((evt) => (
                  <div key={evt.title} className="flex gap-3">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg flex flex-col items-center justify-center font-bold text-xs ${evt.isPrimary
                        ? "bg-ec-accent/10 text-ec-accent border border-ec-accent/20"
                        : "bg-ec-muted text-ec-text-sub border border-ec-border"
                        }`}
                    >
                      <span className="text-[9px] font-semibold leading-none">{evt.month}</span>
                      <span className="text-sm font-extrabold leading-none mt-0.5">{evt.day}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ec-highlight hover:text-ec-accent cursor-pointer transition-colors">
                        {evt.title}
                      </p>
                      <p className="text-[10px] text-ec-text-sub mt-0.5">{evt.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/student/events"
                className="w-full mt-6 text-ec-accent hover:text-ec-accent-hover font-semibold text-xs border-t border-ec-border pt-4 block text-center hover:underline"
              >
                Explore All Events
              </Link>
            </div>

          </aside>

        </div>
      </main>
    </AppLayout>
  );
}