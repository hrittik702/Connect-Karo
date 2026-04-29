import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase/config";

export default function AlumniDashboard() {
  const { userData,dummyLogout } = useAuth();

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#28a745' }}>Alumni Dashboard 🎓</h1>
      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
        <p><strong>Welcome back,</strong> {userData?.name || "Alumni"}</p>
        <p><strong>Batch:</strong> {userData?.batch || "N/A"}</p>
        <p><strong>Current Company:</strong> {userData?.company || "Not Updated"}</p>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Networking:</h3>
        <ul>
          <li>Edit Professional Profile</li>
          <li>Connect with Current Students</li>
          <li>Post Job Referrals</li>
        </ul>
      </div>
      
      <button 
        onClick={dummyLogout} 
        style={{ marginTop: '20px', padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Logout
      </button>
    </div>
  );
}