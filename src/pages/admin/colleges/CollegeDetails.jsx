import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  Globe, 
  Hash, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Users,
  GraduationCap,
  ShieldAlert,
  Trash2,
  ShieldBan,
  CheckCircle2
} from 'lucide-react';
import { db } from '../../../firebase/config';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function CollegeDetails() {
  const { id } = useParams(); // URL se college ID nikalenge
  const navigate = useNavigate();
  
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch College Data
  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const docRef = doc(db, 'colleges', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCollege({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('College not found in the database.');
        }
      } catch (err) {
        console.error("Error fetching college:", err);
        setError('Failed to fetch college details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeDetails();
  }, [id]);

  // Safe Date Formatter (Prevents .toDate() crashes)
  const formatDate = (dateVal) => {
    if (!dateVal) return 'Not Available';
    return dateVal.toDate 
      ? dateVal.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
      : new Date(dateVal).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  // Toggle Status Logic
  const handleToggleStatus = async () => {
    if (!college) return;
    const newStatus = college.status === 'active' ? 'suspended' : 'active';
    const confirmMsg = college.status === 'active' 
      ? `Are you sure you want to suspend ${college.name}? They will lose access.`
      : `Are you sure you want to reactivate ${college.name}?`;
      
    if (window.confirm(confirmMsg)) {
      setIsProcessing(true);
      try {
        await updateDoc(doc(db, 'colleges', id), { status: newStatus });
        setCollege({ ...college, status: newStatus });
      } catch (err) {
        console.error("Status Update Failed:", err);
        alert("Failed to update status.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Delete Logic
  const handleDelete = async () => {
    if (window.confirm(`CRITICAL WARNING: Are you absolutely sure you want to delete '${college.name}'? All associated data mapping will be lost. This cannot be undone.`)) {
      setIsProcessing(true);
      try {
        await deleteDoc(doc(db, 'colleges', id));
        navigate('/admin/colleges');
      } catch (err) {
        console.error("Deletion Failed:", err);
        alert("Failed to delete college.");
        setIsProcessing(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 animate-in fade-in">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-ec-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-ec-text-sub font-medium">Loading Institutional Data...</p>
        </div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="surface-card border border-red-500/30 p-8 text-center rounded-xl max-w-lg mx-auto mt-10">
        <ShieldAlert size={48} className="mx-auto text-red-400 mb-4" />
        <h2 className="text-lg font-bold text-ec-highlight mb-2">Data Retrieval Failed</h2>
        <p className="text-sm text-ec-text-sub mb-6">{error}</p>
        <button 
          onClick={() => navigate('/admin/colleges')}
          className="px-5 py-2.5 bg-ec-surface border border-ec-border text-ec-text-sub rounded-lg hover:text-white transition-colors text-sm font-bold"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* ── HEADER & QUICK ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ec-border pb-5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/colleges')}
            className="p-2 rounded-lg bg-ec-surface border border-ec-border text-ec-text-sub hover:text-ec-highlight hover:border-ec-accent/50 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-ec-highlight tracking-tight">{college.name}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                college.status === 'active' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {college.status}
              </span>
            </div>
            <p className="text-xs text-ec-text-sub mt-1 flex items-center gap-2">
              <Calendar size={12} /> Onboarded: {formatDate(college.createdAt)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleToggleStatus}
            disabled={isProcessing}
            className={`px-4 py-2 text-[13px] font-bold rounded-lg transition-all flex items-center gap-2 ${
              college.status === 'active' 
                ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20 hover:bg-orange-500/20' 
                : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20'
            }`}
          >
            {college.status === 'active' ? <ShieldBan size={16} /> : <CheckCircle2 size={16} />}
            {college.status === 'active' ? 'Suspend Access' : 'Restore Access'}
          </button>
          
          <button 
            onClick={handleDelete}
            disabled={isProcessing}
            className="px-4 py-2 text-[13px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 rounded-lg transition-all flex items-center gap-2"
          >
            <Trash2 size={16} /> Delete Node
          </button>
        </div>
      </div>

      {/* ── METRICS DASHBOARD ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="surface-card border border-ec-border rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-ec-text-sub uppercase tracking-wider mb-1">Active Students</p>
            <p className="text-2xl font-black text-ec-highlight">{college.metrics?.totalStudents || 0}</p>
          </div>
        </div>
        
        <div className="surface-card border border-ec-border rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-ec-text-sub uppercase tracking-wider mb-1">Registered Alumni</p>
            <p className="text-2xl font-black text-ec-highlight">{college.metrics?.totalAlumni || 0}</p>
          </div>
        </div>

        <div className="surface-card border border-ec-border rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-ec-text-sub uppercase tracking-wider mb-1">Current Plan</p>
            <p className="text-2xl font-black text-ec-highlight capitalize">{college.subscription?.plan || 'Free'}</p>
          </div>
        </div>
      </div>

      {/* ── DETAILED INFO PANELS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core Institutional Data */}
        <div className="surface-card border border-ec-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-ec-accent uppercase tracking-wider border-b border-ec-border/40 pb-3 mb-4 flex items-center gap-2">
            <Building2 size={18} /> Institutional Mapping
          </h3>
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-bold text-ec-text-sub uppercase tracking-wide mb-1">Institution Code</p>
              <p className="text-[14px] font-medium text-ec-highlight flex items-center gap-2">
                <Hash size={14} className="text-ec-text-sub" /> {college.collegeCode}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-ec-text-sub uppercase tracking-wide mb-1">Verified Domain</p>
              <p className="text-[14px] font-medium text-ec-highlight flex items-center gap-2">
                <Globe size={14} className="text-ec-text-sub" /> 
                <a href={`https://${college.domain}`} target="_blank" rel="noreferrer" className="hover:text-ec-accent hover:underline">
                  {college.domain}
                </a>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-ec-text-sub uppercase tracking-wide mb-1">Registered Address</p>
              <p className="text-[14px] font-medium text-ec-highlight flex items-start gap-2 leading-relaxed">
                <MapPin size={16} className="text-ec-text-sub shrink-0 mt-0.5" /> 
                {college.address}
              </p>
            </div>
          </div>
        </div>

        {/* Security & Access Contacts */}
        <div className="surface-card border border-ec-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-ec-accent uppercase tracking-wider border-b border-ec-border/40 pb-3 mb-4 flex items-center gap-2">
            <Mail size={18} /> Root Admin Credentials
          </h3>
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-bold text-ec-text-sub uppercase tracking-wide mb-1">Primary Email Address</p>
              <p className="text-[14px] font-medium text-ec-highlight flex items-center gap-2">
                <Mail size={14} className="text-ec-text-sub" /> {college.adminEmail}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-ec-text-sub uppercase tracking-wide mb-1">Contact Phone</p>
              <p className="text-[14px] font-medium text-ec-highlight flex items-center gap-2">
                <Phone size={14} className="text-ec-text-sub" /> {college.adminPhone}
              </p>
            </div>
            
            <div className="mt-6 p-4 bg-ec-muted/30 border border-ec-border rounded-lg">
              <p className="text-xs text-ec-text-sub leading-relaxed">
                <strong>Note:</strong> Admin passwords are encrypted in Firebase Authentication and cannot be viewed here. If the college administrator loses access, they must use the "Forgot Password" feature on the login page.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}