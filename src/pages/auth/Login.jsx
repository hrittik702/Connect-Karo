import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Firebase Auth se login karo
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Firestore se user ka role check karo
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const role = userDoc.data().role;

        // 3. Role ke hisaab se redirect karo
        if (role === "root_admin") navigate("/admin");
        else if (role === "college_admin") navigate("/college");
        else if (role === "alumni") navigate("/alumni");
        else if (role === "student") navigate("/student");
        else setError("Invalid role assigned.");
      } else {
        setError("User profile not found in database.");
      }
    } catch (err) {
      setError("Login failed. Check email and password.");
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}>
        <h2>CONNECT-KARO Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input 
          type="email" placeholder="Email" required 
          value={email} onChange={(e) => setEmail(e.target.value)} 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" placeholder="Password" required 
          value={password} onChange={(e) => setPassword(e.target.value)} 
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white' }}>
          Login
        </button>
      </form>
    </div>
  );
}