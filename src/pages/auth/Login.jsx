import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useSystemTheme from "../../hooks/useSystemTheme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const { dummyLogin } = useAuth();
  const theme = useSystemTheme();

  // Dynamic Colors based on System Theme
  const isDark = theme === 'dark';
  const colors = {
    background: isDark ? '#0f172a' : '#f8fafc',
    textPrimary: isDark ? '#f1f5f9' : '#0f172a',
    textSecondary: isDark ? '#94a3b8' : '#64748b',
    cardBg: isDark ? '#1e293b' : '#ffffff',
    cardBorder: isDark ? '#334155' : '#e2e8f0',
    primaryBlue: '#3b82f6',
    hoverBlue: '#2563eb',
    inputBg: isDark ? '#0f172a' : '#f1f5f9',
    errorText: '#ef4444'
  };

  const handleRealLogin = async (e) => {
    e.preventDefault();
    setError("");
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

  // Internal CSS for animations and focus states
  const internalStyles = `
    .animate-fade-in {
      opacity: 0;
      transform: translateY(20px);
      animation: fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    @keyframes fadeIn {
      to { opacity: 1; transform: translateY(0); }
    }
    .custom-input:focus {
      outline: none;
      border-color: ${colors.primaryBlue} !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }
    .btn-primary {
      transition: background-color 0.2s ease, transform 0.1s ease;
    }
    .btn-primary:active {
      transform: scale(0.98);
    }
    .dev-btn {
      transition: all 0.2s ease;
    }
    .dev-btn:hover {
      border-color: ${colors.primaryBlue} !important;
      color: ${colors.primaryBlue} !important;
    }
    .back-link {
      transition: color 0.2s ease;
    }
    .back-link:hover {
      color: ${colors.primaryBlue} !important;
    }
  `;

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", transition: 'background-color 0.4s ease' }}>
      <style>{internalStyles}</style>

      <div className="animate-fade-in" style={{ backgroundColor: colors.cardBg, padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', border: `1px solid ${colors.cardBorder}`, boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.05)', position: 'relative' }}>
        
        {/* Back to Home Link */}
        <button 
          onClick={() => navigate('/')} 
          className="back-link"
          style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: colors.textSecondary, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          &larr; Home
        </button>

        <div style={{ textAlign: 'center', marginTop: '15px', marginBottom: '30px' }}>
          <h2 style={{ color: colors.textPrimary, fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Access Portal</h2>
          <p style={{ color: colors.textSecondary, fontSize: '14px' }}>Enter your credentials to continue</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeft: `3px solid ${colors.errorText}`, padding: '10px 15px', marginBottom: '20px', borderRadius: '4px' }}>
            <p style={{ color: colors.errorText, fontSize: '13px', margin: 0 }}>{error}</p>
          </div>
        )}
        
        {/* Real Authentication Form */}
        <form onSubmit={handleRealLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: colors.textSecondary, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@institution.edu" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="custom-input"
              style={{ width: '100%', padding: '12px 14px', backgroundColor: colors.inputBg, border: `1px solid ${colors.cardBorder}`, color: colors.textPrimary, borderRadius: '6px', boxSizing: 'border-box', transition: 'all 0.2s ease' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', color: colors.textSecondary, fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="custom-input"
              style={{ width: '100%', padding: '12px 14px', backgroundColor: colors.inputBg, border: `1px solid ${colors.cardBorder}`, color: colors.textPrimary, borderRadius: '6px', boxSizing: 'border-box', transition: 'all 0.2s ease' }}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary"
            style={{ width: '100%', padding: '14px', backgroundColor: colors.primaryBlue, color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '8px', fontSize: '15px' }}
          >
            Secure Login
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '30px 0', color: colors.textSecondary }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: colors.cardBorder }}></div>
          <span style={{ padding: '0 10px', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Developer Access</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: colors.cardBorder }}></div>
        </div>

        {/* Development Environment Access */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button onClick={() => handleDummyLogin("root_admin")} className="dev-btn" style={{ padding: '10px', backgroundColor: 'transparent', color: colors.textSecondary, border: `1px solid ${colors.cardBorder}`, borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
            Root Admin
          </button>
          <button onClick={() => handleDummyLogin("college_admin")} className="dev-btn" style={{ padding: '10px', backgroundColor: 'transparent', color: colors.textSecondary, border: `1px solid ${colors.cardBorder}`, borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
            College Admin
          </button>
          <button onClick={() => handleDummyLogin("alumni")} className="dev-btn" style={{ padding: '10px', backgroundColor: 'transparent', color: colors.textSecondary, border: `1px solid ${colors.cardBorder}`, borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
            Alumni
          </button>
          <button onClick={() => handleDummyLogin("student")} className="dev-btn" style={{ padding: '10px', backgroundColor: 'transparent', color: colors.textSecondary, border: `1px solid ${colors.cardBorder}`, borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
            Student
          </button>
        </div>

      </div>
    </div>
  );
}