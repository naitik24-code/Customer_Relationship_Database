/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crm: {
          darkBg: '#0f172a',      // slate-900
          cardBg: 'rgba(30, 41, 59, 0.7)', // slate-800 with transparency
          border: 'rgba(255, 255, 255, 0.08)',
          primary: '#3b82f6',     // blue-500
          accent: '#10b981',      // emerald-500
          warning: '#f59e0b',     // amber-500
          danger: '#ef4444'       // red-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        glass: '16px',
      }
    },
  },
  plugins: [],
}
