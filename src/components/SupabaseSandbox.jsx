import React, { useState, useEffect } from 'react';
import { 
  Database, 
  UserCheck, 
  UserMinus,
  Plus, 
  RefreshCw, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle,
  BookOpen,
  Eye,
  Trash2,
  FileText,
  MessageSquare
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function SupabaseSandbox() {
  const [sbUser, setSbUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Filter state
  const [filterMyPosts, setFilterMyPosts] = useState(false);

  // Comments states
  const [commentsByPost, setCommentsByPost] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [newCommentTexts, setNewCommentTexts] = useState({});
  const [commentSubmitting, setCommentSubmitting] = useState({});
  
  // UI states
  const [showCode, setShowCode] = useState(false);
  const [toast, setToast] = useState({ type: '', text: '' });
  const [dbConnected, setDbConnected] = useState(null);

  // 1. Check connection and fetch active user session
  useEffect(() => {
    checkConnection();
    fetchSession();

    // Listen for auth state changes in Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSbUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch posts whenever user or filter toggles changes
  useEffect(() => {
    fetchPosts();
  }, [sbUser, filterMyPosts]);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast({ type: '', text: '' }), 3500);
  };

  const checkConnection = async () => {
    try {
      // Attempt a lightweight select on public profiles to verify connection
      const { error } = await supabase.from('profiles').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        // If error is database missing posts/profiles table, we still consider connected
        if (error.message.includes('relation "public.profiles" does not exist')) {
          setDbConnected(true);
          return;
        }
        setDbConnected(false);
      } else {
        setDbConnected(true);
      }
    } catch (err) {
      setDbConnected(false);
    }
  };

  const fetchSession = async () => {
    setLoadingUser(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSbUser(session?.user || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUser(false);
    }
  };

  // 1-Click Instant Test User Login
  const handleInstantLogin = async () => {
    setLoadingUser(true);
    const testEmail = 'evaluator@connect-karo.com';
    const testPassword = 'blErGR4VlDWQh569_test';
    
    try {
      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (signInError) {
        // If user doesn't exist, sign them up!
        if (signInError.message.includes('Invalid login credentials') || signInError.message.includes('credentials') || signInError.message.includes('not found')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
              data: {
                username: 'sb_evaluator',
                full_name: 'Supabase Evaluator Node',
              }
            }
          });

          if (signUpError) {
            showToast('error', `Sign up failed: ${signUpError.message}`);
          } else {
            setSbUser(signUpData.user);
            showToast('success', 'Test user registered and logged in successfully!');
          }
        } else {
          showToast('error', signInError.message);
        }
      } else {
        setSbUser(signInData.user);
        showToast('success', 'Logged in as evaluator@connect-karo.com');
      }
    } catch (err) {
      showToast('error', err.message || 'Auth initialization failed.');
    } finally {
      setLoadingUser(false);
    }
  };

  const handleSignOut = async () => {
    setLoadingUser(true);
    try {
      await supabase.auth.signOut();
      setSbUser(null);
      showToast('success', 'Signed out of Supabase Auth session.');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setLoadingUser(false);
    }
  };

  // Insert row into Supabase Posts table (Part 4 - Action 1)
  const handleInsertPost = async (e) => {
    e.preventDefault();
    if (!sbUser) {
      showToast('error', 'You must initiate a Supabase user session to post!');
      return;
    }
    if (!title.trim()) {
      showToast('error', 'Title is required!');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: sbUser.id,
            title: title.trim(),
            content: content.trim(),
            image_url: imageUrl.trim() || null
          }
        ])
        .select();

      if (error) {
        // If posts table doesn't exist yet, guide them
        if (error.message.includes('relation "public.posts" does not exist')) {
          showToast('error', 'Error: "posts" table does not exist in Supabase! Did you run the SQL script in your Supabase editor?');
        } else {
          showToast('error', error.message);
        }
      } else {
        showToast('success', 'Row inserted successfully into Supabase "posts" table!');
        setTitle('');
        setContent('');
        setImageUrl('');
        fetchPosts(); // Reload feed
      }
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch rows with dynamic user filter (Part 4 - Action 2)
  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      let query = supabase.from('posts').select('*');

      // If filtering by current logged-in user (Demonstrates EQUAL operator filtering)
      if (filterMyPosts && sbUser) {
        query = query.eq('user_id', sbUser.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        // Silently capture relation errors (meaning SQL editor scripts haven't run)
        if (error.message.includes('relation "public.posts" does not exist')) {
          setPosts([]);
        } else {
          console.error(error);
        }
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Safe delete testing post helper
  const handleDeletePost = async (postId) => {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) {
        showToast('error', `RLS Violation or Error: ${error.message}`);
      } else {
        showToast('success', 'Post deleted successfully!');
        fetchPosts();
      }
    } catch (err) {
      showToast('error', err.message);
    }
  };

  // Fetch comments helper (Action 3)
  const fetchComments = async (postId) => {
    setLoadingComments(prev => ({ ...prev, [postId]: true }));
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        if (!error.message.includes('relation "public.comments" does not exist')) {
          console.error('Fetch comments error:', error);
        }
        setCommentsByPost(prev => ({ ...prev, [postId]: [] }));
      } else {
        setCommentsByPost(prev => ({ ...prev, [postId]: data || [] }));
      }
    } catch (err) {
      console.error(err);
      setCommentsByPost(prev => ({ ...prev, [postId]: [] }));
    } finally {
      setLoadingComments(prev => ({ ...prev, [postId]: false }));
    }
  };

  const toggleComments = (postId) => {
    const isExpanded = !expandedComments[postId];
    setExpandedComments(prev => ({ ...prev, [postId]: isExpanded }));
    if (isExpanded) {
      fetchComments(postId);
    }
  };

  const handleAddComment = async (postId) => {
    const text = newCommentTexts[postId];
    if (!text || !text.trim()) return;
    if (!sbUser) {
      showToast('error', 'You must initiate a Supabase user session to comment!');
      return;
    }

    setCommentSubmitting(prev => ({ ...prev, [postId]: true }));
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: postId,
            user_id: sbUser.id,
            text: text.trim()
          }
        ])
        .select();

      if (error) {
        if (error.message.includes('relation "public.comments" does not exist')) {
          showToast('error', 'Error: "comments" table does not exist in Supabase! Run the database SQL script.');
        } else {
          showToast('error', error.message);
        }
      } else {
        showToast('success', 'Comment added successfully!');
        setNewCommentTexts(prev => ({ ...prev, [postId]: '' }));
        fetchComments(postId);
      }
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setCommentSubmitting(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        showToast('error', `RLS Violation or Error: ${error.message}`);
      } else {
        showToast('success', 'Comment deleted successfully!');
        fetchComments(postId);
      }
    } catch (err) {
      showToast('error', err.message);
    }
  };

  return (
    <div className="space-y-6 select-none font-sans text-gray-700 dark:text-[#c9d1d9] pb-6">
      
      {/* Toast popup */}
      {toast.text && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#24292f] dark:bg-[#1f2428] text-white border border-[#30363d] rounded-xl px-4 py-3 shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom-5 duration-200">
          <Database size={14} className="text-ec-accent animate-pulse" />
          <span>{toast.text}</span>
        </div>
      )}

      {/* Sandbox Connection & Session Dashboard */}
      <div className="surface-card p-5 bg-ec-surface border border-ec-border rounded-xl space-y-4">
        
        {/* Real-time status indicators */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ec-border/40 pb-3.5">
          <div className="flex items-center gap-2">
            <Database className="text-ec-accent shrink-0 animate-bounce" size={18} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-ec-highlight">
              Supabase Live Sandbox (Vercel Node)
            </h3>
          </div>

          <div className="flex gap-2">
            {/* Database status */}
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${
              dbConnected === true 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                : dbConnected === false
                ? 'bg-red-500/10 text-red-400 border-red-500/25'
                : 'bg-gray-500/10 text-gray-400 border-gray-500/25 animate-pulse'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dbConnected ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {dbConnected === true ? 'DB Connected' : dbConnected === false ? 'DB Offline' : 'Verifying DB...'}
            </span>

            {/* Auth Session Status */}
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${
              sbUser 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
            }`}>
              {sbUser ? 'Auth Session Active' : 'Auth Inactive'}
            </span>
          </div>
        </div>

        {/* Supabase user session manager description */}
        <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between p-4 bg-gray-50 dark:bg-[#161b22]/40 border border-gray-100 dark:border-[#30363d]/60 rounded-xl">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-ec-highlight flex items-center gap-1">
              {sbUser ? (
                <>
                  <UserCheck size={14} className="text-emerald-500" />
                  Active User: <span className="text-ec-accent">{sbUser.email}</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={14} className="text-yellow-500" />
                  Active Supabase session required
                </>
              )}
            </h4>
            <p className="text-[10px] text-ec-text-sub leading-normal max-w-lg">
              Supabase enforces Row Level Security (RLS) policies. To insert rows into the <code>posts</code> and <code>comments</code> tables, you must have an active Supabase user session so <code>auth.uid()</code> gets populated! Click below to automatically instantiate a session.
            </p>
          </div>

          <div className="shrink-0">
            {loadingUser ? (
              <div className="w-6 h-6 border-2 border-ec-accent/30 border-t-ec-accent rounded-full animate-spin" />
            ) : sbUser ? (
              <button
                onClick={handleSignOut}
                className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1 bg-transparent"
              >
                <UserMinus size={12} />
                Sign Out Session
              </button>
            ) : (
              <button
                onClick={handleInstantLogin}
                className="px-3.5 py-2 bg-ec-accent hover:bg-ec-accent-hover text-white text-[10.5px] font-bold rounded-lg shadow-md shadow-ec-accent/15 transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus size={12} />
                Initialize Supabase Test Session
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Main Sandbox Interactive panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PANEL 1: Create Post (Action 1 Insert) */}
        <div className="surface-card p-6 bg-ec-surface border border-ec-border rounded-xl space-y-4 h-[540px]">
          <div className="flex items-center gap-2 border-b border-ec-border/40 pb-2.5">
            <Plus className="text-ec-accent" size={15} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-ec-highlight">
              Insert Row (Action 1)
            </h3>
          </div>

          <form onSubmit={handleInsertPost} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1.5">
                Post Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-ec-root border border-ec-border focus:border-ec-accent rounded-lg px-3 py-2 text-xs text-ec-highlight outline-none font-semibold transition-all"
                placeholder="Vercel deployment is live!"
                disabled={!sbUser || submitting}
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1.5">
                Content / Details
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="w-full bg-ec-root border border-ec-border focus:border-ec-accent rounded-lg px-3 py-2 text-xs text-ec-highlight outline-none font-semibold transition-all resize-y"
                placeholder="Write whatever details you want to save to Supabase..."
                disabled={!sbUser || submitting}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1.5">
                Optional Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-ec-root border border-ec-border focus:border-ec-accent rounded-lg px-3 py-2 text-xs text-ec-highlight outline-none font-semibold transition-all"
                placeholder="https://images.unsplash.com/photo-..."
                disabled={!sbUser || submitting}
              />
            </div>

            <button
              type="submit"
              disabled={!sbUser || submitting}
              className="w-full py-2.5 bg-ec-accent hover:bg-ec-accent-hover text-white text-xs font-bold rounded-lg shadow-md shadow-ec-accent/15 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {submitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus size={14} />
                  Insert Row into Supabase Table
                </>
              )}
            </button>

            {!sbUser && (
              <p className="text-[10px] text-yellow-500 font-semibold text-center select-none animate-pulse">
                ⚠️ Click "Initialize Supabase Test Session" above to unlock writing!
              </p>
            )}
          </form>
        </div>

        {/* PANEL 2: Live Feed (Action 2 Fetch & filter & Actions for comments) */}
        <div className="surface-card p-6 bg-ec-surface border border-ec-border rounded-xl flex flex-col h-[540px]">
          <div className="flex items-center justify-between border-b border-ec-border/40 pb-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <RefreshCw className={`text-ec-accent shrink-0 ${loadingPosts ? 'animate-spin' : ''}`} size={15} onClick={fetchPosts} />
              <h3 className="text-xs font-bold uppercase tracking-wider text-ec-highlight">
                Fetch Rows (Action 2)
              </h3>
            </div>

            {/* Filter Toggle */}
            {sbUser && (
              <button
                onClick={() => setFilterMyPosts(!filterMyPosts)}
                className={`px-2.5 py-1 rounded-md text-[9px] font-bold border transition-all cursor-pointer ${
                  filterMyPosts 
                    ? 'bg-ec-accent text-white border-ec-accent' 
                    : 'bg-ec-root text-ec-text-sub border-ec-border hover:text-ec-highlight'
                }`}
              >
                Filter: My Posts Only
              </button>
            )}
          </div>

          {/* Posts container list */}
          <div className="flex-1 overflow-y-auto pr-1 mt-3 space-y-3 custom-scrollbar-sandbox">
            <style>{`
              .custom-scrollbar-sandbox::-webkit-scrollbar {
                width: 4px;
              }
              .custom-scrollbar-sandbox::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scrollbar-sandbox::-webkit-scrollbar-thumb {
                background: rgb(var(--ec-border) / 0.5);
                border-radius: 4px;
              }
            `}</style>

            {loadingPosts && posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-ec-text-sub">
                <div className="w-5 h-5 border-2 border-ec-accent/30 border-t-ec-accent rounded-full animate-spin mb-2" />
                <span className="text-[10px]">Fetching real-time rows...</span>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 border-2 border-dashed border-ec-border rounded-xl bg-ec-root/40">
                <FileText size={24} className="text-ec-text-sub/50 mb-2" />
                <h4 className="text-[11.5px] font-bold text-ec-highlight">No posts discovered in Supabase</h4>
                <p className="text-[9.5px] text-ec-text-sub max-w-[200px] mt-1 leading-relaxed">
                  Make sure you have run the database setup script `supabase_schema.sql` inside the Supabase SQL editor, initialized the test session, and inserted a row!
                </p>
              </div>
            ) : (
              posts.map((post) => {
                const isAuthor = sbUser && post.user_id === sbUser.id;
                const showComments = expandedComments[post.id];
                return (
                  <div 
                    key={post.id} 
                    className="p-3 bg-ec-root/50 border border-ec-border/70 rounded-xl space-y-2 relative group hover:border-ec-accent/30 transition-all text-left"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-ec-highlight truncate max-w-[180px]">
                        {post.title}
                      </h4>
                      
                      {/* Delete option if active owner */}
                      {isAuthor && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1 text-gray-400 hover:text-red-400 bg-transparent border-transparent opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Delete row (RLS verified)"
                        >
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>

                    <p className="text-[10.5px] text-ec-text-sub leading-normal">
                      {post.content || 'No content provided.'}
                    </p>

                    {post.image_url && (
                      <div className="w-full h-20 rounded-lg overflow-hidden border border-ec-border/50 select-none pointer-events-none">
                        <img src={post.image_url} alt="post" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex justify-between items-center text-[8.5px] text-ec-text-sub/80 pt-1.5 border-t border-ec-border/40 select-none">
                      <span className="font-mono">Author: {post.user_id.substring(0, 8)}...</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleComments(post.id)}
                          className="text-ec-accent hover:underline flex items-center gap-0.5 bg-transparent border-transparent cursor-pointer font-semibold outline-none"
                        >
                          <MessageSquare size={9} />
                          {showComments ? 'Hide Comments' : 'Comments'}
                        </button>
                        <span>{new Date(post.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {/* EXPANDABLE COMMENTS SECTION */}
                    {showComments && (
                      <div className="mt-2.5 pt-2 border-t border-ec-border/30 space-y-2 select-text">
                        {/* Comments List */}
                        <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar-sandbox pr-0.5">
                          {loadingComments[post.id] ? (
                            <div className="text-[9.5px] text-ec-text-sub flex items-center gap-1 py-1 select-none">
                              <RefreshCw size={10} className="animate-spin" /> Loading comments...
                            </div>
                          ) : !commentsByPost[post.id] || commentsByPost[post.id].length === 0 ? (
                            <div className="text-[9.5px] text-ec-text-sub/70 italic py-1 select-none">No comments yet. Be the first to comment!</div>
                          ) : (
                            commentsByPost[post.id].map((comment) => {
                              const isCommentAuthor = sbUser && comment.user_id === sbUser.id;
                              return (
                                <div key={comment.id} className="flex items-start justify-between gap-2 bg-ec-surface/40 p-1.5 rounded border border-ec-border/30 text-[9.5px]">
                                  <div className="space-y-0.5 max-w-[85%]">
                                    <div className="flex items-center gap-1 text-[8px] text-ec-text-sub font-semibold font-mono select-none">
                                      <span>{comment.user_id.substring(0, 8)}...:</span>
                                      <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-ec-highlight break-words leading-relaxed">{comment.text}</p>
                                  </div>
                                  {isCommentAuthor && (
                                    <button
                                      onClick={() => handleDeleteComment(post.id, comment.id)}
                                      className="p-0.5 text-gray-400 hover:text-red-400 bg-transparent border-transparent cursor-pointer shrink-0"
                                      title="Delete comment (RLS verified)"
                                    >
                                      <Trash2 size={9} />
                                    </button>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                        
                        {/* Add Comment Input */}
                        {sbUser ? (
                          <div className="flex gap-1.5 pt-1">
                            <input
                              type="text"
                              value={newCommentTexts[post.id] || ''}
                              onChange={(e) => setNewCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                              placeholder="Add a comment..."
                              className="flex-1 bg-ec-surface border border-ec-border focus:border-ec-accent rounded px-2 py-1 text-[9.5px] text-ec-highlight outline-none font-medium"
                              disabled={commentSubmitting[post.id]}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              disabled={commentSubmitting[post.id] || !(newCommentTexts[post.id] || '').trim()}
                              className="px-2 py-1 bg-ec-accent hover:bg-ec-accent-hover text-white text-[9.5px] font-bold rounded flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {commentSubmitting[post.id] ? (
                                <RefreshCw size={10} className="animate-spin" />
                              ) : (
                                'Comment'
                              )}
                            </button>
                          </div>
                        ) : (
                          <p className="text-[8.5px] text-yellow-500/80 italic text-center select-none font-semibold mt-1">
                            ⚠️ Sign in above to comment on this post
                          </p>
                        )}
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* SECTION C: Code Panel Toggle (Learn exactly how to do Part 4!) */}
      <div className="surface-card border border-ec-border rounded-xl overflow-hidden bg-ec-surface select-none">
        <button
          onClick={() => setShowCode(!showCode)}
          className="w-full flex items-center justify-between px-5 py-4 font-semibold text-xs text-ec-highlight hover:bg-ec-muted/20 transition-all border-transparent bg-transparent outline-none cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Terminal className="text-ec-accent animate-pulse" size={15} />
            <span>Developer Guide: View Part 4 Code Snippets & RLS Guide</span>
          </div>
          <span className="text-[9.5px] font-bold text-ec-accent uppercase">
            {showCode ? 'Hide Guide' : 'Show Guide'}
          </span>
        </button>

        {showCode && (
          <div className="p-5 border-t border-ec-border bg-[#0d1117] text-[#c9d1d9] font-mono text-[10.5px] space-y-5 animate-in slide-in-from-top-3 duration-200 text-left">
            
            {/* Part 4 SQL Script */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs select-none">
                <CheckCircle2 size={13} />
                <span>Part 4: PostgreSQL Row Level Security (RLS) & Table Schemas</span>
              </div>
              <p className="text-[10px] text-ec-text-sub font-sans leading-normal">
                To enforce safety, copy the contents of the generated <code>supabase_schema.sql</code> file at your project's root and execute them in your Supabase SQL editor. This enables Row Level Security (RLS) on all tables, creating foreign key constraints and secure policies so users can only modify their own rows!
              </p>
              <pre className="p-3 bg-[#161b22] border border-[#30363d] rounded-xl overflow-x-auto text-[9.5px] leading-relaxed max-h-48">
{`-- Example of RLS policies created for posts and comments tables
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 1. Read access is public
CREATE POLICY "Posts are viewable by everyone" ON public.posts
  FOR SELECT USING (true);

-- 2. Modify access restricted to the row creator
CREATE POLICY "Authenticated users can create posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);`}
              </pre>
            </div>

            {/* Insert explanation */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs select-none">
                <CheckCircle2 size={13} />
                <span>Action 1 Code: Insert Row into Supabase Table</span>
              </div>
              <pre className="p-3 bg-[#161b22] border border-[#30363d] rounded-xl overflow-x-auto text-[9.5px] leading-relaxed">
{`// 🟢 HOW TO INSERT A NEW ROW INTO THE "POSTS" TABLE
import { supabase } from '../lib/supabaseClient';

export async function insertRow(title, content, imageUrl) {
  // 1. Fetch current active authenticated user session from Supabase
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Must be logged in!");

  // 2. Perform insertion using select() to return the freshly inserted row
  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        user_id: user.id, // Links directly to Profiles UUID
        title: title,
        content: content,
        image_url: imageUrl || null
      }
    ])
    .select();

  return { data, error };
}`}
              </pre>
            </div>

            {/* Fetch explanation */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs select-none">
                <CheckCircle2 size={13} />
                <span>Action 2 Code: Fetch Rows & Filter by Current Logged-In User</span>
              </div>
              <pre className="p-3 bg-[#161b22] border border-[#30363d] rounded-xl overflow-x-auto text-[9.5px] leading-relaxed">
{`// 🟢 HOW TO FETCH ROWS FILTERED BY CURRENT AUTHENTICATED USER
import { supabase } from '../lib/supabaseClient';

export async function fetchUserFilteredRows() {
  // 1. Fetch active session profile from auth
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Must be logged in!");

  // 2. Query columns and filter user_id using equal (.eq) operator
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user.id) // 👈 CRUCIAL: Filters query by logged in user ID!
    .order('created_at', { ascending: false });

  return { data, error };
}`}
              </pre>
            </div>

            {/* Comments explanation */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs select-none">
                <CheckCircle2 size={13} />
                <span>Action 3 Code: Insert and Fetch Comments</span>
              </div>
              <pre className="p-3 bg-[#161b22] border border-[#30363d] rounded-xl overflow-x-auto text-[9.5px] leading-relaxed">
{`// 🟢 HOW TO INSERT A COMMENT
export async function addComment(postId, commentText) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Must be logged in!");

  const { data, error } = await supabase
    .from('comments')
    .insert([{ post_id: postId, user_id: user.id, text: commentText }])
    .select();
  return { data, error };
}

// 🟢 HOW TO FETCH COMMENTS FOR A POST
export async function fetchComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  return { data, error };
}`}
              </pre>
            </div>

            <div className="p-3.5 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex items-start gap-2.5">
              <BookOpen size={16} className="text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-ec-text-sub leading-normal">
                <strong>Architect's Tip:</strong> Standard Firebase logins are separate from Supabase Auth tokens. In a standard production app, you would typically use Supabase as your unified Auth + Database backend, avoiding split session issues entirely.
              </p>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
