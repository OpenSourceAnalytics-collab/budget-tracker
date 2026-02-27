/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
          muted: 'var(--surface-muted)',
        },
        border: 'var(--border)',
        content: {
          DEFAULT: 'var(--content)',
          muted: 'var(--content-muted)',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 var(--shadow), 0 1px 2px -1px var(--shadow)',
        'card-hover': '0 4px 6px -1px var(--shadow), 0 2px 4px -2px var(--shadow)',
      },
    },
  },
  plugins: [],
}
