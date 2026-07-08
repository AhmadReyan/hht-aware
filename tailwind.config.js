import konstaConfig from 'konsta/config';

/** @type {import('tailwindcss').Config} */
export default konstaConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Force dark mode (the app is always dark). `dark` class is set on <html>.
  darkMode: 'class',
  konsta: {
    colors: {
      // Konsta uses these to generate its component color variants.
      primary: '#E74C3C',   // brand red-mid
    },
  },
  theme: {
    extend: {
      colors: {
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
          glass: 'var(--glass)',        // NEW — glassmorphic surface fill
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
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
        // NEW — "Living Vessel" gradients & aurora fields
        'aurora': 'var(--gradient-aurora)',
        'ember': 'var(--gradient-ember)',
        'teal-flow': 'var(--gradient-teal)',
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
