import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSystemTheme from '../../hooks/useSystemTheme';

export default function Home() {
  const navigate = useNavigate();
  const theme = useSystemTheme(); // Theme hook use kar rahe hain

  // System theme ke hisaab se dynamic colors
  const isDark = theme === 'dark';
  
  const colors = {
    background: isDark ? '#0f172a' : '#f8fafc',
    textPrimary: isDark ? '#f1f5f9' : '#0f172a',
    textSecondary: isDark ? '#94a3b8' : '#64748b',
    cardBg: isDark ? '#1e293b' : '#ffffff',
    cardBorder: isDark ? '#334155' : '#e2e8f0',
    primaryBlue: '#3b82f6',
    hoverBlue: '#2563eb',
  };

  // CSS ko isi file mein likh rahe hain taaki alag file na banani pade
  const internalStyles = `
    .animate-fade-in-up {
      opacity: 0;
      transform: translateY(40px);
      animation: fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    .animate-float {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .animate-float:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
    .delay-400 { animation-delay: 0.4s; }
    
    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .btn-glow {
      position: relative;
      overflow: hidden;
    }
    .btn-glow::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 300%;
      height: 300%;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 60%);
      transform: translate(-50%, -50%) scale(0);
      transition: transform 0.5s ease;
    }
    .btn-glow:hover::after {
      transform: translate(-50%, -50%) scale(1);
    }
  `;

  return (
    <div style={{ backgroundColor: colors.background, color: colors.textPrimary, minHeight: '100vh', transition: 'background-color 0.4s ease', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Ye style tag saari CSS animations ko is page pe apply kar dega */}
      <style>{internalStyles}</style>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 5%', alignItems: 'center', borderBottom: `1px solid ${colors.cardBorder}` }} className="animate-fade-in-up">
        <div style={{ fontSize: '26px', fontWeight: '800', color: colors.primaryBlue, letterSpacing: '-0.5px' }}>
          CONNECT<span style={{ color: colors.textPrimary }}>KARO</span>
        </div>
        <button 
          onClick={() => navigate('/login')} 
          style={{ padding: '10px 24px', backgroundColor: 'transparent', border: `2px solid ${colors.primaryBlue}`, color: colors.primaryBlue, borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.3s' }}
          onMouseOver={(e) => { e.target.style.backgroundColor = colors.primaryBlue; e.target.style.color = '#fff'; }}
          onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = colors.primaryBlue; }}
        >
          Login Portal
        </button>
      </nav>

      {/* Hero Section */}
      <header style={{ textAlign: 'center', padding: '120px 20px 80px', maxWidth: '900px', margin: '0 auto' }}>
        <h1 className="animate-fade-in-up delay-100" style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: '900', lineHeight: '1.2', marginBottom: '24px' }}>
          Bridge the Gap Between <br/>
          <span style={{ color: colors.primaryBlue }}>Students & Alumni</span>
        </h1>
        
        <p className="animate-fade-in-up delay-200" style={{ fontSize: '18px', color: colors.textSecondary, lineHeight: '1.6', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          A modern, centralized platform designed for institutions to foster mentorship, track career growth, and build a powerful networking ecosystem.
        </p>
        
        <div className="animate-fade-in-up delay-300">
          <button 
            onClick={() => navigate('/login')} 
            className="btn-glow"
            style={{ padding: '16px 40px', fontSize: '18px', backgroundColor: colors.primaryBlue, color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)', transition: 'background-color 0.3s ease' }}
            onMouseOver={(e) => e.target.style.backgroundColor = colors.hoverBlue}
            onMouseOut={(e) => e.target.style.backgroundColor = colors.primaryBlue}
          >
            Get Started Now
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', padding: '40px 10%', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Card 1 */}
        <div className="animate-fade-in-up delay-200 animate-float" style={{ backgroundColor: colors.cardBg, padding: '40px 30px', borderRadius: '16px', border: `1px solid ${colors.cardBorder}`, textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>🎓</div>
          <h3 style={{ fontSize: '22px', marginBottom: '15px' }}>For Students</h3>
          <p style={{ color: colors.textSecondary, lineHeight: '1.5' }}>Connect with industry professionals, seek mentorship, and get referral opportunities from your seniors.</p>
        </div>

        {/* Card 2 */}
        <div className="animate-fade-in-up delay-300 animate-float" style={{ backgroundColor: colors.cardBg, padding: '40px 30px', borderRadius: '16px', border: `1px solid ${colors.cardBorder}`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: colors.primaryBlue }}></div>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>🤝</div>
          <h3 style={{ fontSize: '22px', marginBottom: '15px' }}>For Alumni</h3>
          <p style={{ color: colors.textSecondary, lineHeight: '1.5' }}>Give back to your alma mater, share your journey, and hire top talent directly from your college.</p>
        </div>

        {/* Card 3 */}
        <div className="animate-fade-in-up delay-400 animate-float" style={{ backgroundColor: colors.cardBg, padding: '40px 30px', borderRadius: '16px', border: `1px solid ${colors.cardBorder}`, textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>🏛️</div>
          <h3 style={{ fontSize: '22px', marginBottom: '15px' }}>For Colleges</h3>
          <p style={{ color: colors.textSecondary, lineHeight: '1.5' }}>Manage your entire network efficiently. Approve users, monitor connections, and grow your institutional value.</p>
        </div>

      </section>

      {/* Simple Footer */}
      <footer className="animate-fade-in-up delay-400" style={{ textAlign: 'center', padding: '40px 20px', color: colors.textSecondary, marginTop: '40px', borderTop: `1px solid ${colors.cardBorder}` }}>
        <p>© 2026 Connect-Karo. Built for professional networking.</p>
      </footer>

    </div>
  );
}