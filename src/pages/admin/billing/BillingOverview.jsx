import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Crown, 
  Clock, 
  IndianRupee, 
  Search, 
  Filter, 
  MoreVertical, 
  Zap, 
  CalendarPlus, 
  Mail,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { db } from '../../../firebase/config';
import { collection, onSnapshot, query, doc, updateDoc, Timestamp } from 'firebase/firestore';

export default function BillingOverview() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all'); // all, free, premium, enterprise
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  
  // KPI Stats State
  const [stats, setStats] = useState({
    paidColleges: 0,
    trialColleges: 0,
    upcomingRenewals: 0,
    estimatedMRR: 0
  });

  // Action Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [modalAction, setModalAction] = useState(''); // 'upgrade' | 'extend'
  const [isProcessing, setIsProcessing] = useState(false);

  // Pricing Mock (For MRR Calculation - standard B2B Indian pricing logic)
  const PRICING = {
    free: 0,
    premium: 4999, // ₹4,999/month
    enterprise: 14999 // ₹14,999/month
  };

  // Firebase Real-time Pipeline
  useEffect(() => {
    const q = query(collection(db, 'colleges'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const collegeData = [];
      let pColleges = 0;
      let tColleges = 0;
      let renewals = 0;
      let mrr = 0;
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);

      snapshot.forEach((doc) => {
        const data = doc.data();
        collegeData.push({ id: doc.id, ...data });

        if (data.status === 'active') {
          // Calculate Tiers
          if (data.subscription?.plan === 'free') {
            tColleges++;
          } else {
            pColleges++;
            mrr += PRICING[data.subscription?.plan] || 0;
          }

          // Calculate Upcoming Renewals
          if (data.subscription?.expiresAt) {
            const expiryDate = data.subscription.expiresAt.toDate();
            if (expiryDate > now && expiryDate <= thirtyDaysFromNow) {
              renewals++;
            }
          }
        }
      });

      setColleges(collegeData.sort((a, b) => b.createdAt - a.createdAt));
      setStats({
        paidColleges: pColleges,
        trialColleges: tColleges,
        upcomingRenewals: renewals,
        estimatedMRR: mrr
      });
      setLoading(false);
    }, (error) => {
      console.error("Billing Fetch Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Utility: Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = () => setActionMenuOpen(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Compute Expiry Status Logic
  const getExpiryStatus = (timestamp) => {
    if (!timestamp) return { label: 'No Expiry Set', color: 'text-gray-400', badge: 'bg-gray-500/10 border-gray-500/20' };
    const expiry = timestamp.toDate();
    const now = new Date();
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Expired', color: 'text-red-400', badge: 'bg-red-500/10 text-red-400 border-red-500/20', days: diffDays };
    if (diffDays <= 30) return { label: 'Expiring Soon', color: 'text-orange-400', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20', days: diffDays };
    return { label: 'Active', color: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', days: diffDays };
  };

  // Database Action Handlers
  const handleUpdatePlan = async (newPlan) => {
    if (!selectedCollege) return;
    setIsProcessing(true);
    try {
      await updateDoc(doc(db, 'colleges', selectedCollege.id), {
        'subscription.plan': newPlan
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Plan update error:", err);
      alert("Plan update failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExtendValidity = async (daysToAdd) => {
    if (!selectedCollege) return;
    setIsProcessing(true);
    try {
      const currentExpiry = selectedCollege.subscription?.expiresAt?.toDate() || new Date();
      const newExpiry = new Date(currentExpiry);
      newExpiry.setDate(newExpiry.getDate() + daysToAdd);
      
      await updateDoc(doc(db, 'colleges', selectedCollege.id), {
        'subscription.expiresAt': Timestamp.fromDate(newExpiry)
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Validity extension error:", err);
      alert("Extension failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter Engine
  const filteredColleges = colleges.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || c.subscription?.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  // UI Component: KPI Card
  const KPICard = ({ title, value, icon: Icon, colorTheme, glowTheme }) => (
    <div className="surface-card p-5 border border-ec-border rounded-xl relative overflow-hidden group">
      <div className={`absolute -top-6 -right-6 w-24 h-24 opacity-10 blur-2xl rounded-full transition-transform duration-500 group-hover:scale-150 ${glowTheme}`} />
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[12px] font-semibold text-ec-text-sub tracking-wide uppercase mb-1.5">{title}</p>
          <h3 className="text-2xl font-bold text-ec-highlight tracking-tight">
            {loading ? <span className="animate-pulse bg-ec-muted/50 text-transparent rounded inline-block w-12">00</span> : value}
          </h3>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colorTheme}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ec-border pb-5">
        <div>
          <h2 className="text-xl font-bold text-ec-highlight tracking-tight flex items-center gap-2">
            <CreditCard className="text-ec-accent" size={22} />
            Subscription & Revenue Manager
          </h2>
          <p className="text-xs text-ec-text-sub mt-1">SaaS billing, plan upgrades, aur contract renewals manage karein.</p>
        </div>
      </div>

      {/* ── KPI REVENUE GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Active Paid Nodes" 
          value={stats.paidColleges} 
          icon={Crown} 
          colorTheme="bg-purple-500/10 text-purple-400 border-purple-500/20" 
          glowTheme="bg-purple-500" 
        />
        <KPICard 
          title="Free Trial Accounts" 
          value={stats.trialColleges} 
          icon={ShieldCheck} 
          colorTheme="bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
          glowTheme="bg-emerald-500" 
        />
        <KPICard 
          title="Upcoming Renewals" 
          value={stats.upcomingRenewals} 
          icon={Clock} 
          colorTheme="bg-orange-500/10 text-orange-400 border-orange-500/20" 
          glowTheme="bg-orange-500" 
        />
        <KPICard 
          title="Estimated MRR" 
          value={`₹${stats.estimatedMRR.toLocaleString()}`} 
          icon={IndianRupee} 
          colorTheme="bg-yellow-500/10 text-yellow-400 border-yellow-500/20" 
          glowTheme="bg-yellow-500" 
        />
      </div>

      {/* ── SEARCH & FILTER ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-ec-text-sub/50" />
          <input 
            type="text"
            placeholder="Search institution by name or domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-ec-surface/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent transition-all font-medium"
          />
        </div>
        <div className="relative shrink-0">
          <Filter size={16} className="absolute left-3 top-3 text-ec-text-sub/50 pointer-events-none" />
          <select 
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-ec-surface/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent transition-all font-semibold appearance-none cursor-pointer"
          >
            <option value="all">All SaaS Tiers</option>
            <option value="free">Free Trial Only</option>
            <option value="premium">Premium Tier</option>
            <option value="enterprise">Enterprise Custom</option>
          </select>
        </div>
      </div>

      {/* ── BILLING DATA GRID ── */}
      <div className="surface-card border border-ec-border rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ec-surface/40 border-b border-ec-border">
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">Institution Client</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">Current Tier</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">MRR Value</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">Billing Status</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-ec-border/60">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-ec-muted/50 rounded w-48 mb-2"></div></td>
                    <td className="px-5 py-4"><div className="h-5 bg-ec-muted/50 rounded w-20"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-ec-muted/50 rounded w-16"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-ec-muted/50 rounded w-32"></div></td>
                    <td className="px-5 py-4"><div className="h-6 bg-ec-muted/50 rounded w-6 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredColleges.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-ec-text-sub">
                    <CreditCard size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No billing records found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredColleges.map((college) => {
                  const expiryData = getExpiryStatus(college.subscription?.expiresAt);
                  const plan = college.subscription?.plan || 'free';
                  
                  return (
                    <tr key={college.id} className="hover:bg-ec-surface/80 transition-colors group">
                      
                      {/* Institution Client */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[13px] text-ec-highlight">{college.name}</div>
                        <div className="text-[11px] text-ec-text-sub font-mono mt-0.5">{college.domain}</div>
                      </td>

                      {/* Current Tier */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          plan === 'premium' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 
                          plan === 'enterprise' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                          'bg-ec-muted/40 text-ec-text-sub border border-ec-border'
                        }`}>
                          {plan === 'premium' && <Crown size={10} />}
                          {plan === 'enterprise' && <Zap size={10} />}
                          {plan}
                        </span>
                      </td>

                      {/* MRR Value */}
                      <td className="px-5 py-4">
                        <span className="text-[13px] font-semibold text-ec-highlight">
                          ₹{(PRICING[plan] || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-ec-text-sub ml-1">/mo</span>
                      </td>

                      {/* Billing Status */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center w-max px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${expiryData.badge}`}>
                            {expiryData.label}
                          </span>
                          <span className="text-[11px] text-ec-text-sub">
                            Expires: {college.subscription?.expiresAt ? college.subscription.expiresAt.toDate().toLocaleDateString('en-GB') : 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Actions (Light Theme Dropdown) */}
                      <td className="px-5 py-4 text-right relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionMenuOpen(actionMenuOpen === college.id ? null : college.id);
                          }}
                          className="p-1.5 rounded-md text-ec-text-sub hover:text-ec-highlight hover:bg-ec-muted/50 transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {actionMenuOpen === college.id && (
                          <>
                            <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setActionMenuOpen(null)} />
                            <div className="absolute right-8 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.2)] py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                              <button 
                                onClick={() => { setSelectedCollege(college); setModalAction('upgrade'); setActionMenuOpen(null); setIsModalOpen(true); }}
                                className="w-full px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                              >
                                <Crown size={14} className="text-purple-600" /> Change SaaS Tier
                              </button>
                              
                              <button 
                                onClick={() => { setSelectedCollege(college); setModalAction('extend'); setActionMenuOpen(null); setIsModalOpen(true); }}
                                className="w-full px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                              >
                                <CalendarPlus size={14} className="text-emerald-600" /> Extend Validity
                              </button>

                              <div className="h-px bg-gray-100 my-1"></div>
                              
                              <button 
                                onClick={() => alert("Email integration setup pending.")}
                                className="w-full px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                              >
                                <Mail size={14} className="text-gray-500" /> Send Invoice/Reminder
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── LIGHT THEME ACTION MODAL ── */}
      {isModalOpen && selectedCollege && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {modalAction === 'upgrade' && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <Crown size={22} className="text-purple-600" />
                  <h3 className="text-[17px] font-bold text-gray-900">Manage Subscription Tier</h3>
                </div>
                <p className="text-[13px] text-gray-600 mb-5">
                  Update plan for <span className="font-bold">{selectedCollege.name}</span>. Currently on <strong>{selectedCollege.subscription?.plan || 'free'}</strong>.
                </p>
                <div className="space-y-3 mb-6">
                  {['free', 'premium', 'enterprise'].map((plan) => (
                    <button
                      key={plan}
                      onClick={() => handleUpdatePlan(plan)}
                      disabled={isProcessing}
                      className="w-full p-3 rounded-lg border border-gray-200 text-left hover:border-purple-500 hover:bg-purple-50 transition-all flex justify-between items-center group"
                    >
                      <span className="text-[14px] font-bold text-gray-800 capitalize">{plan}</span>
                      <span className="text-[12px] font-medium text-gray-500 group-hover:text-purple-600">₹{PRICING[plan].toLocaleString()}/mo</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {modalAction === 'extend' && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <CalendarPlus size={22} className="text-emerald-600" />
                  <h3 className="text-[17px] font-bold text-gray-900">Extend Contract Validity</h3>
                </div>
                <p className="text-[13px] text-gray-600 mb-5">
                  Grant grace period to <span className="font-bold">{selectedCollege.name}</span> without changing their billing cycle.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button onClick={() => handleExtendValidity(15)} disabled={isProcessing} className="p-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:border-emerald-500 hover:bg-emerald-50">+15 Days</button>
                  <button onClick={() => handleExtendValidity(30)} disabled={isProcessing} className="p-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:border-emerald-500 hover:bg-emerald-50">+1 Month</button>
                  <button onClick={() => handleExtendValidity(180)} disabled={isProcessing} className="p-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:border-emerald-500 hover:bg-emerald-50">+6 Months</button>
                  <button onClick={() => handleExtendValidity(365)} disabled={isProcessing} className="p-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:border-emerald-500 hover:bg-emerald-50">+1 Year</button>
                </div>
              </>
            )}

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button 
                onClick={() => setIsModalOpen(false)} 
                disabled={isProcessing}
                className="px-4 py-2 text-[13px] font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 rounded-lg transition-colors"
              >
                Cancel Action
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}