import konstaConfig from 'konsta/config';

/** @type {import('tailwindcss').Config} */
export default konstaConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Warm editorial LIGHT theme — no `dark` class on <html>.
  darkMode: 'class',
  konsta: {
    colors: {
      // Konsta uses these to generate its component color variants.
      primary: '#8E2D3B',   // garnet
    },
  },
  theme: {
    extend: {
      colors: {
        // Warm editorial palette (reference names) — use directly, e.g. text-garnet, bg-rose.
        garnet: 'var(--garnet)',
        deep: 'var(--deep)',
        rose: 'var(--rose)',
        gold: 'var(--gold)',
        'teal-soft': 'var(--teal-soft)',
        line: 'var(--line)',
        brand: {
          red: 'var(--red)',
          'red-mid': 'var(--red-mid)',
          'red-light': 'var(--red-light)',
          'red-dark': 'var(--red-dark)',
          orange: 'var(--orange)',
          'orange-light': 'var(--orange-light)',
          teal: 'var(--teal)',
          'teal-light': 'var(--teal-light)',
        },
        app: {
          dark: 'var(--dark)',
          dark2: 'var(--dark2)',
          mid: 'var(--mid)',
          muted: 'var(--muted)',
          border: 'var(--border)',
          bg: 'var(--bg)',
          ink: 'var(--ink)',            // text-app-ink
          soft: 'var(--ink-soft)',      // text-app-soft
          surface: 'var(--surface)',    // bg-app-surface
          surface2: 'var(--surface-2)', // bg-app-surface2
          glass: 'var(--glass)',        // frosted light surface fill
        }
      },
      fontFamily: {
        // `font-serif` is the DISPLAY face across the app.
        serif: ['"Bricolage Grotesque"', '"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', '"DM Sans"', 'system-ui', 'sans-serif'],
        disp: ['"Bricolage Grotesque"', 'Georgia', 'serif'],
      },
      borderRadius: {
        custom: 'var(--radius)',
        'custom-sm': 'var(--radius-sm)',
        'custom-lg': 'var(--radius-lg)',
        'custom-xl': 'var(--radius-xl)',   // NEW — hero surfaces
        'custom-pill': 'var(--radius-pill)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        raised: 'var(--shadow-raised)',
        poster: 'var(--shadow-poster)',
        glow: 'var(--shadow-glow)',        // NEW — accent glow for active/hero elements
      },
      backgroundImage: {
        // Warm editorial gradients & aurora fields
        'aurora': 'var(--gradient-aurora)',
        'ember': 'var(--gradient-ember)',       // garnet hero
        'teal-flow': 'var(--gradient-teal)',
        'gold-flow': 'var(--gradient-gold)',
        'glass-sheen': 'var(--gradient-glass)',
      },
      backdropBlur: {
        glass: '16px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
});
