import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Send, 
  Trash2, 
  AlertTriangle, 
  Info, 
  ShieldAlert, 
  Users, 
  Clock,
  CheckCircle2,
  RefreshCw,
  Edit2,
  X,
  Save,
  Filter
} from 'lucide-react';
import { db } from '../../../firebase/config';
import { collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// =====================================================================
// 🚨 DUMMY DATA BLOCK START
// =====================================================================
const DUMMY_ANNOUNCEMENTS = [
  {
    id: 'ANC-881',
    title: 'Scheduled Core Network Maintenance',
    message: 'The ConnectKaro core database will undergo scheduled maintenance on Sunday, 02:00 AM IST. Expect a downtime of approximately 45 minutes.',
    type: 'critical',
    target: 'all',
    status: 'active',
    createdAt: { toDate: () => new Date(Date.now() - 3600000) }
  },
  {
    id: 'ANC-882',
    title: 'New Alumni Analytics Dashboard Live',
    message: 'We have rolled out the new V2 analytics dashboard. College admins can now track alumni engagement metrics in real-time.',
    type: 'info',
    target: 'premium',
    status: 'active',
    createdAt: { toDate: () => new Date(Date.now() - 86400000) }
  },
  {
    id: 'ANC-883',
    title: 'Identity Verification Reminder',
    message: 'Please ensure all pending student and alumni profiles are verified by Friday to maintain your active node status.',
    type: 'warning',
    target: 'active',
    status: 'active',
    createdAt: { toDate: () => new Date(Date.now() - 172800000) }
  }
];
// =====================================================================
// 🚨 DUMMY DATA BLOCK END
// =====================================================================

export default function AnnouncementPanel() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Composer Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info'); 
  const [target, setTarget] = useState('all'); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Custom Toast Notification State
  const [feedback, setFeedback] = useState({ show: false, message: '', type: '' });

  // Revoke Confirmation Modal
  const [revokeTarget, setRevokeTarget] = useState(null);

  // ── CUSTOM TOAST NOTIFICATION ──
  const showFeedback = (msg, type = 'success') => {
    setFeedback({ show: true, message: msg, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: '' }), 4000);
  };

  // ── DATA FETCHING PIPELINE ──
  useEffect(() => {
    // =====================================================================
    // 🚨 DUMMY INITIALIZATION
    // =====================================================================
    setAnnouncements(DUMMY_ANNOUNCEMENTS);
    setLoading(false);

    /* --- 🔥 PRODUCTION FIREBASE CODE (UNCOMMENT WHEN READY) ---
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setAnnouncements(data);
      setLoading(false);
    }, (error) => {
      console.error("Broadcast Fetch Error:", error);
      showFeedback("Failed to fetch broadcasts.", "error");
      setLoading(false);
    });
    return () => unsubscribe();
    ---------------------------------------------------------- */
  }, []);

  // ── DISPATCH / UPDATE BROADCAST (Write Operation) ──
  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      if (isEditing && editId) {
        // 🚨 DUMMY UPDATE LOGIC
        setAnnouncements(prev => prev.map(anc => 
          anc.id === editId ? { ...anc, title: title.trim(), message: message.trim(), type, target } : anc
        ));
        showFeedback('Broadcast updated successfully.', 'success');

        /* --- 🔥 PRODUCTION FIREBASE UPDATE CODE ---
        await updateDoc(doc(db, 'announcements', editId), {
          title: title.trim(), message: message.trim(), type, target, updatedAt: serverTimestamp()
        });
        showFeedback('Broadcast updated successfully.', 'success');
        ------------------------------------------ */
      } else {
        // 🚨 DUMMY DISPATCH LOGIC
        const newAnnouncement = {
          id: `ANC-${Math.floor(Math.random() * 1000)}`,
          title: title.trim(), message: message.trim(), type, target, status: 'active',
          createdAt: { toDate: () => new Date() }
        };
        setAnnouncements([newAnnouncement, ...announcements]);
        showFeedback('Broadcast dispatched across the network.', 'success');

        /* --- 🔥 PRODUCTION FIREBASE DISPATCH CODE ---
        await addDoc(collection(db, 'announcements'), {
          title: title.trim(), message: message.trim(), type, target, status: 'active',
          createdAt: serverTimestamp(), dispatchedBy: 'root_admin'
        });
        showFeedback('Broadcast dispatched across the network.', 'success');
        ------------------------------------------ */
      }
      cancelEdit();
    } catch (error) {
      console.error("Dispatch Error:", error);
      showFeedback('Failed to process request. Check network.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── REVOKE BROADCAST ──
  const confirmRevoke = (id, title) => setRevokeTarget({ id, title });

  const executeRevoke = async () => {
    if (!revokeTarget) return;
    const { id } = revokeTarget;
    try {
      // 🚨 DUMMY REVOKE LOGIC
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      showFeedback('Announcement revoked and removed.', 'success');
      if (isEditing && editId === id) cancelEdit();

      /* --- 🔥 PRODUCTION FIREBASE REVOKE CODE ---
      await deleteDoc(doc(db, 'announcements', id));
      showFeedback('Announcement revoked and removed.', 'success');
      if (isEditing && editId === id) cancelEdit();
      ------------------------------------------ */
    } catch (error) {
      console.error("Revoke Error:", error);
      showFeedback('Failed to revoke announcement.', 'error');
    } finally {
      setRevokeTarget(null);
    }
  };

  // ── EDIT MODE CONTROLS ──
  const triggerEdit = (announcement) => {
    setIsEditing(true); setEditId(announcement.id); setTitle(announcement.title);
    setMessage(announcement.message); setType(announcement.type); setTarget(announcement.target);
  };

  const cancelEdit = () => {
    setIsEditing(false); setEditId(null); setTitle(''); setMessage('');
    setType('info'); setTarget('all');
  };

  // ── UI HELPERS ──
  const getTypeConfig = (typeValue) => {
    switch (typeValue) {
      case 'critical': return { icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Critical Alert' };
      case 'warning': return { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Warning' };
      default: return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'General Info' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12 h-full flex flex-col relative">
      
      {/* ── CUSTOM TOAST FEEDBACK ── */}
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

      {/* ── CUSTOM REVOKE CONFIRMATION MODAL ── */}
      {revokeTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-3 text-red-500">
              <AlertTriangle size={24} strokeWidth={2.5} />
              <h3 className="text-[17px] font-bold text-gray-900">Revoke Transmission</h3>
            </div>
            <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
              Are you sure you want to revoke <strong>"{revokeTarget.title}"</strong>? It will be permanently removed from all dashboards across the network.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRevokeTarget(null)} className="px-4 py-2 text-[13px] font-semibold text-gray-700 hover:text-gray-900 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={executeRevoke} className="px-4 py-2 text-[13px] font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-lg shadow-red-500/20 flex items-center gap-2">
                <Trash2 size={16} /> Yes, Revoke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ec-border pb-5 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-ec-highlight tracking-tight flex items-center gap-2">
            <Radio className="text-ec-accent" size={22} />
            Network Broadcast Control
          </h2>
          <p className="text-xs text-ec-text-sub mt-1">Manage and dispatch unified announcements across all institutional nodes.</p>
        </div>
      </div>

      {/* ── MAIN TIGHT LAYOUT (Fixes the "Khula Khula" feel) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        
        {/* LEFT: COMPOSER (More compact spacing) */}
        <div className={`lg:col-span-4 surface-card border rounded-xl p-5 sticky top-6 transition-colors ${isEditing ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'border-ec-border'}`}>
          <div className="flex items-center justify-between mb-5 border-b border-ec-border/60 pb-3">
            <div className="flex items-center gap-2">
              {isEditing ? <Edit2 size={16} className="text-blue-400" /> : <Send size={16} className="text-ec-accent" />}
              <h3 className="text-sm font-bold text-ec-highlight uppercase tracking-wider">
                {isEditing ? 'Edit Notice' : 'Composer'}
              </h3>
            </div>
            {isEditing && (
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-bold animate-pulse">
                EDIT MODE
              </span>
            )}
          </div>

          <form onSubmit={handleDispatch} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-ec-text-sub uppercase tracking-wide">Target Audience</label>
              <div className="relative">
                <Users size={14} className="absolute left-3 top-3 text-ec-text-sub/50" />
                <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-ec-root/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent transition-all font-semibold appearance-none cursor-pointer">
                  <option value="all">All Network Nodes</option>
                  <option value="active">Active Colleges Only</option>
                  <option value="premium">Premium Tiers Only</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-ec-text-sub uppercase tracking-wide">Notice Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {['info', 'warning', 'critical'].map((t) => {
                  const config = getTypeConfig(t);
                  const Icon = config.icon;
                  const isSelected = type === t;
                  return (
                    <button key={t} type="button" onClick={() => setType(t)} className={`flex flex-col items-center justify-center py-2.5 rounded-lg border transition-all ${isSelected ? `${config.bg} ${config.border} ${config.color} ring-1 ring-${config.color.split('-')[1]}-500/50` : 'bg-ec-root/40 border-ec-border text-ec-text-sub hover:bg-ec-surface'}`}>
                      <Icon size={16} className="mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{t}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-ec-text-sub uppercase tracking-wide">Subject Line</label>
              <input type="text" required maxLength={80} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter brief subject..." className="w-full px-3 py-2 bg-ec-root/60 border border-ec-border rounded-lg text-[13px] text-ec-text outline-none focus:border-ec-accent transition-all font-medium" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-ec-text-sub uppercase tracking-wide">Detailed Message</label>
              <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type announcement details..." className="w-full px-3 py-2 bg-ec-root/60 border border-ec-border rounded-lg text-[13px] text-ec-text outline-none focus:border-ec-accent transition-all font-medium resize-none" />
            </div>

            <div className="flex gap-2 pt-2">
              {isEditing && (
                <button type="button" onClick={cancelEdit} className="px-4 py-2.5 font-bold rounded-lg text-[13px] transition-all bg-ec-surface border border-ec-border hover:bg-ec-muted text-ec-text-sub">
                  <X size={16} />
                </button>
              )}
              <button type="submit" disabled={isSubmitting} className={`flex-1 py-2.5 font-bold rounded-lg text-[13px] transition-all flex items-center justify-center gap-2 shadow-lg ${isEditing ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20' : type === 'critical' ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20' : type === 'warning' ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20' : 'bg-ec-accent hover:bg-emerald-600 text-ec-root shadow-ec-accent/20'} disabled:opacity-50`}>
                {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : isEditing ? <><Save size={16} /> Update</> : <><Radio size={16} /> Dispatch</>}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: STRUCTURED HISTORY CONTAINER */}
        <div className="lg:col-span-8 surface-card border border-ec-border rounded-xl flex flex-col h-[calc(100vh-8rem)] sticky top-6 overflow-hidden">
          
          {/* Box Header */}
          <div className="p-4 border-b border-ec-border/60 bg-ec-surface/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-ec-text-sub" />
              <h3 className="text-sm font-bold text-ec-highlight uppercase tracking-wider">Active Transmissions Grid</h3>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-ec-text-sub">
              <Filter size={14} /> Total: {announcements.length} Logs
            </div>
          </div>

          {/* Box Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-ec-root/20">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border border-ec-border/50 rounded-xl animate-pulse flex gap-4 bg-ec-surface/50">
                  <div className="w-10 h-10 rounded-lg bg-ec-muted/40 shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-ec-muted/50 rounded w-1/3"></div>
                    <div className="h-3 bg-ec-muted/30 rounded w-full"></div>
                  </div>
                </div>
              ))
            ) : announcements.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-ec-text-sub">
                <Radio size={32} className="mb-3 opacity-40" />
                <p className="text-sm font-medium">Grid is currently empty.</p>
              </div>
            ) : (
              announcements.map((announcement) => {
                const config = getTypeConfig(announcement.type);
                const Icon = config.icon;
                const isCurrentlyEditing = editId === announcement.id;

                return (
                  <div key={announcement.id} className={`p-4 border rounded-xl transition-all relative overflow-hidden group ${isCurrentlyEditing ? 'border-blue-500/50 bg-blue-500/5' : 'border-ec-border bg-ec-surface hover:border-ec-accent/40'}`}>
                    {announcement.type === 'critical' && !isCurrentlyEditing && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl pointer-events-none" />
                    )}

                    <div className="flex gap-4 relative z-10">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${config.bg} ${config.border} ${config.color}`}>
                        <Icon size={16} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                          <h4 className="text-[14px] font-bold text-ec-highlight truncate pr-4">{announcement.title}</h4>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2 py-0.5 rounded bg-ec-root border border-ec-border text-[9px] font-bold text-ec-text-sub uppercase flex items-center gap-1">
                              <Users size={10} /> {announcement.target}
                            </span>
                            <span className="text-[10px] text-ec-text-sub font-mono">
                              {announcement.createdAt?.toDate ? announcement.createdAt.toDate().toLocaleDateString('en-GB') : 'Just now'}
                            </span>
                          </div>
                        </div>

                        <p className="text-[12px] text-ec-text-sub leading-relaxed mb-3">{announcement.message}</p>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-ec-border/50">
                          <button onClick={() => triggerEdit(announcement)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-blue-400 hover:text-white hover:bg-blue-500 rounded transition-colors">
                            <Edit2 size={12} /> Edit
                          </button>
                          <button onClick={() => confirmRevoke(announcement.id, announcement.title)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-red-400 hover:text-white hover:bg-red-500 rounded transition-colors">
                            <Trash2 size={12} /> Revoke
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}