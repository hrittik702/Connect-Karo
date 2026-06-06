import { Lock, Plus, Key } from 'lucide-react';

export default function SecuritySettings() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-ec-border pb-4">
        <h2 className="text-2xl font-medium text-ec-highlight capitalize flex items-center gap-2">
          <Key size={20} className="text-ec-accent" />
          Security & keys
        </h2>
        <p className="text-xs text-ec-text-sub mt-0.5">Configure system-wide cryptographic keys, two-factor credentials, and advanced security variables.</p>
      </div>

      <div className="relative bg-ec-surface/40 border-dashed border-2 border-ec-border rounded-xl p-8 text-center flex flex-col items-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-ec-muted/40 border border-ec-border flex items-center justify-center text-ec-highlight mb-4">
          <Lock size={18} className="text-ec-text-sub" />
        </div>
        <h4 className="text-xs font-semibold text-ec-highlight mb-1 uppercase tracking-wider">
          Cryptographic Framework Sealed
        </h4>
        <p className="text-[11px] text-ec-text-sub max-w-lg leading-relaxed">
          Public keys, institutional certificate chains, and 2FA settings are fully locked and protected under local system hardware boundaries.
        </p>
        
        <button 
          disabled
          className="mt-4 px-3.5 py-1.5 bg-ec-accent/10 border border-ec-accent/25 text-ec-accent text-[10px] font-semibold rounded-lg opacity-60 cursor-not-allowed flex items-center gap-1.5"
        >
          <Plus size={11} />
          Register new security key
        </button>
      </div>
    </div>
  );
}
