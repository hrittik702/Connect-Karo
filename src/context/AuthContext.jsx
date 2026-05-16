import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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
            setUserData(userDoc.data());
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

  // 🟢 NEW: Dummy Login Function for Development
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

  // 🟢 NEW: Dummy Logout
  const dummyLogout = () => {
    setCurrentUser(null);
    setUserData(null);
    auth.signOut(); // Real firebase logout just in case
  };

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading, dummyLogin, dummyLogout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};