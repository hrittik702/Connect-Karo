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
        sans: ['Mona Sans Variable', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },

      /* ──────────────────────────────────────────────
       * Connect-Karo — CSS-variable-driven palette
       * All `ec-*` tokens auto-switch via :root / .dark
       * ────────────────────────────────────────────── */
      colors: {
        ec: {
          root:         'rgb(var(--ec-root)         / <alpha-value>)',
          surface:      'rgb(var(--ec-surface)      / <alpha-value>)',
          muted:        'rgb(var(--ec-muted)        / <alpha-value>)',
          text:         'rgb(var(--ec-text)         / <alpha-value>)',
          'text-sub':   'rgb(var(--ec-text-sub)     / <alpha-value>)',
          icon:         'rgb(var(--ec-icon)         / <alpha-value>)',
          accent:       'rgb(var(--ec-accent)       / <alpha-value>)',
          'accent-hover': 'rgb(var(--ec-accent-hover) / <alpha-value>)',
          border:       'rgb(var(--ec-border)       / <alpha-value>)',
          highlight:    'rgb(var(--ec-highlight)    / <alpha-value>)',
        },
      },

      /* ──────────────────────────────────────────────
       * Border Radius — Decent, not bubbly
       * ────────────────────────────────────────────── */
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
        '2xl': '12px',
        '3xl': '12px',
      },

      /* ──────────────────────────────────────────────
       * Animations
       * ────────────────────────────────────────────── */
      animation: {
        'card-slide-up':      'cardSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'spin-fast':          'spin 0.6s linear infinite',
        'shake':              'shakeError 0.4s ease',
        'fade-in-down':       'fadeInDown 0.6s ease',
        'fade-in-up':         'fadeInUp 0.6s ease both',
        'fade-in-up-d1':      'fadeInUp 0.6s ease 0.1s both',
        'fade-in-up-d2':      'fadeInUp 0.6s ease 0.2s both',
        'fade-in-up-d3':      'fadeInUp 0.6s ease 0.3s both',
      },
      keyframes: {
        cardSlideUp: {
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shakeError: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-6px)' },
          '40%':      { transform: 'translateX(6px)' },
          '60%':      { transform: 'translateX(-3px)' },
          '80%':      { transform: 'translateX(3px)' },
        },
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
