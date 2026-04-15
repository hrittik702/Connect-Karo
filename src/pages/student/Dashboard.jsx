import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase/config";

export default function StudentDashboard() {
  const { userData } = useAuth(); // Yahan se current user ka saara data mil jayega

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Student Dashboard</h1>
      <p>Hello, {userData?.name || "Student"}!</p>
      <p>Your College ID: {userData?.collegeId}</p>
      
      {/* Team member yahan apne features code karega */}
      
      <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px', background: 'red', color: 'white' }}>
        Logout
      </button>
    </div>
  );
}