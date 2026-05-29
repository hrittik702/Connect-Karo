import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function AccountSettings() {
  const { currentUser, userData } = useAuth();
  const { setShowLogoutModal } = useOutletContext();

  const adminEmail = userData?.email || currentUser?.email || "admin@institution.edu";
  const userHandle = adminEmail.split('@')[0] || "admin";

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-ec-border pb-4">
        <h2 className="text-2xl font-medium text-ec-highlight">Account Settings</h2>
        <p className="text-[11px] text-ec-text-sub mt-0.5">Manage administrative credentials and security preferences.</p>
      </div>

      <div className="space-y-6">
        
        {/* Account details */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-ec-accent uppercase tracking-wider border-b border-ec-border/40 pb-1.5">
            General Configurations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
            <div>
              <label className="block text-[10px] font-semibold text-ec-text-sub uppercase tracking-wider mb-1.5">
                Username / Handle
              </label>
              <div className="p-3 bg-ec-muted/20 border border-ec-border/60 rounded-lg text-xs text-ec-text-sub font-mono font-normal">
                {userHandle}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-ec-text-sub uppercase tracking-wider mb-1.5">
                Assigned Security Role
              </label>
              <div className="p-3 bg-ec-muted/20 border border-ec-border/60 rounded-lg text-xs text-ec-text-sub font-mono font-semibold uppercase">
                {userData?.role || 'COLLEGE_ADMIN'}
              </div>
            </div>
          </div>
        </div>

        {/* Session Control */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider border-b border-red-500/10 pb-1.5">
            Danger Zone
          </h3>
          
          <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-xl max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-semibold text-ec-highlight">Terminate Active Session</h4>
              <p className="text-[10px] text-ec-text-sub mt-0.5 leading-normal max-w-sm">
                Log out of the Connect-Karo platform immediately. This clears your local security authentication tokens.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <LogOut size={13} />
              Sign Out Node
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
