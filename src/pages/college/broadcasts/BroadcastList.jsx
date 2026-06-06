import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Radio, 
  Clock, 
  AlertTriangle, 
  Info, 
  ShieldAlert,
  Users,
  Server
} from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';

export default function BroadcastList() {
  const { userData } = useAuth();
  const collegeId = userData?.collegeId || '';

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collegeDetails, setCollegeDetails] = useState(null);

  const [searchParams] = useSearchParams();
  const priority = searchParams.get('priority') || 'all'; // 'all', 'critical', 'general'
  const querySearch = searchParams.get('search') || '';

  // 1. Fetch college domain/status configuration
  useEffect(() => {
    if (!collegeId) return;
    const fetchCollegeDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('colleges')
          .select('*')
          .eq('id', collegeId)
          .single();
        if (error) throw error;
        setCollegeDetails(data);
      } catch (err) {
        console.error("Fetch college details error:", err);
        // Fallback college details for local development / dummy login / missing records
        setCollegeDetails({
          status: 'active',
          subscription: { plan: 'free' }
        });
      }
    };
    fetchCollegeDetails();
  }, [collegeId]);

  // 2. Fetch active announcements with server-side target authorization
  useEffect(() => {
    if (!collegeId || !collegeDetails) return;

    const plan = collegeDetails?.subscription?.plan || 'free';
    const status = collegeDetails?.status || 'active';

    const allowedTargets = ['all'];
    if (status === 'active') allowedTargets.push('active');
    if (plan === 'premium') allowedTargets.push('premium');

    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .eq('status', 'active')
          .in('target', allowedTargets)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAnnouncements(data || []);
      } catch (error) {
        console.error("Fetch broadcasts error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();

    const channel = supabase
      .channel('college-announcements-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
        fetchAnnouncements();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collegeId, collegeDetails]);

  const getTypeConfig = (typeValue) => {
    switch (typeValue) {
      case 'critical': return { icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Critical Alert' };
      case 'warning': return { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Warning' };
      default: return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'General Info' };
    }
  };

  const filteredAnnouncements = announcements.filter(ann => {
    const matchesSearch = !querySearch || 
      ann.title?.toLowerCase().includes(querySearch.toLowerCase()) ||
      ann.message?.toLowerCase().includes(querySearch.toLowerCase());
      
    let matchesPriority = true;
    if (priority === 'critical') matchesPriority = ann.type === 'critical' || ann.type === 'warning';
    else if (priority === 'general') matchesPriority = ann.type === 'info' || ann.type === 'general' || !ann.type;
    
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12 h-full flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ec-border pb-5 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-ec-highlight tracking-tight flex items-center gap-2">
            <Radio className="text-ec-accent animate-pulse" size={22} />
            Root System Broadcasts
          </h2>
          <p className="text-xs text-ec-text-sub mt-1">
            Real-time notice bulletins dispatched by the platform administration command network.
          </p>
        </div>
      </div>

      {/* Broadcast Cards Grid/List */}
      <div className="flex-1 surface-card border border-ec-border rounded-xl p-6 overflow-y-auto bg-ec-root/20">
        
        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border border-ec-border/50 rounded-xl animate-pulse flex gap-4 bg-ec-surface/50">
                <div className="w-9 h-9 rounded-lg bg-ec-muted/40 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-ec-muted/50 rounded w-1/3"></div>
                  <div className="h-3 bg-ec-muted/30 rounded w-full"></div>
                </div>
              </div>
            ))
          ) : filteredAnnouncements.length === 0 ? (
            <div className="py-20 text-center text-ec-text-sub">
              <Radio size={36} className="mx-auto mb-3 opacity-40 animate-pulse" />
              <p className="text-sm font-medium">Clear transmission line. No active announcements.</p>
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => {
              const config = getTypeConfig(announcement.type);
              const Icon = config.icon;

              return (
                <div 
                  key={announcement.id} 
                  className="p-4 border border-ec-border bg-ec-surface rounded-xl hover:border-ec-accent/40 transition-all relative overflow-hidden group shadow-sm"
                >
                  {announcement.type === 'critical' && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl pointer-events-none" />
                  )}

                  <div className="flex gap-4 relative z-10">
                    {/* Priority Icon Box */}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${config.bg} ${config.border} ${config.color}`}>
                      <Icon size={16} />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Announcement Title & Meta details */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <h4 className="text-[14px] font-bold text-ec-highlight group-hover:text-ec-accent transition-colors truncate pr-4">
                          {announcement.title}
                        </h4>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 rounded bg-ec-root border border-ec-border text-[9px] font-bold text-ec-text-sub uppercase flex items-center gap-1">
                            <Server size={10} /> Target: {announcement.target}
                          </span>
                          <span className="text-[10px] text-ec-text-sub font-mono flex items-center gap-1">
                            <Clock size={11} />
                            {announcement.created_at ? new Date(announcement.created_at).toLocaleDateString('en-GB') : 'Just now'}
                          </span>
                        </div>
                      </div>

                      {/* Content message */}
                      <p className="text-[12px] text-ec-text-sub leading-relaxed">
                        {announcement.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
      </div>

    </div>
  );
}
