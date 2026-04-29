import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, GraduationCap, LayoutDashboard, Search, Bell, ArrowRight, Sparkles, Globe, Shield, Zap, ChevronRight } from 'lucide-react';
import useSystemTheme from '../../hooks/useSystemTheme';

export default function Home() {
  const navigate = useNavigate();
  const theme = useSystemTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-ec-root text-ec-text overflow-hidden selection:bg-ec-accent/30 font-inter">

      {/* Ambient Background Mesh */}
      <div className="ambient-mesh" />
      
      {/* Noise Texture for frosted realism */}
      <div className="noise-overlay" />

      {/* Extra color orbs for depth */}
      <div className="fixed top-[20%] right-[15%] w-[350px] h-[350px] rounded-full bg-blue-500/10 dark:bg-blue-400/10 blur-[120px] animate-float-orb pointer-events-none" />
      <div className="fixed bottom-[30%] left-[10%] w-[280px] h-[280px] rounded-full bg-purple-500/8 dark:bg-purple-400/8 blur-[100px] animate-float-orb-delayed pointer-events-none" />

      {/* ═══════════════════════════════════════════
       * NAVIGATION — Liquid Glass Navbar
       * ═══════════════════════════════════════════ */}
      <nav className="glass-nav sticky top-0 z-50 animate-fade-in-down">
        <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-ec-accent to-indigo-400 flex items-center justify-center shadow-lg shadow-ec-accent/25 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <span className="relative text-white font-extrabold text-lg leading-none">C</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-ec-highlight">
              Connect<span className="text-transparent bg-clip-text bg-gradient-to-r from-ec-accent to-indigo-400">Karo</span>
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {['Features', 'Solutions', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="px-4 py-2 rounded-xl text-sm font-medium text-ec-text-sub hover:text-ec-text hover:bg-ec-surface/50 transition-all duration-300">
                {item}
              </a>
            ))}
          </div>

          {/* CTA Button — Glass */}
          <button
            onClick={() => navigate('/login')}
            className="glass-btn group"
          >
            Portal Login
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
       * HERO SECTION
       * ═══════════════════════════════════════════ */}
      <main className="relative z-10 px-6 pt-20 pb-8 mx-auto max-w-7xl">

        <div className="flex flex-col items-center text-center">
          {/* Status Badge — Glass */}
          <div className="glass-badge mb-8 animate-fade-in-up">
            <Sparkles size={14} className="text-ec-accent" />
            <span>Connect-Karo v2.0 is Live</span>
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-5xl md:text-7xl font-extrabold tracking-tight text-ec-highlight mb-6 animate-fade-in-up-d1 leading-[1.08]">
            The Ultimate Platform for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ec-accent via-blue-500 to-indigo-400">
              Student–Alumni Synergy
            </span>
          </h1>

          <p className="max-w-2xl text-lg text-ec-text-sub mb-10 animate-fade-in-up-d2 leading-relaxed">
            Unlock the power of your institutional network. Foster meaningful mentorships,
            track career trajectories, and hire top talent directly from your alma mater.
          </p>

          {/* CTA Row — Glass Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up-d3">
            <button
              onClick={() => navigate('/login')}
              className="glass-btn-primary text-lg px-10 py-4"
            >
              Get Started Free
              <ChevronRight size={20} />
            </button>
            <button className="glass-btn text-lg px-10 py-4">
              Book a Demo
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
         * PROTOTYPE SHOWCASE — Glass Window
         * ═══════════════════════════════════════════ */}
        <div className={`w-full max-w-5xl mx-auto mt-24 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          {/* Outer prismatic glow border */}
          <div className="p-[2px] rounded-[28px] bg-gradient-to-b from-ec-accent/20 via-transparent to-purple-500/10">
            <div className="glass-card rounded-[26px] overflow-hidden" style={{ borderRadius: '26px' }}>

              {/* Window Chrome — Glass */}
              <div className="relative z-10 flex items-center px-5 h-12 border-b border-ec-border/30 bg-ec-surface/30 backdrop-blur-sm">
                <div className="flex gap-2 mr-4">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="glass-badge text-xs py-1 px-4">
                    <Globe size={12} />
                    dashboard.connect-karo.edu
                  </div>
                </div>
              </div>

              {/* App Content */}
              <div className="relative z-10 flex h-[480px] bg-ec-root/60">

                {/* Sidebar — Glass */}
                <aside className="hidden md:flex flex-col w-60 p-4 border-r border-ec-border/20 bg-ec-surface/20 backdrop-blur-sm">
                  <div className="text-[11px] font-semibold text-ec-text-sub uppercase tracking-[0.15em] px-3 mb-4">Menu</div>
                  {[
                    { icon: LayoutDashboard, text: 'Dashboard', active: false },
                    { icon: Users, text: 'Network', active: true },
                    { icon: Briefcase, text: 'Jobs', active: false },
                    { icon: GraduationCap, text: 'Mentorship', active: false },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-300
                        ${item.active
                          ? 'glass text-ec-accent shadow-sm'
                          : 'text-ec-text-sub hover:text-ec-text hover:bg-ec-surface/40'
                        }`}
                    >
                      <item.icon size={18} />
                      {item.text}
                    </div>
                  ))}

                  <div className="mt-auto pt-4 border-t border-ec-border/20">
                    <div className="glass rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ec-accent/30 to-indigo-400/30 flex items-center justify-center text-sm font-bold text-ec-accent">H</div>
                        <div>
                          <div className="text-sm font-semibold text-ec-highlight">Hrittik</div>
                          <div className="text-[11px] text-ec-text-sub">Admin</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Main Area */}
                <div className="flex-1 p-8 overflow-hidden relative">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-ec-highlight mb-1">Alumni Network</h2>
                      <p className="text-sm text-ec-text-sub">Connect with 1,204 alumni from your college</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="glass w-10 h-10 rounded-xl flex items-center justify-center text-ec-text-sub cursor-pointer hover:text-ec-text transition-colors">
                        <Search size={18} />
                      </div>
                      <div className="glass w-10 h-10 rounded-xl flex items-center justify-center text-ec-text-sub cursor-pointer hover:text-ec-text transition-colors relative">
                        <Bell size={18} />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-ec-root" />
                      </div>
                    </div>
                  </div>

                  {/* Alumni Cards — Glass */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[
                      { name: 'Sarah Jenkins', role: 'Senior SWE @ Google', year: '2018', gradient: 'from-blue-500 to-cyan-400' },
                      { name: 'Rahul Mehta', role: 'Product Manager @ Meta', year: '2019', gradient: 'from-purple-500 to-pink-400' },
                      { name: 'Emily Chen', role: 'Founder @ Stealth', year: '2021', gradient: 'from-orange-500 to-amber-400' },
                    ].map((person, i) => (
                      <div key={i} className="glass-card group cursor-pointer p-5" style={{ borderRadius: '20px' }}>
                        <div className="relative z-10">
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${person.gradient} flex items-center justify-center font-bold text-white text-lg shadow-lg`}>
                              {person.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-ec-highlight">{person.name}</h3>
                              <p className="text-xs text-ec-text-sub">Class of {person.year}</p>
                            </div>
                          </div>
                          <div className="mb-4">
                            <span className="glass-badge text-xs">{person.role}</span>
                          </div>
                          <button className="w-full py-2.5 rounded-xl glass text-sm font-semibold text-ec-accent group-hover:bg-ec-accent/10 transition-colors">
                            Connect
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom fade */}
                  <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-ec-root/80 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
         * FEATURES SECTION — Glass Cards
         * ═══════════════════════════════════════════ */}
        <section id="features" className="relative z-10 py-32 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="glass-badge mx-auto mb-6 animate-fade-in-up">
              <Zap size={14} className="text-ec-accent" />
              <span>Why Connect-Karo</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-ec-highlight mb-4">
              Built for Every Stakeholder
            </h2>
            <p className="text-ec-text-sub text-lg max-w-xl mx-auto">
              A unified ecosystem that empowers students, alumni, and institutions to grow together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: GraduationCap,
                title: 'For Students',
                desc: 'Connect with industry professionals, seek mentorship, and unlock referral opportunities from your seniors.',
                gradient: 'from-blue-500 to-cyan-400',
              },
              {
                icon: Users,
                title: 'For Alumni',
                desc: 'Give back to your alma mater, share your journey, and hire top talent directly from your college.',
                gradient: 'from-purple-500 to-pink-400',
              },
              {
                icon: Shield,
                title: 'For Colleges',
                desc: 'Manage your entire network efficiently. Approve users, monitor connections, and grow institutional value.',
                gradient: 'from-orange-500 to-amber-400',
              },
            ].map((feature, i) => (
              <div key={i} className="glass-card group p-8" style={{ borderRadius: '24px' }}>
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-ec-highlight mb-3">{feature.title}</h3>
                  <p className="text-ec-text-sub leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
         * STATS — Glass Bar
         * ═══════════════════════════════════════════ */}
        <section className="relative z-10 pb-32 max-w-5xl mx-auto">
          <div className="glass-card p-10 md:p-14" style={{ borderRadius: '28px' }}>
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '50+', label: 'Colleges Onboarded' },
                { value: '12K+', label: 'Active Alumni' },
                { value: '8K+', label: 'Students Connected' },
                { value: '95%', label: 'Satisfaction Rate' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-ec-accent to-indigo-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-ec-text-sub font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
         * CTA — Glass Panel
         * ═══════════════════════════════════════════ */}
        <section className="relative z-10 pb-32 max-w-4xl mx-auto text-center">
          <div className="glass-prism p-12 md:p-16" style={{ borderRadius: '32px' }}>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-ec-highlight mb-4">
                Ready to Transform Your Network?
              </h2>
              <p className="text-ec-text-sub text-lg mb-8 max-w-xl mx-auto">
                Join hundreds of institutions already building stronger alumni–student connections.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="glass-btn-primary text-lg px-10 py-4"
                >
                  Start for Free
                  <ArrowRight size={20} />
                </button>
                <button className="glass-btn text-lg px-10 py-4">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ═══════════════════════════════════════════
       * FOOTER — Glass
       * ═══════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-ec-border/30">
        <div className="glass-nav py-8 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-ec-accent to-indigo-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-sm font-semibold text-ec-highlight">Connect<span className="text-ec-accent">Karo</span></span>
            </div>
            <p className="text-sm text-ec-text-sub">© 2026 Connect-Karo. Built for professional networking.</p>
            <div className="flex gap-6 text-sm text-ec-text-sub">
              <a href="#" className="hover:text-ec-text transition-colors">Privacy</a>
              <a href="#" className="hover:text-ec-text transition-colors">Terms</a>
              <a href="#" className="hover:text-ec-text transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}