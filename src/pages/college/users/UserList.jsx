import React, { useState, useEffect } from 'react';
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
import { db } from '../../../firebase/config';
import { collection, onSnapshot, query, where, doc, updateDoc, deleteDoc, increment } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

export default function CollegeUserList() {
  const { userData } = useAuth();
  const collegeId = userData?.collegeId || '';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'student', 'alumni', 'blocked'
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClose = () => setActionMenuOpen(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  // Fetch verified & blocked users
  useEffect(() => {
    if (!collegeId) return;

    // Fetch all users in college, filter status in React state
    const q = query(
      collection(db, 'users'), 
      where('collegeId', '==', collegeId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach((docSnap) => {
        const u = { id: docSnap.id, ...docSnap.data() };
        // We only show approved & blocked users here (pending requests have their own requests tab)
        if ((u.status === 'approved' || u.status === 'blocked') && u.role !== 'college_admin' && u.role !== 'root_admin') {
          data.push(u);
        }
      });
      setUsers(data);
      setLoading(false);
    }, (error) => {
      console.error("Fetch users list error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collegeId]);

  // Toggle user block/active state
  const handleToggleBlock = async (userId, currentStatus, role) => {
    setActionMenuOpen(null);
    try {
      const newStatus = currentStatus === 'approved' ? 'blocked' : 'approved';
      await updateDoc(doc(db, 'users', userId), { status: newStatus });
      
      // Sync stats: If blocked, decrement count. If unblocked, increment count.
      const metricsField = role === 'student' ? 'metrics.totalStudents' : 'metrics.totalAlumni';
      const incVal = newStatus === 'blocked' ? -1 : 1;
      await updateDoc(doc(db, 'colleges', collegeId), {
        [metricsField]: increment(incVal)
      });
    } catch (error) {
      console.error("Toggle block error:", error);
      alert("Block toggling failed.");
    }
  };

  // Delete user from directory
  const handleDeleteUser = async (userId, userName, currentStatus, role) => {
    setActionMenuOpen(null);
    const isConfirmed = window.confirm(`WARNING: Are you sure you want to permanently delete '${userName}'? This cannot be undone.`);
    if (!isConfirmed) return;

    try {
      await deleteDoc(doc(db, 'users', userId));

      // Decrement metrics only if the deleted user was active ('approved')
      if (currentStatus === 'approved') {
        const metricsField = role === 'student' ? 'metrics.totalStudents' : 'metrics.totalAlumni';
        await updateDoc(doc(db, 'colleges', collegeId), {
          [metricsField]: increment(-1)
        });
      }
    } catch (error) {
      console.error("Delete user error:", error);
      alert("User deletion failed.");
    }
  };

  // Search & Filtration logic
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
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
          <h2 className="text-xl font-bold text-ec-highlight tracking-tight flex items-center gap-2">
            <Users className="text-ec-accent" size={22} />
            Institutional User Directory
          </h2>
          <p className="text-xs text-ec-text-sub mt-1">
            Search, monitor, suspend, or remove registered students and alumni linked to your institution.
          </p>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
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
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-ec-surface/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent transition-all font-semibold appearance-none cursor-pointer"
          >
            <option value="all">All Directory</option>
            <option value="student">Active Students</option>
            <option value="alumni">Active Alumni</option>
            <option value="blocked">Suspended Users</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="flex-1 surface-card border border-ec-border rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1 max-h-[550px] overflow-y-auto scrollbar-thin">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-ec-surface/95 backdrop-blur-md z-10 shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
              <tr className="border-b border-ec-border">
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">Candidate Profile</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">Professional Data</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">Role</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">Security State</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider text-right">Actions</th>
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
                  <tr key={u.id} className="hover:bg-ec-surface/80 transition-colors group">
                    
                    {/* User Profile */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[13px] text-ec-highlight group-hover:text-ec-accent transition-colors flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-ec-muted text-ec-highlight flex items-center justify-center uppercase font-extrabold text-[10px]">
                          {u.name?.charAt(0) || '?'}
                        </div>
                        {u.name}
                      </div>
                      <div className="text-[10px] text-ec-text-sub mt-0.5 flex items-center gap-1">
                        <Mail size={11} /> {u.email}
                      </div>
                    </td>

                    {/* Pro Info / Batch */}
                    <td className="px-5 py-4 max-w-[280px]">
                      {u.role === 'student' ? (
                        <div className="space-y-0.5 text-[11px] text-ec-text-sub">
                          <div className="text-[12px] font-medium text-ec-text">Roll No: {u.rollNo || 'N/A'}</div>
                          <div>Branch: {u.branch || 'N/A'}</div>
                          <div className="flex gap-2">
                            <span>Year: {u.currentYear || 'N/A'}</span>
                            <span>|</span>
                            <span>Class of {u.batch || 'N/A'}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-0.5 text-[11px] text-ec-text-sub">
                          {u.company || u.designation ? (
                            <div className="flex items-start gap-1 text-[12px] font-medium text-ec-text">
                              <Briefcase size={12} className="text-ec-text-sub mt-0.5 shrink-0" />
                              <span>{u.designation || 'Alumni'} at {u.company || 'N/A'}</span>
                            </div>
                          ) : (
                            <div className="text-[12px] font-medium text-ec-text">Class of {u.batch || 'N/A'}</div>
                          )}
                          <div className="flex items-center gap-2">
                            <span>Branch: {u.branch || 'N/A'}</span>
                            <span>|</span>
                            <span>Class of {u.batch || 'N/A'}</span>
                          </div>
                          {u.linkedin && (
                            <div>
                              <a 
                                href={u.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1 text-ec-accent hover:underline text-[10px] mt-0.5"
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
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'student' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    {/* Security State */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                          className="absolute right-8 top-10 w-44 bg-white border border-gray-200 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.2)] py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button 
                            onClick={() => handleToggleBlock(u.id, u.status, u.role)}
                            className="w-full px-4 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                          >
                            {u.status === 'approved' ? (
                              <><ShieldAlert size={14} className="text-orange-500" /> Suspend User</>
                            ) : (
                              <><ShieldCheck size={14} className="text-emerald-500" /> Verify/Unblock</>
                            )}
                          </button>

                          <div className="h-px bg-gray-100 my-1"></div>
                          
                          <button 
                            onClick={() => handleDeleteUser(u.id, u.name, u.status, u.role)}
                            className="w-full px-4 py-2 text-[12px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
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
        </div>
        
        {!loading && filteredUsers.length > 0 && (
          <div className="p-4 border-t border-ec-border bg-ec-surface/30 text-xs text-ec-text-sub text-center">
            Showing {filteredUsers.length} directory record(s)
          </div>
        )}
      </div>

    </div>
  );
}
