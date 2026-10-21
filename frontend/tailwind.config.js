/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        finance: {
          dark: '#080E1E',
          card: '#0F1A30',
          border: '#1E2D4A',
          hover: '#192846',
          teal: '#00F0FF',
          accent: '#06D6A0',
          amber: '#FFD166',
          coral: '#EF476F',
          muted: '#8A99AD'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
