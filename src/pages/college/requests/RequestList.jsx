import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Search, 
  Filter,
  Check,
  X,
  RefreshCw,
  Mail,
  Calendar
} from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';

export default function CollegeRequestList() {
  const { userData } = useAuth();
  const collegeId = userData?.collegeId || '';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // 'all', 'student', 'alumni'
  const [actionInProgress, setActionInProgress] = useState(null);
  const [limitCount, setLimitCount] = useState(15);
  const [hasMore, setHasMore] = useState(false);

  // Search Debouncer
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset page size when filter changes
  useEffect(() => {
    setLimitCount(15);
  }, [filterRole]);

  // Live snapshot fetch with server-side filters and pagination limit
  useEffect(() => {
    if (!collegeId) return;

    setLoading(true);
    const fetchRequests = async () => {
      try {
        let query = supabase
          .from('users')
          .select('*')
          .eq('college_id', collegeId)
          .eq('status', 'pending')
          .limit(limitCount + 1);

        if (filterRole !== 'all') {
          query = query.eq('role', filterRole);
        }

        const { data, error } = await query;
        if (error) throw error;

        // Map database columns to component properties
        const mapped = (data || []).map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          rollNo: u.roll_no,
          branch: u.branch,
          currentYear: u.current_year,
          batch: u.batch,
          degree: u.degree,
          company: u.company,
          designation: u.designation,
          linkedin: u.linkedin
        }));

        if (mapped.length > limitCount) {
          setHasMore(true);
          setRequests(mapped.slice(0, limitCount));
        } else {
          setHasMore(false);
          setRequests(mapped);
        }
      } catch (err) {
        console.error("Fetch pending error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();

    const channel = supabase
      .channel('pending-requests-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `college_id=eq.${collegeId}` }, () => {
        fetchRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collegeId, filterRole, limitCount]);

  // Approval handler
  const handleApprove = async (userId, role) => {
    setActionInProgress(userId);
    try {
      // 1. Update status
      const { error: userError } = await supabase
        .from('users')
        .update({ status: 'approved' })
        .eq('id', userId);

      if (userError) throw userError;

      // 2. Fetch and increment college metrics
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

      // Update college metrics
      const { error: collegeError } = await supabase
        .from('colleges')
        .update({ metrics })
        .eq('id', collegeId);

      if (collegeError) throw collegeError;
    } catch (error) {
      console.error("Approve Error:", error);
      alert("Approve action failed. Please try again.");
    } finally {
      setActionInProgress(null);
    }
  };

  // Reject handler
  const handleReject = async (userId) => {
    const isConfirmed = window.confirm("Are you sure you want to decline this registration request? This action deletes their temporary record.");
    if (!isConfirmed) return;

    setActionInProgress(userId);
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      if (error) throw error;
    } catch (error) {
      console.error("Reject Error:", error);
      alert("Reject action failed. Please try again.");
    } finally {
      setActionInProgress(null);
    }
  };

  // Filtration logic
  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
      req.email?.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesRole = filterRole === 'all' || req.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12 h-full flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ec-border pb-5 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-ec-highlight tracking-tight flex items-center gap-2">
            <UserCheck className="text-ec-accent" size={22} />
            Verification Center
          </h2>
          <p className="text-xs text-ec-text-sub mt-1">
            Approve or decline student and alumni registration requests linked to your domain.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-ec-text-sub/50" />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-ec-surface/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent transition-all font-medium"
          />
        </div>
        
        <div className="relative shrink-0">
          <Filter size={16} className="absolute left-3 top-3 text-ec-text-sub/50 pointer-events-none" />
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-ec-surface/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent transition-all font-semibold appearance-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="student">Students Only</option>
            <option value="alumni">Alumni Only</option>
          </select>
        </div>
      </div>

      {/* Verification Data Glass Sheet */}
      <div className="flex-1 glass-card flex flex-col">
        <div className="overflow-x-auto flex-1 max-h-[550px] overflow-y-auto scrollbar-thin">
          
          {/* Desktop Table View */}
          <table className="w-full text-left border-collapse hidden md:table">
            <thead className="sticky top-0 bg-ec-surface/95 backdrop-blur-md z-10 shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
              <tr className="border-b border-ec-border">
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">Candidate Name</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">Email & Verification Details</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">Requested Role</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider text-right">Verification</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-ec-border/60">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-ec-muted/50 rounded w-3/4 mb-2"></div><div className="h-3 bg-ec-muted/30 rounded w-1/2"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-ec-muted/50 rounded w-40"></div></td>
                    <td className="px-5 py-4"><div className="h-5 bg-ec-muted/50 rounded-full w-20"></div></td>
                    <td className="px-5 py-4"><div className="h-6 bg-ec-muted/50 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-12 text-center text-ec-text-sub">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ec-muted/30 mb-3">
                      <Search size={20} className="opacity-50" />
                    </div>
                    <p className="text-sm font-medium">No pending registration requests found.</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-ec-surface/50 hover:border-ec-accent/20 transition-all duration-250 group border-b border-ec-border/45">
                    
                    {/* Candidate Name */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[13px] text-ec-highlight group-hover:text-ec-accent transition-colors flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-ec-muted text-ec-highlight flex items-center justify-center uppercase font-extrabold text-[10px]">
                          {req.name?.charAt(0) || '?'}
                        </div>
                        {req.name}
                      </div>
                    </td>

                    {/* Email & Details */}
                    <td className="px-5 py-4 max-w-[320px]">
                      <div className="flex items-center gap-1.5 text-[12px] text-ec-text font-medium">
                        <Mail size={13} className="text-ec-text-sub shrink-0" />
                        <span className="truncate">{req.email}</span>
                      </div>
                      {req.role === 'student' ? (
                        <div className="mt-1.5 space-y-0.5 text-[10px] text-ec-text-sub border-t border-ec-border/30 pt-1.5">
                          <div><span className="font-semibold text-ec-highlight">Roll No:</span> {req.rollNo || 'N/A'}</div>
                          <div><span className="font-semibold text-ec-highlight">Branch:</span> {req.branch || 'N/A'}</div>
                          <div className="flex gap-2">
                            <span><span className="font-semibold text-ec-highlight">Year:</span> {req.currentYear || 'N/A'}</span>
                            <span>|</span>
                            <span><span className="font-semibold text-ec-highlight">Batch:</span> {req.batch || 'N/A'}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1.5 space-y-0.5 text-[10px] text-ec-text-sub border-t border-ec-border/30 pt-1.5">
                          <div><span className="font-semibold text-ec-highlight">Branch:</span> {req.branch || 'N/A'} | <span className="font-semibold text-ec-highlight">Batch:</span> {req.batch || 'N/A'}</div>
                          <div><span className="font-semibold text-ec-highlight">Work:</span> {req.designation || 'N/A'} at {req.company || 'N/A'}</div>
                          {req.linkedin && (
                            <div>
                              <a 
                                href={req.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1 text-ec-accent hover:underline mt-0.5"
                              >
                                🔗 LinkedIn Profile
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        req.role === 'student' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {req.role}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          disabled={actionInProgress !== null}
                          onClick={() => handleApprove(req.id, req.role)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1 disabled:opacity-50"
                        >
                          {actionInProgress === req.id ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                          Approve
                        </button>
                        
                        <button 
                          disabled={actionInProgress !== null}
                          onClick={() => handleReject(req.id)}
                          className="px-3 py-1.5 bg-ec-surface hover:bg-red-500/10 text-ec-text-sub hover:text-red-400 border border-ec-border hover:border-red-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                        >
                          <X size={13} />
                          Decline
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mobile Cards View */}
          <div className="block md:hidden divide-y divide-ec-border/60">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="p-4 space-y-3 animate-pulse bg-ec-surface/40">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-ec-muted/40 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-ec-muted/50 rounded w-2/3 mb-1"></div>
                      <div className="h-3 bg-ec-muted/30 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredRequests.length === 0 ? (
              <div className="p-8 text-center text-ec-text-sub">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-ec-muted/30 mb-2">
                  <Search size={16} className="opacity-50" />
                </div>
                <p className="text-xs font-medium">No pending registration requests found.</p>
              </div>
            ) : (
              filteredRequests.map((req) => (
                <div key={req.id} className="p-5 my-3 mx-2 rounded-2xl glass-card space-y-4 border border-ec-border/20 shadow-sm relative overflow-hidden transition-all duration-300">
                  {/* Candidate Name, Email & Role */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-md bg-ec-muted text-ec-highlight flex items-center justify-center uppercase font-bold text-sm shrink-0">
                        {req.name?.charAt(0) || '?'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-ec-highlight truncate">{req.name}</div>
                        <div className="text-[11.5px] text-ec-text-sub flex items-center gap-1 mt-0.5 truncate">
                          <Mail size={11} className="shrink-0" /> {req.email}
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                      req.role === 'student' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}>
                      {req.role}
                    </span>
                  </div>

                  {/* Details Block */}
                  <div className="text-xs text-ec-text-sub bg-ec-root/30 border border-ec-border/40 p-2.5 rounded-lg space-y-1">
                    {req.role === 'student' ? (
                      <div className="space-y-0.5">
                        <div><span className="font-semibold text-ec-highlight">Roll No:</span> {req.rollNo || 'N/A'}</div>
                        <div><span className="font-semibold text-ec-highlight">Branch:</span> {req.branch || 'N/A'}</div>
                        <div className="flex gap-3">
                          <span><span className="font-semibold text-ec-highlight">Year:</span> {req.currentYear || 'N/A'}</span>
                          <span>|</span>
                          <span><span className="font-semibold text-ec-highlight">Batch:</span> {req.batch || 'N/A'}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <div><span className="font-semibold text-ec-highlight">Branch:</span> {req.branch || 'N/A'} | <span className="font-semibold text-ec-highlight">Batch:</span> {req.batch || 'N/A'}</div>
                        <div><span className="font-semibold text-ec-highlight">Work:</span> {req.designation || 'N/A'} at {req.company || 'N/A'}</div>
                        {req.linkedin && (
                          <div className="pt-1.5 border-t border-ec-border/20 mt-1">
                            <a 
                              href={req.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-ec-accent hover:underline inline-flex items-center gap-1 font-semibold"
                            >
                              🔗 LinkedIn Profile
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button 
                      disabled={actionInProgress !== null}
                      onClick={() => handleReject(req.id)}
                      className="px-3.5 py-2 bg-ec-surface hover:bg-red-500/10 text-ec-text-sub hover:text-red-400 border border-ec-border hover:border-red-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1 disabled:opacity-50 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                    >
                      <X size={13} />
                      Decline
                    </button>
                    <button 
                      disabled={actionInProgress !== null}
                      onClick={() => handleApprove(req.id, req.role)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/15 flex items-center gap-1 disabled:opacity-50 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                    >
                      {actionInProgress === req.id ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
        
        {!loading && filteredRequests.length > 0 && (
          <div className="p-4 border-t border-ec-border bg-ec-surface/30 text-xs text-ec-text-sub text-center">
            Showing {filteredRequests.length} pending candidate(s)
          </div>
        )}
      </div>

      {hasMore && !loading && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setLimitCount(prev => prev + 15)}
            className="px-4 py-2 bg-ec-surface hover:bg-ec-muted border border-ec-border hover:border-ec-accent/40 rounded-lg text-xs font-bold text-ec-text transition-all cursor-pointer shadow-sm"
          >
            Load More Requests
          </button>
        </div>
      )}

    </div>
  );
}
