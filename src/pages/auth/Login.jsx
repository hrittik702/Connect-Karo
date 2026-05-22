import React, { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { doc, getDoc, collection, query, where, getDocs, setDoc, getDocFromServer } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useSystemTheme from "../../hooks/useSystemTheme";
import { 
  ArrowLeft, 
  ArrowRight, 
  LogIn, 
  Shield, 
  GraduationCap, 
  Users, 
  Building2, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  Info,
  Building,
  ChevronRight
} from "lucide-react";

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

      // Read from Firestore (Active colleges only)
      const q = query(collection(db, "colleges"), where("status", "==", "active"));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          name: data.name,
          collegeCode: data.collegeCode,
          domain: data.domain
        });
      });

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDocFromServer(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.status === "blocked") {
          setError("Your account is blocked by Admin.");
          await auth.signOut();
          return;
        }
        if (userData.status === "pending") {
          setError("Your registration request is pending approval from your college.");
          await auth.signOut();
          return;
        }

        // Student, Alumni and College Admin must belong to a registered and active college
        if (userData.role === "student" || userData.role === "alumni" || userData.role === "college_admin") {
          if (!userData.collegeId) {
            setError("Your user profile is missing an institutional identifier.");
            await auth.signOut();
            return;
          }
          
          const isDummy = userData.collegeId.toLowerCase() === "dummy_college_01";
          let isCollegeActive = isDummy;
          
          if (!isDummy) {
            let collegeDoc = await getDocFromServer(doc(db, "colleges", userData.collegeId.trim()));
            if (!collegeDoc.exists()) {
              collegeDoc = await getDocFromServer(doc(db, "colleges", userData.collegeId.trim().toUpperCase()));
            }
            if (!collegeDoc.exists()) {
              collegeDoc = await getDocFromServer(doc(db, "colleges", userData.collegeId.trim().toLowerCase()));
            }
            
            if (collegeDoc.exists() && collegeDoc.data()?.status === "active") {
              isCollegeActive = true;
            }
          }
          
          if (!isCollegeActive) {
            setError("Your institution is not registered or is currently suspended on this platform. Please contact support.");
            await auth.signOut();
            return;
          }
        }

        const role = userData.role;
        redirectUser(role);
      } else {
        setError("User profile not found in the system database.");
        await auth.signOut();
      }
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
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const selectedCollegeObj = colleges.find(c => c.collegeCode === selectedCollegeCode);
      
      // 2. Prepare user profile payload
      const baseData = {
        uid: user.uid,
        name: name.trim(),
        email: email.trim(),
        role: signupRole,
        collegeId: selectedCollegeCode,
        collegeName: selectedCollegeObj?.name || selectedCollegeCode,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      let finalData = { ...baseData };
      if (signupRole === "student") {
        finalData = {
          ...finalData,
          rollNo: rollNo.trim(),
          branch: branch.trim(),
          currentYear: currentYear,
          batch: graduationYear.trim()
        };
      } else if (signupRole === "alumni") {
        finalData = {
          ...finalData,
          rollNo: rollNo.trim(),
          branch: branch.trim(),
          batch: graduationYear.trim(),
          company: company.trim(),
          designation: designation.trim(),
          linkedin: linkedin.trim()
        };
      }

      // 3. Write User Profile into Firestore
      await setDoc(doc(db, "users", user.uid), finalData);
      
      // 4. Force auth sign out immediately to prevent auto-login of pending user
      await auth.signOut();

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
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already registered in our system.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters long.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(err.message || "Failed to submit request. Please try again.");
      }
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
    { role: "root_admin", label: "Root Admin", icon: Shield, color: "bg-red-500" },
    { role: "college_admin", label: "College Admin", icon: Building2, color: "bg-blue-500" },
    { role: "alumni", label: "Alumni", icon: Users, color: "bg-purple-500" },
    { role: "student", label: "Student", icon: GraduationCap, color: "bg-ec-accent" },
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
        <div className="my-auto py-6 z-10 relative max-w-[460px]">
          <h2 className="text-3xl font-[800] tracking-tight leading-tight text-white mb-2">
            Secure Gateway to <br />
            Your Campus Network
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed mb-6">
            Welcome to Connect-Karo — a unified professional network connecting students, graduates, and college administrators.
          </p>

          {/* Interactive Bouncing Guide Banner */}
          <div className="flex items-center gap-2.5 mb-6 bg-slate-900/60 border border-slate-800/80 rounded-lg py-2 px-3.5 self-start animate-pulse">
            <Sparkles size={12} className="text-ec-accent shrink-0 animate-bounce" />
            <span className="text-[10.5px] font-medium text-slate-300">
              Interactive Guide: Click any feature below to expand details.
            </span>
          </div>

          {/* Accordion List */}
          <div className="space-y-3.5">
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
                        <Check size={11} className="stroke-[3.5]" />
                      </div>
                      <span className={`font-semibold text-xs transition-colors duration-200 truncate
                        ${isOpen ? "text-white" : "text-slate-300 group-hover:text-white"}`}
                      >
                        {prop.title}
                      </span>
                    </div>
                    
                    <ChevronRight 
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

      {/* ── RIGHT PANE: 50% split form, constrained height fitting without scrollbars ── */}
      <div className="flex flex-col justify-between p-6 md:p-10 xl:p-12 h-full relative bg-ec-root overflow-y-auto lg:overflow-y-hidden">
        
        {/* Subtle Ambient light glow */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-ec-accent/5 to-transparent rounded-full filter blur-[80px] pointer-events-none" />

        {/* Top Switch Row */}
        <div className="flex items-center justify-between w-full mb-6 lg:mb-0 z-10">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-xs font-semibold text-ec-text-sub hover:text-ec-highlight transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} />
            Back to Home
          </button>

          <div className="text-xs">
            {mode === "signup" ? (
              <>
                <span className="text-ec-text-sub mr-1.5">Already registered?</span>
                <button 
                  onClick={() => { setMode("login"); setError(""); }} 
                  className="text-ec-accent hover:text-ec-accent-hover font-bold transition-colors cursor-pointer hover:underline"
                >
                  Sign in &rarr;
                </button>
              </>
            ) : (
              <>
                <span className="text-ec-text-sub mr-1.5">Need portal access?</span>
                <button 
                  onClick={() => { setMode("signup"); setError(""); }} 
                  className="text-ec-accent hover:text-ec-accent-hover font-bold transition-colors cursor-pointer hover:underline"
                >
                  Register &rarr;
                </button>
              </>
            )}
          </div>
        </div>

        {/* Form Container (Fits strictly on screen) */}
        <div className="flex-1 flex flex-col justify-center max-w-[390px] w-full mx-auto my-auto z-10 py-4">
          
          {/* Mobile Logo Brand */}
          <div 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-6 lg:hidden cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-ec-accent flex items-center justify-center font-bold text-white text-sm">
              C
            </div>
            <span className="font-extrabold text-sm tracking-tight text-ec-highlight">
              Connect<span className="text-ec-accent">Karo</span>
            </span>
          </div>

          {signupSuccess ? (
            /* Request Confirmation Screen */
            <div className="surface-card p-6 animate-fade-in-up border border-ec-accent/20 bg-ec-surface/40 backdrop-blur-sm shadow-xl">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-ec-accent/10 border border-ec-accent/20 flex items-center justify-center text-ec-accent mb-4 animate-pulse">
                  <CheckCircle2 size={24} className="stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-ec-highlight mb-1.5">Request Submitted</h3>
                <p className="text-[11px] text-ec-text-sub leading-relaxed mb-5">
                  We've successfully logged your request for <strong className="text-ec-highlight">{email}</strong>. 
                  Administrators at <span className="font-medium text-ec-highlight">{colleges.find(c => c.collegeCode === selectedCollegeCode)?.name || "your college"}</span> will review your academic credentials.
                </p>
                <div className="w-full bg-ec-muted/40 rounded-lg p-3 mb-5 text-left border border-ec-border">
                  <div className="flex gap-2">
                    <Info size={13} className="text-ec-accent mt-0.5 shrink-0" />
                    <p className="text-[10px] text-ec-text-sub leading-normal">
                      Once verified, an onboarding invitation link containing role authorization credentials will be delivered to your registered inbox.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => { setSignupSuccess(false); setMode("login"); }}
                  className="btn-primary w-full text-xs py-3"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          ) : (
            /* Auth / Access Form */
            <div className="animate-fade-in-up">
              <div className="mb-5">
                <h2 className="text-xl font-extrabold text-ec-highlight tracking-tight mb-1">
                  {mode === "signup" ? "Request portal access" : "Sign in to Connect-Karo"}
                </h2>
                <p className="text-[11px] text-ec-text-sub leading-relaxed">
                  {mode === "signup" 
                    ? "Enter your academic credentials to submit an invitation request to your college."
                    : "Access your student dashboard, alumni workspace, or administration tower."
                  }
                </p>
              </div>

              {/* Error Notice */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 border-l-4 border-l-red-500 animate-shake">
                  <p className="text-[11px] text-red-400 font-medium">{error}</p>
                </div>
              )}

              {/* Form Input fields */}
              <form onSubmit={mode === "signup" ? handleRequestAccess : handleRealLogin} className="space-y-3.5">
                
                {mode === "login" ? (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="name@institution.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input text-xs py-2.5"
                        required
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider">Password</label>
                        <a href="#" className="text-[10px] font-semibold text-ec-accent hover:underline">Forgot password?</a>
                      </div>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input text-xs py-2.5"
                        required
                      />
                    </div>
                  </>
                ) : (
                  /* Signup fields wrapper with internal scrolling */
                  <div className="max-h-[300px] md:max-h-[360px] lg:max-h-[260px] xl:max-h-[340px] overflow-y-auto pr-2 space-y-3.5 custom-form-scroll">
                    <style>{`
                      .custom-form-scroll::-webkit-scrollbar {
                        width: 4px;
                      }
                      .custom-form-scroll::-webkit-scrollbar-track {
                        background: transparent;
                      }
                      .custom-form-scroll::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 4px;
                      }
                      .custom-form-scroll::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.2);
                      }
                    `}</style>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input text-xs py-2.5"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="name@institution.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input text-xs py-2.5"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">Choose Password</label>
                      <input
                        type="password"
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input text-xs py-2.5"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">Select College</label>
                      <div className="relative">
                        {collegesLoading ? (
                          <div className="input text-xs py-2.5 pl-9 flex items-center justify-between text-ec-text-sub">
                            <span>Loading active colleges...</span>
                            <div className="w-3.5 h-3.5 border-2 border-ec-accent/30 border-t-ec-accent rounded-full animate-spin" />
                          </div>
                        ) : colleges.length === 0 ? (
                          <div className="input text-xs py-2.5 pl-9 text-red-400 border-red-500/20 bg-red-500/5">
                            No registered colleges found.
                          </div>
                        ) : (
                          <>
                            <select
                              value={selectedCollegeCode}
                              onChange={(e) => setSelectedCollegeCode(e.target.value)}
                              className="input text-xs py-2.5 pl-9 pr-8 bg-ec-root appearance-none cursor-pointer w-full text-ec-highlight font-medium focus:border-ec-accent"
                              required
                            >
                              {colleges.map((c) => (
                                <option key={c.collegeCode} value={c.collegeCode} className="bg-[#0b0f19] text-ec-text">
                                  {c.name} ({c.collegeCode})
                                </option>
                              ))}
                            </select>
                            <Building size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ec-icon" />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ec-text-sub text-xs">&#9662;</div>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">Select Role</label>
                      <div className="relative">
                        <select 
                          value={signupRole}
                          onChange={(e) => setSignupRole(e.target.value)}
                          className="input text-xs py-2.5 pl-9 pr-8 bg-ec-root appearance-none cursor-pointer w-full text-ec-highlight font-medium focus:border-ec-accent"
                          required
                        >
                          <option value="student" className="bg-[#0b0f19] text-ec-text">Student Account</option>
                          <option value="alumni" className="bg-[#0b0f19] text-ec-text">Alumni Account</option>
                        </select>
                        <GraduationCap size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ec-icon" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ec-text-sub text-xs">&#9662;</div>
                      </div>
                    </div>

                    {/* Role-specific sections */}
                    {signupRole === "student" ? (
                      <div className="space-y-3.5 pt-2 border-t border-ec-border/30">
                        <div className="text-[9px] font-extrabold text-ec-accent uppercase tracking-wider">Student Academic Details</div>
                        <div>
                          <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">Roll Number</label>
                          <input
                            type="text"
                            placeholder="e.g. 210123010"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            className="input text-xs py-2.5"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">Branch / Department</label>
                          <input
                            type="text"
                            placeholder="e.g. Computer Science"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="input text-xs py-2.5"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">Current Year</label>
                          <div className="relative">
                            <select
                              value={currentYear}
                              onChange={(e) => setCurrentYear(e.target.value)}
                              className="input text-xs py-2.5 pl-3 pr-8 bg-ec-root appearance-none cursor-pointer w-full text-ec-highlight font-medium focus:border-ec-accent"
                              required
                            >
                              <option value="1st" className="bg-[#0b0f19] text-ec-text">1st Year</option>
                              <option value="2nd" className="bg-[#0b0f19] text-ec-text">2nd Year</option>
                              <option value="3rd" className="bg-[#0b0f19] text-ec-text">3rd Year</option>
                              <option value="4th" className="bg-[#0b0f19] text-ec-text">4th Year</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ec-text-sub text-xs">&#9662;</div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">Graduation Year</label>
                          <input
                            type="number"
                            min="2000"
                            max="2035"
                            placeholder="e.g. 2025"
                            value={graduationYear}
                            onChange={(e) => setGraduationYear(e.target.value)}
                            className="input text-xs py-2.5"
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3.5 pt-2 border-t border-ec-border/30">
                        <div className="text-[9px] font-extrabold text-ec-accent uppercase tracking-wider">Alumni Professional Details</div>
                        <div>
                          <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">Roll Number</label>
                          <input
                            type="text"
                            placeholder="e.g. 210123010"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            className="input text-xs py-2.5"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">Branch / Department</label>
                          <input
                            type="text"
                            placeholder="e.g. Computer Science"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="input text-xs py-2.5"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">Graduation Year</label>
                          <input
                            type="number"
                            min="1950"
                            max="2035"
                            placeholder="e.g. 2020"
                            value={graduationYear}
                            onChange={(e) => setGraduationYear(e.target.value)}
                            className="input text-xs py-2.5"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">Current Company</label>
                          <input
                            type="text"
                            placeholder="e.g. Google"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="input text-xs py-2.5"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">Current Designation</label>
                          <input
                            type="text"
                            placeholder="e.g. Software Engineer"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            className="input text-xs py-2.5"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">LinkedIn Profile URL</label>
                          <input
                            type="url"
                            placeholder="e.g. https://linkedin.com/in/johndoe"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            className="input text-xs py-2.5"
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
                  className="btn-primary w-full text-xs font-bold py-3 mt-1 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : mode === "signup" ? (
                    <>
                      Submit Access Request
                      <ArrowRight size={13} />
                    </>
                  ) : (
                    <>
                      Secure Sign In
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </form>

              {/* Developer Access Box (Available only in Login Mode) */}
              {mode === "login" && (
                <div className="mt-5 border-t border-ec-border/60 pt-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Sparkles size={12} className="text-ec-accent animate-pulse" />
                    <span className="text-[9px] font-[800] text-ec-text-sub uppercase tracking-wider">
                      Developer & Evaluator Portal Access
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {devRoles.map(({ role, label, icon: Icon, color }) => (
                      <button
                        key={role}
                        onClick={() => handleDummyLogin(role)}
                        className="flex items-center gap-2 p-1.5 rounded-lg border border-ec-border/80 bg-ec-surface/40 hover:bg-ec-surface hover:border-ec-accent/40 group transition-all duration-200 cursor-pointer"
                      >
                        <div className={`w-6 h-6 rounded-md ${color} flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-105`}>
                          <Icon size={11} className="stroke-[2.5]" />
                        </div>
                        <div className="text-left min-w-0">
                          <div className="text-[10px] font-bold text-ec-highlight group-hover:text-ec-accent transition-colors truncate">
                            {label}
                          </div>
                          <div className="text-[8.5px] text-ec-text-sub leading-none mt-0.5">
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
        <div className="w-full mt-6 lg:mt-0 flex flex-col sm:flex-row items-center justify-between text-[10px] text-ec-text-sub gap-2 pt-4 border-t border-ec-border/40">
          <span>&copy; 2026 Connect-Karo. All rights reserved.</span>
          <div className="flex gap-3.5">
            <a href="#" className="hover:text-ec-highlight transition-colors">Security</a>
            <a href="#" className="hover:text-ec-highlight transition-colors">Terms</a>
            <a href="#" className="hover:text-ec-highlight transition-colors">Support</a>
          </div>
        </div>
      </div>
      
    </div>
  );
}