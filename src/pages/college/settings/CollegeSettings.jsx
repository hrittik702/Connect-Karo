import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Palette, 
  Accessibility, 
  Bell, 
  CreditCard, 
  Mail, 
  Key, 
  Tv, 
  ShieldAlert, 
  Check, 
  Calendar, 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  Hash, 
  Shield, 
  Heart, 
  HelpCircle, 
  Laptop, 
  Edit2, 
  LogOut, 
  ExternalLink, 
  X,
  Lock,
  Plus
} from 'lucide-react';
import { db, auth } from '../../../firebase/config';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import AppearanceSettings from '../../../components/AppearanceSettings';

export default function CollegeSettings() {
  const { currentUser, userData, logout } = useAuth();
  const collegeId = userData?.collegeId || '';
  const navigate = useNavigate();

  // Active Menu Tab state matching the GitHub settings structure
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'account', 'appearance', 'accessibility', 'notifications', 'institution', etc.

  // College institutional details state
  const [collegeDetails, setCollegeDetails] = useState(null);
  const [collegeLoading, setCollegeLoading] = useState(true);

  // Form edit states for Institutional Settings
  const [isEditingCollege, setIsEditingCollege] = useState(false);
  const [collegeName, setCollegeName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [address, setAddress] = useState('');
  const [savingCollege, setSavingCollege] = useState(false);

  // Form edit states for User Profile settings
  const [profileName, setProfileName] = useState(userData?.name || '');
  const [profileBio, setProfileBio] = useState(userData?.bio || '');
  const [profilePronouns, setProfilePronouns] = useState(userData?.pronouns || 'he/him');
  const [profileUrl, setProfileUrl] = useState(userData?.url || '');
  const [profilePhotoURL, setProfilePhotoURL] = useState(userData?.photoURL || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Modal / Toast message states
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const adminName = userData?.name || "College Admin";
  const adminEmail = userData?.email || currentUser?.email || "admin@institution.edu";
  const userHandle = adminEmail.split('@')[0] || "admin";

  // Resolve default profile picture college letters
  const institutionName = userData?.collegeName || userData?.collegeId || "College";
  const collegeInitial = institutionName.charAt(0).toUpperCase();

  // Load Institutional Details
  useEffect(() => {
    if (!collegeId) return;

    if (collegeId === 'dummy_college_01' || currentUser?.uid === 'dummy_12345') {
      const dummyData = {
        name: 'Rajkiya Engineering College, Ambedkar Nagar',
        domain: 'recabn.ac.in',
        collegeCode: '0737',
        adminEmail: 'admin@demo.edu',
        adminPhone: '+91 98765 43210',
        address: 'Ambedkar Nagar, Uttar Pradesh India',
        status: 'Active',
        createdAt: new Date().toISOString()
      };
      setCollegeDetails(dummyData);
      setCollegeName(dummyData.name);
      setAdminPhone(dummyData.adminPhone);
      setAddress(dummyData.address);
      setCollegeLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, 'colleges', collegeId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCollegeDetails(data);
        setCollegeName(data.name || '');
        setAdminPhone(data.adminPhone || '');
        setAddress(data.address || '');
      }
      setCollegeLoading(false);
    }, (error) => {
      console.error("Fetch settings details failed:", error);
      setCollegeLoading(false);
    });

    return () => unsub();
  }, [collegeId, currentUser]);

  // Sync profile editing states with real-time userData
  useEffect(() => {
    if (userData) {
      setProfileName(userData.name || '');
      setProfileBio(userData.bio || '');
      setProfilePronouns(userData.pronouns || 'he/him');
      setProfileUrl(userData.url || '');
      setProfilePhotoURL(userData.photoURL || '');
    }
  }, [userData]);

  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  // Save personal profile data to Firestore
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      showToast('error', 'Display name cannot be empty.');
      return;
    }

    setSavingProfile(true);
    try {
      if (currentUser?.uid === 'dummy_12345') {
        showToast('success', 'Public profile updated successfully! (Demo Mode)');
        setSavingProfile(false);
        return;
      }

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        name: profileName.trim(),
        bio: profileBio.trim(),
        pronouns: profilePronouns,
        url: profileUrl.trim()
      });

      showToast('success', 'Public profile updated successfully!');
    } catch (err) {
      console.error("Failed to save user profile:", err);
      showToast('error', 'Failed to update database profile records.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Save college institutional details
  const handleSaveCollege = async (e) => {
    e.preventDefault();
    if (!collegeName.trim()) {
      showToast('error', 'Institution name is required.');
      return;
    }

    setSavingCollege(true);
    try {
      if (collegeId === 'dummy_college_01' || currentUser?.uid === 'dummy_12345') {
        const updated = {
          ...collegeDetails,
          name: collegeName.trim(),
          adminPhone: adminPhone.trim(),
          address: address.trim()
        };
        setCollegeDetails(updated);
        showToast('success', 'Institutional configurations saved! (Demo Mode)');
        setIsEditingCollege(false);
        return;
      }

      const collegeRef = doc(db, 'colleges', collegeId);
      await updateDoc(collegeRef, {
        name: collegeName.trim(),
        adminPhone: adminPhone.trim(),
        address: address.trim()
      });

      showToast('success', 'Institutional configurations updated successfully!');
      setIsEditingCollege(false);
    } catch (error) {
      console.error("Failed to update college details:", error);
      showToast('error', 'Failed to update institutional database records.');
    } finally {
      setSavingCollege(false);
    }
  };

  // Update profile photo url
  const handleUpdatePhoto = async () => {
    if (!tempPhotoUrl.trim()) return;
    setSavingProfile(true);
    try {
      if (currentUser?.uid === 'dummy_12345') {
        setProfilePhotoURL(tempPhotoUrl.trim());
        showToast('success', 'Avatar updated! (Demo Mode)');
        setIsEditingPhoto(false);
        setSavingProfile(false);
        return;
      }

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { photoURL: tempPhotoUrl.trim() });
      showToast('success', 'Profile picture updated successfully!');
      setIsEditingPhoto(false);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to update avatar photo.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 font-sans selection:bg-ec-accent/20 select-none pb-12 animate-in fade-in duration-300">
      
      {/* ── LEFT SIDEBAR NAVIGATION (GitHub style) ── */}
      <aside className="w-full md:w-[260px] shrink-0 space-y-6">
        
        {/* User profile brief card */}
        <div className="flex items-center gap-3 px-2 pb-2 border-b border-ec-border/100">
          {/* Avatar preview */}
          <div className="w-10 h-10 rounded-full bg-[#f3f4f6] dark:bg-[#30363d] flex items-center justify-center text-gray-600 dark:text-[#c9d1d9] font-extrabold text-sm border border-gray-200 dark:border-[#30363d] overflow-hidden shrink-0 shadow-sm">
            {profilePhotoURL ? (
              <img src={profilePhotoURL} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              collegeInitial
            )}
          </div>
          <div className="text-left min-w-0">
            <h3 className="text-xs font-bold text-ec-highlight leading-tight truncate">
              {adminName}
            </h3>
            <span className="block text-[10px] text-ec-text-sub font-medium truncate mt-0.5">
              Personal settings
            </span>
          </div>
        </div>

        {/* Sidebar menu list */}
        <nav className="space-y-6">
          
          {/* Section 1: User Settings */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60'
                  : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight'
              }`}
            >
              <User size={14} className={activeTab === 'profile' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Public profile</span>
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                activeTab === 'account'
                  ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60'
                  : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight'
              }`}
            >
              <Settings size={14} className={activeTab === 'account' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Account</span>
            </button>

            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                activeTab === 'appearance'
                  ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60'
                  : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight'
              }`}
            >
              <Palette size={14} className={activeTab === 'appearance' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Appearance</span>
            </button>

            <button
              onClick={() => setActiveTab('institution')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                activeTab === 'institution'
                  ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60'
                  : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight'
              }`}
            >
              <Building2 size={14} className={activeTab === 'institution' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Institution Details</span>
            </button>

            <button
              onClick={() => setActiveTab('accessibility')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                activeTab === 'accessibility'
                  ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60'
                  : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight'
              }`}
            >
              <Accessibility size={14} className={activeTab === 'accessibility' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Accessibility</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60'
                  : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight'
              }`}
            >
              <Bell size={14} className={activeTab === 'notifications' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Notifications</span>
            </button>
          </div>

          {/* Section 2: Access & Licensing */}
          <div className="space-y-1">
            <span className="block px-3 text-[9px] font-[800] uppercase tracking-wider text-ec-text-sub select-none">
              Access & Security
            </span>

            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                activeTab === 'billing'
                  ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60'
                  : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard size={14} className={activeTab === 'billing' ? 'text-ec-accent' : 'text-ec-icon'} />
                <span>Billing & licensing</span>
              </div>
              <span className="text-[8px] font-bold border border-ec-border px-1.5 py-0.5 rounded-full uppercase leading-none font-mono">
                Free
              </span>
            </button>

            <button
              onClick={() => setActiveTab('emails')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                activeTab === 'emails'
                  ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60'
                  : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight'
              }`}
            >
              <Mail size={14} className={activeTab === 'emails' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Emails</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60'
                  : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight'
              }`}
            >
              <Key size={14} className={activeTab === 'security' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Security & keys</span>
            </button>

            <button
              onClick={() => setActiveTab('sessions')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors border border-transparent bg-transparent outline-none cursor-pointer ${
                activeTab === 'sessions'
                  ? 'bg-ec-muted/50 dark:bg-[#21262d] text-ec-highlight border-ec-border/60'
                  : 'text-ec-text-sub hover:bg-ec-muted/20 hover:text-ec-highlight'
              }`}
            >
              <Tv size={14} className={activeTab === 'sessions' ? 'text-ec-accent' : 'text-ec-icon'} />
              <span>Active sessions</span>
            </button>
          </div>

        </nav>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 min-w-0">
        
        {/* Global Action Banner Alert */}
        {message.text && (
          <div className={`p-4 rounded-xl text-xs font-semibold border flex items-center gap-2 mb-6 animate-in fade-in duration-200 ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
              : 'bg-red-500/10 text-red-400 border-red-500/25'
          }`}>
            <Check size={14} />
            <span>{message.text}</span>
          </div>
        )}

        {/* ── TAB CONTENT ── */}
        
        {/* TAB A: Public profile (Matches the uploaded screenshot exactly!) */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="border-b border-ec-border pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-ec-highlight">Public profile</h2>
                <p className="text-[11px] text-ec-text-sub mt-0.5">Manage details shown to verified network nodes.</p>
              </div>
              <button 
                onClick={() => navigate('/college')}
                className="px-3 py-1.5 border border-ec-border hover:bg-ec-muted/30 text-ec-highlight rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 bg-transparent"
              >
                Go to your personal profile
                <ExternalLink size={12} />
              </button>
            </div>

            <div className="flex flex-col-reverse lg:flex-row gap-8">
              
              {/* Form columns */}
              <form onSubmit={handleSaveProfile} className="flex-1 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-ec-highlight mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full max-w-lg bg-ec-surface border border-ec-border focus:border-ec-accent focus:ring-1 focus:ring-ec-accent/25 rounded-lg px-3 py-2 text-xs text-ec-highlight outline-none font-semibold transition-all"
                    placeholder="Enter your display name"
                    required
                  />
                  <p className="text-[10px] text-ec-text-sub mt-1 leading-normal max-w-md">
                    Your name may appear around the Connect-Karo platform where you publish broadcasts, notice letters, or review directories.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ec-highlight mb-1.5">
                    Public email
                  </label>
                  <select 
                    className="w-full max-w-lg bg-ec-surface border border-ec-border focus:border-ec-accent rounded-lg px-3 py-2 text-xs text-ec-highlight outline-none font-semibold transition-all"
                    disabled
                  >
                    <option>{adminEmail} (Primary)</option>
                  </select>
                  <p className="text-[10px] text-ec-text-sub mt-1 leading-normal max-w-md">
                    You have set your email address to primary institutional verification.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ec-highlight mb-1.5">
                    Bio
                  </label>
                  <textarea
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    rows={4}
                    className="w-full max-w-lg bg-ec-surface border border-ec-border focus:border-ec-accent focus:ring-1 focus:ring-ec-accent/25 rounded-lg px-3 py-2 text-xs text-ec-highlight outline-none font-semibold transition-all resize-y"
                    placeholder="C++ (DSA) | Contributor to Alumni and Hackathon Projects..."
                  />
                  <p className="text-[10px] text-ec-text-sub mt-1 leading-normal max-w-md">
                    Brief professional or academic summary. You can mention other departments or colleges to link to them.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ec-highlight mb-1.5">
                    Pronouns
                  </label>
                  <select 
                    value={profilePronouns}
                    onChange={(e) => setProfilePronouns(e.target.value)}
                    className="w-full max-w-xs bg-ec-surface border border-ec-border focus:border-ec-accent rounded-lg px-3 py-2 text-xs text-ec-highlight outline-none font-semibold transition-all cursor-pointer"
                  >
                    <option value="he/him">he/him</option>
                    <option value="she/her">she/her</option>
                    <option value="they/them">they/them</option>
                    <option value="custom">Don't specify</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ec-highlight mb-1.5">
                    URL
                  </label>
                  <input
                    type="url"
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    className="w-full max-w-lg bg-ec-surface border border-ec-border focus:border-ec-accent focus:ring-1 focus:ring-ec-accent/25 rounded-lg px-3 py-2 text-xs text-ec-highlight outline-none font-semibold transition-all"
                    placeholder="https://github.com/hrittik702"
                  />
                </div>

                <div className="pt-4 border-t border-ec-border/60">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-ec-accent hover:bg-ec-accent-hover text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-60"
                    disabled={savingProfile}
                  >
                    {savingProfile ? 'Updating profile...' : 'Update profile'}
                  </button>
                </div>

              </form>

              {/* Avatar picture editor right-side (GitHub Style) */}
              <div className="w-full lg:w-[220px] shrink-0 flex flex-col items-center select-none">
                <span className="block text-xs font-bold text-ec-highlight mb-3 self-start lg:self-center">
                  Profile picture
                </span>

                <div className="relative group w-36 h-36 rounded-full border border-ec-border bg-[#f3f4f6] dark:bg-[#30363d] shadow-md flex items-center justify-center text-gray-600 dark:text-[#c9d1d9] font-extrabold text-3xl overflow-hidden mb-4">
                  {profilePhotoURL ? (
                    <img src={profilePhotoURL} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    collegeInitial
                  )}

                  {/* Overlaid edit buttons */}
                  <button
                    onClick={() => {
                      setTempPhotoUrl(profilePhotoURL);
                      setIsEditingPhoto(true);
                    }}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 text-white text-[10px] font-bold transition-opacity cursor-pointer border-transparent outline-none"
                  >
                    <Edit2 size={16} />
                    <span>Edit Photo</span>
                  </button>
                </div>

                {isEditingPhoto ? (
                  <div className="w-full space-y-2.5 animate-in slide-in-from-top-2 duration-150 p-3 bg-ec-muted/20 border border-ec-border rounded-xl">
                    <div className="flex justify-between items-center border-b border-ec-border/40 pb-1">
                      <span className="text-[10px] font-bold text-ec-highlight">Input Image URL</span>
                      <X size={12} className="text-ec-text-sub cursor-pointer" onClick={() => setIsEditingPhoto(false)} />
                    </div>
                    <input 
                      type="url"
                      value={tempPhotoUrl}
                      onChange={(e) => setTempPhotoUrl(e.target.value)}
                      placeholder="https://example.com/anime.jpg"
                      className="w-full bg-ec-surface border border-ec-border focus:border-ec-accent rounded-lg px-2 py-1.5 text-[10.5px] text-ec-highlight outline-none font-semibold transition-all"
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsEditingPhoto(false)}
                        className="flex-1 py-1 text-[9px] font-bold text-ec-text-sub bg-ec-surface border border-ec-border hover:bg-ec-muted rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleUpdatePhoto}
                        className="flex-1 py-1 text-[9px] font-bold text-white bg-ec-accent hover:bg-ec-accent-hover rounded cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setTempPhotoUrl(profilePhotoURL);
                      setIsEditingPhoto(true);
                    }}
                    className="px-3.5 py-1.5 border border-ec-border hover:bg-ec-muted/30 text-ec-highlight rounded-lg text-xs font-semibold transition-colors cursor-pointer bg-transparent"
                  >
                    Edit
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB B: Account details (Standard configurations) */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <div className="border-b border-ec-border pb-4">
              <h2 className="text-xl font-bold text-ec-highlight">Account Settings</h2>
              <p className="text-[11px] text-ec-text-sub mt-0.5">Manage administrative credentials and security preferences.</p>
            </div>

            <div className="space-y-6">
              
              {/* Account details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-ec-accent uppercase tracking-wider border-b border-ec-border/40 pb-1.5">
                  General Configurations
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
                  <div>
                    <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1.5">
                      Username / Handle
                    </label>
                    <div className="p-3 bg-ec-muted/20 border border-ec-border/60 rounded-lg text-xs text-ec-text-sub font-mono font-semibold">
                      {userHandle}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1.5">
                      Assigned Security Role
                    </label>
                    <div className="p-3 bg-ec-muted/20 border border-ec-border/60 rounded-lg text-xs text-ec-text-sub font-mono font-bold uppercase">
                      {userData?.role || 'COLLEGE_ADMIN'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Control */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider border-b border-red-500/10 pb-1.5">
                  Danger Zone
                </h3>
                
                <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-xl max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-ec-highlight">Terminate Active Session</h4>
                    <p className="text-[10px] text-ec-text-sub mt-0.5 leading-normal max-w-sm">
                      Log out of the Connect-Karo platform immediately. This clears your local security authentication tokens.
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(true)}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <LogOut size={13} />
                    Sign Out Node
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB C: Modular Appearance Settings */}
        {activeTab === 'appearance' && (
          <AppearanceSettings />
        )}

        {/* TAB D: Institutional Node Details (Old CollegeSettings layout integrated seamlessly!) */}
        {activeTab === 'institution' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="border-b border-ec-border pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-ec-highlight flex items-center gap-2">
                  <Building2 size={20} className="text-ec-accent" />
                  Institutional Details
                </h2>
                <p className="text-[11px] text-ec-text-sub mt-0.5">Manage domain protection, addresses, and college-wide credentials.</p>
              </div>

              {collegeDetails && !isEditingCollege && (
                <button
                  onClick={() => setIsEditingCollege(true)}
                  className="px-3.5 py-1.5 bg-ec-accent hover:bg-ec-accent-hover text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Edit2 size={13} />
                  Edit Settings
                </button>
              )}
            </div>

            {collegeLoading ? (
              <div className="surface-card p-6 space-y-4 animate-pulse border border-ec-border rounded-xl">
                <div className="h-5 bg-ec-muted/50 w-1/4 rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-ec-muted/40 rounded"></div>
                  <div className="h-10 bg-ec-muted/40 rounded"></div>
                </div>
              </div>
            ) : !collegeDetails ? (
              <div className="surface-card p-8 border border-ec-border rounded-xl text-center text-ec-text-sub">
                College records failed to sync.
              </div>
            ) : (
              <form onSubmit={handleSaveCollege} className="space-y-6 max-w-3xl">
                
                {/* Node Active Banner */}
                <div className="flex items-center gap-3 p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl select-none">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Shield size={16} />
                  </div>
                  <div>
                    <p className="text-[11.5px] font-bold text-ec-highlight">Operational Status: Verified Node</p>
                    <p className="text-[9.5px] text-ec-text-sub mt-0.5">
                      This institutional dashboard is authenticated and synced to Connect-Karo core databases.
                    </p>
                  </div>
                  <span className="ml-auto px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase">
                    {collegeDetails.status || 'Active'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1.5">
                      Institution Name
                    </label>
                    {isEditingCollege ? (
                      <div className="relative">
                        <Building2 size={15} className="absolute left-3 top-3 text-ec-text-sub" />
                        <input 
                          type="text"
                          value={collegeName}
                          onChange={(e) => setCollegeName(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-ec-surface border border-ec-border focus:border-ec-accent rounded-lg text-xs text-ec-highlight font-semibold outline-none transition-all"
                          placeholder="Enter institution full name"
                          required
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 p-3 bg-ec-muted/20 border border-ec-border/60 rounded-lg text-xs text-ec-highlight font-semibold">
                        <Building2 size={15} className="text-ec-text-sub" />
                        <span>{collegeDetails.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1.5">
                      Primary Domain Protection (Read-Only)
                    </label>
                    <div className="flex items-center gap-2.5 p-3 bg-ec-muted/10 border border-ec-border/40 rounded-lg text-xs text-ec-text-sub font-mono font-medium">
                      <Globe size={15} className="text-ec-text-sub/50" />
                      <span>{collegeDetails.domain}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1.5">
                      Unique Institution Code (Read-Only)
                    </label>
                    <div className="flex items-center gap-2.5 p-3 bg-ec-muted/10 border border-ec-border/40 rounded-lg text-xs text-ec-text-sub font-mono font-bold uppercase">
                      <Hash size={15} className="text-ec-text-sub/50" />
                      <span>{collegeDetails.collegeCode}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1.5">
                      Admin Email Endpoint (Read-Only)
                    </label>
                    <div className="flex items-center gap-2.5 p-3 bg-ec-muted/10 border border-ec-border/40 rounded-lg text-xs text-ec-text-sub font-medium">
                      <Mail size={15} className="text-ec-text-sub/50" />
                      <span>{collegeDetails.adminEmail}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1.5">
                      Contact Telephone
                    </label>
                    {isEditingCollege ? (
                      <div className="relative">
                        <Phone size={15} className="absolute left-3 top-3 text-ec-text-sub" />
                        <input 
                          type="tel"
                          value={adminPhone}
                          onChange={(e) => setAdminPhone(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-ec-surface border border-ec-border focus:border-ec-accent rounded-lg text-xs text-ec-text outline-none transition-all font-semibold"
                          placeholder="e.g. +91 98765 43210"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 p-3 bg-ec-muted/20 border border-ec-border/60 rounded-lg text-xs text-ec-text font-medium">
                        <Phone size={15} className="text-ec-text-sub" />
                        <span>{collegeDetails.adminPhone || 'N/A'}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-ec-text-sub uppercase tracking-wider mb-1.5">
                      Campus Localization Address
                    </label>
                    {isEditingCollege ? (
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3 top-3 text-ec-text-sub" />
                        <textarea 
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          rows={3}
                          className="w-full pl-9 pr-4 py-2.5 bg-ec-surface border border-ec-border focus:border-ec-accent rounded-lg text-xs text-ec-text outline-none transition-all font-semibold resize-y"
                          placeholder="Enter physical campus boundary coordinates"
                        />
                      </div>
                    ) : (
                      <div className="flex items-start gap-2.5 p-3 bg-ec-muted/20 border border-ec-border/60 rounded-lg text-xs text-ec-text font-medium leading-relaxed">
                        <MapPin size={15} className="text-ec-text-sub mt-0.5 shrink-0" />
                        <span>{collegeDetails.address || 'No campus localization credentials configured.'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isEditingCollege && (
                  <div className="flex gap-2.5 justify-end pt-3 border-t border-ec-border/60">
                    <button 
                      type="button"
                      onClick={() => setIsEditingCollege(false)}
                      className="px-3.5 py-2 text-xs font-bold text-ec-text-sub hover:text-ec-highlight bg-ec-surface border border-ec-border hover:bg-ec-muted rounded-lg transition-colors cursor-pointer"
                      disabled={savingCollege}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 text-xs font-bold text-white bg-ec-accent hover:bg-ec-accent-hover rounded-lg transition-all shadow-md disabled:opacity-50 cursor-pointer"
                      disabled={savingCollege}
                    >
                      {savingCollege ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}

                {!isEditingCollege && collegeDetails.createdAt && (
                  <div className="flex items-center gap-1.5 text-[9.5px] text-ec-text-sub pt-3 border-t border-ec-border/40 select-none">
                    <Calendar size={11} />
                    <span>Node initialized on: {new Date(collegeDetails.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                )}

              </form>
            )}

          </div>
        )}

        {/* TAB E: Mock Settings Pages (Accessibility, Notifications, Emails, etc.) */}
        {(activeTab === 'accessibility' || activeTab === 'notifications' || activeTab === 'billing' || activeTab === 'emails' || activeTab === 'security' || activeTab === 'sessions') && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-ec-border pb-4">
              <h2 className="text-xl font-bold text-ec-highlight capitalize">
                {activeTab === 'security' ? 'Security & Keys' : activeTab === 'billing' ? 'Billing & licensing' : activeTab === 'sessions' ? 'Active sessions' : activeTab}
              </h2>
              <p className="text-[11px] text-ec-text-sub mt-0.5">Customize your security keys, notifications, and advanced access controls.</p>
            </div>

            <div className="surface-card border-dashed border-2 border-ec-border rounded-xl p-8 text-center flex flex-col items-center max-w-2xl bg-ec-surface/40">
              <div className="w-12 h-12 rounded-full bg-ec-muted/40 border border-ec-border flex items-center justify-center text-ec-highlight mb-4">
                <Lock size={18} className="text-ec-text-sub" />
              </div>
              <h4 className="text-xs font-bold text-ec-highlight mb-1 uppercase tracking-wider">
                Pipeline Sealed & Protected
              </h4>
              <p className="text-[10px] text-ec-text-sub max-w-sm leading-relaxed">
                This sub-configuration node is fully encrypted and synced with the local mock credentials. Real-time controls will live lock once database credentials migrate.
              </p>
              
              <button 
                disabled
                className="mt-4 px-3.5 py-1.5 bg-ec-accent/10 border border-ec-accent/25 text-ec-accent text-[10px] font-bold rounded-lg opacity-60 cursor-not-allowed flex items-center gap-1.5"
              >
                <Plus size={11} />
                Configure advanced flags
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ── LOGOUT CONFIRMATION MODAL ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setShowLogoutModal(false)}
          />
          
          <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-ec-border bg-ec-surface p-6 text-left shadow-2xl transition-all animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 animate-pulse">
                <LogOut size={22} className="rotate-180" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ec-highlight">
                  Terminate Active Session?
                </h3>
                <p className="text-xs text-ec-text-sub mt-1">
                  You are about to sign out of the Connect-Karo Admin Portal.
                </p>
              </div>
            </div>

            <div className="mt-4 text-xs text-ec-text leading-relaxed">
              This will clear your local administrative session token. You will need to input your credentials to log back in.
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-xs font-bold text-ec-text-sub hover:text-ec-highlight bg-ec-surface border border-ec-border hover:bg-ec-muted rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-lg shadow-red-500/15 transition-all cursor-pointer border-transparent"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
