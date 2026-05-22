import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.collegeId && data.collegeId.toLowerCase() !== "dummy_college_01") {
              const rawId = data.collegeId.trim();
              let docRef = doc(db, "colleges", rawId);
              let snap = await getDoc(docRef);
              
              if (!snap.exists()) {
                docRef = doc(db, "colleges", rawId.toUpperCase());
                snap = await getDoc(docRef);
                if (snap.exists()) {
                  data.collegeId = rawId.toUpperCase();
                  try {
                    await updateDoc(doc(db, "users", user.uid), { collegeId: data.collegeId });
                  } catch (e) {
                    console.warn("Self-healing updateDoc failed:", e);
                  }
                } else {
                  docRef = doc(db, "colleges", rawId.toLowerCase());
                  snap = await getDoc(docRef);
                  if (snap.exists()) {
                    data.collegeId = rawId.toLowerCase();
                    try {
                      await updateDoc(doc(db, "users", user.uid), { collegeId: data.collegeId });
                    } catch (e) {
                      console.warn("Self-healing updateDoc failed:", e);
                    }
                  }
                }
              }
            }
            setUserData(data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 🟢 Dummy Login Function (Enabled in production to facilitate evaluation and testing on Vercel)
  const dummyLogin = (role) => {
    // Fake Firebase User
    setCurrentUser({ uid: "dummy_12345", email: `test@${role}.com` });
    
    // Fake Firestore Data
    setUserData({
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
    return auth.signOut();
  };

  // 🟢 Dummy Logout (for backward compatibility, calls unified logout)
  const dummyLogout = () => {
    logout();
  };

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading, dummyLogin, dummyLogout, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};