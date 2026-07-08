/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
          ink: 'var(--ink)',            // NEW — text-app-ink
          soft: 'var(--ink-soft)',      // NEW — text-app-soft
          surface: 'var(--surface)',    // NEW — bg-app-surface
          surface2: 'var(--surface-2)', // NEW — bg-app-surface2
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
        'custom-pill': 'var(--radius-pill)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        raised: 'var(--shadow-raised)',
        poster: 'var(--shadow-poster)',
      }
    },
  },
  plugins: [],
}
