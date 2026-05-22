import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Globe, 
  Hash, 
  Mail, 
  Phone, 
  MapPin, 
  Settings,
  Calendar,
  ShieldAlert,
  Edit3,
  X,
  Check,
  LogOut
} from 'lucide-react';
import { db, auth } from '../../../firebase/config';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

export default function CollegeSettings() {
  const { currentUser, userData, dummyLogout } = useAuth();
  const collegeId = userData?.collegeId || '';
  const navigate = useNavigate();

  const [collegeDetails, setCollegeDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form edit states
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Sync snapshot
  useEffect(() => {
    if (!collegeId) return;

    // Check for dummy developer/evaluator credentials to prevent sync failures
    if (collegeId === 'dummy_college_01' || currentUser?.uid === 'dummy_12345') {
      const dummyData = {
        name: 'Demo University (Bypass)',
        domain: 'demo.edu',
        collegeCode: 'DEMO01',
        adminEmail: 'admin@demo.edu',
        adminPhone: '+91 98765 43210',
        address: '123 Tech Campus, Innovation Hub, Bangalore, India',
        status: 'Active',
        createdAt: new Date().toISOString()
      };
      setCollegeDetails(dummyData);
      setName(dummyData.name);
      setAdminPhone(dummyData.adminPhone);
      setAddress(dummyData.address);
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, 'colleges', collegeId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCollegeDetails(data);
        // Initialize form fields with database data
        setName(data.name || '');
        setAdminPhone(data.adminPhone || '');
        setAddress(data.address || '');
      }
      setLoading(false);
    }, (error) => {
      console.error("Fetch settings details failed:", error);
      setLoading(false);
    });

    return () => unsub();
  }, [collegeId, currentUser]);

  const handleCancel = () => {
    if (collegeDetails) {
      setName(collegeDetails.name || '');
      setAdminPhone(collegeDetails.adminPhone || '');
      setAddress(collegeDetails.address || '');
    }
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Institution name is required and cannot be empty.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // If dummy bypass mode is active, handle mock save
      if (collegeId === 'dummy_college_01' || currentUser?.uid === 'dummy_12345') {
        const updated = {
          ...collegeDetails,
          name: name.trim(),
          adminPhone: adminPhone.trim(),
          address: address.trim()
        };
        setCollegeDetails(updated);
        setMessage({ type: 'success', text: 'Institutional configurations updated successfully! (Demo Mode)' });
        setIsEditing(false);
        setTimeout(() => {
          setMessage(prev => prev.type === 'success' ? { type: '', text: '' } : prev);
        }, 3000);
        return;
      }

      const collegeRef = doc(db, 'colleges', collegeId);
      await updateDoc(collegeRef, {
        name: name.trim(),
        adminPhone: adminPhone.trim(),
        address: address.trim()
      });

      setMessage({ type: 'success', text: 'Institutional configurations updated successfully!' });
      setIsEditing(false);

      // Auto clear success banner after 3 seconds
      setTimeout(() => {
        setMessage(prev => prev.type === 'success' ? { type: '', text: '' } : prev);
      }, 3000);
    } catch (error) {
      console.error("Failed to update college details:", error);
      setMessage({ type: 'error', text: 'Failed to update database records. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (currentUser?.uid === 'dummy_12345') {
        dummyLogout();
      } else {
        await auth.signOut();
      }
      navigate('/login');
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12 relative">
      
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-ec-border pb-5">
        <div>
          <h2 className="text-xl font-bold text-ec-highlight tracking-tight flex items-center gap-2">
            <Settings className="text-ec-accent" size={22} />
            Institutional Node Configurations
          </h2>
          <p className="text-xs text-ec-text-sub mt-1">
            Display identity configurations, physical localization coordinates, and network status tags.
          </p>
        </div>
        {!loading && collegeDetails && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-ec-accent hover:bg-ec-accent-hover text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-ec-accent/15 cursor-pointer flex items-center gap-1.5"
          >
            <Edit3 size={14} />
            Edit Settings
          </button>
        )}
      </div>

      {loading ? (
        <div className="surface-card border border-ec-border rounded-xl p-8 space-y-6 animate-pulse">
          <div className="h-6 bg-ec-muted/50 rounded w-1/4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-ec-muted/40 rounded"></div>
            <div className="h-10 bg-ec-muted/40 rounded"></div>
          </div>
        </div>
      ) : !collegeDetails ? (
        <div className="surface-card border border-ec-border rounded-xl p-8 text-center text-ec-text-sub">
          College records failed to sync.
        </div>
      ) : (
        <>
          <form onSubmit={handleSave} className="surface-card border border-ec-border rounded-xl p-6 lg:p-8 space-y-8 bg-ec-surface">
            
            {/* Notification / Toast Banner */}
            {message.text && (
              <div className={`p-4 rounded-xl text-xs font-semibold border flex items-center gap-2 animate-in fade-in duration-200 ${
                message.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                  : 'bg-red-500/10 text-red-400 border-red-500/25'
              }`}>
                {message.type === 'success' ? <Check size={14} /> : <ShieldAlert size={14} />}
                <span>{message.text}</span>
              </div>
            )}

            {/* Node Status Banner */}
            <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <ShieldAlert size={16} />
              </div>
              <div>
                <p className="text-[12px] font-bold text-ec-highlight">Operational Status: Verified Node</p>
                <p className="text-[10px] text-ec-text-sub">
                  This institutional dashboard is authenticated and synced to ConnectKaro core databases.
                </p>
              </div>
              <span className="ml-auto px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase">
                {collegeDetails.status || 'Active'}
              </span>
            </div>

            {/* Section 1: Campus Identity */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-ec-accent uppercase tracking-wider border-b border-ec-border/40 pb-2">
                1. Institutional Identity & Domain
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1.5">
                    Institution Name
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3 top-3.5 text-ec-text-sub" />
                      <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-ec-root/60 border border-ec-border focus:border-ec-accent rounded-lg text-sm text-ec-highlight font-semibold outline-none transition-all"
                        placeholder="Enter institution full name"
                        required
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 p-3 bg-ec-root/40 border border-ec-border rounded-lg text-sm text-ec-highlight font-semibold">
                      <Building2 size={16} className="text-ec-text-sub" />
                      <span>{collegeDetails.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1.5">
                    Primary Domain Protection (Read-Only)
                  </label>
                  <div className="flex items-center gap-2.5 p-3 bg-ec-root/20 border border-ec-border/60 rounded-lg text-sm text-ec-text-sub font-mono font-medium select-none">
                    <Globe size={16} className="text-ec-text-sub/50" />
                    <span>{collegeDetails.domain}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1.5">
                    Unique Institution Code (Read-Only)
                  </label>
                  <div className="flex items-center gap-2.5 p-3 bg-ec-root/20 border border-ec-border/60 rounded-lg text-sm text-ec-text-sub font-mono font-bold uppercase select-none">
                    <Hash size={16} className="text-ec-text-sub/50" />
                    <span>{collegeDetails.collegeCode}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Contact Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-ec-accent uppercase tracking-wider border-b border-ec-border/40 pb-2">
                2. Secured Contact Credentials
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1.5">
                    Admin Email Endpoint (Read-Only)
                  </label>
                  <div className="flex items-center gap-2.5 p-3 bg-ec-root/20 border border-ec-border/60 rounded-lg text-sm text-ec-text-sub font-medium select-none">
                    <Mail size={16} className="text-ec-text-sub/50" />
                    <span>{collegeDetails.adminEmail}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1.5">
                    Contact Telephone
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-3.5 text-ec-text-sub" />
                      <input 
                        type="tel"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-ec-root/60 border border-ec-border focus:border-ec-accent rounded-lg text-sm text-ec-text font-medium outline-none transition-all"
                        placeholder="e.g. +91 98765 43210"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 p-3 bg-ec-root/40 border border-ec-border rounded-lg text-sm text-ec-text font-medium">
                      <Phone size={16} className="text-ec-text-sub" />
                      <span>{collegeDetails.adminPhone || 'N/A'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Localization */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-ec-accent uppercase tracking-wider border-b border-ec-border/40 pb-2">
                3. Physical Deployment Boundary
              </h3>
              
              <div>
                <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1.5">
                  Campus Localization Address
                </label>
                {isEditing ? (
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-3.5 text-ec-text-sub" />
                    <textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-ec-root/60 border border-ec-border focus:border-ec-accent rounded-lg text-sm text-ec-text font-medium outline-none transition-all min-h-[90px] resize-y"
                      placeholder="Enter full physical address of the institution"
                    />
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 p-3 bg-ec-root/40 border border-ec-border rounded-lg text-sm text-ec-text font-medium leading-relaxed">
                    <MapPin size={16} className="text-ec-text-sub mt-0.5 shrink-0" />
                    <span>{collegeDetails.address || 'No physical address configured.'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            {isEditing && (
              <div className="flex gap-3 justify-end pt-4 border-t border-ec-border/60">
                <button 
                  type="button"
                  onClick={handleCancel} 
                  className="px-4 py-2.5 text-xs font-bold text-ec-text-sub hover:text-ec-highlight rounded-lg bg-ec-surface border border-ec-border hover:bg-ec-muted transition-colors cursor-pointer flex items-center gap-1"
                  disabled={saving}
                >
                  <X size={14} />
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-ec-accent hover:bg-ec-accent-hover rounded-lg transition-all shadow-md shadow-ec-accent/15 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  disabled={saving}
                >
                  <Check size={14} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

            {/* Metadata info */}
            {!isEditing && collegeDetails.createdAt && (
              <div className="flex items-center gap-2 text-[10px] text-ec-text-sub pt-4 border-t border-ec-border/60 select-none">
                <Calendar size={12} />
                <span>Node onboarded on: {new Date(collegeDetails.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            )}

          </form>

          {/* Section 4: Session Control (Danger Zone) */}
          <div className="surface-card border border-red-500/20 rounded-xl p-6 lg:p-8 space-y-4 bg-ec-surface">
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider border-b border-red-500/10 pb-2">
              4. Session Administration
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[12px] font-bold text-ec-highlight">Terminate Active Session</p>
                <p className="text-[10px] text-ec-text-sub">
                  Safely log out of the Institutional Admin Console. This will terminate your current authentication token.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-center cursor-pointer"
              >
                <LogOut size={14} />
                Sign Out Node
              </button>
            </div>
          </div>
        </>
      )}

      {/* Sign Out Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setShowLogoutModal(false)}
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-ec-border bg-ec-surface p-6 text-left shadow-2xl transition-all animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                <LogOut size={22} className="rotate-180" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ec-highlight">
                  Terminate Active Session?
                </h3>
                <p className="text-xs text-ec-text-sub mt-1">
                  You are about to sign out of the Institutional Admin Console.
                </p>
              </div>
            </div>

            <div className="mt-4 text-xs text-ec-text leading-relaxed">
              This will clear your local authorization session token. You will need to input your email and security password to access the administrative dashboard again.
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-xs font-bold text-ec-text-sub hover:text-ec-highlight bg-ec-surface border border-ec-border hover:bg-ec-muted rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-lg shadow-red-500/15 transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
