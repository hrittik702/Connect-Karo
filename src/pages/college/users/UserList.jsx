import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Mail,
  Briefcase
} from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';

export default function CollegeUserList() {
  const { userData } = useAuth();
  const collegeId = userData?.collegeId || '';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [limitCount, setLimitCount] = useState(15);
  const [hasMore, setHasMore] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const filterType = searchParams.get('type') || 'all'; // 'all', 'student', 'alumni', 'blocked'
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Sync search input with URL search param changes
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  // Search Debouncer & URL Sync
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      
      const currentSearch = new URLSearchParams(window.location.search).get('search') || '';
      if (searchTerm === currentSearch) return;

      const newParams = new URLSearchParams(window.location.search);
      if (searchTerm) {
        newParams.set('search', searchTerm);
      } else {
        newParams.delete('search');
      }
      setSearchParams(newParams, { replace: true });
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClose = () => setActionMenuOpen(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  // Reset page size when filter changes
  useEffect(() => {
    setLimitCount(15);
  }, [filterType]);

  // Fetch verified & blocked users (Server-side paginated/filtered)
  useEffect(() => {
    if (!collegeId) return;

    setLoading(true);
    const fetchUsers = async () => {
      try {
        let query = supabase
          .from('users')
          .select('*')
          .eq('college_id', collegeId)
          .not('role', 'in', '("college_admin","root_admin")')
          .limit(limitCount + 1);

        if (filterType === 'student') {
          query = query.eq('status', 'approved').eq('role', 'student');
        } else if (filterType === 'alumni') {
          query = query.eq('status', 'approved').eq('role', 'alumni');
        } else if (filterType === 'blocked') {
          query = query.eq('status', 'blocked');
        } else {
          // 'all'
          query = query.in('status', ['approved', 'blocked']);
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
          setUsers(mapped.slice(0, limitCount));
        } else {
          setHasMore(false);
          setUsers(mapped);
        }
      } catch (err) {
        console.error("Fetch users list error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    const channel = supabase
      .channel('college-directory-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `college_id=eq.${collegeId}` }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collegeId, filterType, limitCount]);

  // Toggle user block/active state
  const handleToggleBlock = async (userId, currentStatus, role) => {
    setActionMenuOpen(null);
    const newStatus = currentStatus === 'approved' ? 'blocked' : 'approved';
    const incVal = newStatus === 'blocked' ? -1 : 1;

    try {
      // 1. Update user status in Supabase
      const { error: userError } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('id', userId);

      if (userError) throw userError;

      // 2. Fetch and adjust college metrics
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
        metrics.totalStudents = Math.max(0, (metrics.totalStudents || 0) + incVal);
      } else {
        metrics.totalAlumni = Math.max(0, (metrics.totalAlumni || 0) + incVal);
      }

      // Update college metrics
      const { error: collegeError } = await supabase
        .from('colleges')
        .update({ metrics })
        .eq('id', collegeId);

      if (collegeError) throw collegeError;
    } catch (error) {
      console.error("Toggle block error:", error);
      alert("Block toggling failed. Please try again.");
    }
  };

  // Delete user from directory
  const handleDeleteUser = async (userId, userName, currentStatus, role) => {
    setActionMenuOpen(null);
    const isConfirmed = window.confirm(`WARNING: Are you sure you want to permanently delete '${userName}'? This cannot be undone.`);
    if (!isConfirmed) return;

    try {
      // 1. Delete user
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (deleteError) throw deleteError;

      // 2. Adjust metrics if the user was verified/approved
      if (currentStatus === 'approved') {
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
          metrics.totalStudents = Math.max(0, (metrics.totalStudents || 0) - 1);
        } else {
          metrics.totalAlumni = Math.max(0, (metrics.totalAlumni || 0) - 1);
        }

        const { error: collegeError } = await supabase
          .from('colleges')
          .update({ metrics })
          .eq('id', collegeId);

        if (collegeError) throw collegeError;
      }
    } catch (error) {
      console.error("Delete user error:", error);
      alert("User deletion failed. Please try again.");
    }
  };

  // Search & Filtration logic (local filter on the retrieved page)
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
      u.email?.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    let matchesType = true;
    if (filterType === 'student') matchesType = (u.role === 'student' && u.status === 'approved');
    else if (filterType === 'alumni') matchesType = (u.role === 'alumni' && u.status === 'approved');
    else if (filterType === 'blocked') matchesType = (u.status === 'blocked');

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12 h-full flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ec-border pb-5 shrink-0">
        <div>
          <h2 className="text-2xl font-semibold text-ec-highlight tracking-tight flex items-center gap-2">
            <Users className="text-ec-accent" size={22} />
            Institutional User Directory
          </h2>
          <p className="text-xs text-ec-text-sub mt-1">
            Search, monitor, suspend, or remove registered students and alumni linked to your institution.
          </p>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 shrink-0 md:hidden">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-ec-text-sub/50" />
          <input 
            type="text"
            placeholder="Search directory by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-ec-surface/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent transition-all font-medium"
          />
        </div>
        
        <div className="relative shrink-0">
          <Filter size={16} className="absolute left-3 top-3 text-ec-text-sub/50 pointer-events-none" />
          <select 
            value={filterType}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set('type', e.target.value);
              setSearchParams(newParams);
            }}
            className="pl-9 pr-8 py-2.5 bg-ec-surface/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent transition-all font-normal appearance-none cursor-pointer"
          >
            <option value="all">All Directory</option>
            <option value="student">Active Students</option>
            <option value="alumni">Active Alumni</option>
            <option value="blocked">Suspended Users</option>
          </select>
        </div>
      </div>

      {/* Directory Glass Sheet */}
      <div className="flex-1 glass-card flex flex-col rounded-sm overflow-hidden">
        <div className="overflow-x-auto flex-1 max-h-[550px] overflow-y-auto scrollbar-thin">
          
          {/* Desktop Table View */}
          <table className="w-full text-left border-collapse hidden md:table">
            <thead className="sticky top-0 bg-ec-surface/95 backdrop-blur-md z-10 shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
              <tr className="border-b border-ec-border">
                <th className="px-5 py-3.5 text-xs font-semibold text-ec-text-sub uppercase tracking-wider">Candidate Profile</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-ec-text-sub uppercase tracking-wider">Professional Data</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-ec-text-sub uppercase tracking-wider">Role</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-ec-text-sub uppercase tracking-wider">Security State</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-ec-text-sub uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-ec-border/60">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-ec-muted/50 rounded w-3/4 mb-2"></div><div className="h-3 bg-ec-muted/30 rounded w-1/2"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-ec-muted/50 rounded w-24"></div></td>
                    <td className="px-5 py-4"><div className="h-5 bg-ec-muted/50 rounded-full w-16"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-ec-muted/50 rounded w-16"></div></td>
                    <td className="px-5 py-4"><div className="h-6 bg-ec-muted/50 rounded w-6 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-ec-text-sub">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ec-muted/30 mb-3">
                      <Search size={20} className="opacity-50" />
                    </div>
                    <p className="text-sm font-medium">No directory records found.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-ec-surface/50 hover:border-ec-accent/20 transition-all duration-250 group border-b border-ec-border/45">
                    
                    {/* User Profile */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-sm text-ec-highlight group-hover:text-ec-accent transition-colors flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-ec-muted text-ec-highlight flex items-center justify-center uppercase font-bold text-xs">
                          {u.name?.charAt(0) || '?'}
                        </div>
                        {u.name}
                      </div>
                      <div className="text-xs text-ec-text-sub mt-1.5 flex items-center gap-1">
                        <Mail size={12} /> {u.email}
                      </div>
                    </td>

                    {/* Pro Info / Batch */}
                    <td className="px-5 py-4 max-w-[280px]">
                      {u.role === 'student' ? (
                        <div className="space-y-1 text-xs text-ec-text-sub">
                          <div className="text-sm font-normal text-ec-text">Roll No: {u.rollNo || 'N/A'}</div>
                          <div>Branch: {u.branch || 'N/A'}</div>
                          <div className="flex gap-2 text-[11px]">
                            <span>Year: {u.currentYear || 'N/A'}</span>
                            <span>|</span>
                            <span>Class of {u.batch || 'N/A'}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1 text-xs text-ec-text-sub">
                          {u.company || u.designation ? (
                            <div className="flex items-start gap-1 text-sm font-normal text-ec-text">
                              <Briefcase size={13} className="text-ec-text-sub mt-0.5 shrink-0" />
                              <span>{u.designation || 'Alumni'} at {u.company || 'N/A'}</span>
                            </div>
                          ) : (
                            <div className="text-sm font-normal text-ec-text">Class of {u.batch || 'N/A'}</div>
                          )}
                          <div className="flex items-center gap-2 text-[11px]">
                            <span>Branch: {u.branch || 'N/A'}</span>
                            {u.company || u.designation ? (
                              <>
                                <span>|</span>
                                <span>Class of {u.batch || 'N/A'}</span>
                              </>
                            ) : null}
                          </div>
                          {u.linkedin && (
                            <div className="pt-0.5">
                              <a 
                                href={u.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1 text-ec-accent hover:underline text-[11px] mt-0.5"
                              >
                                🔗 LinkedIn
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        u.role === 'student' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                           : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    {/* Security State */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        u.status === 'approved' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {u.status === 'approved' ? 'Verified' : 'Suspended'}
                      </span>
                    </td>
                    
                    {/* Action Menu */}
                    <td className="px-5 py-4 text-right relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionMenuOpen(actionMenuOpen === u.id ? null : u.id);
                        }}
                        className="p-1.5 rounded-md text-ec-text-sub hover:text-ec-highlight hover:bg-ec-muted/50 transition-colors"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {actionMenuOpen === u.id && (
                        <div 
                          className="absolute right-8 top-10 w-44 bg-ec-surface border border-ec-border rounded-lg shadow-2xl py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button 
                            onClick={() => handleToggleBlock(u.id, u.status, u.role)}
                            className="w-full px-4 py-2 text-xs font-normal text-ec-highlight hover:bg-ec-muted/50 flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-transparent"
                          >
                            {u.status === 'approved' ? (
                              <><ShieldAlert size={14} className="text-orange-400" /> Suspend User</>
                            ) : (
                              <><ShieldCheck size={14} className="text-emerald-400" /> Verify/Unblock</>
                            )}
                          </button>

                          <div className="h-px bg-ec-border/40 my-1"></div>
                           
                          <button 
                            onClick={() => handleDeleteUser(u.id, u.name, u.status, u.role)}
                            className="w-full px-4 py-2 text-xs font-normal text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-transparent"
                          >
                            <Trash2 size={14} /> Remove Profile
                          </button>
                        </div>
                      )}
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
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-ec-text-sub">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-ec-muted/30 mb-2">
                  <Search size={16} className="opacity-50" />
                </div>
                <p className="text-xs font-medium">No directory records found.</p>
              </div>
            ) : (
              filteredUsers.map((u) => (
                <div key={u.id} className="p-5 my-3 mx-2 rounded-sm glass-card space-y-4 border border-ec-border/20 relative overflow-hidden transition-all duration-300">
                  {/* Candidate Profile Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-md bg-ec-muted text-ec-highlight flex items-center justify-center uppercase font-bold text-sm shrink-0">
                        {u.name?.charAt(0) || '?'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-ec-highlight truncate">{u.name}</div>
                        <div className="text-[11.5px] text-ec-text-sub flex items-center gap-1 mt-0.5 truncate">
                          <Mail size={11} className="shrink-0" /> {u.email}
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                      u.role === 'student' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}>
                      {u.role}
                    </span>
                  </div>

                  {/* Professional / Branch info */}
                  <div className="text-xs text-ec-text-sub bg-ec-root/30 border border-ec-border/40 p-2.5 rounded-lg space-y-1">
                    {u.role === 'student' ? (
                      <div className="space-y-0.5">
                        <div><span className="font-semibold text-ec-highlight">Roll No:</span> {u.rollNo || 'N/A'}</div>
                        <div><span className="font-semibold text-ec-highlight">Branch:</span> {u.branch || 'N/A'}</div>
                        <div className="flex gap-3">
                          <span><span className="font-semibold text-ec-highlight">Year:</span> {u.currentYear || 'N/A'}</span>
                          <span>|</span>
                          <span><span className="font-semibold text-ec-highlight">Batch:</span> {u.batch || 'N/A'}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        {u.company || u.designation ? (
                          <div className="flex items-start gap-1">
                            <Briefcase size={12} className="text-ec-text-sub mt-0.5 shrink-0" />
                            <span>{u.designation || 'Alumni'} at {u.company || 'N/A'}</span>
                          </div>
                        ) : (
                          <div><span className="font-semibold text-ec-highlight">Batch:</span> Class of {u.batch || 'N/A'}</div>
                        )}
                        <div><span className="font-semibold text-ec-highlight">Branch:</span> {u.branch || 'N/A'}</div>
                        {u.linkedin && (
                          <div className="pt-1.5 border-t border-ec-border/20 mt-1">
                            <a 
                              href={u.linkedin} 
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

                  {/* Security Status & Quick Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      u.status === 'approved' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {u.status === 'approved' ? 'Verified' : 'Suspended'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleToggleBlock(u.id, u.status, u.role)}
                        className="px-3 py-1.5 bg-ec-surface hover:bg-ec-muted border border-ec-border hover:border-ec-accent/30 rounded-xl text-[10.5px] font-bold flex items-center gap-1.5 text-ec-text-sub hover:text-ec-highlight transition-all cursor-pointer shadow-sm"
                      >
                        {u.status === 'approved' ? (
                           <><ShieldAlert size={12} className="text-orange-400 shrink-0" /> Suspend</>
                        ) : (
                           <><ShieldCheck size={12} className="text-emerald-400 shrink-0" /> Unblock</>
                        )}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(u.id, u.name, u.status, u.role)}
                        className="p-2 text-red-400 hover:text-white hover:bg-red-500 rounded-xl border border-transparent transition-all cursor-pointer"
                        title="Remove Profile"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
        
        {!loading && filteredUsers.length > 0 && (
          <div className="p-4 border-t border-ec-border bg-ec-surface/30 text-xs text-ec-text-sub text-center">
            Showing {filteredUsers.length} directory record(s)
          </div>
        )}
      </div>

      {hasMore && !loading && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setLimitCount(prev => prev + 15)}
            className="px-4 py-2 bg-ec-surface hover:bg-ec-muted border border-ec-border hover:border-ec-accent/40 rounded-lg text-xs font-bold text-ec-text transition-all cursor-pointer shadow-sm"
          >
            Load More Users
          </button>
        </div>
      )}

    </div>
  );
}
