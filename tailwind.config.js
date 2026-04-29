/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },

      /* ──────────────────────────────────────────────
       * Blue Eclipse — CSS-variable-driven palette
       * All `ec-*` tokens auto-switch via :root / .dark
       * ────────────────────────────────────────────── */
      colors: {
        ec: {
          root:         'rgb(var(--ec-root)         / <alpha-value>)',
          surface:      'rgb(var(--ec-surface)      / <alpha-value>)',
          muted:        'rgb(var(--ec-muted)        / <alpha-value>)',
          text:         'rgb(var(--ec-text)         / <alpha-value>)',
          'text-sub':   'rgb(var(--ec-text-sub)     / <alpha-value>)',
          accent:       'rgb(var(--ec-accent)       / <alpha-value>)',
          'accent-hover': 'rgb(var(--ec-accent-hover) / <alpha-value>)',
          border:       'rgb(var(--ec-border)       / <alpha-value>)',
          highlight:    'rgb(var(--ec-highlight)    / <alpha-value>)',
        },
      },

      /* ──────────────────────────────────────────────
       * Animations
       * ────────────────────────────────────────────── */
      animation: {
        'float-orb':          'floatOrb 8s ease-in-out infinite alternate',
        'float-orb-delayed':  'floatOrb 8s ease-in-out 4s infinite alternate',
        'card-slide-up':      'cardSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'logo-pulse':         'logoPulse 3s ease-in-out infinite',
        'spin-fast':          'spin 0.6s linear infinite',
        'shake':              'shakeError 0.4s ease',
        'fade-in-down':       'fadeInDown 0.8s ease',
        'fade-in-up':         'fadeInUp 0.8s ease both',
        'fade-in-up-d1':      'fadeInUp 0.8s ease 0.1s both',
        'fade-in-up-d2':      'fadeInUp 0.8s ease 0.2s both',
        'fade-in-up-d3':      'fadeInUp 0.8s ease 0.3s both',
      },
      keyframes: {
        floatOrb: {
          '0%':   { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(30px, -30px) scale(1.1)' },
        },
        cardSlideUp: {
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        logoPulse: {
          '0%, 100%': { boxShadow: '0 8px 24px rgb(var(--ec-accent) / 0.35)' },
          '50%':      { boxShadow: '0 8px 32px rgb(var(--ec-accent) / 0.55)' },
        },
        shakeError: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-8px)' },
          '40%':      { transform: 'translateX(8px)' },
          '60%':      { transform: 'translateX(-4px)' },
          '80%':      { transform: 'translateX(4px)' },
        },
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-15px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
