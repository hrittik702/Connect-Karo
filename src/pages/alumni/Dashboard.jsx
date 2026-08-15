import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  MessageCircle,
  BarChart3
} from 'lucide-react';

export default function AlumniDashboard() {
  // Top Navbar ke searchBox ki functionality ko fetch kiya
  const { searchFilter } = useOutletContext() || { searchFilter: "" }; 
  const navigate = useNavigate();

  // Baseline metrics score matrix tracking state
  const [stats] = useState({
    activeQueries: 3,
    corporateReferrals: 2,
    impactPoints: 450
  });
  
  // Real activity logs dataset matching actual operational feed paths
  const [activityLog] = useState([
    { 
      id: 1, 
      type: 'referral', 
      msg: "Student Anjali Singh submitted a PDF resume for your Frontend Engineer corporate referral opening.", 
      status: 'success', 
      time: "2 hours ago" 
    },
    { 
      id: 2, 
      type: 'event', 
      msg: "Information Technology department proposed a MERN Optimization Guest Lecture request to your channel.", 
      status: 'action', 
      time: "1 day ago" 
    },
    { 
      id: 3, 
      type: 'mentorship', 
      msg: "New secure real-time message stream established with student Amit Kumar regarding interview prep.", 
      status: 'success', 
      time: "3 days ago" 
    },
    {
      id: 4,
      type: 'system',
      msg: "Your corporate referral opening for Google - Senior Software Engineer has been published to Student Dashboard Job Feeds.",
      status: 'alert',
      time: "5 days ago"
    }
  ]);

  // Live filter connection matching search box inputs string
  const filteredLogs = activityLog.filter(log => 
    log.msg.toLowerCase().includes((searchFilter || "").toLowerCase())
  );

  return (
    <div className="space-y-6 animate-scale-in select-none">
      
      {/* ── CLEAN SIMPLIFIED MAIN HEADER TITLES ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ec-highlight transition-colors duration-300">
            Dashboard
          </h1>
          <p className="text-sm text-ec-text-sub font-medium mt-0.5 transition-colors duration-300">
            Welcome back! Here is a summary of your network interactions, professional referrals, and connection history.
          </p>
        </div>
      </div>

      {/* ── 📊 UPGRADED PERFORMANCE CARDS WITH GRAPHICAL PROGRESS MATRICES ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card A: Active Inbound Queries with Messaging Redirect Links */}
        <div className="surface p-5 rounded-xl flex flex-col justify-between border border-ec-border transition-all duration-300 group hover:border-ec-accent/30 relative overflow-hidden">
          <div className="flex items-center justify-between w-full">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-ec-text-sub uppercase tracking-wider transition-colors duration-300">
                Active Discussions
              </p>
              <h3 className="text-4xl font-black text-ec-highlight tracking-tight transition-colors duration-300">
                {String(stats.activeQueries).padStart(2, '0')}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-ec-accent/12 text-ec-accent shadow-sm transition-colors duration-300">
              <MessageSquare size={20} />
            </div>
          </div>
          
          {/* Micro Graphical Analytics Metric Gauge Bar */}
          <div className="space-y-1.5 pt-4 w-full">
            <div className="flex justify-between text-[10px] font-bold text-ec-text-sub">
              <span>Response Rate Capacity</span>
              <span>75%</span>
            </div>
            <div className="w-full h-1.5 bg-ec-root rounded-full overflow-hidden">
              <div className="h-full bg-ec-accent rounded-full transition-all duration-500" style={{ width: '75%' }} />
            </div>
          </div>

          <button 
            onClick={() => navigate('/alumni/mentorship')}
            className="w-full mt-4 text-[11px] font-bold bg-ec-root hover:bg-ec-accent hover:text-white border border-ec-border text-ec-highlight py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer focus:outline-none"
          >
            <MessageCircle size={13} />
            <span>Open Chat Room</span>
          </button>
        </div>
        
        {/* Card B: Corporate Referrals Listed Panel */}
        <div className="surface p-5 rounded-xl flex flex-col justify-between border border-ec-border transition-all duration-300 group hover:border-blue-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between w-full">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-ec-text-sub uppercase tracking-wider transition-colors duration-300">
                Corporate Referrals
              </p>
              <h3 className="text-4xl font-black text-ec-highlight tracking-tight flex items-baseline gap-2 transition-colors duration-300">
                {String(stats.corporateReferrals).padStart(2, '0')}
                <span className="text-xs text-ec-accent font-bold flex items-center gap-0.5">
                  <TrendingUp size={12} /> Active
                </span>
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 shadow-sm transition-colors duration-300">
              <Briefcase size={20} />
            </div>
          </div>

          {/* Micro Graphical Analytics Metric Gauge Bar */}
          <div className="space-y-1.5 pt-4 w-full">
            <div className="flex justify-between text-[10px] font-bold text-ec-text-sub">
              <span>Student Application Rate</span>
              <span>40%</span>
            </div>
            <div className="w-full h-1.5 bg-ec-root rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: '40%' }} />
            </div>
          </div>

          <button 
            onClick={() => navigate('/alumni/jobs')}
            className="w-full mt-4 text-[11px] font-bold bg-ec-root hover:bg-blue-500 hover:text-white border border-ec-border text-ec-highlight py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer focus:outline-none"
          >
            <BarChart3 size={13} />
            <span>Manage Referral Openings</span>
          </button>
        </div>

        {/* Card C: Contribution Network Points Ledger Level */}
        <div className="surface p-5 rounded-xl flex flex-col justify-between border border-ec-border transition-all duration-300 group hover:border-amber-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between w-full">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-ec-text-sub uppercase tracking-wider transition-colors duration-300">
                Contributions Tier
              </p>
              <h3 className="text-4xl font-black text-ec-highlight tracking-tight transition-colors duration-300">
                Lvl 4
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 shadow-sm transition-colors duration-300">
              <Award size={20} />
            </div>
          </div>

          {/* Micro Graphical Analytics Metric Gauge Bar */}
          <div className="space-y-1.5 pt-4 w-full">
            <div className="flex justify-between text-[10px] font-bold text-ec-text-sub">
              <span>Next Level Milestone ({stats.impactPoints} XP)</span>
              <span>500 XP</span>
            </div>
            <div className="w-full h-1.5 bg-ec-root rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: '85%' }} />
            </div>
          </div>

          <div className="text-[10px] text-center text-ec-text-sub font-semibold bg-ec-root/50 py-2.5 rounded-lg border border-ec-border/40 mt-4 select-none">
            Top 5% Global University Ranking
          </div>
        </div>

      </div>

      {/* ── 2. RECENT ACTIVITY TIMELINE LOG (SEARCH ACTION ENABLED) ── */}
      <div className="surface rounded-xl p-5 border border-ec-border transition-all duration-300">
        
        {/* Log Panel Header */}
        <div className="flex items-center justify-between border-b border-ec-border pb-4 mb-4 transition-colors duration-300">
          <h2 className="font-bold text-xs uppercase tracking-wider text-ec-text-sub transition-colors duration-300">
            Recent Activity Log
          </h2>
          <span className="text-[10px] font-bold text-ec-text-sub transition-colors duration-300">
            Sorted by Latest Operations
          </span>
        </div>

        {/* Stacked Filter Rows */}
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-xs text-ec-text-sub font-medium bg-ec-root/30 rounded-lg border border-dashed border-ec-border/50">
            No active updates matching your search parameters.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div 
                key={log.id} 
                className="flex items-start gap-4 p-4 bg-ec-root border border-ec-border rounded-lg transition-all duration-200 hover:border-ec-text-sub/40 shadow-inner"
              >
                
                {/* Dynamic Status Icon Channels */}
                <div className="mt-0.5 flex-shrink-0">
                  {log.type === 'referral' && (
                    <div className="p-1.5 rounded-md bg-ec-accent/12 text-ec-accent">
                      <CheckCircle2 size={14} />
                    </div>
                  )}
                  {log.type === 'event' && (
                    <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
                      <AlertCircle size={14} />
                    </div>
                  )}
                  {log.type === 'mentorship' && (
                    <div className="p-1.5 rounded-md bg-ec-accent/12 text-ec-accent">
                      <MessageSquare size={14} />
                    </div>
                  )}
                  {log.type === 'system' && (
                    <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400">
                      <ArrowUpRight size={14} />
                    </div>
                  )}
                </div>
                
                {/* Message Content Text Grid */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
                  <p className="text-xs font-medium text-ec-highlight leading-relaxed break-words transition-colors duration-300">
                    {log.msg}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-ec-text-sub font-semibold flex-shrink-0 whitespace-nowrap self-start sm:self-center transition-colors duration-300">
                    <Clock size={11} />
                    <span>{log.time}</span>
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