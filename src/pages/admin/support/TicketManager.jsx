import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Search, 
  Filter, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  Building2,
  Calendar,
  Save,
  RefreshCw,
  X,
  Mail,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

export default function TicketManager() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // KPI Stats
  const [stats, setStats] = useState({ open: 0, critical: 0, resolved: 0 });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');

  // ── DATA FETCHING PIPELINE ──
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data, error } = await supabase
          .from('root_support_tickets')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        const mappedTickets = (data || []).map(t => ({
          id: t.id,
          subject: t.subject,
          collegeName: t.name,
          collegeEmail: t.email,
          description: t.message,
          priority: 'medium', // Default priority as it is not in the DDL
          status: t.status, // 'pending', 'resolved', 'closed'
          createdAt: t.created_at
        }));
        
        let openCount = 0; let criticalCount = 0; let resolvedCount = 0;
        mappedTickets.forEach(t => {
          if (t.status === 'pending' || t.status === 'open' || t.status === 'in_progress') openCount++;
          // Priority heuristic based on keywords
          if (t.subject?.toLowerCase().includes('urgent') || t.description?.toLowerCase().includes('critical') || t.description?.toLowerCase().includes('urgent')) {
            t.priority = 'critical';
          }
          if ((t.status === 'pending' || t.status === 'open' || t.status === 'in_progress') && t.priority === 'critical') criticalCount++;
          if (t.status === 'resolved' || t.status === 'closed') resolvedCount++;
        });

        setTickets(mappedTickets);
        setStats({ open: openCount, critical: criticalCount, resolved: resolvedCount });
      } catch (err) {
        console.error("Support Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();

    const channel = supabase
      .channel('root-support-tickets-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'root_support_tickets' }, () => {
        fetchTickets();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ── UPDATE TICKET STATUS ──
  const handleUpdateTicket = async () => {
    if (!selectedTicket || !updateStatus || updateStatus === selectedTicket.status) return;
    setIsProcessing(true);
    
    try {
      const { error } = await supabase
        .from('root_support_tickets')
        .update({
          status: updateStatus
        })
        .eq('id', selectedTicket.id);

      if (error) throw error;
      setIsModalOpen(false);
    } catch (error) {
      console.error("Ticket update error:", error);
      alert("Ticket status update failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ── FORMATTING UTILITIES ──
  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return d.toLocaleString('en-IN', { 
      day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', hour12: true 
    });
  };

  const openTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setUpdateStatus(ticket.status);
    setIsModalOpen(true);
  };

  // ── UI HELPERS ──
  const getPriorityBadge = (priority) => {
    const p = priority?.toLowerCase() || 'low';
    if (p === 'critical') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase">Critical</span>;
    if (p === 'high') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase">High</span>;
    if (p === 'medium') return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">Medium</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20 uppercase">Low</span>;
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'open';
    if (s === 'resolved') return <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400"><CheckCircle2 size={12}/> Resolved</span>;
    if (s === 'in_progress') return <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-400"><RefreshCw size={12} className="animate-spin"/> In Progress</span>;
    return <span className="flex items-center gap-1 text-[11px] font-semibold text-orange-400"><Clock size={12}/> Open</span>;
  };

  // ── FILTER ENGINE ──
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.collegeEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const KPICard = ({ title, value, icon: Icon, colorTheme, glowTheme }) => (
    <div className="surface-card p-5 border border-ec-border rounded-xl relative overflow-hidden group">
      <div className={`absolute -top-6 -right-6 w-24 h-24 opacity-10 blur-2xl rounded-full transition-transform duration-500 group-hover:scale-150 ${glowTheme}`} />
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[12px] font-semibold text-ec-text-sub tracking-wide uppercase mb-1.5">{title}</p>
          <h3 className="text-2xl font-bold text-ec-highlight tracking-tight">
            {loading ? <span className="animate-pulse bg-ec-muted/50 text-transparent rounded inline-block w-10">00</span> : value}
          </h3>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colorTheme}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12 h-full flex flex-col">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ec-border pb-5 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-ec-highlight tracking-tight flex items-center gap-2">
            <Ticket className="text-ec-accent" size={22} />
            Global Support Helpdesk
          </h2>
          <p className="text-xs text-ec-text-sub mt-1">Monitor, track, and resolve institutional support requests securely.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
          <ShieldCheck size={14} /> End-to-End Encrypted Data
        </div>
      </div>

      {/* ── KPI GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
        <KPICard title="Active Pending Tickets" value={stats.open} icon={Clock} colorTheme="bg-orange-500/10 text-orange-400 border-orange-500/20" glowTheme="bg-orange-500" />
        <KPICard title="Critical Alerts" value={stats.critical} icon={AlertOctagon} colorTheme="bg-red-500/10 text-red-400 border-red-500/20" glowTheme="bg-red-500" />
        <KPICard title="Resolved Issues" value={stats.resolved} icon={CheckCircle2} colorTheme="bg-emerald-500/10 text-emerald-400 border-emerald-500/20" glowTheme="bg-emerald-500" />
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-ec-text-sub/50" />
          <input 
            type="text"
            placeholder="Search by subject, Ticket ID, or College Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-ec-surface/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent transition-all font-medium"
          />
        </div>
        
        <div className="flex gap-3">
          <div className="relative shrink-0 w-36">
            <Filter size={16} className="absolute left-3 top-3 text-ec-text-sub/50 pointer-events-none" />
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-ec-surface/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent transition-all font-semibold appearance-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div className="relative shrink-0 w-36">
            <Filter size={16} className="absolute left-3 top-3 text-ec-text-sub/50 pointer-events-none" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-ec-surface/60 border border-ec-border rounded-lg text-sm text-ec-text outline-none focus:border-ec-accent transition-all font-semibold appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── TICKETS DATA GRID ── */}
      <div className="flex-1 surface-card border border-ec-border rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ec-surface/40 border-b border-ec-border">
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">Issue Reference</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">Institution & Contact</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">Priority Level</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider">Current Status</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-ec-text-sub uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-ec-border/60">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-ec-muted/50 rounded w-48 mb-2"></div><div className="h-3 bg-ec-muted/30 rounded w-20"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-ec-muted/50 rounded w-32 mb-2"></div><div className="h-3 bg-ec-muted/30 rounded w-24"></div></td>
                    <td className="px-5 py-4"><div className="h-5 bg-ec-muted/50 rounded w-16"></div></td>
                    <td className="px-5 py-4"><div className="h-4 bg-ec-muted/50 rounded w-24"></div></td>
                    <td className="px-5 py-4"><div className="h-8 bg-ec-muted/50 rounded w-20 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-ec-text-sub">
                    <Ticket size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No support tickets found.</p>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-ec-surface/80 transition-colors group cursor-pointer" onClick={() => openTicketDetails(ticket)}>
                    
                    {/* Column 1: Issue Subject & Timestamp */}
                    <td className="px-5 py-4 max-w-xs truncate">
                      <div className="font-semibold text-[13px] text-ec-highlight group-hover:text-ec-accent transition-colors truncate">
                        {ticket.subject || "No Subject Provided"}
                      </div>
                      <div className="text-[10px] text-ec-text-sub font-mono mt-1 flex items-center gap-1.5">
                        <span className="bg-ec-muted/40 px-1.5 py-0.5 rounded text-ec-highlight">{ticket.id.slice(0,8).toUpperCase()}</span> 
                        <span>•</span>
                        {formatDateTime(ticket.createdAt)}
                      </div>
                    </td>

                    {/* Column 2: College Data & Email */}
                    <td className="px-5 py-4">
                      <div className="text-[12px] font-semibold text-ec-text flex items-center gap-1.5">
                        <Building2 size={12} className="text-ec-text-sub" />
                        {ticket.collegeName || "Unknown Node"}
                      </div>
                      <div className="text-[11px] text-ec-accent mt-0.5 flex items-center gap-1.5 hover:underline" onClick={(e) => e.stopPropagation()}>
                        <Mail size={10} />
                        <a href={`mailto:${ticket.collegeEmail || ''}`}>{ticket.collegeEmail || "No Email Provided"}</a>
                      </div>
                    </td>

                    {/* Column 3: Priority */}
                    <td className="px-5 py-4">{getPriorityBadge(ticket.priority)}</td>

                    {/* Column 4: Status */}
                    <td className="px-5 py-4">{getStatusBadge(ticket.status)}</td>

                    {/* Column 5: Action Button */}
                    <td className="px-5 py-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); openTicketDetails(ticket); }}
                        className="px-3 py-1.5 bg-ec-surface/80 border border-ec-border hover:border-ec-accent/50 rounded-lg text-[11px] font-semibold text-ec-highlight transition-all"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── LIGHT THEME RESOLUTION MODAL WITH TRACKER ── */}
      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div 
            className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-gray-900 leading-tight">Secure Ticket Investigation</h3>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">REF: {selectedTicket.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              
              {/* STATUS TRACKER PIPELINE */}
              <div className="mb-2">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-3 tracking-wider">Resolution Lifecycle Tracker</p>
                <div className="flex items-center justify-between relative px-2">
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-gray-100 rounded-full z-0"></div>
                  
                  {/* Step 1: Open */}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md ring-4 ring-white"><Clock size={12} /></div>
                    <span className="text-[10px] font-bold text-gray-700">Ticket Opened</span>
                  </div>

                  {/* Step 2: In Progress */}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md ring-4 ring-white transition-colors ${selectedTicket.status === 'in_progress' || selectedTicket.status === 'resolved' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      <RefreshCw size={12} className={selectedTicket.status === 'in_progress' ? 'animate-spin' : ''} />
                    </div>
                    <span className={`text-[10px] font-bold ${selectedTicket.status === 'in_progress' || selectedTicket.status === 'resolved' ? 'text-gray-700' : 'text-gray-400'}`}>Investigation</span>
                  </div>

                  {/* Step 3: Resolved */}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md ring-4 ring-white transition-colors ${selectedTicket.status === 'resolved' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      <CheckCircle2 size={12} />
                    </div>
                    <span className={`text-[10px] font-bold ${selectedTicket.status === 'resolved' ? 'text-gray-700' : 'text-gray-400'}`}>Issue Resolved</span>
                  </div>
                </div>
              </div>

              {/* Ticket Meta Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="sm:col-span-2">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Institution & Contact</p>
                  <p className="text-[12px] font-semibold text-gray-800 flex items-center gap-1.5 truncate"><Building2 size={12} className="text-gray-400 shrink-0"/> {selectedTicket.collegeName || "System Node"}</p>
                  <a href={`mailto:${selectedTicket.collegeEmail}`} className="text-[11px] font-medium text-blue-600 hover:underline flex items-center gap-1.5 mt-1 truncate">
                    <Mail size={10} className="shrink-0" /> {selectedTicket.collegeEmail || "No Email Provided"}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Timestamp</p>
                  <p className="text-[11px] font-semibold text-gray-800"><Calendar size={12} className="inline mr-1 text-gray-400"/> {formatDateTime(selectedTicket.createdAt)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Priority</p>
                  <div>{getPriorityBadge(selectedTicket.priority)}</div>
                </div>
              </div>

              {/* Subject & Description */}
              <div>
                <h4 className="text-[14px] font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <ChevronRight size={18} className="text-blue-500 shrink-0 mt-0.5" /> 
                  {selectedTicket.subject}
                </h4>
                <div className="p-4 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-600 leading-relaxed whitespace-pre-wrap shadow-inner min-h-[100px] font-medium">
                  {selectedTicket.description || "No specific description provided by the institution."}
                </div>
              </div>

              {/* Status Update Control */}
              <div className="pt-4 border-t border-gray-100">
                <label className="text-[12px] font-bold text-gray-800 mb-2 block">Execute State Transition</label>
                <div className="flex gap-3">
                  <select 
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-[13px] font-bold text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 shadow-sm"
                  >
                    <option value="open">Re-open Ticket (Unassigned)</option>
                    <option value="in_progress">Mark as In Progress (Investigating)</option>
                    <option value="resolved">Mark as Resolved (Closed)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={isProcessing}
                className="px-5 py-2.5 text-[13px] font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close Panel
              </button>
              <button 
                onClick={handleUpdateTicket}
                disabled={isProcessing || updateStatus === selectedTicket.status}
                className="px-5 py-2.5 text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                Commit Status Change
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}