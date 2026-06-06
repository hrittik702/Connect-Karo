import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Plus, 
  Filter,
  MoreVertical,
  ShieldBan,
  Trash2,
  ExternalLink,
  Users,
  GraduationCap
} from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

export default function CollegeList() {
  const navigate = useNavigate();
  
  // States
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'suspended'
  const [actionMenuOpen, setActionMenuOpen] = useState(null); // Tracks which row's menu is open

  // Real-time Data Fetching Pipeline
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const { data, error } = await supabase
          .from('colleges')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setColleges(data || []);
      } catch (err) {
        console.error("Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();

    // Setup Postgres realtime listener for colleges table
    const channel = supabase
      .channel('public:colleges')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'colleges' }, () => {
        fetchColleges();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Action Logic: Toggle Status (Suspend/Activate)
  const handleToggleStatus = async (collegeId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      const { error } = await supabase
        .from('colleges')
        .update({ status: newStatus })
        .eq('id', collegeId);

      if (error) throw error;
      setActionMenuOpen(null);
    } catch (err) {
      console.error("Status Update Failed:", err);
      alert("Status update karne mein dikkat aayi.");
    }
  };

  // Action Logic: Delete College (Requires confirmation)
  const handleDelete = async (collegeId, collegeName) => {
    const isConfirmed = window.confirm(`WARNING: Kya aap sach mein '${collegeName}' ka data delete karna chahte hain? Ye undo nahi hoga.`);
    if (isConfirmed) {
      try {
        const { error } = await supabase
          .from('colleges')
          .delete()
          .eq('id', collegeId);

        if (error) throw error;
        setActionMenuOpen(null);
      } catch (err) {
        console.error("Deletion Failed:", err);
        alert("College delete karne mein error aaya.");
      }
    }
  };

  // Close action menus if clicked outside
  useEffect(() => {
    const handleClickOutside = () => setActionMenuOpen(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Filter & Search Engine
  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          college.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || college.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12 h-full flex flex-col">
      
      {/* ── HEADER & CONTROLS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ec-border pb-5 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-ec-highlight tracking-tight flex items-center gap-2">
            <Building2 className="text-ec-accent" size={22} />
            Master College Directory
          </h2>
          <p className="text-xs text-ec-text-sub mt-1">Platform par onboarded saare colleges ko manage aur monitor karein.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/colleges/add')}
          className="px-4 py-2 bg-ec-accent hover:bg-ec-accent-hover text-white font-bold rounded-lg text-[13px] transition-all flex items-center gap-2 shadow-lg shadow-ec-accent/10 whitespace-nowrap"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add New College</span>
        </button>
      </div>

      {/* ── SEARCH & FILTER BAR ── */}
      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-ec-text-sub/50" />
          <input 
            type="text"
            placeholder="Search by college name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-ec-surface/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent transition-all font-medium"
          />
        </div>
        <div className="relative shrink-0">
          <Filter size={16} className="absolute left-3 top-3 text-ec-text-sub/50 pointer-events-none" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-ec-surface/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent transition-all font-semibold appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* ── MAIN DATA GRID ── */}
      <div className="flex-1 surface-card border border-ec-border rounded-xl overflow-hidden flex flex-col bg-transparent">
        <div className="overflow-x-auto flex-1">
          
          {/* Desktop Table View */}
          <table className="w-full text-left border-collapse hidden md:table">
            <thead>
              <tr className="bg-ec-surface/40 border-b border-ec-border">
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">Institution Details</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">Domain & Code</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider text-center">Network Size</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-ec-border/60">
              {loading ? (
                // Loading Skeleton
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-ec-muted/50 rounded w-3/4 mb-2"></div><div className="h-3 bg-ec-muted/30 rounded w-1/2"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-ec-muted/50 rounded w-24"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-ec-muted/50 rounded w-16 mx-auto"></div></td>
                    <td className="px-5 py-4"><div className="h-5 bg-ec-muted/50 rounded-full w-16"></div></td>
                    <td className="px-5 py-4"><div className="h-6 bg-ec-muted/50 rounded w-6 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredColleges.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-ec-text-sub">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ec-muted/30 mb-3">
                      <Search size={20} className="opacity-50" />
                    </div>
                    <p className="text-sm">Koi college data nahi mila.</p>
                  </td>
                </tr>
              ) : (
                // Data Rows
                filteredColleges.map((college) => (
                  <tr key={college.id} className="hover:bg-ec-surface/80 transition-colors group">
                    
                    {/* Col 1: Name */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[13px] text-ec-highlight group-hover:text-ec-accent transition-colors">
                        {college.name}
                      </div>
                      <div className="text-[11px] text-ec-text-sub mt-0.5">
                        Added: {college.created_at 
                          ? new Date(college.created_at).toLocaleDateString('en-GB') 
                          : 'Recently'}
                      </div>
                    </td>

                    {/* Col 2: Domain & Code */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-[12px] font-mono text-ec-text-sub">
                        <span className="px-1.5 py-0.5 rounded bg-ec-muted/40 border border-ec-border font-bold text-ec-highlight">
                          {college.id}
                        </span>
                      </div>
                      <div className="text-[11px] text-ec-accent mt-1 hover:underline cursor-pointer">
                        {college.domain}
                      </div>
                    </td>

                    {/* Col 3: Stats */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-4 text-ec-text-sub">
                        <div className="flex items-center gap-1.5 tooltip-trigger" title="Total Students">
                          <Users size={14} />
                          <span className="text-[12px] font-medium">{college.metrics?.totalStudents || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 tooltip-trigger" title="Total Alumni">
                          <GraduationCap size={14} />
                          <span className="text-[12px] font-medium">{college.metrics?.totalAlumni || 0}</span>
                        </div>
                      </div>
                    </td>

                    {/* Col 4: Status Badge */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        college.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {college.status}
                      </span>
                    </td>

                    {/* Col 5: Actions */}
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

                      {/* Light Theme Action Dropdown */}
                      {actionMenuOpen === college.id && (
                        <div 
                          className="absolute right-8 top-10 w-44 bg-white border border-gray-200 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.2)] py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button 
                            onClick={() => navigate(`/admin/colleges/${college.id}`)}
                            className="w-full px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-transparent"
                          >
                            <ExternalLink size={14} /> View Details
                          </button>
                          
                          <button 
                            onClick={() => handleToggleStatus(college.id, college.status)}
                            className="w-full px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-transparent"
                          >
                            <ShieldBan size={14} className={college.status === 'active' ? 'text-orange-500' : 'text-emerald-500'} /> 
                            {college.status === 'active' ? 'Suspend College' : 'Activate College'}
                          </button>

                          <div className="h-px bg-gray-100 my-1"></div>
                          
                          <button 
                            onClick={() => handleDelete(college.id, college.name)}
                            className="w-full px-4 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-transparent"
                          >
                            <Trash2 size={14} /> Delete Record
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
            ) : filteredColleges.length === 0 ? (
              <div className="p-8 text-center text-ec-text-sub">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-ec-muted/30 mb-2">
                  <Search size={16} className="opacity-50" />
                </div>
                <p className="text-xs font-medium">Koi college data nahi mila.</p>
              </div>
            ) : (
              filteredColleges.map((college) => (
                <div key={college.id} className="p-4 space-y-3 hover:bg-ec-surface/85 transition-colors">
                  {/* Institution Title & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-ec-surface border border-ec-border flex items-center justify-center font-bold text-ec-highlight group-hover:text-ec-accent transition-all shrink-0">
                        {college.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-ec-highlight truncate">{college.name}</div>
                        <div className="text-[11.5px] text-ec-accent hover:underline mt-0.5 truncate cursor-pointer">
                          {college.domain}
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                      college.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {college.status}
                    </span>
                  </div>

                  {/* Details block */}
                  <div className="text-xs text-ec-text-sub bg-ec-root/30 border border-ec-border/40 p-2.5 rounded-lg space-y-1.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-ec-highlight">Code:</span>{' '}
                      <span className="px-1.5 py-0.5 rounded bg-ec-muted/40 border border-ec-border font-bold text-[10.5px] font-mono text-ec-highlight">
                        {college.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1" title="Students">
                        <Users size={12} className="text-ec-text-sub" />
                        <span className="font-bold text-ec-highlight text-[11px]">{college.metrics?.totalStudents || 0}</span>
                      </div>
                      <div className="flex items-center gap-1" title="Alumni">
                        <GraduationCap size={12} className="text-ec-text-sub" />
                        <span className="font-bold text-ec-highlight text-[11px]">{college.metrics?.totalAlumni || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-ec-text-sub font-mono">
                      Added: {college.created_at ? new Date(college.created_at).toLocaleDateString('en-GB') : 'Recently'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => navigate(`/admin/colleges/${college.id}`)}
                        className="px-2.5 py-1.5 bg-ec-surface hover:bg-ec-muted border border-ec-border rounded-lg text-[10.5px] font-bold flex items-center gap-1 text-ec-text-sub hover:text-ec-highlight transition-all cursor-pointer shadow-sm"
                      >
                        <ExternalLink size={12} /> Details
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionMenuOpen(actionMenuOpen === college.id ? null : college.id);
                        }}
                        className="p-1.5 rounded-lg text-ec-text-sub hover:text-ec-highlight hover:bg-ec-muted/50 border border-transparent transition-all cursor-pointer relative"
                      >
                        <MoreVertical size={16} />

                        {actionMenuOpen === college.id && (
                          <div 
                            className="absolute right-0 bottom-9 w-44 bg-white border border-gray-200 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.2)] py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button 
                              onClick={() => handleToggleStatus(college.id, college.status)}
                              className="w-full px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-transparent"
                            >
                              <ShieldBan size={14} className={college.status === 'active' ? 'text-orange-500' : 'text-emerald-500'} /> 
                              {college.status === 'active' ? 'Suspend Node' : 'Activate Node'}
                            </button>

                            <div className="h-px bg-gray-100 my-1"></div>
                            
                            <button 
                              onClick={() => handleDelete(college.id, college.name)}
                              className="w-full px-4 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-transparent"
                            >
                              <Trash2 size={14} /> Delete Node
                            </button>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
        
        {/* Table Footer */}
        {!loading && filteredColleges.length > 0 && (
          <div className="p-4 border-t border-ec-border bg-ec-surface/30 text-xs text-ec-text-sub text-center">
            Showing {filteredColleges.length} registered institution(s)
          </div>
        )}
      </div>

    </div>
  );
}