import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase/config";

export default function AdminDashboard() {
  const { userData, dummyLogout } = useAuth(); // dummyLogout ko destructure karein

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#d9534f' }}>Root Admin Dashboard 👑</h1>
      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
        <p><strong>Welcome,</strong> {userData?.name || "Super Admin"}</p>
        <p><strong>Email:</strong> {userData?.email}</p>
        <p><strong>Role:</strong> {userData?.role}</p>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Quick Actions:</h3>
        <ul>
          <li>Manage All Colleges</li>
          <li>System Settings</li>
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