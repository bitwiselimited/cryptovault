/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'linear-dark': {
          100: '#18181b',
          200: '#141416',
          300: '#0e0e10',
        },
        'linear-border': 'rgba(255, 255, 255, 0.08)',
        'linear-hover': 'rgba(255, 255, 255, 0.04)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'linear': '0 0 0 1px rgba(255,255,255,0.08)',
        'linear-lg': '0 8px 32px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'gradient-linear': 'linear-gradient(135deg, #0e0e10 0%, #18181b 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
    },
  },
  plugins: [],
}
