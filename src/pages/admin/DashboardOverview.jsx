import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  GraduationCap, 
  TrendingUp, 
  ShieldBan,
  Activity,
  Plus,
  ArrowRight,
  Radio
} from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

export default function DashboardOverview() {
  const navigate = useNavigate();
  
  // Real-time Engine States
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalColleges: 0,
    activeColleges: 0,
    suspendedColleges: 0,
    totalStudents: 0,
    totalAlumni: 0
  });
  const [recentColleges, setRecentColleges] = useState([]);

  // Firebase Real-time Data Aggregation Pipeline
  useEffect(() => {
    // Query for recently added colleges
    const q = query(collection(db, 'colleges'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let tColleges = 0;
      let aColleges = 0;
      let sColleges = 0;
      let tStudents = 0;
      let tAlumni = 0;
      const recent = [];

      snapshot.forEach((doc, index) => {
        const data = doc.data();
        tColleges++;
        
        if (data.status === 'active') aColleges++;
        if (data.status === 'suspended') sColleges++;
        
        tStudents += (data.metrics?.totalStudents || 0);
        tAlumni += (data.metrics?.totalAlumni || 0);

        // Sirf top 4 recent colleges nikalne ke liye
        if (index < 4) {
          recent.push({ id: doc.id, ...data });
        }
      });

      setStats({
        totalColleges: tColleges,
        activeColleges: aColleges,
        suspendedColleges: sColleges,
        totalStudents: tStudents,
        totalAlumni: tAlumni
      });
      setRecentColleges(recent);
      setLoading(false);
    }, (error) => {
      console.error("Dashboard Aggregation Failed:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Current Date Formatter for Topbar
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  // Premium Metric Card Component (Liquid Glass UI)
  const MetricCard = ({ title, value, subtitle, icon: Icon, colorClass, gradientClass }) => (
    <div className="surface-card p-6 border border-ec-border rounded-2xl relative overflow-hidden group">
      {/* Background Glow Hover Effect */}
      <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl rounded-full transition-transform duration-500 group-hover:scale-150 ${gradientClass}`} />
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[13px] font-semibold text-ec-text-sub tracking-wide uppercase mb-1.5">{title}</p>
          <h3 className="text-3xl font-extrabold text-ec-highlight mb-1 tracking-tight">
            {loading ? <span className="animate-pulse bg-ec-muted/50 text-transparent rounded w-16 inline-block">000</span> : value}
          </h3>
          <p className="text-xs text-ec-text-sub/80 mt-2 flex items-center gap-1.5">
            {subtitle}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-lg ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* ── COMMAND CENTER HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-ec-highlight tracking-tight">
            Network Overview
          </h2>
          <p className="text-sm text-ec-text-sub mt-1 flex items-center gap-2">
            <Activity size={14} className="text-ec-accent animate-pulse" />
            Live Platform Metrics • {currentDate}
          </p>
        </div>
        
        {/* Quick Actions Array */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/broadcast')}
            className="px-4 py-2 bg-ec-surface/60 border border-ec-border hover:border-ec-accent hover:text-ec-accent text-ec-text-sub font-semibold rounded-lg text-[13px] transition-all flex items-center gap-2"
          >
            <Radio size={16} />
            <span className="hidden sm:inline">Broadcast</span>
          </button>
          <button 
            onClick={() => navigate('/admin/colleges/add')}
            className="px-4 py-2 bg-ec-accent hover:bg-emerald-600 text-ec-root font-bold rounded-lg text-[13px] transition-all flex items-center gap-2 shadow-lg shadow-ec-accent/10"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Onboard College</span>
          </button>
        </div>
      </div>

      {/* ── KEY METRICS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard 
          title="Total Colleges" 
          value={stats.totalColleges}
          subtitle={<><TrendingUp size={12} className="text-emerald-400"/> +{stats.activeColleges} Active Network Nodes</>}
          icon={Building2}
          colorClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          gradientClass="bg-emerald-500"
        />
        <MetricCard 
          title="Global Alumni" 
          value={stats.totalAlumni.toLocaleString()}
          subtitle="Verified professionals"
          icon={GraduationCap}
          colorClass="bg-blue-500/10 text-blue-400 border-blue-500/20"
          gradientClass="bg-blue-500"
        />
        <MetricCard 
          title="Active Students" 
          value={stats.totalStudents.toLocaleString()}
          subtitle="Currently enrolled"
          icon={Users}
          colorClass="bg-purple-500/10 text-purple-400 border-purple-500/20"
          gradientClass="bg-purple-500"
        />
        <MetricCard 
          title="Suspended" 
          value={stats.suspendedColleges}
          subtitle={<><ShieldBan size={12} className="text-red-400"/> Action required</>}
          icon={ShieldBan}
          colorClass="bg-red-500/10 text-red-400 border-red-500/20"
          gradientClass="bg-red-500"
        />
      </div>

      {/* ── SECONDARY PANELS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Panel: Recent Onboardings */}
        <div className="lg:col-span-2 surface-card border border-ec-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-ec-highlight">Recently Onboarded</h3>
              <p className="text-xs text-ec-text-sub mt-0.5">Latest institutions added to ConnectKaro.</p>
            </div>
            <button 
              onClick={() => navigate('/admin/colleges')}
              className="text-xs font-semibold text-ec-accent hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              View Directory <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-ec-border/50 rounded-lg animate-pulse">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 bg-ec-muted/40 rounded-lg"></div><div><div className="w-32 h-4 bg-ec-muted/50 rounded mb-2"></div><div className="w-20 h-3 bg-ec-muted/30 rounded"></div></div></div>
                </div>
              ))
            ) : recentColleges.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-ec-border rounded-lg text-ec-text-sub">
                Koi naya college nahi mila. Start onboarding!
              </div>
            ) : (
              recentColleges.map((college) => (
                <div key={college.id} className="flex items-center justify-between p-3 bg-ec-root/40 border border-ec-border/60 rounded-lg hover:border-ec-accent/40 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-ec-surface border border-ec-border flex items-center justify-center font-bold text-ec-highlight group-hover:text-ec-accent group-hover:border-ec-accent/30 transition-all">
                      {college.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-ec-highlight group-hover:text-ec-accent transition-colors">
                        {college.name}
                      </h4>
                      <p className="text-[11px] text-ec-text-sub font-mono mt-0.5">{college.domain}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md ${
                      college.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {college.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Platform Health / Setup Progress */}
        <div className="surface-card border border-ec-border rounded-xl p-6 flex flex-col">
          <h3 className="text-base font-bold text-ec-highlight mb-1">Platform Setup</h3>
          <p className="text-xs text-ec-text-sub mb-6">Root configuration progress</p>

          <div className="flex-1 space-y-5">
            {/* Custom Progress Item 1 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-ec-highlight">Database Nodes</span>
                <span className="text-ec-accent">100%</span>
              </div>
              <div className="w-full bg-ec-root rounded-full h-1.5 overflow-hidden border border-ec-border">
                <div className="bg-ec-accent h-full rounded-full w-full"></div>
              </div>
            </div>

            {/* Custom Progress Item 2 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-ec-highlight">Master Routing</span>
                <span className="text-ec-accent">100%</span>
              </div>
              <div className="w-full bg-ec-root rounded-full h-1.5 overflow-hidden border border-ec-border">
                <div className="bg-ec-accent h-full rounded-full w-full"></div>
              </div>
            </div>

            {/* Custom Progress Item 3 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-ec-highlight">Colleges Onboarded</span>
                <span className="text-blue-400">{stats.totalColleges > 0 ? 'Active' : 'Pending'}</span>
              </div>
              <div className="w-full bg-ec-root rounded-full h-1.5 overflow-hidden border border-ec-border">
                <div className={`h-full rounded-full transition-all duration-1000 ${stats.totalColleges > 0 ? 'w-full bg-blue-500' : 'w-[10%] bg-blue-500/30'}`}></div>
              </div>
            </div>
            
            {/* Custom Progress Item 4 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-ec-highlight">Helpdesk Config</span>
                <span className="text-orange-400">Pending</span>
              </div>
              <div className="w-full bg-ec-root rounded-full h-1.5 overflow-hidden border border-ec-border">
                <div className="bg-orange-500/50 h-full rounded-full w-[5%]"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}