import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase/config";

export default function CollegeDashboard() {
  const { userData, dummyLogout } = useAuth();

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#007bff' }}>College Admin Dashboard 🏛️</h1>
      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
        <p><strong>Welcome,</strong> {userData?.name || "College Admin"}</p>
        <p><strong>College ID:</strong> {userData?.collegeId}</p>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3>College Management:</h3>
        <ul>
          <li>Approve New Students</li>
          <li>Approve Alumni Profiles</li>
          <li>Block/Remove Users</li>
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