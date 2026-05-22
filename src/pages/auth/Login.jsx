import React, { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
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
  
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [signupRole, setSignupRole] = useState("student");
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Stateful index for the collapsible description accordion
  const [openIndex, setOpenIndex] = useState(0); 

  const { dummyLogin } = useAuth();
  const theme = useSystemTheme(); 

  const handleRealLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        redirectUser(role);
      } else {
        setError("User profile not found in the system database.");
      }
    } catch (err) {
      console.error(err);
      setError("Authentication failed. Please verify your portal credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setSignupSuccess(true);
    }, 1000);
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
                  Administrators at <span className="font-medium text-ec-highlight">{college || "your college"}</span> will review your academic credentials.
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
                
                {mode === "signup" && (
                  <>
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
                      <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">Institution / College Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="State Technical University"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          className="input text-xs py-2.5 pl-9"
                          required
                        />
                        <Building size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ec-icon" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">Select Role</label>
                      <select 
                        value={signupRole}
                        onChange={(e) => setSignupRole(e.target.value)}
                        className="input text-xs py-2.5 bg-ec-root appearance-none cursor-pointer"
                      >
                        <option value="student">Student Account</option>
                        <option value="alumni">Alumni Account</option>
                      </select>
                    </div>
                  </>
                )}

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

                {mode === "login" && (
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
                )}

                <button
                  type="submit"
                  disabled={loading}
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