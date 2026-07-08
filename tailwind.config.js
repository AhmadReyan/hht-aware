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
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        custom: 'var(--radius)',
        'custom-sm': 'var(--radius-sm)',
        'custom-pill': 'var(--radius-pill)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        poster: 'var(--shadow-poster)',
      }
    },
  },
  plugins: [],
}
