import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, GraduationCap, LayoutDashboard, Search, ArrowRight, Sparkles, Shield, Zap, ChevronRight, ChevronDown, Globe, Code, BookOpen } from 'lucide-react';
import useSystemTheme from '../../hooks/useSystemTheme';
import heroBg from '../../assets/hero-bg.png';

export default function Home() {
  const navigate = useNavigate();
  const theme = useSystemTheme();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track scroll for dynamic island navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignUp = (e) => {
    e.preventDefault();
    // Navigate to login with email pre-filled
    navigate('/login', { state: { email, mode: 'signup' } });
  };

  const navItems = [
    { label: 'Platform', hasDropdown: true },
    { label: 'Solutions', hasDropdown: true },
    { label: 'Resources', hasDropdown: true },
    { label: 'Open Source', hasDropdown: true },
    { label: 'Pricing', hasDropdown: false, href: '#pricing' },
  ];

  return (
    <div className="min-h-screen bg-ec-root text-ec-text overflow-hidden selection:bg-ec-accent/20">

      {/* ═══════════════════════════════════════════
       * NAVIGATION — Dynamic Island
       * ═══════════════════════════════════════════ */}
      <div
        className="nav-island-wrapper fixed top-0 left-0 right-0 z-50"
        style={{
          '--island-pad-x': scrolled ? '16px' : '0px',
          '--island-pad-top': scrolled ? '10px' : '0px',
          padding: 'var(--island-pad-top) var(--island-pad-x) 0',
        }}
      >
        <nav
          className="nav-island"
          data-scrolled={scrolled}
        >
          <div className="nav-island-inner">
            
            {/* ── Left: Logo + Links ── */}
            <div className="flex items-center gap-4 min-w-0">
              {/* Logo — always visible, scales down */}
              <div className="nav-island-logo">
                <span>C</span>
              </div>

              {/* Brand name — appears in island mode */}
              <span className={`nav-island-brand ${scrolled ? 'nav-island-brand--show' : ''}`}>
                Connect<span className="text-ec-accent">Karo</span>
              </span>

              {/* Nav Links — collapse out in island mode */}
              <div className={`nav-island-links ${scrolled ? 'nav-island-links--hide' : ''}`}>
                {navItems.map((item, i) => (
                  <a
                    key={item.label}
                    href={item.href || '#'}
                    className="nav-island-link"
                    style={{ transitionDelay: scrolled ? '0ms' : `${i * 30}ms` }}
                  >
                    {item.label}
                    {item.hasDropdown && <ChevronDown size={13} className="opacity-50" />}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Right: Search + Auth ── */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Search — morphs into compact pill */}
              <div className={`nav-island-search ${scrolled ? 'nav-island-search--compact' : ''} ${searchFocused && !scrolled ? 'nav-island-search--focused' : ''}`}>
                <Search size={14} className="nav-island-search-icon" />
                <input
                  type="text"
                  placeholder={scrolled ? 'Search...' : 'Search or jump to...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="nav-island-search-input"
                />
                <kbd className={`nav-island-kbd ${scrolled ? 'nav-island-kbd--hide' : ''}`}>/</kbd>
              </div>

              {/* Sign in */}
              <button
                onClick={() => navigate('/login')}
                className="nav-island-signin"
              >
                Sign in
              </button>

              {/* Sign up */}
              <button
                onClick={() => navigate('/login')}
                className={`nav-island-signup ${scrolled ? 'nav-island-signup--pill' : ''}`}
              >
                Sign up
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-[52px]" />

      {/* ═══════════════════════════════════════════
       * HERO SECTION — With background image + gradient
       * ═══════════════════════════════════════════ */}
      <div className="hero-bg relative">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        
        {/* Gradient overlay on top of image */}
        <div className="absolute inset-0 bg-gradient-to-b from-ec-surface/80 via-transparent to-ec-root/90" />

        <main className="relative z-10 px-6 pt-24 pb-16 mx-auto max-w-[1200px]">
          <div className="flex flex-col items-center text-center">
            
            {/* Headline */}
            <h1 className={`max-w-4xl text-[48px] md:text-[64px] lg:text-[72px] font-[800] tracking-tight text-ec-highlight mb-5 leading-[1.05] transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              The future of <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ec-accent via-emerald-400 to-teal-400">
                networking starts here
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`max-w-2xl text-[17px] text-ec-text-sub mb-10 leading-relaxed transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Tools and platforms evolve, but connections endure. With Connect-Karo, students, alumni, and institutions come together on one platform.
            </p>

            {/* Email Signup Row — GitHub style */}
            <div className={`flex flex-col sm:flex-row items-center gap-3 w-full max-w-xl transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <form onSubmit={handleSignUp} className="flex flex-col sm:flex-row items-stretch gap-3 w-full">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-ec-root/80 border border-ec-border rounded-md text-[15px] text-ec-text placeholder:text-ec-text-sub/50 outline-none focus:border-ec-accent focus:ring-1 focus:ring-ec-accent/30 font-[inherit]"
                />
                <button
                  type="submit"
                  className="btn-primary text-[15px] px-6 py-3 whitespace-nowrap"
                >
                  Sign up for Connect-Karo
                </button>
              </form>
              <button
                onClick={() => navigate('/login')}
                className="btn-ghost text-[15px] px-6 py-3 whitespace-nowrap border-ec-text-sub/30 text-ec-text hover:border-ec-text-sub/60"
              >
                Try Portal Login
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
           * PROTOTYPE SHOWCASE — Dashboard Preview
           * ═══════════════════════════════════════════ */}
          <div className={`w-full max-w-5xl mx-auto mt-20 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
            <div className="surface-card overflow-hidden shadow-2xl shadow-black/20">

              {/* Window Chrome */}
              <div className="flex items-center px-4 h-10 border-b border-ec-border bg-ec-muted/30">
                <div className="flex gap-1.5 mr-4">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-ec-text-sub bg-ec-muted/40 rounded-md px-3 py-1">
                    <Globe size={11} className="text-ec-icon" />
                    dashboard.connect-karo.edu
                  </div>
                </div>
              </div>

              {/* App Content */}
              <div className="flex h-[400px] bg-ec-root">

                {/* Sidebar */}
                <aside className="hidden md:flex flex-col w-52 p-3 border-r border-ec-border bg-ec-surface">
                  <div className="text-[10px] font-semibold text-ec-text-sub uppercase tracking-[0.12em] px-2.5 mb-2.5">Menu</div>
                  {[
                    { icon: LayoutDashboard, text: 'Dashboard', active: false },
                    { icon: Users, text: 'Network', active: true },
                    { icon: Briefcase, text: 'Jobs', active: false },
                    { icon: GraduationCap, text: 'Mentorship', active: false },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium cursor-pointer transition-all duration-150 mb-0.5
                        ${item.active
                          ? 'bg-ec-accent/10 text-ec-accent border border-ec-accent/20'
                          : 'text-ec-text-sub hover:text-ec-text hover:bg-ec-muted/50'
                        }`}
                    >
                      <item.icon size={15} className={item.active ? 'text-ec-accent' : 'text-ec-icon'} />
                      {item.text}
                    </div>
                  ))}

                  <div className="mt-auto pt-3 border-t border-ec-border">
                    <div className="flex items-center gap-2 px-2">
                      <div className="w-7 h-7 rounded-md bg-ec-accent/15 flex items-center justify-center text-xs font-bold text-ec-accent">H</div>
                      <div>
                        <div className="text-[12px] font-semibold text-ec-highlight">Hrittik</div>
                        <div className="text-[10px] text-ec-text-sub">Admin</div>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Main Area */}
                <div className="flex-1 p-5 overflow-hidden relative">
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <h2 className="text-lg font-bold text-ec-highlight mb-0.5">Alumni Network</h2>
                      <p className="text-[13px] text-ec-text-sub">Connect with 1,204 alumni from your college</p>
                    </div>
                  </div>

                  {/* Alumni Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { name: 'Sarah Jenkins', role: 'Senior SWE @ Google', year: '2018', color: 'bg-emerald-500' },
                      { name: 'Rahul Mehta', role: 'PM @ Meta', year: '2019', color: 'bg-teal-500' },
                      { name: 'Emily Chen', role: 'Founder @ Stealth', year: '2021', color: 'bg-green-600' },
                    ].map((person, i) => (
                      <div key={i} className="surface-card group cursor-pointer p-3.5 hover:transform-none">
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <div className={`w-9 h-9 rounded-md ${person.color} flex items-center justify-center font-bold text-white text-sm`}>
                            {person.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-ec-highlight text-[13px]">{person.name}</h3>
                            <p className="text-[11px] text-ec-text-sub">Class of {person.year}</p>
                          </div>
                        </div>
                        <div className="mb-2.5">
                          <span className="badge text-[11px] py-0.5 px-2">{person.role}</span>
                        </div>
                        <button className="w-full py-1.5 rounded-md bg-ec-accent/10 border border-ec-accent/20 text-[12px] font-semibold text-ec-accent hover:bg-ec-accent/20 transition-colors">
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Bottom fade */}
                  <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-ec-root to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ═══════════════════════════════════════════
       * FEATURES SECTION
       * ═══════════════════════════════════════════ */}
      <section id="features" className="relative z-10 py-24 px-6 bg-ec-root">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="badge mx-auto mb-5">
              <Zap size={13} className="text-ec-accent" />
              <span>Why Connect-Karo</span>
            </div>
            <h2 className="text-[32px] md:text-[44px] font-[800] text-ec-highlight mb-3 leading-tight">
              Built for Every Stakeholder
            </h2>
            <p className="text-ec-text-sub text-[16px] max-w-xl mx-auto">
              A unified ecosystem that empowers students, alumni, and institutions to grow together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: GraduationCap,
                title: 'For Students',
                desc: 'Connect with industry professionals, seek mentorship, and unlock referral opportunities from your seniors.',
                color: 'bg-emerald-500',
              },
              {
                icon: Users,
                title: 'For Alumni',
                desc: 'Give back to your alma mater, share your journey, and hire top talent directly from your college.',
                color: 'bg-teal-500',
              },
              {
                icon: Shield,
                title: 'For Colleges',
                desc: 'Manage your entire network efficiently. Approve users, monitor connections, and grow institutional value.',
                color: 'bg-green-600',
              },
            ].map((feature, i) => (
              <div key={i} className="surface-card group p-6">
                <div className={`w-11 h-11 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200`}>
                  <feature.icon size={20} className="text-white" />
                </div>
                <h3 className="text-[17px] font-bold text-ec-highlight mb-2">{feature.title}</h3>
                <p className="text-ec-text-sub leading-relaxed text-[14px]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
       * STATS SECTION
       * ═══════════════════════════════════════════ */}
      <section className="relative z-10 pb-24 px-6 bg-ec-root">
        <div className="max-w-5xl mx-auto">
          <div className="surface-card p-8 md:p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: '50+', label: 'Colleges Onboarded' },
                { value: '12K+', label: 'Active Alumni' },
                { value: '8K+', label: 'Students Connected' },
                { value: '95%', label: 'Satisfaction Rate' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-[28px] md:text-[36px] font-[800] text-ec-accent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[13px] text-ec-text-sub font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
       * CTA SECTION
       * ═══════════════════════════════════════════ */}
      <section id="pricing" className="relative z-10 pb-24 px-6 bg-ec-root">
        <div className="max-w-4xl mx-auto text-center">
          <div className="surface-card p-10 md:p-14 border-ec-accent/20">
            <h2 className="text-[28px] md:text-[38px] font-[800] text-ec-highlight mb-3 leading-tight">
              Ready to Transform Your Network?
            </h2>
            <p className="text-ec-text-sub text-[16px] mb-8 max-w-xl mx-auto">
              Join hundreds of institutions already building stronger alumni–student connections.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="btn-primary text-[15px] px-7 py-3"
              >
                Start for Free
                <ArrowRight size={17} />
              </button>
              <button className="btn text-[15px] px-7 py-3">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
       * FOOTER
       * ═══════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-ec-border bg-ec-surface">
        <div className="py-6 px-6">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-ec-accent flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">C</span>
              </div>
              <span className="text-[13px] font-semibold text-ec-highlight">Connect<span className="text-ec-accent">Karo</span></span>
            </div>
            <p className="text-[13px] text-ec-text-sub">© 2026 Connect-Karo. Built for professional networking.</p>
            <div className="flex gap-5 text-[13px] text-ec-text-sub">
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