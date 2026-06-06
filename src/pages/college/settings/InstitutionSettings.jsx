import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import { 
  Building2, 
  Globe, 
  Hash, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Edit2, 
  Calendar 
} from 'lucide-react';

export default function InstitutionSettings() {
  const { userData } = useAuth();
  const { showToast, collegeDetails, collegeLoading, setCollegeDetails } = useOutletContext();
  const collegeId = userData?.collegeId || '';

  // Form edit states for Institutional Settings
  const [isEditingCollege, setIsEditingCollege] = useState(false);
  const [collegeName, setCollegeName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [address, setAddress] = useState('');
  const [savingCollege, setSavingCollege] = useState(false);

  // Sync editing fields with loaded collegeDetails
  useEffect(() => {
    if (collegeDetails) {
      setCollegeName(collegeDetails.name || '');
      setAdminPhone(collegeDetails.adminPhone || '');
      setAddress(collegeDetails.address || '');
    }
  }, [collegeDetails]);

  // Save college institutional details
  const handleSaveCollege = async (e) => {
    e.preventDefault();
    if (!collegeName.trim()) {
      showToast('error', 'Institution name is required.');
      return;
    }

    setSavingCollege(true);
    try {
      if (collegeId.toLowerCase().includes('dummy') || userData?.id === 'dummy_12345') {
        const updated = {
          ...collegeDetails,
          name: collegeName.trim(),
          adminPhone: adminPhone.trim(),
          address: address.trim()
        };
        setCollegeDetails(updated);
        showToast('success', 'Institutional configurations saved! (Demo Mode)');
        setIsEditingCollege(false);
        return;
      }

      const { error } = await supabase
        .from('colleges')
        .update({
          name: collegeName.trim(),
          admin_phone: adminPhone.trim(),
          address: address.trim()
        })
        .eq('id', collegeId);

      if (error) throw error;

      showToast('success', 'Institutional configurations updated successfully!');
      setIsEditingCollege(false);
    } catch (error) {
      console.error("Failed to update college details:", error);
      showToast('error', 'Failed to update institutional database records.');
    } finally {
      setSavingCollege(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-ec-border pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-medium text-ec-highlight flex items-center gap-2">
            <Building2 size={20} className="text-ec-accent" />
            Institutional Details
          </h2>
          <p className="text-xs text-ec-text-sub mt-0.5">Manage domain protection, addresses, and college-wide credentials.</p>
        </div>

        {collegeDetails && !isEditingCollege && (
          <button
            onClick={() => setIsEditingCollege(true)}
            className="px-3.5 py-1.5 bg-ec-accent hover:bg-ec-accent-hover text-white rounded-lg text-xs font-semibold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Edit2 size={13} />
            Edit Settings
          </button>
        )}
      </div>

      {collegeLoading ? (
        <div className="relative bg-ec-surface p-6 space-y-4 animate-pulse border border-ec-border rounded-xl shadow-sm">
          <div className="h-5 bg-ec-muted/50 w-1/4 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-ec-muted/40 rounded"></div>
            <div className="h-10 bg-ec-muted/40 rounded"></div>
          </div>
        </div>
      ) : !collegeDetails ? (
        <div className="relative bg-ec-surface p-8 border border-ec-border rounded-xl text-center text-ec-text-sub shadow-sm">
          College records failed to sync.
        </div>
      ) : (
        <form onSubmit={handleSaveCollege} className="space-y-6">
          
          {/* Node Active Banner */}
          <div className="flex items-center gap-3 p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl select-none">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Shield size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-ec-highlight">Operational Status: Verified Node</p>
              <p className="text-[11px] text-ec-text-sub mt-0.5">
                This institutional dashboard is authenticated and synced to Connect-Karo core databases.
              </p>
            </div>
            <span className="ml-auto px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-semibold uppercase">
              {collegeDetails.status || 'Active'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-semibold text-ec-text-sub uppercase tracking-wider mb-1.5">
                Institution Name
              </label>
              {isEditingCollege ? (
                <div className="relative">
                  <Building2 size={15} className="absolute left-3 top-3 text-ec-text-sub" />
                  <input 
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-ec-surface border border-ec-border focus:border-ec-accent rounded-lg text-[13px] text-ec-highlight font-normal outline-none transition-all"
                    placeholder="Enter institution full name"
                    required
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2.5 p-3 bg-ec-muted/20 border border-ec-border/60 rounded-lg text-[13px] text-ec-highlight font-normal">
                  <Building2 size={15} className="text-ec-text-sub" />
                  <span>{collegeDetails.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-ec-text-sub uppercase tracking-wider mb-1.5">
                Primary Domain Protection (Read-Only)
              </label>
              <div className="flex items-center gap-2.5 p-3 bg-ec-muted/10 border border-ec-border/40 rounded-lg text-[13px] text-ec-text-sub font-mono font-normal">
                <Globe size={15} className="text-ec-text-sub/50" />
                <span>{collegeDetails.domain}</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-ec-text-sub uppercase tracking-wider mb-1.5">
                Unique Institution Code (Read-Only)
              </label>
              <div className="flex items-center gap-2.5 p-3 bg-ec-muted/10 border border-ec-border/40 rounded-lg text-[13px] text-ec-text-sub font-mono font-semibold uppercase">
                <Hash size={15} className="text-ec-text-sub/50" />
                <span>{collegeDetails.collegeCode}</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-ec-text-sub uppercase tracking-wider mb-1.5">
                Admin Email Endpoint (Read-Only)
              </label>
              <div className="flex items-center gap-2.5 p-3 bg-ec-muted/10 border border-ec-border/40 rounded-lg text-[13px] text-ec-text-sub font-normal">
                <Mail size={15} className="text-ec-text-sub/50" />
                <span>{collegeDetails.adminEmail}</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-ec-text-sub uppercase tracking-wider mb-1.5">
                Contact Telephone
              </label>
              {isEditingCollege ? (
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-3 text-ec-text-sub" />
                  <input 
                    type="tel"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-ec-surface border border-ec-border focus:border-ec-accent rounded-lg text-[13px] text-ec-text outline-none transition-all font-normal"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2.5 p-3 bg-ec-muted/20 border border-ec-border/60 rounded-lg text-[13px] text-ec-text font-normal">
                  <Phone size={15} className="text-ec-text-sub" />
                  <span>{collegeDetails.adminPhone || 'N/A'}</span>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-semibold text-ec-text-sub uppercase tracking-wider mb-1.5">
                Campus Localization Address
              </label>
              {isEditingCollege ? (
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-3 text-ec-text-sub" />
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full pl-9 pr-4 py-2.5 bg-ec-surface border border-ec-border focus:border-ec-accent rounded-lg text-[13px] text-ec-text outline-none transition-all font-normal resize-y"
                    placeholder="Enter physical campus boundary coordinates"
                  />
                </div>
              ) : (
                <div className="flex items-start gap-2.5 p-3 bg-ec-muted/20 border border-ec-border/60 rounded-lg text-[13px] text-ec-text font-normal leading-relaxed">
                  <MapPin size={15} className="text-ec-text-sub mt-0.5 shrink-0" />
                  <span>{collegeDetails.address || 'No campus localization credentials configured.'}</span>
                </div>
              )}
            </div>
          </div>

          {isEditingCollege && (
            <div className="flex gap-2.5 justify-end pt-3 border-t border-ec-border/60">
              <button 
                type="button"
                onClick={() => {
                  setIsEditingCollege(false);
                  setCollegeName(collegeDetails?.name || '');
                  setAdminPhone(collegeDetails?.adminPhone || '');
                  setAddress(collegeDetails?.address || '');
                }}
                className="px-3.5 py-2 text-xs font-semibold text-ec-text-sub hover:text-ec-highlight bg-ec-surface border border-ec-border hover:bg-ec-muted rounded-lg transition-colors cursor-pointer"
                disabled={savingCollege}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-ec-accent hover:bg-ec-accent-hover rounded-lg transition-all shadow-md disabled:opacity-50 cursor-pointer"
                disabled={savingCollege}
              >
                {savingCollege ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {!isEditingCollege && collegeDetails.createdAt && (
            <div className="flex items-center gap-1.5 text-[9.5px] text-ec-text-sub pt-3 border-t border-ec-border/40 select-none">
              <Calendar size={11} />
              <span>Node initialized on: {new Date(collegeDetails.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          )}

        </form>
      )}

    </div>
  );
}
