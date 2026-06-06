import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import { Edit2, X, User } from 'lucide-react';

export default function PublicProfileSettings() {
  const { currentUser, userData } = useAuth();
  const { showToast } = useOutletContext();

  const [profileName, setProfileName] = useState(userData?.name || '');
  const [profileBio, setProfileBio] = useState(userData?.bio || '');
  const [profilePronouns, setProfilePronouns] = useState(userData?.pronouns || 'he/him');
  const [profileUrl, setProfileUrl] = useState(userData?.url || '');
  const [profilePhotoURL, setProfilePhotoURL] = useState(userData?.photoURL || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState('');

  const adminEmail = userData?.email || currentUser?.email || "admin@institution.edu";
  const institutionName = userData?.collegeName || userData?.collegeId || "College";
  const collegeInitial = institutionName.charAt(0).toUpperCase();

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

  // Save personal profile data to Supabase
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      showToast('error', 'Display name cannot be empty.');
      return;
    }

    setSavingProfile(true);
    try {
      if (userData?.id === 'dummy_12345') {
        showToast('success', 'Public profile updated successfully! (Demo Mode)');
        setSavingProfile(false);
        return;
      }

      const { error } = await supabase
        .from('users')
        .update({
          name: profileName.trim(),
          bio: profileBio.trim(),
          pronouns: profilePronouns,
          url: profileUrl.trim()
        })
        .eq('id', userData.id);

      if (error) throw error;

      showToast('success', 'Public profile updated successfully!');
    } catch (err) {
      console.error("Failed to save user profile:", err);
      showToast('error', 'Failed to update database profile records.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Update profile photo url
  const handleUpdatePhoto = async () => {
    if (!tempPhotoUrl.trim()) return;
    setSavingProfile(true);
    try {
      if (userData?.id === 'dummy_12345') {
        setProfilePhotoURL(tempPhotoUrl.trim());
        showToast('success', 'Avatar updated! (Demo Mode)');
        setIsEditingPhoto(false);
        setSavingProfile(false);
        return;
      }

      const { error } = await supabase
        .from('users')
        .update({ photo_url: tempPhotoUrl.trim() })
        .eq('id', userData.id);

      if (error) throw error;

      setProfilePhotoURL(tempPhotoUrl.trim());
      showToast('success', 'Profile picture updated successfully!');
      setIsEditingPhoto(false);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to update avatar photo.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-ec-border pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-medium text-ec-highlight flex items-center gap-2">
            <User size={20} className="text-ec-accent" />
            Public profile
          </h2>
          <p className="text-xs text-ec-text-sub mt-0.5">Manage details shown to verified network nodes.</p>
        </div>
      </div>

      <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">
        
        {/* Form columns */}
        <form onSubmit={handleSaveProfile} className="flex-1 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-ec-highlight mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full bg-ec-surface border border-ec-border focus:border-ec-accent focus:ring-1 focus:ring-ec-accent/25 rounded-lg px-3 py-2 text-[13px] text-ec-highlight outline-none font-normal transition-all"
              placeholder="Enter your display name"
              required
            />
            <p className="text-[11px] text-ec-text-sub mt-1 leading-normal">
              Your name may appear around the Connect-Karo platform where you publish broadcasts, notice letters, or review directories.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ec-highlight mb-1.5">
              Public email
            </label>
            <select 
              className="w-full bg-ec-surface border border-ec-border focus:border-ec-accent rounded-lg px-3 py-2 text-[13px] text-ec-highlight outline-none font-normal transition-all"
              disabled
            >
              <option>{adminEmail} (Primary)</option>
            </select>
            <p className="text-[11px] text-ec-text-sub mt-1 leading-normal">
              You have set your email address to primary institutional verification.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ec-highlight mb-1.5">
              Bio
            </label>
            <textarea
              value={profileBio}
              onChange={(e) => setProfileBio(e.target.value)}
              rows={4}
              className="w-full bg-ec-surface border border-ec-border focus:border-ec-accent focus:ring-1 focus:ring-ec-accent/25 rounded-lg px-3 py-2 text-[13px] text-ec-highlight outline-none font-normal transition-all resize-y"
              placeholder="C++ (DSA) | Contributor to Alumni and Hackathon Projects..."
            />
            <p className="text-[11px] text-ec-text-sub mt-1 leading-normal">
              Brief professional or academic summary. You can mention other departments or colleges to link to them.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ec-highlight mb-1.5">
              Pronouns
            </label>
            <select 
              value={profilePronouns}
              onChange={(e) => setProfilePronouns(e.target.value)}
              className="w-full max-w-xs bg-ec-surface border border-ec-border focus:border-ec-accent rounded-lg px-3 py-2 text-[13px] text-ec-highlight outline-none font-normal transition-all cursor-pointer"
            >
              <option value="he/him">he/him</option>
              <option value="she/her">she/her</option>
              <option value="they/them">they/them</option>
              <option value="custom">Don't specify</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ec-highlight mb-1.5">
              URL
            </label>
            <input
              type="url"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              className="w-full bg-ec-surface border border-ec-border focus:border-ec-accent focus:ring-1 focus:ring-ec-accent/25 rounded-lg px-3 py-2 text-[13px] text-ec-highlight outline-none font-normal transition-all"
              placeholder="https://github.com/hrittik702"
            />
          </div>

          <div className="pt-4 border-t border-ec-border/60">
            <button
              type="submit"
              className="px-4 py-2 bg-ec-accent hover:bg-ec-accent-hover text-white text-xs font-semibold rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-60"
              disabled={savingProfile}
            >
              {savingProfile ? 'Updating profile...' : 'Update profile'}
            </button>
          </div>

        </form>

        {/* Avatar picture editor right-side (GitHub Style) */}
        <div className="w-full lg:w-[280px] shrink-0 flex flex-col items-start select-none">
          <span className="block text-xs font-semibold text-ec-highlight mb-3">
            Profile picture
          </span>

          <div className="relative group w-[200px] h-[200px] rounded-full border border-ec-border bg-ec-muted shadow-sm flex items-center justify-center text-ec-text font-medium text-4xl overflow-hidden mb-4">
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
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 text-white text-[11px] font-semibold transition-opacity cursor-pointer border-transparent outline-none"
            >
              <Edit2 size={16} />
              <span>Change avatar</span>
            </button>
          </div>

          {isEditingPhoto ? (
            <div className="w-[200px] space-y-2.5 animate-in slide-in-from-top-2 duration-150 p-3 bg-ec-muted/20 border border-ec-border rounded-xl">
              <div className="flex justify-between items-center border-b border-ec-border/40 pb-1">
                <span className="text-[10px] font-semibold text-ec-highlight">Input Image URL</span>
                <X size={12} className="text-ec-text-sub cursor-pointer" onClick={() => setIsEditingPhoto(false)} />
              </div>
              <input 
                type="url"
                value={tempPhotoUrl}
                onChange={(e) => setTempPhotoUrl(e.target.value)}
                placeholder="https://example.com/anime.jpg"
                className="w-full bg-ec-surface border border-ec-border focus:border-ec-accent rounded-lg px-2 py-1.5 text-[10.5px] text-ec-highlight outline-none font-normal transition-all"
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditingPhoto(false)}
                  className="flex-1 py-1 text-[9px] font-semibold text-ec-text-sub bg-ec-surface border border-ec-border hover:bg-ec-muted rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdatePhoto}
                  className="flex-1 py-1 text-[9px] font-semibold text-white bg-ec-accent hover:bg-ec-accent-hover rounded cursor-pointer"
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
              className="w-[200px] py-1.5 border border-ec-border hover:bg-ec-muted/30 text-ec-highlight rounded-lg text-xs font-semibold transition-colors cursor-pointer bg-transparent flex items-center justify-center gap-1.5"
            >
              <Edit2 size={12} />
              Edit
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
