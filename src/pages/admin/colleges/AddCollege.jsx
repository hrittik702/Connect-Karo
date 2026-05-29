import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Globe, 
  Hash, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';

export default function AddCollege() {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    collegeCode: '',
    domain: '',
    adminEmail: '',
    adminPhone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: '' });

  // ── CUSTOM TOAST NOTIFICATION ──
  const showFeedback = (msg, type = 'success') => {
    setFeedback({ show: true, message: msg, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: '' }), 4000);
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── AUTO-SANITIZATION & VALIDATION ──
  const cleanDomainString = (rawDomain) => {
    return rawDomain
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, '') 
      .replace(/^www\./, '')       
      .replace(/\/.*$/, '');       
  };

  const validateDomain = (domain) => {
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  // ── FORM SUBMISSION PIPELINE ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Password Pre-Validation Checks
    if (formData.password.length < 6) {
      showFeedback("Password must be at least 6 characters long!", "error");
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showFeedback("Passwords do not match!", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      // 2. Sanitize Inputs
      const sanitizedDomain = cleanDomainString(formData.domain);
      const sanitizedCode = formData.collegeCode.toUpperCase().trim();
      const sanitizedEmail = formData.adminEmail.toLowerCase().trim();

      // 3. Validate Domain Format
      if (!validateDomain(sanitizedDomain)) {
        showFeedback("Invalid domain format! Example: recabn.ac.in", "error");
        setIsSubmitting(false);
        return;
      }

      // 4. Multi-Layer Duplicate Verification
      const { data: dupDomain } = await supabase
        .from('colleges')
        .select('id')
        .eq('domain', sanitizedDomain);
      
      if (dupDomain && dupDomain.length > 0) {
        showFeedback(`Domain '${sanitizedDomain}' is already registered!`, "error");
        setIsSubmitting(false);
        return;
      }

      const { data: dupCode } = await supabase
        .from('colleges')
        .select('id')
        .eq('id', sanitizedCode);
      
      if (dupCode && dupCode.length > 0) {
        showFeedback(`College Code '${sanitizedCode}' is already in use!`, "error");
        setIsSubmitting(false);
        return;
      }

      const { data: dupEmail } = await supabase
        .from('colleges')
        .select('id')
        .eq('admin_email', sanitizedEmail);
      
      if (dupEmail && dupEmail.length > 0) {
        showFeedback(`Admin Email '${sanitizedEmail}' is already registered!`, "error");
        setIsSubmitting(false);
        return;
      }

      // 5. Build Master Payload for Database Provisioning
      const newCollegeData = {
        id: sanitizedCode,
        name: formData.name.trim(),
        domain: sanitizedDomain,
        admin_email: sanitizedEmail,
        admin_phone: formData.adminPhone.trim(),
        address: formData.address.trim(),
        status: 'active',
        billing_plan: 'Free',
        metrics: {
          totalStudents: 0,
          totalAlumni: 0
        }
      };

      // 6. Execute Write Operation for College table first (admin_uid is initially null)
      // This is crucial because the signup trigger has a foreign key constraint requiring the college to exist first!
      const { error: colErr } = await supabase
        .from('colleges')
        .insert([newCollegeData]);

      if (colErr) {
        throw colErr;
      }

      // 7. REAL AUTHENTICATION INJECTION (Secondary Supabase Client)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const secondarySupabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
          storageKey: 'sb-secondary-auth-token',
          storage: {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {}
          }
        }
      });

      // Sign up secondary college admin user
      const { data: authData, error: authError } = await secondarySupabase.auth.signUp({
        email: sanitizedEmail,
        password: formData.password,
        options: {
          data: {
            name: formData.name.trim() + ' Admin',
            role: 'college_admin',
            collegeId: sanitizedCode,
            collegeName: formData.name.trim(),
            status: 'approved'
          }
        }
      });

      if (authError) {
        // Rollback college creation
        await supabase.from('colleges').delete().eq('id', sanitizedCode);
        showFeedback(`Auth Error: ${authError.message}`, "error");
        setIsSubmitting(false);
        return;
      }

      if (!authData || !authData.user) {
        // Rollback college creation
        await supabase.from('colleges').delete().eq('id', sanitizedCode);
        showFeedback("Auth Error: This email is already registered. Please use a different admin email.", "error");
        setIsSubmitting(false);
        return;
      }

      // 8. Update college administrative UID now that user is successfully registered
      const { error: updateErr } = await supabase
        .from('colleges')
        .update({ admin_uid: authData.user.id })
        .eq('id', sanitizedCode);

      if (updateErr) {
        throw updateErr;
      }

      // 9. Success Orchestration
      showFeedback("Institution and credentials provisioned successfully!", "success");
      setFormData({ name: '', collegeCode: '', domain: '', adminEmail: '', adminPhone: '', address: '', password: '', confirmPassword: '' });
      
      setTimeout(() => navigate('/admin/colleges'), 1500);

    } catch (error) {
      console.error("Critical Provisioning Error:", error);
      showFeedback("A structural database write error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12 relative">
      
      {/* Custom Toast Feedback */}
      {feedback.show && (
        <div className={`fixed bottom-8 right-8 z-[200] px-5 py-3.5 rounded-xl flex items-center gap-3 text-sm font-bold shadow-2xl animate-in slide-in-from-bottom-5 border backdrop-blur-md ${
          feedback.type === 'success' 
            ? 'bg-[#0b0f19]/90 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10' 
            : 'bg-[#0b0f19]/90 text-red-400 border-red-500/30 shadow-red-500/10'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          {feedback.message}
        </div>
      )}

      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-ec-border pb-5">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => navigate('/admin/colleges')}
            className="p-2 rounded-lg bg-ec-surface border border-ec-border text-ec-text-sub hover:text-ec-highlight hover:border-ec-accent/50 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-ec-highlight tracking-tight flex items-center gap-2">
              <Building2 className="text-ec-accent" size={22} />
              Onboard New Institution
            </h2>
            <p className="text-xs text-ec-text-sub mt-1">Register institutional nodes and configure secure access credentials.</p>
          </div>
        </div>
      </div>

      {/* Master Form */}
      <form onSubmit={handleSubmit} className="surface-card border border-ec-border rounded-xl p-6 lg:p-8 space-y-8">
        
        {/* Section 1: Institutional Core Mapping */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-ec-accent uppercase tracking-wider border-b border-ec-border/40 pb-2">1. Identity & Routing Mapping</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[11px] font-bold text-ec-text-sub uppercase tracking-wide">Institution Name</label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-3 text-ec-text-sub/50" />
                <input 
                  type="text" required name="name" value={formData.name} onChange={handleChange}
                  placeholder="e.g., Rajkiya Engineering College"
                  className="w-full pl-10 pr-4 py-2.5 bg-ec-root/60 border border-ec-border rounded-lg text-[13px] text-ec-text outline-none focus:border-ec-accent transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-ec-text-sub uppercase tracking-wide">Primary Domain</label>
              <div className="relative">
                <Globe size={16} className="absolute left-3 top-3 text-ec-text-sub/50" />
                <input 
                  type="text" required name="domain" value={formData.domain} onChange={handleChange}
                  placeholder="e.g., recabn.ac.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-ec-root/60 border border-ec-border rounded-lg text-[13px] text-ec-text outline-none focus:border-ec-accent transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-ec-text-sub uppercase tracking-wide">Institution Code</label>
              <div className="relative">
                <Hash size={16} className="absolute left-3 top-3 text-ec-text-sub/50" />
                <input 
                  type="text" required name="collegeCode" value={formData.collegeCode} onChange={handleChange}
                  placeholder="e.g., RECABN"
                  className="w-full pl-10 pr-4 py-2.5 bg-ec-root/60 border border-ec-border rounded-lg text-[13px] text-ec-text outline-none focus:border-ec-accent transition-all font-medium uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Security & Access Management */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-ec-accent uppercase tracking-wider border-b border-ec-border/40 pb-2">2. Secure Identity Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-ec-text-sub uppercase tracking-wide">Root Admin Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-ec-text-sub/50" />
                <input 
                  type="email" required name="adminEmail" value={formData.adminEmail} onChange={handleChange}
                  placeholder="e.g., admin@recabn.ac.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-ec-root/60 border border-ec-border rounded-lg text-[13px] text-ec-text outline-none focus:border-ec-accent transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-ec-text-sub uppercase tracking-wide">Contact Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-3 text-ec-text-sub/50" />
                <input 
                  type="tel" required name="adminPhone" value={formData.adminPhone} onChange={handleChange}
                  placeholder="e.g., +91 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 bg-ec-root/60 border border-ec-border rounded-lg text-[13px] text-ec-text outline-none focus:border-ec-accent transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 relative">
              <label className="text-[11px] font-bold text-ec-text-sub uppercase tracking-wide">Access Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-ec-text-sub/50" />
                <input 
                  type={showPassword ? "text" : "password"} required name="password" value={formData.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-ec-root/60 border border-ec-border rounded-lg text-[13px] text-ec-text outline-none focus:border-ec-accent transition-all font-medium"
                />
                <button 
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-ec-text-sub/50 hover:text-ec-highlight transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-ec-text-sub uppercase tracking-wide">Confirm Access Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-ec-text-sub/50" />
                <input 
                  type={showPassword ? "text" : "password"} required name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-ec-root/60 border border-ec-border rounded-lg text-[13px] text-ec-text outline-none focus:border-ec-accent transition-all font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Localization Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-ec-accent uppercase tracking-wider border-b border-ec-border/40 pb-2">3. Physical Deployment Bounds</h3>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-ec-text-sub uppercase tracking-wide">Physical Campus Address</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-ec-text-sub/50" />
              <textarea 
                required name="address" rows={3} value={formData.address} onChange={handleChange}
                placeholder="Enter complete institutional address..."
                className="w-full pl-10 pr-4 py-2.5 bg-ec-root/60 border border-ec-border rounded-lg text-[13px] text-ec-text outline-none focus:border-ec-accent transition-all font-medium resize-none"
              />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-5 border-t border-ec-border flex justify-end gap-3">
          <button 
            type="button" onClick={() => navigate('/admin/colleges')}
            className="px-5 py-2.5 text-[13px] font-bold text-ec-text-sub hover:text-white bg-ec-surface border border-ec-border hover:bg-ec-muted rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" disabled={isSubmitting}
            className="px-6 py-2.5 text-[13px] font-bold text-white bg-ec-accent hover:bg-ec-accent-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-lg shadow-ec-accent/10 flex items-center gap-2"
          >
            {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            {isSubmitting ? 'Provisioning Node...' : 'Register Institution'}
          </button>
        </div>
      </form>

    </div>
  );
}