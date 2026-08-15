import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    console.log("Initiating authentication handshake hook to the DB engine...");

    // Simulating your Supabase authentication loop & role flag check
    setTimeout(() => {
      setIsLoading(false);
      console.log("Authorization successful! Role verified as 'alumni'. Caching tokens.");
      
      // Lock context tokens and switch view location directly to the dashboard
      navigate('/alumni/dashboard');
    }, 800); 
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--ec-root))] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Decorative Gritty Dark Background Grid/Glow Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgb(var(--ec-accent)/0.05),transparent_45%)] select-none pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl select-none pointer-events-none" />

      {/* ── CENTRAL MINIMALISTIC PORTAL FRAME CONTAINER ── */}
      <div className="w-full max-w-md transition-all duration-300">
        
        {/* Brand Identity Branding Header Block */}
        <div className="text-center mb-6 space-y-2 select-none animate-scale-in">
          <div className="w-12 h-12 rounded-xl bg-[rgb(var(--ec-accent))] flex items-center justify-center text-white font-black text-xl mx-auto shadow-md shadow-[rgb(var(--ec-accent)/0.2)]">
            <span>CK</span>
          </div>
          <h1 className="text-xl font-black text-ec-highlight tracking-tight">Connect-Karo Platform</h1>
          <p className="text-xs text-[rgb(var(--ec-text-sub))] font-medium">Official Gateway Access Portal</p>
        </div>

        {/* ── FORM SURFACE CARD WRAPPER ── */}
        <div 
          className="surface-card bg-[rgb(var(--ec-surface))] border border-[rgb(var(--ec-border))] p-6 rounded-[12px] shadow-lg shadow-black/20 relative overflow-hidden group hover:border-[rgb(var(--ec-accent)/0.3)] hover:-translate-y-0.5 transition-all duration-300"
          style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }}
        >
          {/* Vibrant Top Accent Line Accent Boundary */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[rgb(var(--ec-accent))] to-emerald-400" />

          <div className="mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[rgb(var(--ec-text-sub))] flex items-center gap-1.5 select-none">
              <ShieldCheck size={14} className="text-[rgb(var(--ec-accent))]" />
              Alumni Verification Secure Sign-In
            </h2>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Input Field A: User Identity Email Account */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[rgb(var(--ec-text-sub))] uppercase tracking-wider select-none">
                Official Registered Email
              </label>
              <div className="relative flex items-center">
                <Mail size={14} className="absolute left-3.5 text-[rgb(var(--ec-icon))]" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@rec-alumni.org" 
                  className="input w-full pl-10 pr-4 py-2.5 text-xs bg-[rgb(var(--ec-root))] text-ec-text border border-[rgb(var(--ec-border))] rounded-md focus:border-[rgb(var(--ec-accent))] focus:ring-4 focus:ring-[rgb(var(--ec-accent)/0.12)] outline-none transition-all duration-200" 
                />
              </div>
            </div>

            {/* Input Field B: Security Core Access Password Token */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-[rgb(var(--ec-text-sub))] uppercase tracking-wider select-none">
                  Security Access Password
                </label>
                <a href="#forgot" className="text-[10px] text-[rgb(var(--ec-accent))] hover:text-[rgb(var(--ec-accent-hover))] font-bold transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative flex items-center">
                <Lock size={14} className="absolute left-3.5 text-[rgb(var(--ec-icon))]" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(password_event) => setPassword(password_event.target.value)}
                  placeholder="••••••••••••" 
                  className="input w-full pl-10 pr-4 py-2.5 text-xs bg-[rgb(var(--ec-root))] text-ec-text border border-[rgb(var(--ec-border))] rounded-md focus:border-[rgb(var(--ec-accent))] focus:ring-4 focus:ring-[rgb(var(--ec-accent)/0.12)] outline-none transition-all duration-200" 
                />
              </div>
            </div>

            {/* Form Structural Separator Spacer */}
            <div className="pt-2">
              
              {/* Primary Sign-In Submission Push Trigger Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-primary w-full text-xs font-bold text-white bg-[rgb(var(--ec-accent))] hover:bg-[rgb(var(--ec-accent-hover))] py-2.5 rounded-md shadow-sm shadow-[rgb(var(--ec-accent)/0.15)] flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-[1px] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
              >
                {isLoading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>Verify Credentials & Enter Workspace</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

            </div>

          </form>
        </div>

        {/* Footer Support Identity Notice */}
        <div className="text-center mt-4 select-none animate-scale-in">
          <p className="text-[10px] text-[rgb(var(--ec-text-sub))] font-medium">
            Authorized Personnel Only. Core connections encrypted via structural RLS protocol policies.
          </p>
        </div>

      </div>

    </div>
  );
}