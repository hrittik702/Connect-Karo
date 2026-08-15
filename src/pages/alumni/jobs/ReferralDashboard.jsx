import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Briefcase, Plus, Users, ClipboardList, CheckCircle, 
  ArrowUpRight, Clock, FileText, Search, Filter, Trash2, ExternalLink
} from 'lucide-react';

export default function ReferralDashboard() {
  // Global Layout ke search input state ko retrieve kiya
  const { searchFilter } = useOutletContext() || { searchFilter: "" };

  const [isPostOpen, setIsPostOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");

  // Local State Metrics for Referrals Matrix
  const [metrics] = useState({
    totalPosted: 3,
    activeApplicants: 12,
    successfulPlacements: 4
  });

  // Mock Active Referral Openings Posted by this Alumni
  const [referrals, setReferrals] = useState([
    {
      id: "ref_01",
      title: "Senior Software Engineer (Backend)",
      company: "Google",
      location: "Bengaluru, India",
      type: "Full-Time",
      applicants: 5,
      status: "Active",
      datePosted: "3 days ago"
    },
    {
      id: "ref_02",
      title: "Frontend Developer Intern",
      company: "Amazon",
      location: "Remote",
      type: "Internship",
      applicants: 7,
      status: "Active",
      datePosted: "1 week ago"
    },
    {
      id: "ref_03",
      title: "Data Analyst",
      company: "QuadSync Tech Solutions",
      location: "Hyderabad, India",
      type: "Full-Time",
      applicants: 0,
      status: "Closed",
      datePosted: "2 weeks ago"
    }
  ]);

  // New Referral Form Input States
  const [newRef, setNewRef] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-Time",
    description: ""
  });

  // Handle Form Submission
  const handleCreateReferral = (e) => {
    e.preventDefault();
    if (!newRef.title || !newRef.company) return;

    const freshPost = {
      id: `ref_${Date.now()}`,
      title: newRef.title,
      company: newRef.company,
      location: newRef.location || "Remote",
      type: newRef.type,
      applicants: 0,
      status: "Active",
      datePosted: "Just now"
    };

    setReferrals([freshPost, ...referrals]);
    setNewRef({ title: "", company: "", location: "", type: "Full-Time", description: "" });
    setIsPostOpen(false);
  };

  // Filter & Global Search logic matching
  const filteredReferrals = referrals.filter(ref => {
    const matchesSearch = ref.title.toLowerCase().includes((searchFilter || "").toLowerCase()) ||
                          ref.company.toLowerCase().includes((searchFilter || "").toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    return matchesSearch && ref.status.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="space-y-6 animate-scale-in select-none w-full">
      
      {/* ── HEADER ROW ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ec-highlight transition-colors duration-300">
            Corporate Referrals Portal
          </h1>
          <p className="text-sm text-ec-text-sub font-medium mt-0.5">
            Create professional corporate referral openings, track inbound student application metrics, and manage vacancy lifecycles.
          </p>
        </div>

        <button 
          onClick={() => setIsPostOpen(!isPostOpen)}
          className="px-4 py-2.5 bg-ec-accent text-white font-black text-xs tracking-wide rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-ec-accent/10 self-start sm:self-center focus:outline-none"
        >
          <Plus size={14} strokeWidth={2.5} />
          Create Referral Opening
        </button>
      </div>

      {/* ── 📊 METRICS GRID OVERVIEW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="surface p-5 rounded-xl border border-ec-border flex items-center justify-between transition-all duration-300">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-ec-text-sub uppercase tracking-wider">Referrals Published</p>
            <h3 className="text-3xl font-black text-ec-highlight tracking-tight">{String(metrics.totalPosted).padStart(2, '0')}</h3>
          </div>
          <div className="p-3 rounded-xl bg-ec-accent/12 text-ec-accent shadow-sm"><Briefcase size={20} /></div>
        </div>

        <div className="surface p-5 rounded-xl border border-ec-border flex items-center justify-between transition-all duration-300">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-ec-text-sub uppercase tracking-wider">Active Applicants</p>
            <h3 className="text-3xl font-black text-ec-highlight tracking-tight">{String(metrics.activeApplicants).padStart(2, '0')}</h3>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 shadow-sm"><Users size={20} /></div>
        </div>

        <div className="surface p-5 rounded-xl border border-ec-border flex items-center justify-between transition-all duration-300">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-ec-text-sub uppercase tracking-wider">Successful Referrals</p>
            <h3 className="text-3xl font-black text-ec-highlight tracking-tight">{String(metrics.successfulPlacements).padStart(2, '0')}</h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 shadow-sm"><ClipboardList size={20} /></div>
        </div>
      </div>

      {/* ── 🛠️ CREATE REFERRAL EXPANDABLE CONTAINER MODULE ── */}
      {isPostOpen && (
        <div className="surface p-5 border border-ec-border rounded-xl animate-scale-in shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-ec-border pb-3">
            <h3 className="text-sm font-black text-ec-highlight uppercase tracking-wider">Publish Corporate Vacancy</h3>
            <button onClick={() => setIsPostOpen(false)} className="text-xs text-ec-text-sub hover:text-ec-text font-bold">Cancel</button>
          </div>

          <form onSubmit={handleCreateReferral} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-black uppercase text-ec-text-sub">Role Title *</label>
              <input 
                type="text" 
                required
                value={newRef.title}
                onChange={e => setNewRef({...newRef, title: e.target.value})}
                placeholder="e.g. Software Engineer"
                className="text-xs bg-ec-root border border-ec-border p-3 rounded-lg text-ec-text outline-none focus:border-ec-accent"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-black uppercase text-ec-text-sub">Target Corporate Organization *</label>
              <input 
                type="text" 
                required
                value={newRef.company}
                onChange={e => setNewRef({...newRef, company: e.target.value})}
                placeholder="e.g. Google"
                className="text-xs bg-ec-root border border-ec-border p-3 rounded-lg text-ec-text outline-none focus:border-ec-accent"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-black uppercase text-ec-text-sub">Job Type Location</label>
              <select 
                value={newRef.type}
                onChange={e => setNewRef({...newRef, type: e.target.value})}
                className="text-xs bg-ec-root border border-ec-border p-3 rounded-lg text-ec-text outline-none focus:border-ec-accent"
              >
                <option value="Full-Time">Full-Time (On-Site)</option>
                <option value="Remote">Remote Operations</option>
                <option value="Internship">Internship Tenure</option>
              </select>
            </div>

            <div className="md:col-span-3 flex justify-end gap-2 pt-2">
              <button 
                type="submit"
                className="px-4 py-2 bg-ec-accent text-white font-black text-xs rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all focus:outline-none cursor-pointer"
              >
                Broadcast to Dashboard Feeds
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── 📜 MAIN LISTINGS ENGINE ── */}
      <div className="surface border border-ec-border rounded-xl p-5 shadow-sm">
        
        {/* Table/List Filter Toggles Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-ec-border pb-4 mb-4 gap-3">
          <h2 className="font-bold text-xs uppercase tracking-wider text-ec-text-sub">
            Your Active Referral Streams
          </h2>

          <div className="flex items-center gap-2">
            <Filter size={12} className="text-ec-icon" />
            <select 
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="text-[11px] font-bold bg-ec-root border border-ec-border text-ec-highlight rounded-lg px-2 py-1.5 outline-none focus:border-ec-accent"
            >
              <option value="all">All Channels</option>
              <option value="active">Active Openings</option>
              <option value="closed">Archived/Closed</option>
            </select>
          </div>
        </div>

        {/* Listings Stack Loop */}
        {filteredReferrals.length === 0 ? (
          <div className="text-center py-12 text-xs text-ec-text-sub font-medium bg-ec-root/30 rounded-lg border border-dashed border-ec-border/50">
            No active corporate referral vacancies found matching your dashboard criteria.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReferrals.map((ref) => (
              <div 
                key={ref.id}
                className="p-4 bg-ec-root border border-ec-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 hover:border-ec-text-sub/40 shadow-inner"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-ec-surface border border-ec-border text-ec-icon mt-0.5">
                    <Briefcase size={16} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-ec-highlight tracking-tight truncate">{ref.title}</h3>
                    <p className="text-xs font-semibold text-ec-accent mt-0.5">{ref.company} • <span className="text-ec-text-sub">{ref.location}</span></p>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-ec-surface border border-ec-border/70 text-ec-text-sub tracking-wider uppercase">
                        {ref.type}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-ec-text-sub">
                        <Clock size={11} />
                        <span>Posted {ref.datePosted}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-ec-border/50 pt-3 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-black text-ec-text-sub uppercase tracking-wider">Applicants</p>
                    <p className="text-base font-black text-ec-highlight mt-0.5">{ref.applicants > 0 ? String(ref.applicants).padStart(2, '0') : '--'}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                      ref.status === "Active" 
                        ? 'text-ec-accent bg-ec-accent/10 border-ec-accent/20' 
                        : 'text-ec-text-sub bg-ec-muted/40 border-ec-border'
                    }`}>
                      {ref.status}
                    </span>
                    
                    <button 
                      onClick={() => alert(`Opening tracking logs pipeline for vacancy ID: ${ref.id}`)}
                      disabled={ref.status === "Closed"}
                      className={`p-2 rounded-xl border border-ec-border bg-ec-surface flex items-center justify-center text-ec-highlight hover:bg-ec-muted transition-colors focus:outline-none ${ref.status === "Closed" ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                      title="Review Candidate Applications"
                    >
                      <FileText size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}