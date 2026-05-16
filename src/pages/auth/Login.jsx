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
    { role: "root_admin", label: "Root Admin", icon: Shield, color: "bg-red-500" },
    { role: "college_admin", label: "College Admin", icon: Building2, color: "bg-blue-500" },
    { role: "alumni", label: "Alumni", icon: Users, color: "bg-purple-500" },
    { role: "student", label: "Student", icon: GraduationCap, color: "bg-ec-accent" },
  ];

  return (
    <div className="relative min-h-screen bg-ec-root text-ec-text overflow-hidden flex items-center justify-center p-6">
      
      {/* Subtle ambient glow */}
      <div className="ambient-glow" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="btn mb-5 text-sm py-2 px-3.5"
        >
          <ArrowLeft size={15} className="text-ec-icon" />
          Back to Home
        </button>

        {/* Main Card */}
        <div className="surface-card p-7 md:p-9">

          {/* Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-ec-accent mb-4">
              <LogIn size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-ec-highlight mb-1.5">Access Portal</h2>
            <p className="text-sm text-ec-text-sub">Enter your credentials to continue</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3.5 mb-5 border-l-4 border-l-red-500 animate-shake">
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleRealLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ec-text-sub mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="name@institution.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ec-text-sub mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-sm py-3.5 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Secure Login
                  <ArrowLeft size={16} className="rotate-180" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-ec-border" />
            <div className="badge text-[11px] py-1 px-2.5 uppercase tracking-widest">
              <Sparkles size={10} />
              Dev Access
            </div>
            <div className="flex-1 h-px bg-ec-border" />
          </div>

          {/* Dev Login Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            {devRoles.map(({ role, label, icon: Icon, color }) => (
              <button
                key={role}
                onClick={() => handleDummyLogin(role)}
                className="surface group p-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer hover:border-ec-accent/30 transition-all duration-200"
              >
                <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                  <Icon size={15} className="text-white" />
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
  );
}