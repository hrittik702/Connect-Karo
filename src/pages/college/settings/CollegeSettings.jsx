import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Globe, 
  Hash, 
  Mail, 
  Phone, 
  MapPin, 
  Settings,
  Calendar,
  ShieldAlert
} from 'lucide-react';
import { db } from '../../../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

export default function CollegeSettings() {
  const { userData } = useAuth();
  const collegeId = userData?.collegeId || '';

  const [collegeDetails, setCollegeDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collegeId) return;

    const unsub = onSnapshot(doc(db, 'colleges', collegeId), (snapshot) => {
      if (snapshot.exists()) {
        setCollegeDetails(snapshot.data());
      }
      setLoading(false);
    }, (error) => {
      console.error("Fetch settings details failed:", error);
      setLoading(false);
    });

    return () => unsub();
  }, [collegeId]);

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
        <div className="surface-card border border-ec-border rounded-xl p-6 lg:p-8 space-y-8 bg-ec-surface">
          
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
                <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">
                  Institution Name
                </label>
                <div className="flex items-center gap-2 p-3 bg-ec-root/40 border border-ec-border rounded-lg text-sm text-ec-highlight font-semibold">
                  <Building2 size={16} className="text-ec-text-sub" />
                  <span>{collegeDetails.name}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">
                  Primary Domain Protection
                </label>
                <div className="flex items-center gap-2 p-3 bg-ec-root/40 border border-ec-border rounded-lg text-sm text-ec-text font-mono font-medium">
                  <Globe size={16} className="text-ec-text-sub" />
                  <span>{collegeDetails.domain}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">
                  Unique Institution Code
                </label>
                <div className="flex items-center gap-2 p-3 bg-ec-root/40 border border-ec-border rounded-lg text-sm text-ec-highlight font-mono font-bold uppercase">
                  <Hash size={16} className="text-ec-text-sub" />
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
                <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">
                  Admin Email Endpoint
                </label>
                <div className="flex items-center gap-2 p-3 bg-ec-root/40 border border-ec-border rounded-lg text-sm text-ec-text font-medium">
                  <Mail size={16} className="text-ec-text-sub" />
                  <span>{collegeDetails.adminEmail}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">
                  Contact Telephone
                </label>
                <div className="flex items-center gap-2 p-3 bg-ec-root/40 border border-ec-border rounded-lg text-sm text-ec-text font-medium">
                  <Phone size={16} className="text-ec-text-sub" />
                  <span>{collegeDetails.adminPhone || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Localization */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-ec-accent uppercase tracking-wider border-b border-ec-border/40 pb-2">
              3. Physical Deployment Boundary
            </h3>
            
            <div>
              <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1">
                Campus Localization Address
              </label>
              <div className="flex items-start gap-2 p-3 bg-ec-root/40 border border-ec-border rounded-lg text-sm text-ec-text font-medium leading-relaxed">
                <MapPin size={16} className="text-ec-text-sub mt-0.5 shrink-0" />
                <span>{collegeDetails.address || 'No physical address configured.'}</span>
              </div>
            </div>
          </div>

          {/* Metadata info */}
          {collegeDetails.createdAt && (
            <div className="flex items-center gap-2 text-[10px] text-ec-text-sub pt-4 border-t border-ec-border/60">
              <Calendar size={12} />
              <span>Node onboarded on: {new Date(collegeDetails.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
