import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to cleanly map Postgres snake_case fields to camelCase properties for 100% UI compatibility
  const mapProfileData = (dbUser) => {
    if (!dbUser) return null;
    return {
      uid: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      status: dbUser.status,
      collegeId: dbUser.college_id,
      collegeName: dbUser.college_name,
      batch: dbUser.batch,
      degree: dbUser.degree,
      company: dbUser.company,
      designation: dbUser.designation,
      linkedin: dbUser.linkedin,
      bio: dbUser.bio,
      pronouns: dbUser.pronouns,
      url: dbUser.url,
      photoURL: dbUser.photo_url,
      rollNo: dbUser.roll_no,
      branch: dbUser.branch,
      currentYear: dbUser.current_year
    };
  };

  const handleUserSession = async (session) => {
    if (session?.user) {
      const user = session.user;
      setCurrentUser(user);
      
      try {
        // Retrieve public profile details from users table
        const { data: dbUser, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (dbUser) {
          const profile = { ...dbUser };
          
          // Self-healing collegeId logic (case sensitivity fix)
          if (profile.college_id && profile.college_id.toLowerCase() !== "dummy_college_01") {
            const rawId = profile.college_id.trim();
            
            const { data: college } = await supabase
              .from("colleges")
              .select("id")
              .eq("id", rawId)
              .single();

            if (!college) {
              const { data: upperCol } = await supabase
                .from("colleges")
                .select("id")
                .eq("id", rawId.toUpperCase())
                .single();

              if (upperCol) {
                profile.college_id = rawId.toUpperCase();
                await supabase.from("users").update({ college_id: profile.college_id }).eq("id", user.id);
              } else {
                const { data: lowerCol } = await supabase
                  .from("colleges")
                  .select("id")
                  .eq("id", rawId.toLowerCase())
                  .single();

                if (lowerCol) {
                  profile.college_id = rawId.toLowerCase();
                  await supabase.from("users").update({ college_id: profile.college_id }).eq("id", user.id);
                }
              }
            }
          }

          setUserData(mapProfileData(profile));
        } else {
          // Fallback to Supabase Auth metadata if public.users is not yet provisioned
          const metadata = user.user_metadata || {};
          setUserData({
            uid: user.id,
            email: user.email,
            name: metadata.name || "Connect-Karo Member",
            role: metadata.role || "student",
            status: metadata.status || "pending",
            collegeId: metadata.collegeId,
            collegeName: metadata.collegeName
          });
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      }
    } else {
      setCurrentUser(null);
      setUserData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Register real-time session updates.
    // In Supabase v2, onAuthStateChange immediately fires an INITIAL_SESSION event
    // with the active session (if any), removing the need for a separate getSession call.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await handleUserSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🟢 Dummy Login Function (Preserved for offline, fast portal evaluation)
  const dummyLogin = (role) => {
    setCurrentUser({ id: "dummy_12345", email: `test@${role}.com` });
    setUserData({
      uid: "dummy_12345",
      name: `Demo ${role.toUpperCase()}`,
      role: role,
      status: "approved",
      collegeId: "dummy_college_01",
      batch: "2024",
      company: "Test Corp"
    });
  };

  // 🟢 Unified Logout Function
  const logout = () => {
    setCurrentUser(null);
    setUserData(null);
    return supabase.auth.signOut();
  };

  // 🟢 Dummy Logout
  const dummyLogout = () => {
    logout();
  };

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading, dummyLogin, dummyLogout, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};