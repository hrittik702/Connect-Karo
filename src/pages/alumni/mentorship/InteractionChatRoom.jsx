import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, Search, Clock, XCircle, 
  Check, CheckCheck, AlertCircle, ArrowLeft, MoreVertical, User, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InteractionChatRoom() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const menuRef = useRef(null);
  
  const [typedMessage, setTypedMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChatId, setSelectedChatId] = useState("chat_old_01");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Student Interaction Requests State
  const [incomingRequests, setIncomingRequests] = useState([
    {
      id: "req_01",
      studentName: "Anjali Singh",
      branch: "Information Technology",
      batch: "2027",
      message: "Hi Bhaiya, I have an upcoming technical interview round with Amazon for an internship role next month. Could you please guide me on what specific DSA graphs and system design topics I should prioritize based on your experience?",
      time: "4h ago",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
    },
    {
      id: "req_02",
      studentName: "Amit Kumar",
      branch: "Computer Science",
      batch: "2026",
      message: "Hello sir, I am currently building our campus tech fest web application using the MERN stack. We are facing severe database connection pool lags when using Supabase/PostgreSQL under high concurrent requests. Can you review our architectural setup layout?",
      time: "1d ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
    }
  ]);

  // Active Conversations Channels
  const [activeChats, setActiveChats] = useState([
    {
      id: "chat_old_01",
      studentName: "Rohan Verma",
      branch: "Computer Science",
      lastMsg: "Perfect, I will try tweaking the pool count configurations.",
      time: "Yesterday",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80"
    }
  ]);

  // Messages Ledgers with Dynamic WhatsApp Ticks
  const [chatHistories, setChatHistories] = useState({
    "chat_old_01": [
      { id: "m_1", isAlumni: false, text: "Hello sir, we are facing severe database connection pool lags when using Supabase/PostgreSQL.", time: "10:15 AM", status: "read" },
      { id: "m_2", isAlumni: true, text: "Check your connection pooling configurations inside your server setup parameters.", time: "10:20 AM", status: "read" },
      { id: "m_3", isAlumni: false, text: "Perfect, I will try tweaking the pool count configurations.", time: "10:22 AM", status: "read" }
    ]
  });

  // Auto-Scroll implementation
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChatId, chatHistories]);

  // Dropdown click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAcceptRequest = (request) => {
    setIncomingRequests(prev => prev.filter(req => req.id !== request.id));
    const newChatId = `chat_${request.id}`;
    
    const newChatListItem = {
      id: newChatId,
      studentName: request.studentName,
      branch: request.branch,
      lastMsg: request.message,
      time: "Just now",
      avatar: request.avatar
    };

    const initialMessages = [
      {
        id: `m_init_${Date.now()}`,
        isAlumni: false,
        text: request.message,
        time: "Just now",
        status: "read"
      }
    ];

    setChatHistories(prev => ({ ...prev, [newChatId]: initialMessages }));
    setActiveChats(prev => [newChatListItem, ...prev]);
    setSelectedChatId(newChatId);
  };

  const handleDeclineRequest = (requestId) => {
    setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
    if (selectedChatId === `chat_${requestId}`) {
      setSelectedChatId(null);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const uniqueMsgId = `msg_${Date.now()}`;
    const newTextMsg = {
      id: uniqueMsgId,
      isAlumni: true,
      text: typedMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setChatHistories(prev => ({
      ...prev,
      [selectedChatId]: [...prev[selectedChatId], newTextMsg]
    }));

    setActiveChats(prev => prev.map(chat => 
      chat.id === selectedChatId ? { ...chat, lastMsg: typedMessage.trim(), time: "Just now" } : chat
    ));

    setTypedMessage("");

    // WhatsApp ticks simulation hook
    setTimeout(() => {
      setChatHistories(prev => ({
        ...prev,
        [selectedChatId]: prev[selectedChatId].map(m => m.id === uniqueMsgId ? { ...m, status: 'delivered' } : m)
      }));
    }, 1000);

    setTimeout(() => {
      setChatHistories(prev => ({
        ...prev,
        [selectedChatId]: prev[selectedChatId].map(m => m.id === uniqueMsgId ? { ...m, status: 'read' } : m)
      }));
    }, 2000);
  };

  const currentChatMessages = chatHistories[selectedChatId] || [];
  const currentChatDetails = activeChats.find(c => c.id === selectedChatId);

  const filteredActiveChats = activeChats.filter(chat => 
    chat.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full border border-ec-border rounded-xl h-[calc(100vh-140px)] flex overflow-hidden shadow-xl bg-ec-surface select-none animate-scale-in">
      
      {/* ── LEFT DISCUSSIONS PANEL (Cleaned Header) ── */}
      <div className={`w-full md:w-[360px] border-r border-ec-border flex flex-col bg-ec-surface/40 flex-shrink-0 transition-all duration-300 ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Simple Search conversations box at top */}
        <div className="p-4 border-b border-ec-border bg-ec-surface">
          <div className="flex items-center bg-ec-root border border-ec-border rounded-xl px-3 py-2 focus-within:border-ec-accent/50 transition-colors duration-200">
            <Search size={14} className="text-ec-icon mr-2 flex-shrink-0" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..." 
              className="bg-transparent border-none outline-none text-xs w-full text-ec-text placeholder-ec-text-sub/40 focus:ring-0 p-0 font-medium" 
            />
          </div>
        </div>

        {/* Scrollable Channels Container */}
        <div className="flex-1 overflow-y-auto space-y-5 py-4 custom-scrollbar">
          
          {/* Inbound Queries Loop */}
          {incomingRequests.length > 0 && (
            <div className="space-y-2 animate-fade-in">
              <p className="text-[10px] font-black uppercase tracking-widest text-ec-accent px-4 mb-1">
                Inbound Queries ({incomingRequests.length})
              </p>
              
              {incomingRequests.map((req) => (
                <div key={req.id} className="mx-3 p-3.5 bg-gradient-to-b from-ec-root/80 to-ec-root/30 border border-ec-border rounded-xl space-y-3 shadow-sm hover:border-ec-accent/30 transition-all duration-300">
                  <div className="flex gap-2.5 items-start">
                    <img src={req.avatar} alt="" className="w-8 h-8 rounded-xl object-cover border border-ec-border flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-bold text-ec-highlight truncate tracking-tight">{req.studentName}</h4>
                        <span className="text-[9px] text-ec-text-sub font-semibold">{req.time}</span>
                      </div>
                      <p className="text-[9px] text-ec-accent font-black tracking-wide uppercase mt-0.5">{req.branch} • Batch {req.batch}</p>
                    </div>
                  </div>
                  <p className="text-xs text-ec-text-sub/90 bg-ec-surface/60 p-2.5 rounded-lg border border-ec-border/30 line-clamp-2 leading-relaxed font-medium">
                    "{req.message}"
                  </p>
                  <div className="flex gap-1.5 justify-end pt-1">
                    <button 
                      onClick={() => handleDeclineRequest(req.id)}
                      className="px-2.5 py-1.5 text-[10px] font-black text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-1 cursor-pointer transition-colors focus:outline-none"
                    >
                      <XCircle size={13} /> Decline
                    </button>
                    <button 
                      onClick={() => handleAcceptRequest(req)}
                      className="px-3 py-1.5 text-[10px] font-black bg-ec-accent text-white rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-sm focus:outline-none hover:opacity-90"
                    >
                      <Check size={13} strokeWidth={2.5} /> Accept & Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Chats Loop */}
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-ec-text-sub px-4 mb-1">
              Active Conversations
            </p>
            
            {filteredActiveChats.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-1">
                <AlertCircle size={16} className="text-ec-text-sub/30 mx-auto" />
                <p className="text-xs text-ec-text-sub/60 font-semibold">No ongoing discussions active.</p>
              </div>
            ) : (
              filteredActiveChats.map((chat) => {
                const isSelected = chat.id === selectedChatId;
                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => setSelectedChatId(chat.id)}
                    className={`w-full text-left px-4 py-3.5 flex gap-3.5 border-b border-ec-border/30 transition-all cursor-pointer relative group focus:outline-none ${
                      isSelected 
                        ? 'bg-ec-accent/[0.06] border-l-4 border-l-ec-accent' 
                        : 'hover:bg-ec-muted/30 border-l-4 border-l-transparent'
                    }`}
                  >
                    <img src={chat.avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-ec-border shadow-sm flex-shrink-0" />
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-black truncate tracking-tight ${isSelected ? 'text-ec-accent' : 'text-ec-highlight'}`}>{chat.studentName}</p>
                        <span className="text-[9px] text-ec-text-sub font-bold">{chat.time}</span>
                      </div>
                      <p className="text-[9px] text-ec-text-sub font-black tracking-widest uppercase">{chat.branch}</p>
                      <p className="text-xs text-ec-text-sub truncate font-medium mt-1">{chat.lastMsg}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT MESSAGING TIMELINE SCREEN ── */}
      <div className={`flex-1 flex flex-col bg-gradient-to-b from-ec-root/[0.02] to-transparent transition-all duration-300 ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}>
        {selectedChatId && currentChatDetails ? (
          <div className="flex flex-col h-full w-full animate-fade-in">
            
            {/* Topbar Info profile bar */}
            <div className="px-4 h-16 border-b border-ec-border bg-ec-surface flex items-center justify-between shadow-sm z-10 flex-shrink-0">
              <div className="flex items-center gap-3.5 min-w-0">
                <button 
                  onClick={() => setSelectedChatId(null)}
                  className="p-2 rounded-xl bg-ec-root/80 border border-ec-border text-ec-text-sub hover:text-ec-text md:hidden"
                >
                  <ArrowLeft size={14} strokeWidth={2.5} />
                </button>
                <img src={currentChatDetails.avatar} alt="" className="w-9 h-9 rounded-xl object-cover border border-ec-border hidden sm:block flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xs font-black text-ec-highlight truncate tracking-tight">{currentChatDetails.studentName}</h3>
                  <p className="text-[10px] text-ec-text-sub font-bold uppercase tracking-wider mt-0.5">{currentChatDetails.branch}</p>
                </div>
              </div>

              {/* Functional Three-dot Action Trigger Dropdown */}
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-xl hover:bg-ec-root text-ec-text-sub hover:text-ec-highlight focus:outline-none cursor-pointer"
                >
                  <MoreVertical size={15} />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-1 w-44 bg-ec-surface border border-ec-border rounded-xl shadow-xl z-50 overflow-hidden animate-scale-in">
                    <button 
                      onClick={() => { alert("Viewing Student Profile Context"); setIsMenuOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-ec-highlight hover:bg-ec-muted/50 flex items-center gap-2 cursor-pointer focus:outline-none"
                    >
                      <User size={13} className="text-ec-icon" /> View Student Profile
                    </button>
                    <button 
                      onClick={() => { alert("Chat Session Marked as Resolved"); setIsMenuOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-ec-accent hover:bg-ec-accent/10 border-t border-ec-border/50 flex items-center gap-2 cursor-pointer focus:outline-none"
                    >
                      <CheckCircle2 size={13} /> Mark as Resolved
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Core Text Dialogue Pipeline (Upgraded to text-sm) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-ec-root/10">
              {currentChatMessages.map((msg) => (
                <div key={msg.id} className={`flex w-full ${msg.isAlumni ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`max-w-[75%] md:max-w-[65%] rounded-2xl px-4 py-2.5 text-sm font-medium shadow-sm leading-relaxed relative border transition-all duration-200 ${
                    msg.isAlumni 
                      ? 'bg-ec-accent text-white border-transparent rounded-tr-none' 
                      : 'bg-ec-surface border-ec-border text-ec-highlight rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    
                    {/* Real-time WhatsApp ticks engine integration block */}
                    <div className={`text-[9px] mt-1.5 font-bold flex items-center justify-end gap-1 select-none opacity-85 ${msg.isAlumni ? 'text-white/80' : 'text-ec-text-sub'}`}>
                      <span>{msg.time}</span>
                      {msg.isAlumni && (
                        <span className="ml-0.5">
                          {msg.status === 'sent' && <Check size={12} strokeWidth={3} />}
                          {msg.status === 'delivered' && <CheckCheck size={12} strokeWidth={3} />}
                          {msg.status === 'read' && <CheckCheck size={12} strokeWidth={3} className="text-cyan-200" />}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* Send Dock form tool */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-ec-border bg-ec-surface flex items-center gap-3 flex-shrink-0 z-10">
              <div className="flex-1 flex items-center">
                <input 
                  type="text" 
                  value={typedMessage} 
                  onChange={(e) => setTypedMessage(e.target.value)} 
                  placeholder="Type your message..." 
                  className="text-sm bg-ec-root border border-ec-border px-4 py-3 w-full rounded-xl text-ec-text outline-none focus:border-ec-accent/60 placeholder-ec-text-sub/40 transition-colors focus:ring-0 font-medium" 
                />
              </div>
              <button 
                type="submit" 
                disabled={!typedMessage.trim()} 
                className={`p-3 rounded-xl text-white transition-all flex items-center justify-center ${
                  typedMessage.trim() 
                    ? 'bg-ec-accent shadow-md shadow-ec-accent/10 hover:scale-105 active:scale-95 cursor-pointer' 
                    : 'bg-ec-muted text-ec-text-sub/30 opacity-50 cursor-not-allowed border border-ec-border'
                }`}
              >
                <Send size={14} strokeWidth={2.5} />
              </button>
            </form>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3 select-none">
            <div className="p-4 bg-ec-surface border border-ec-border rounded-2xl text-ec-text-sub/40 shadow-sm">
              <MessageSquare size={28} strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-ec-highlight tracking-tight">No Open Chat</h3>
              <p className="text-xs text-ec-text-sub/70 max-w-xs font-semibold leading-normal">Select an ongoing conversation or accept an inbound request from the sidebar to begin.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}