import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  GraduationCap, 
  TrendingUp, 
  Clock, 
  Activity,
  ArrowRight,
  Radio,
  UserCheck,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function CollegeDashboardOverview() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  // Safe extraction of collegeId
  const collegeId = userData?.collegeId || '';

  const [loading, setLoading] = useState(true);
  const [collegeDetails, setCollegeDetails] = useState(null);
  
  // Real-time states
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAlumni: 0,
    pendingApprovals: 0,
    activeBroadcasts: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [actionInProgress, setActionInProgress] = useState(null);

  // 1. Fetch College Metadata
  useEffect(() => {
    if (!collegeId) return;
    
    const fetchCollegeMetadata = async () => {
      try {
        const { data, error } = await supabase
          .from('colleges')
          .select('*')
          .eq('id', collegeId)
          .single();
          
        if (error) throw error;
        
        setCollegeDetails({
          ...data,
          collegeCode: data.id
        });
      } catch (err) {
        console.error("Fetch college metadata error:", err);
      }
    };

    fetchCollegeMetadata();

    const channel = supabase
      .channel('college-metadata-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'colleges', filter: `id=eq.${collegeId}` }, () => {
        fetchCollegeMetadata();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collegeId]);

  // 2. Fetch College Users (Students/Alumni/Pending)
  useEffect(() => {
    if (!collegeId) return;
    
    const fetchCollegeUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('college_id', collegeId);
          
        if (error) throw error;
        
        let studentsCount = 0;
        let alumniCount = 0;
        let pendingCount = 0;
        const pendingList = [];

        (data || []).forEach((u) => {
          if (u.status === 'pending') {
            pendingCount++;
            pendingList.push(u);
          } else if (u.status === 'approved') {
            if (u.role === 'student') studentsCount++;
            if (u.role === 'alumni') alumniCount++;
          }
        });

        setStats(prev => ({
          ...prev,
          totalStudents: studentsCount,
          totalAlumni: alumniCount,
          pendingApprovals: pendingCount
        }));
        setRecentRequests(pendingList.slice(0, 3));
      } catch (err) {
        console.error("College Aggregation Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeUsers();

    const channel = supabase
      .channel('college-users-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `college_id=eq.${collegeId}` }, () => {
        fetchCollegeUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collegeId]);

  // 3. Fetch Active Announcements targeted to this node
  useEffect(() => {
    if (!collegeId) return;

    const fetchActiveAnnouncements = async () => {
      try {
        const plan = collegeDetails?.subscription?.plan || 'free';
        const status = collegeDetails?.status || 'active';

        const allowedTargets = ['all'];
        if (status === 'active') allowedTargets.push('active');
        if (plan === 'premium') allowedTargets.push('premium');

        const { data, error } = await supabase
          .from('announcements')
          .select('id, target')
          .eq('status', 'active')
          .in('target', allowedTargets);

        if (error) throw error;
        setStats(prev => ({
          ...prev,
          activeBroadcasts: (data || []).length
        }));
      } catch (err) {
        console.error("Fetch Active Announcements error:", err);
      }
    };

    fetchActiveAnnouncements();

    const channel = supabase
      .channel('announcements-metrics-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
        fetchActiveAnnouncements();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collegeId, collegeDetails]);

  // Approval handler
  const handleApprove = async (userId, role) => {
    if (!userId || !role) return;
    setActionInProgress(userId);
    try {
      // 1. Update user status in Supabase
      const { error: userError } = await supabase
        .from('users')
        .update({ status: 'approved' })
        .eq('id', userId);
        
      if (userError) throw userError;
      
      // 2. Fetch current metrics
      const { data: collegeData, error: fetchError } = await supabase
        .from('colleges')
        .select('metrics')
        .eq('id', collegeId)
        .single();
        
      if (fetchError) throw fetchError;
      
      let metrics = collegeData.metrics || { totalStudents: 0, totalAlumni: 0 };
      if (typeof metrics === 'string') {
        try { metrics = JSON.parse(metrics); } catch(e) {}
      }
      
      if (role === 'student') {
        metrics.totalStudents = (metrics.totalStudents || 0) + 1;
      } else {
        metrics.totalAlumni = (metrics.totalAlumni || 0) + 1;
      }
      
      // Update metrics inside the college document
      const { error: collegeError } = await supabase
        .from('colleges')
        .update({ metrics })
        .eq('id', collegeId);
        
      if (collegeError) throw collegeError;
    } catch (error) {
      console.error("Approval Error:", error);
      alert("Approve karne mein error aaya.");
    } finally {
      setActionInProgress(null);
    }
  };

  // Reject handler
  const handleReject = async (userId) => {
    const isConfirmed = window.confirm("Kya aap is registration request ko reject karna chahte hain? User document permanently delete ho jayega.");
    if (!isConfirmed) return;
    
    setActionInProgress(userId);
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      if (error) throw error;
    } catch (error) {
      console.error("Rejection Error:", error);
      alert("Reject karne mein error aaya.");
    } finally {
      setActionInProgress(null);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const MetricCard = ({ title, value, subtitle, icon: Icon, colorClass, gradientClass }) => (
    <div className="surface-card p-6 border border-ec-border rounded-2xl relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl rounded-full transition-transform duration-500 group-hover:scale-150 ${gradientClass}`} />
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[13px] font-semibold text-ec-text-sub tracking-wide uppercase mb-1.5">{title}</p>
          <h3 className="text-3xl font-extrabold text-ec-highlight mb-1 tracking-tight">
            {loading ? <span className="animate-pulse bg-ec-muted/50 text-transparent rounded w-16 inline-block">00</span> : value}
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
      
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-ec-highlight tracking-tight">
            {collegeDetails?.name || "College Command Dashboard"}
          </h2>
          <p className="text-sm text-ec-text-sub mt-1 flex items-center gap-2">
            <Activity size={14} className="text-ec-accent animate-pulse" />
            Institutional Node Synced • {currentDate}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/college/broadcasts')}
            className="px-4 py-2 bg-ec-surface/60 border border-ec-border hover:border-ec-accent hover:text-ec-accent text-ec-text-sub font-semibold rounded-lg text-[13px] transition-all flex items-center gap-2"
          >
            <Radio size={16} />
            <span>View Broadcasts</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard 
          title="Verified Students" 
          value={stats.totalStudents}
          subtitle="Active network nodes"
          icon={Users}
          colorClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          gradientClass="bg-emerald-500"
        />
        <MetricCard 
          title="Verified Alumni" 
          value={stats.totalAlumni}
          subtitle="Mentorship active profiles"
          icon={GraduationCap}
          colorClass="bg-blue-500/10 text-blue-400 border-blue-500/20"
          gradientClass="bg-blue-500"
        />
        <MetricCard 
          title="Pending Approvals" 
          value={stats.pendingApprovals}
          subtitle="Verification required"
          icon={UserCheck}
          colorClass="bg-purple-500/10 text-purple-400 border-purple-500/20"
          gradientClass="bg-purple-500"
        />
        <MetricCard 
          title="Root Broadcasts" 
          value={stats.activeBroadcasts}
          subtitle="Active system bulletins"
          icon={Radio}
          colorClass="bg-red-500/10 text-red-400 border-red-500/20"
          gradientClass="bg-red-500"
        />
      </div>

      {/* Secondary Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Recent Requests List */}
        <div className="lg:col-span-2 surface-card border border-ec-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-ec-highlight">Registration Requests</h3>
              <p className="text-xs text-ec-text-sub mt-0.5">Top pending profiles awaiting campus verification.</p>
            </div>
            <button 
              onClick={() => navigate('/college/requests')}
              className="text-xs font-semibold text-ec-accent hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              Requests Panel <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-ec-border/50 rounded-lg animate-pulse bg-ec-surface/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-ec-muted/40 rounded-lg"></div>
                    <div>
                      <div className="w-32 h-4 bg-ec-muted/50 rounded mb-1"></div>
                      <div className="w-20 h-3 bg-ec-muted/30 rounded"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : recentRequests.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-ec-border rounded-lg text-ec-text-sub">
                Perfect node health. No pending approvals found!
              </div>
            ) : (
              recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-ec-root/40 border border-ec-border/60 rounded-lg hover:border-ec-accent/40 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-ec-surface border border-ec-border flex items-center justify-center font-bold text-ec-highlight group-hover:text-ec-accent transition-all uppercase">
                      {request.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-ec-highlight group-hover:text-ec-accent transition-colors">
                        {request.name}
                      </h4>
                      <p className="text-[11px] text-ec-text-sub mt-0.5">{request.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-ec-muted/60 text-ec-text-sub border border-ec-border font-mono">
                      {request.role}
                    </span>
                    
                    <button 
                      disabled={actionInProgress !== null}
                      onClick={() => handleApprove(request.id, request.role)}
                      className="p-1 rounded-md text-emerald-400 hover:text-white hover:bg-emerald-500 transition-colors disabled:opacity-50"
                      title="Verify Profile"
                    >
                      <CheckCircle size={17} />
                    </button>
                    <button 
                      disabled={actionInProgress !== null}
                      onClick={() => handleReject(request.id)}
                      className="p-1 rounded-md text-red-400 hover:text-white hover:bg-red-500 transition-colors disabled:opacity-50"
                      title="Decline"
                    >
                      <XCircle size={17} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Institution Health progress */}
        <div className="surface-card border border-ec-border rounded-xl p-6 flex flex-col">
          <h3 className="text-base font-bold text-ec-highlight mb-1">Campus Node Status</h3>
          <p className="text-xs text-ec-text-sub mb-6">Institutional configuration</p>

          <div className="flex-1 space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-ec-highlight">Campus Identity Code</span>
                <span className="text-ec-accent font-mono font-bold bg-ec-accent/10 px-1.5 py-0.5 rounded">{collegeDetails?.collegeCode || 'N/A'}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-ec-highlight">Domain Protection Node</span>
                <span className="text-blue-400 font-mono">{collegeDetails?.domain || 'N/A'}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-ec-highlight">Security Verification Code</span>
                <span className="text-ec-accent font-bold">100% Active</span>
              </div>
              <div className="w-full bg-ec-root rounded-full h-1.5 overflow-hidden border border-ec-border">
                <div className="bg-ec-accent h-full rounded-full w-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-ec-highlight">Institution Node Health</span>
                <span className="text-emerald-400 capitalize">{collegeDetails?.status || 'Active'}</span>
              </div>
              <div className="w-full bg-ec-root rounded-full h-1.5 overflow-hidden border border-ec-border">
                <div className={`h-full rounded-full ${collegeDetails?.status === 'suspended' ? 'bg-red-500 w-1/4' : 'bg-ec-accent w-full'}`}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}