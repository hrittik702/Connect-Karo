import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Globe, 
  Hash, 
  Mail, 
  Lock, 
  RefreshCw, 
  Copy, 
  Check, 
  ShieldAlert, 
  Save, 
  ArrowLeft,
  ToggleLeft,
  ToggleRight,
  Sparkles
} from 'lucide-react';

// Firebase Configurations & SDK Tools
import { db, firebaseConfig } from '../../../firebase/config'; 
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function AddCollege() {
  const navigate = useNavigate();

  // 1. Form Core Fields State
  const [collegeName, setCollegeName] = useState('');
  const [domain, setDomain] = useState('');
  const [collegeCode, setCollegeCode] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('free');

  // 2. SaaS Feature Flags Toggles State
  const [features, setFeatures] = useState({
    jobBoard: true,
    mentorship: true,
    alumniDirectory: true,
  });

  // 3. Operational Infrastructure States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordCopied, setPasswordCopied] = useState(false);

  // Feature Flag Toggle Helper
  const toggleFeature = (key) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Enterprise Password Generator Utility
  const generateSecurePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAdminPassword(password);
    if (error.includes('Password')) setError('');
  };

  // Copy Password Utility
  const copyPasswordToClipboard = async () => {
    if (!adminPassword) return;
    try {
      await navigator.clipboard.writeText(adminPassword);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard Error:", err);
    }
  };

  // 100% Production-Ready Form Submission Engine
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Core Validation Boundary Logs
    if (!collegeName || !domain || !collegeCode || !adminEmail || !adminPassword) {
      setError('Kripya saari mandatory fields ko sahi se fill karein.');
      return;
    }

    // Domain validation regex rule
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      setError('Invalid domain format! Udaharan ke liye sahi format: recabn.ac.in');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    let secondaryApp;

    try {
      // Step 1: Initialize Secondary App Instance for background auth injection
      const uniqueInstanceName = `SecondaryApp_${Date.now()}`;
      secondaryApp = initializeApp(firebaseConfig, uniqueInstanceName);
      const secondaryAuth = getAuth(secondaryApp);

      // Step 2: Register College Admin User Credentials safely
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth, 
        adminEmail, 
        adminPassword
      );
      const adminUid = userCredential.user.uid;

      // Step 3: Write to Master 'users' Auth Node Collection
      const userDocRef = doc(db, 'users', adminUid);
      await setDoc(userDocRef, {
        email: adminEmail.toLowerCase().trim(),
        role: 'college_admin',
        status: 'active',
        createdAt: serverTimestamp(),
        lastLogin: null
      });

      // Step 4: Write to Master 'colleges' Config Node Collection
      const customCollegeId = `clg_${collegeCode.toLowerCase().trim()}_${Date.now().toString().slice(-4)}`;
      const collegeDocRef = doc(db, 'colleges', customCollegeId);
      
      // Calculate automated plan expiration time boundary (e.g., 1 Year standard tier boundary)
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);

      await setDoc(collegeDocRef, {
        name: collegeName.trim(),
        domain: domain.toLowerCase().trim(),
        collegeCode: collegeCode.toUpperCase().trim(),
        adminUid: adminUid,
        status: 'active',
        features: {
          jobBoard: features.jobBoard,
          mentorship: features.mentorship,
          alumniDirectory: features.alumniDirectory
        },
        subscription: {
          plan: subscriptionPlan,
          expiresAt: expirationDate
        },
        metrics: {
          totalStudents: 0,
          totalAlumni: 0
        },
        createdAt: serverTimestamp()
      });

      // Pipeline execution completely successful
      setSuccess(`College '${collegeName}' successfully onboard kar diya gaya hai!`);
      
      // Clear form inputs safely
      setCollegeName('');
      setDomain('');
      setCollegeCode('');
      setAdminEmail('');
      setAdminPassword('');
      
    } catch (err) {
      console.error("Critical Onboarding Failure Pipeline:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Yeh Admin Email id pehle se system mein registered hai.');
      } else {
        setError(`Database registration pipeline block ho gayi: ${err.message}`);
      }
    } finally {
      // Step 5: Critical Memory Leak Cleanup - Kill secondary instance immediately
      if (secondaryApp) {
        try {
          await deleteApp(secondaryApp);
        } catch (cleanupErr) {
          console.error("Secondary app termination block error:", cleanupErr);
        }
      }
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Upper Navigation & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ec-border pb-5">
        <div>
          <button 
            onClick={() => navigate('/admin/colleges')}
            className="flex items-center gap-1.5 text-xs text-ec-text-sub hover:text-ec-accent mb-2 transition-colors group"
          >
            <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
            Back to College List
          </button>
          <h2 className="text-xl font-bold text-ec-highlight tracking-tight flex items-center gap-2">
            <Building2 className="text-ec-accent" size={22} />
            Onboard New Institution
          </h2>
          <p className="text-xs text-ec-text-sub mt-0.5">Platform multi-tenant node par naya college account link karein.</p>
        </div>
      </div>

      {/* Global State Notifications Deck */}
      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-sm text-red-400">
          <ShieldAlert size={18} className="shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-ec-accent/10 border border-ec-accent/20 rounded-xl flex items-start gap-3 text-sm text-ec-accent">
          <Sparkles size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold leading-none mb-1">Registration Complete!</p>
            <p className="text-xs opacity-90">{success}</p>
          </div>
        </div>
      )}

      {/* Main Execution Split Panel Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Inputs Fields Deck */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Institutional Core Parameters */}
          <div className="surface-card p-6 border border-ec-border rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-ec-highlight border-b border-ec-border/60 pb-2 uppercase tracking-wider text-xs opacity-75">
              1. Institutional Specifications
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-ec-text-sub">College / University Name *</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3 top-3.5 text-ec-text-sub/50" />
                  <input 
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g., Rajkiya Engineering College"
                    className="w-full pl-10 pr-4 py-2.5 bg-ec-root/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent focus:ring-1 focus:ring-ec-accent/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ec-text-sub">Official Domain *</label>
                <div className="relative">
                  <Globe size={16} className="absolute left-3 top-3.5 text-ec-text-sub/50" />
                  <input 
                    type="text"
                    required
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g., recabn.ac.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-ec-root/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent focus:ring-1 focus:ring-ec-accent/20 transition-all font-medium font-mono"
                  />
                </div>
                <span className="text-[10px] text-ec-text-sub block opacity-60 pl-1">Isi domain ke email IDs handle honge.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ec-text-sub">College Code / AICTE Code *</label>
                <div className="relative">
                  <Hash size={16} className="absolute left-3 top-3.5 text-ec-text-sub/50" />
                  <input 
                    type="text"
                    required
                    value={collegeCode}
                    onChange={(e) => setCollegeCode(e.target.value)}
                    placeholder="e.g., RECABN84"
                    className="w-full pl-10 pr-4 py-2.5 bg-ec-root/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent focus:ring-1 focus:ring-ec-accent/20 transition-all font-medium font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Administrative Control Credentials */}
          <div className="surface-card p-6 border border-ec-border rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-ec-highlight border-b border-ec-border/60 pb-2 uppercase tracking-wider text-xs opacity-75">
              2. Administrative Management Keys
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-ec-text-sub">College Master Admin Email *</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3.5 text-ec-text-sub/50" />
                  <input 
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="e.g., admin@recabn.ac.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-ec-root/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent focus:ring-1 focus:ring-ec-accent/20 transition-all font-medium font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-ec-text-sub">Secure Account Access Password *</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Lock size={16} className="absolute left-3 top-3.5 text-ec-text-sub/50" />
                    <input 
                      type="text"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Min 8 characters alpha-numeric"
                      className="w-full pl-10 pr-10 py-2.5 bg-ec-root/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent focus:ring-1 focus:ring-ec-accent/20 transition-all font-medium font-mono"
                    />
                    {adminPassword && (
                      <button
                        type="button"
                        onClick={copyPasswordToClipboard}
                        className="absolute right-3 top-3 text-ec-text-sub hover:text-ec-accent transition-colors p-0.5"
                        title="Copy Password"
                      >
                        {passwordCopied ? <Check size={16} className="text-ec-accent" /> : <Copy size={16} />}
                      </button>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={generateSecurePassword}
                    className="px-3 bg-ec-surface border border-ec-border hover:border-ec-accent hover:bg-ec-accent/10 rounded-lg text-ec-text-sub hover:text-ec-accent text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0"
                  >
                    <RefreshCw size={14} />
                    Auto Gen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: SaaS Tier & Feature Triggers Panel */}
        <div className="space-y-6">
          
          {/* SaaS Plan Selector Panel */}
          <div className="surface-card p-6 border border-ec-border rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-ec-highlight border-b border-ec-border/60 pb-2 uppercase tracking-wider text-xs opacity-75">
              3. Service Plan Matrix
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ec-text-sub">Subscription Tier Selector</label>
              <select 
                value={subscriptionPlan}
                onChange={(e) => setSubscriptionPlan(e.target.value)}
                className="w-full px-3 py-2.5 bg-ec-root border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent transition-all font-semibold"
              >
                <option value="free">Basic Trial Deployment</option>
                <option value="premium">Premium Commercial Network</option>
                <option value="enterprise">Custom Enterprise Cluster</option>
              </select>
            </div>
          </div>

          {/* SaaS Feature Flags Switching Panel */}
          <div className="surface-card p-6 border border-ec-border rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-ec-highlight border-b border-ec-border/60 pb-2 uppercase tracking-wider text-xs opacity-75">
              4. Operational Flags
            </h3>

            <div className="space-y-3.5 pt-1">
              {/* Feature Toggle Row 1 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-ec-root/40 border border-ec-border/40">
                <div>
                  <p className="text-xs font-bold text-ec-highlight">Job Portal Engine</p>
                  <p className="text-[10px] text-ec-text-sub">Alumni job postings & referrals.</p>
                </div>
                <button type="button" onClick={() => toggleFeature('jobBoard')} className="text-ec-accent transition-colors">
                  {features.jobBoard ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-ec-text-sub/40" />}
                </button>
              </div>

              {/* Feature Toggle Row 2 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-ec-root/40 border border-ec-border/40">
                <div>
                  <p className="text-xs font-bold text-ec-highlight">Mentorship Grid</p>
                  <p className="text-[10px] text-ec-text-sub">1-on-1 scheduled network maps.</p>
                </div>
                <button type="button" onClick={() => toggleFeature('mentorship')} className="text-ec-accent transition-colors">
                  {features.mentorship ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-ec-text-sub/40" />}
                </button>
              </div>

              {/* Feature Toggle Row 3 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-ec-root/40 border border-ec-border/40">
                <div>
                  <p className="text-xs font-bold text-ec-highlight">Alumni Directory</p>
                  <p className="text-[10px] text-ec-text-sub">Global verified identity matrix indexing.</p>
                </div>
                <button type="button" onClick={() => toggleFeature('alumniDirectory')} className="text-ec-accent transition-colors">
                  {features.alumniDirectory ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-ec-text-sub/40" />}
                </button>
              </div>
            </div>
          </div>

          {/* Submission Primary Controls Trigger */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-ec-accent hover:bg-emerald-600 disabled:bg-ec-accent/50 text-ec-root font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-ec-accent/10 select-none cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Onboarding Cluster...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Execute Account Deployment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}