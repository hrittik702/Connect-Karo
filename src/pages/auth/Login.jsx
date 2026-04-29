import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useSystemTheme from "../../hooks/useSystemTheme";
import { ArrowLeft, LogIn, Shield, GraduationCap, Users, Building2, Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
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
        setError("User profile not found in the system.");
      }
    } catch (err) {
      setError("Authentication failed. Please verify your credentials.");
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
    { role: "root_admin", label: "Root Admin", icon: Shield, gradient: "from-red-500 to-orange-400" },
    { role: "college_admin", label: "College Admin", icon: Building2, gradient: "from-blue-500 to-cyan-400" },
    { role: "alumni", label: "Alumni", icon: Users, gradient: "from-purple-500 to-pink-400" },
    { role: "student", label: "Student", icon: GraduationCap, gradient: "from-green-500 to-emerald-400" },
  ];

  return (
    <div className="relative min-h-screen bg-ec-root text-ec-text overflow-hidden font-inter flex items-center justify-center p-6">
      
      {/* Ambient Background */}
      <div className="ambient-mesh" />
      <div className="noise-overlay" />

      {/* Extra orbs */}
      <div className="fixed top-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-ec-accent/15 blur-[140px] animate-float-orb pointer-events-none" />
      <div className="fixed bottom-[10%] right-[15%] w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[120px] animate-float-orb-delayed pointer-events-none" />

      {/* Login Card — Liquid Glass */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        
        {/* Back Button — Glass */}
        <button
          onClick={() => navigate('/')}
          className="glass-btn mb-6 text-sm py-2 px-4"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        {/* Main Card */}
        <div className="glass-card p-8 md:p-10" style={{ borderRadius: '28px' }}>
          <div className="relative z-10">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-ec-accent to-indigo-400 shadow-lg shadow-ec-accent/25 mb-5">
                <LogIn size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-ec-highlight mb-2">Access Portal</h2>
              <p className="text-sm text-ec-text-sub">Enter your credentials to continue</p>
            </div>

            {/* Error — Glass */}
            {error && (
              <div className="glass rounded-xl p-4 mb-6 border-l-4 border-red-500/80 animate-shake" style={{ borderRadius: '14px' }}>
                <p className="text-sm text-red-400 font-medium">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleRealLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-ec-text-sub mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="name@institution.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ec-text-sub mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="glass-btn-primary w-full text-base py-4 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Secure Login
                    <ArrowLeft size={18} className="rotate-180" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-ec-border/30" />
              <div className="glass-badge text-[11px] py-1 px-3 uppercase tracking-widest">
                <Sparkles size={10} />
                Dev Access
              </div>
              <div className="flex-1 h-px bg-ec-border/30" />
            </div>

            {/* Dev Login Buttons — Glass */}
            <div className="grid grid-cols-2 gap-3">
              {devRoles.map(({ role, label, icon: Icon, gradient }) => (
                <button
                  key={role}
                  onClick={() => handleDummyLogin(role)}
                  className="glass group p-3 rounded-2xl flex items-center gap-3 cursor-pointer hover:border-ec-accent/30 transition-all duration-300"
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold text-ec-text-sub group-hover:text-ec-highlight transition-colors">
                    {label}
                  </span>
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}