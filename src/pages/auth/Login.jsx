import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import useSystemTheme from "../../hooks/useSystemTheme";
import { 
  GoArrowLeft, 
  GoArrowRight, 
  GoShield, 
  GoMortarBoard, 
  GoPeople, 
  GoOrganization, 
  GoZap, 
  GoCheck, 
  GoCheckCircle, 
  GoInfo, 
  GoChevronRight 
} from "react-icons/go";

// Twinkling space backdrop for the left pane
function StarfieldCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const numStars = 60;
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 0.9 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.012 + 0.004,
        twinkle: Math.random() < 0.4
      });
    }

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];

        if (star.twinkle) {
          star.alpha += star.speed;
          if (star.alpha > 0.9 || star.alpha < 0.1) {
            star.speed = -star.speed;
          }
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(star.alpha, 1))})`;
        ctx.fill();

        star.y -= Math.random() * 0.03 + 0.01;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0" />;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const initialMode = location.state?.mode === "signup" ? "signup" : "login";
  const prefilledEmail = location.state?.email || "";

  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Registration States
  const [name, setName] = useState("");
  const [signupRole, setSignupRole] = useState("student");
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Selected College state
  const [selectedCollegeCode, setSelectedCollegeCode] = useState("");
  
  // Student registration fields
  const [rollNo, setRollNo] = useState("");
  const [branch, setBranch] = useState("");
  const [currentYear, setCurrentYear] = useState("1st");
  const [graduationYear, setGraduationYear] = useState("");

  // Alumni registration fields
  const [company, setCompany] = useState("");
  const [designation, setDesignation] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // List of active colleges & loading state
  const [colleges, setColleges] = useState([]);
  const [collegesLoading, setCollegesLoading] = useState(false);

  // Stateful index for the collapsible description accordion
  const [openIndex, setOpenIndex] = useState(0); 

  const { dummyLogin } = useAuth();
  const theme = useSystemTheme(); 

  // Fetch registered colleges with caching
  useEffect(() => {
    if (mode === "signup") {
      fetchColleges();
    }
  }, [mode]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("error") === "suspended") {
      setError("Your institution is not registered or is currently suspended on this platform. Please contact support.");
    }
  }, [location]);

  const fetchColleges = async () => {
    setCollegesLoading(true);
    try {
      const cachedColleges = localStorage.getItem("connect_karo_active_colleges");
      const cachedTime = localStorage.getItem("connect_karo_colleges_cache_time");
      const now = Date.now();

      // Use cache if under 5 minutes (300000 ms)
      if (cachedColleges && cachedTime && (now - parseInt(cachedTime)) < 300000) {
        const parsed = JSON.parse(cachedColleges);
        setColleges(parsed);
        if (parsed.length > 0) {
          setSelectedCollegeCode(parsed[0].collegeCode);
        }
        setCollegesLoading(false);
        return;
      }

      // Read from Supabase (Active colleges only)
      const { data: cols, error: colsErr } = await supabase
        .from("colleges")
        .select("id, name, domain")
        .eq("status", "active");

      if (colsErr) throw colsErr;

      const list = (cols || []).map(col => ({
        id: col.id,
        name: col.name,
        collegeCode: col.id,
        domain: col.domain
      }));

      list.sort((a, b) => a.name.localeCompare(b.name));
      setColleges(list);
      
      if (list.length > 0) {
        setSelectedCollegeCode(list[0].collegeCode);
      }

      localStorage.setItem("connect_karo_active_colleges", JSON.stringify(list));
      localStorage.setItem("connect_karo_colleges_cache_time", now.toString());
    } catch (err) {
      console.error("Colleges load failed:", err);
      setError("Failed to fetch registered colleges. Please try again.");
    } finally {
      setCollegesLoading(false);
    }
  };

  const handleRealLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw authError;
      }

      const user = authData.user;
      const { data: userData, error: userErr } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (userErr || !userData) {
        setError("User profile not found in the system database.");
        await supabase.auth.signOut();
        return;
      }

      if (userData.status === "blocked") {
        setError("Your account is blocked by Admin.");
        await supabase.auth.signOut();
        return;
      }
      if (userData.status === "pending") {
        setError("Your registration request is pending approval from your college.");
        await supabase.auth.signOut();
        return;
      }

      // Student, Alumni and College Admin must belong to a registered and active college
      if (userData.role === "student" || userData.role === "alumni" || userData.role === "college_admin") {
        if (!userData.college_id) {
          setError("Your user profile is missing an institutional identifier.");
          await supabase.auth.signOut();
          return;
        }
        
        const isDummy = userData.college_id.toLowerCase() === "dummy_college_01";
        let isCollegeActive = isDummy;
        
        if (!isDummy) {
          const { data: college } = await supabase
            .from("colleges")
            .select("status")
            .eq("id", userData.college_id.trim())
            .single();

          if (college && college.status === "active") {
            isCollegeActive = true;
          }
        }
        
        if (!isCollegeActive) {
          setError("Your institution is not registered or is currently suspended on this platform. Please contact support.");
          await supabase.auth.signOut();
          return;
        }
      }

      redirectUser(userData.role);
    } catch (err) {
      console.error(err);
      setError("Authentication failed. Please verify your portal credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    if (!selectedCollegeCode) {
      setError("Please select a registered college to continue.");
      setLoading(false);
      return;
    }

    try {
      const selectedCollegeObj = colleges.find(c => c.collegeCode === selectedCollegeCode);
      
      // Prepare custom fields in user_metadata so triggers populate public.users atomically!
      const metadata = {
        name: name.trim(),
        role: signupRole,
        collegeId: selectedCollegeCode,
        collegeName: selectedCollegeObj?.name || selectedCollegeCode,
        status: "pending"
      };

      if (signupRole === "student") {
        metadata.rollNo = rollNo.trim();
        metadata.branch = branch.trim();
        metadata.currentYear = currentYear;
        metadata.batch = graduationYear.trim();
      } else if (signupRole === "alumni") {
        metadata.rollNo = rollNo.trim();
        metadata.branch = branch.trim();
        metadata.batch = graduationYear.trim();
        metadata.company = company.trim();
        metadata.designation = designation.trim();
        metadata.linkedin = linkedin.trim();
      }

      // Create User in Supabase Auth
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: metadata
        }
      });

      if (signUpErr) {
        throw signUpErr;
      }
      
      // Force auth sign out immediately to prevent auto-login of pending user
      await supabase.auth.signOut();

      // Clear form inputs
      setName("");
      setRollNo("");
      setBranch("");
      setGraduationYear("");
      setCompany("");
      setDesignation("");
      setLinkedin("");
      
      // Show registration success view
      setSignupSuccess(true);
    } catch (err) {
      console.error("Sign up failure:", err);
      setError(err.message || "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDummyLogin = (role) => {
    dummyLogin(role);
    redirectUser(role);
  };

  const redirectUser = (role) => {
    if (role === "root_admin") navigate("/admin");
    else if (role === "college_admin") navigate("/college");
    else if (role === "alumni") navigate("/alumni");
    else if (role === "student") navigate("/student");
  };

  const devRoles = [
    { role: "root_admin", label: "Root Admin", icon: GoShield, color: "bg-red-500" },
    { role: "college_admin", label: "College Admin", icon: GoOrganization, color: "bg-blue-500" },
    { role: "alumni", label: "Alumni", icon: GoPeople, color: "bg-purple-500" },
    { role: "student", label: "Student", icon: GoMortarBoard, color: "bg-ec-accent" },
  ];

  const valueProps = [
    {
      title: "Verified Identity Access",
      desc: "Connect securely via academic emails. Student and alumni credentials undergo background database verification checks authorized by institutional administrators."
    },
    {
      title: "Alumni Mentorship Network",
      desc: "Direct communication nodes linking students to graduated professionals. Engage in career guidance sessions, discuss job trends, and request interview referrals."
    },
    {
      title: "Enterprise Broadcaster",
      desc: "An integrated notice board sending real-time push bulletins, events schedules, and campus alerts directly from the college administration control panel."
    },
    {
      title: "Tailored Role Workspaces",
      desc: "Distinct custom dashboards designed for academic profiles. Special views are created specifically for College Management, Alumni Networks, Students, and Root System Admins."
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-screen lg:overflow-hidden bg-ec-root text-ec-text font-sans antialiased selection:bg-ec-accent/20">
      
      {/* ── LEFT PANE: 50% split space showroom with animated accordion descriptions ── */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-b from-[#030712] via-[#080a1d] to-[#030712] text-white border-r border-ec-border/10 overflow-hidden shadow-2xl h-full">
        <StarfieldCanvas />
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] rounded-full bg-ec-accent/5 filter blur-[60px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/5 filter blur-[70px] pointer-events-none" />

        {/* Top Brand Logo */}
        <div 
          onClick={() => navigate("/")} 
          className="flex items-center gap-3 cursor-pointer z-10 hover:opacity-90 transition-opacity self-start"
        >
          <div className="w-9 h-9 rounded-lg bg-ec-accent flex items-center justify-center font-bold text-white text-lg shadow-md shadow-ec-accent/25">
            C
          </div>
          <span className="font-extrabold text-lg tracking-tight">
            Connect<span className="text-ec-accent">Karo</span>
          </span>
        </div>

        {/* Brand Accordion Panel */}
        <div className="my-auto py-6 z-10 relative max-w-[460px] mx-auto w-full text-center flex flex-col items-center">
          <h2 className="text-3xl font-[800] tracking-tight leading-tight text-white mb-3">
            Secure Gateway to <br />
            Your Campus Network
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed mb-6">
            Welcome to Connect-Karo — a unified professional network connecting students, graduates, and college administrators.
          </p>

          {/* Interactive Bouncing Guide Banner */}
          <div className="flex items-center gap-2.5 mb-6 bg-slate-900/60 border border-slate-800/80 rounded-lg py-2 px-3.5 mx-auto animate-pulse">
            <GoZap size={12} className="text-ec-accent shrink-0 animate-bounce" />
            <span className="text-[10.5px] font-medium text-slate-300">
              Interactive Guide: Click any feature below to expand details.
            </span>
          </div>

          {/* Accordion List */}
          <div className="space-y-3.5 w-full text-left">
            {valueProps.map((prop, i) => {
              const isOpen = openIndex === i;
              return (
                <div 
                  key={i} 
                  className={`p-3.5 rounded-lg border transition-all duration-300 bg-slate-950/20 
                    ${isOpen ? "border-ec-accent/30 bg-slate-950/40 shadow-sm" : "border-slate-800/40 hover:border-slate-700/60"}`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between text-left focus:outline-none group"
                  >
                    <div className="flex gap-3 items-center min-w-0">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 transition-all duration-300
                        ${isOpen 
                          ? "bg-ec-accent border-ec-accent text-white" 
                          : "bg-slate-900 border-slate-700 text-slate-400 group-hover:text-slate-300"}`}
                      >
                        <GoCheck size={11} className="stroke-[3.5]" />
                      </div>
                      <span className={`font-semibold text-xs transition-colors duration-200 truncate
                        ${isOpen ? "text-white" : "text-slate-300 group-hover:text-white"}`}
                      >
                        {prop.title}
                      </span>
                    </div>
                    
                    <GoChevronRight 
                      size={14} 
                      className={`text-slate-400 group-hover:text-slate-300 transition-transform duration-300 shrink-0
                        ${isOpen ? "rotate-90 text-ec-accent" : ""}`} 
                    />
                  </button>

                  {/* Smooth height animation transition */}
                  <div 
                    className={`grid transition-all duration-300 ease-in-out overflow-hidden
                      ${isOpen ? "grid-rows-[1fr] opacity-100 mt-2.5" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[11px] text-slate-400 leading-relaxed pl-8">
                        {prop.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Small Footer Notice */}
        <div className="z-10 text-[10px] text-slate-500 pt-4 border-t border-slate-900">
          Connect-Karo Systems Integration Core v1.2
        </div>
      </div>

      {/* ── RIGHT PANE: 50% split form, light GitHub style layout ── */}
      <div className="flex flex-col justify-between p-6 md:p-10 xl:p-12 h-full relative bg-white overflow-y-auto lg:overflow-y-hidden text-gray-900 shadow-2xl">
        
        {/* Subtle Ambient light glow */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full filter blur-[80px] pointer-events-none" />

        {/* Absolute Top Switch Controls */}
        <div className="absolute top-6 left-6 right-6 md:top-8 md:left-8 md:right-8 flex justify-between items-center z-20">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <GoArrowLeft size={13} />
            Back to Home
          </button>

          <div className="text-xs">
            {mode === "signup" ? (
              <>
                <span className="text-gray-500 mr-1.5">Already registered?</span>
                <button 
                  onClick={() => { setMode("login"); setError(""); }} 
                  className="text-emerald-600 hover:text-emerald-700 font-extrabold transition-colors cursor-pointer hover:underline"
                >
                  Sign in &rarr;
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-500 mr-1.5">Need portal access?</span>
                <button 
                  onClick={() => { setMode("signup"); setError(""); }} 
                  className="text-emerald-600 hover:text-emerald-700 font-extrabold transition-colors cursor-pointer hover:underline"
                >
                  Register &rarr;
                </button>
              </>
            )}
          </div>
        </div>

        {/* Form Container (Fits strictly on screen with slightly larger width) */}
        <div className="flex-1 flex flex-col justify-center max-w-[410px] w-full mx-auto my-auto z-10 py-6">
          
          {/* Mobile Logo Brand */}
          <div 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-6 lg:hidden cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
              C
            </div>
            <span className="font-extrabold text-sm tracking-tight text-gray-900">
              Connect<span className="text-emerald-600">Karo</span>
            </span>
          </div>

          {signupSuccess ? (
            /* Request Confirmation Screen */
            <div className="p-6 bg-gray-50 border border-emerald-500/20 rounded-2xl shadow-xl animate-fade-in-up">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 animate-pulse">
                  <GoCheckCircle size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1.5">Request Submitted</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-5">
                  We've successfully logged your request for <strong className="text-gray-900">{email}</strong>. 
                  Administrators at <span className="font-semibold text-gray-900">{colleges.find(c => c.collegeCode === selectedCollegeCode)?.name || "your college"}</span> will review your academic credentials.
                </p>
                <div className="w-full bg-white rounded-xl p-4 mb-5 text-left border border-gray-200 shadow-sm">
                  <div className="flex gap-2">
                    <GoInfo size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-gray-500 leading-normal">
                      Once verified, an onboarding invitation link containing role authorization credentials will be delivered to your registered inbox.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => { setSignupSuccess(false); setMode("login"); }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg py-3 text-sm transition-colors cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          ) : (
            /* Auth / Access Form */
            <div className="animate-fade-in-up">
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2 md:text-[26px]">
                  {mode === "signup" ? "Request portal access" : "Sign in to Connect-Karo"}
                </h2>
                <p className="text-xs md:text-[13px] text-gray-500 leading-relaxed">
                  {mode === "signup" 
                    ? "Enter your academic credentials to submit an invitation request to your college."
                    : "Access your student dashboard, alumni workspace, or administration tower."
                  }
                </p>
              </div>

              {/* Error Notice */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 border-l-4 border-l-red-500 animate-shake">
                  <p className="text-xs text-red-600 font-semibold">{error}</p>
                </div>
              )}

              {/* Form Input fields */}
              <form onSubmit={mode === "signup" ? handleRequestAccess : handleRealLogin} className="space-y-4">
                
                {mode === "login" ? (
                  <>
                    <div>
                      <label className="block text-[11px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Email Address</label>
                      <input
                        type="email"
                        placeholder="name@institution.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[11px] md:text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                        <a href="#" className="text-xs font-semibold text-emerald-600 hover:underline">Forgot password?</a>
                      </div>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none"
                        required
                      />
                    </div>
                  </>
                ) : (
                  /* Signup fields wrapper with internal scrolling */
                  <div className="max-h-[300px] md:max-h-[360px] lg:h-[198px] xl:h-[198px] overflow-y-auto pr-2 space-y-4 custom-form-scroll">
                    <style>{`
                      .custom-form-scroll::-webkit-scrollbar {
                        width: 4px;
                      }
                      .custom-form-scroll::-webkit-scrollbar-track {
                        background: transparent;
                      }
                      .custom-form-scroll::-webkit-scrollbar-thumb {
                        background: rgba(0, 0, 0, 0.1);
                        border-radius: 4px;
                      }
                      .custom-form-scroll::-webkit-scrollbar-thumb:hover {
                        background: rgba(0, 0, 0, 0.2);
                      }
                    `}</style>
                    
                    <div>
                      <label className="block text-[11px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Email Address</label>
                      <input
                        type="email"
                        placeholder="name@institution.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Choose Password</label>
                      <input
                        type="password"
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Select College</label>
                      <div className="relative">
                        {collegesLoading ? (
                          <div className="w-full bg-white text-gray-500 border border-gray-300 rounded-lg px-3.5 py-2.5 pl-9 text-sm flex items-center justify-between">
                            <span>Loading active colleges...</span>
                            <div className="w-3.5 h-3.5 border-2 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin" />
                          </div>
                        ) : colleges.length === 0 ? (
                          <div className="w-full bg-red-50 text-red-600 border border-red-200 rounded-lg px-3.5 py-2.5 pl-9 text-sm">
                            No registered colleges found.
                          </div>
                        ) : (
                          <>
                            <select
                              value={selectedCollegeCode}
                              onChange={(e) => setSelectedCollegeCode(e.target.value)}
                              className="w-full bg-white text-gray-900 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-lg px-3.5 py-2.5 pl-9 pr-8 appearance-none cursor-pointer font-medium transition-all duration-200 outline-none"
                              required
                            >
                              {colleges.map((c) => (
                                <option key={c.collegeCode} value={c.collegeCode} className="text-gray-900 bg-white">
                                  {c.name} ({c.collegeCode})
                                </option>
                              ))}
                            </select>
                            <GoOrganization size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">&#9662;</div>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Select Role</label>
                      <div className="relative">
                        <select 
                          value={signupRole}
                          onChange={(e) => setSignupRole(e.target.value)}
                          className="w-full bg-white text-gray-900 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-lg px-3.5 py-2.5 pl-9 pr-8 appearance-none cursor-pointer font-medium transition-all duration-200 outline-none"
                          required
                        >
                          <option value="student" className="text-gray-900 bg-white">Student Account</option>
                          <option value="alumni" className="text-gray-900 bg-white">Alumni Account</option>
                        </select>
                        <GoMortarBoard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">&#9662;</div>
                      </div>
                    </div>

                    {/* Role-specific sections */}
                    {signupRole === "student" ? (
                      <div className="space-y-4 pt-3 border-t border-gray-200">
                        <div className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Student Academic Details</div>
                        <div>
                          <label className="block text-[11px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Roll Number</label>
                          <input
                            type="text"
                            placeholder="e.g. 210123010"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Branch / Department</label>
                          <input
                            type="text"
                            placeholder="e.g. Computer Science"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Current Year</label>
                          <div className="relative">
                            <select
                              value={currentYear}
                              onChange={(e) => setCurrentYear(e.target.value)}
                              className="w-full bg-white text-gray-900 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-lg px-3.5 py-2.5 pr-8 appearance-none cursor-pointer font-medium transition-all duration-200 outline-none"
                              required
                            >
                              <option value="1st" className="text-gray-900 bg-white">1st Year</option>
                              <option value="2nd" className="text-gray-900 bg-white">2nd Year</option>
                              <option value="3rd" className="text-gray-900 bg-white">3rd Year</option>
                              <option value="4th" className="text-gray-900 bg-white">4th Year</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">&#9662;</div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Graduation Year</label>
                          <input
                            type="number"
                            min="2000"
                            max="2035"
                            placeholder="e.g. 2025"
                            value={graduationYear}
                            onChange={(e) => setGraduationYear(e.target.value)}
                            className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none"
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 pt-3 border-t border-gray-200">
                        <div className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Alumni Professional Details</div>
                        <div>
                          <label className="block text-[11px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Roll Number</label>
                          <input
                            type="text"
                            placeholder="e.g. 210123010"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Branch / Department</label>
                          <input
                            type="text"
                            placeholder="e.g. Computer Science"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Graduation Year</label>
                          <input
                            type="number"
                            min="1950"
                            max="2035"
                            placeholder="e.g. 2020"
                            value={graduationYear}
                            onChange={(e) => setGraduationYear(e.target.value)}
                            className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Current Company</label>
                          <input
                            type="text"
                            placeholder="e.g. Google"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Current Designation</label>
                          <input
                            type="text"
                            placeholder="e.g. Software Engineer"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">LinkedIn Profile URL</label>
                          <input
                            type="url"
                            placeholder="e.g. https://linkedin.com/in/johndoe"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            className="w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 outline-none"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || (mode === "signup" && colleges.length === 0)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg py-3 text-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(16,185,129,0.15)] transition-colors"
                >
                  {loading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : mode === "signup" ? (
                    <>
                      Submit Access Request
                      <GoArrowRight size={14} />
                    </>
                  ) : (
                    <>
                      Secure Sign In
                      <GoArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              {/* Developer Access Box (Available only in Login Mode) */}
              {mode === "login" && (
                <div className="mt-5 border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <GoZap size={12} className="text-emerald-600 animate-pulse" />
                    <span className="text-[9px] font-[800] text-gray-500 uppercase tracking-wider">
                      Developer & Evaluator Portal Access
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {devRoles.map(({ role, label, icon: Icon, color }) => (
                      <button
                        key={role}
                        onClick={() => handleDummyLogin(role)}
                        className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-emerald-500/40 group transition-all duration-200 cursor-pointer shadow-sm text-gray-900"
                      >
                        <div className={`w-7 h-7 rounded-md ${color} flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-105 shadow-sm`}>
                          <Icon size={12} className="stroke-[2.5]" />
                        </div>
                        <div className="text-left min-w-0">
                          <div className="text-[11px] font-bold text-gray-800 group-hover:text-emerald-600 transition-colors truncate">
                            {label}
                          </div>
                          <div className="text-[9px] text-gray-500 leading-none mt-0.5">
                            Bypass Login
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info links (Lower heights to avoid scrollbars) */}
        <div className="w-full mt-6 lg:mt-0 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-400 gap-2 pt-4 border-t border-gray-100">
          <span>&copy; 2026 Connect-Karo. All rights reserved.</span>
          <div className="flex gap-3.5">
            <a href="#" className="hover:text-gray-800 transition-colors">Security</a>
            <a href="#" className="hover:text-gray-800 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-800 transition-colors">Support</a>
          </div>
        </div>
      </div>
      
    </div>
  );
}