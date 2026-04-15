import { useNavigate } from 'react-router-dom'
import { GraduationCap, ArrowRight, Shield, Users, BarChart3, Sun, Moon } from 'lucide-react'
import { useSystemTheme } from './hooks/useSystemTheme'

function App() {
  const navigate = useNavigate()
  const theme = useSystemTheme()

  return (
    <div className="min-h-screen bg-ec-root text-ec-text font-inter overflow-x-hidden transition-colors duration-300">
      {/* ====== Navbar ====== */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 sticky top-0 z-50 bg-ec-root/80 backdrop-blur-xl border-b border-ec-border transition-colors duration-300">
        <span className="text-xl font-bold text-ec-accent tracking-tight">
          Connect Karo
        </span>
        <div className="flex items-center gap-3">
          {/* System Theme Indicator */}
          <div className="p-2.5 rounded-xl bg-ec-surface border border-ec-border text-ec-text-sub transition-colors duration-300">
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </div>
          <button
            className="px-5 py-2.5 rounded-xl border border-ec-accent/30 bg-ec-accent/10 text-ec-accent text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-ec-accent/20 hover:border-ec-accent/50 hover:shadow-lg hover:shadow-ec-accent/15 hover:-translate-y-0.5"
            onClick={() => navigate('/college-admin/login')}
          >
            Admin Login
          </button>
        </div>
      </nav>

      {/* ====== Hero Section ====== */}
      <section className="text-center px-6 pt-20 md:pt-28 pb-16 md:pb-20 relative">
        {/* Background glow — uses accent as radial */}
        <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-ec-accent/[0.06] blur-[140px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-ec-accent/10 border border-ec-accent/20 text-ec-accent text-[13px] font-medium mb-8 animate-fade-in-down">
          <Shield size={14} />
          <span>Trusted by Colleges Nationwide</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-[-3px] text-ec-highlight mb-6 animate-fade-in-up-d1">
          Your College.
          <br />
          <span className="text-ec-accent">Connected.</span>
        </h1>

        <p className="text-base md:text-lg leading-relaxed text-ec-text-sub max-w-xl mx-auto mb-10 animate-fade-in-up-d2">
          A unified platform for college administrators to manage students,
          placements, and campus operations — all in one place.
        </p>

        <div className="flex gap-4 justify-center animate-fade-in-up-d3">
          <button
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl border-none bg-ec-accent text-white text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-ec-accent/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-ec-accent/40 hover:bg-ec-accent-hover active:translate-y-0"
            onClick={() => navigate('/college-admin/login')}
          >
            <GraduationCap size={18} />
            College Admin Login
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* ====== Features ====== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-12 pb-16 md:pb-20 max-w-[1100px] mx-auto">
        {[
          {
            icon: <Users size={24} />,
            title: 'Student Management',
            desc: 'Manage student records, profiles and academic data effortlessly.',
          },
          {
            icon: <BarChart3 size={24} />,
            title: 'Analytics Dashboard',
            desc: 'Get real-time insights on placements, attendance and performance.',
          },
          {
            icon: <Shield size={24} />,
            title: 'Secure Access',
            desc: 'Role-based access control with encrypted data protection.',
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="p-7 bg-ec-surface border border-ec-border rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ec-accent/10 hover:border-ec-accent/30"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-ec-accent/10 text-ec-accent">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-ec-highlight mb-2">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-ec-text-sub">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* ====== Footer ====== */}
      <footer className="py-8 px-6 md:px-12 border-t border-ec-border text-center transition-colors duration-300">
        <p className="text-xs text-ec-text-sub/60">&copy; 2026 Connect Karo. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
