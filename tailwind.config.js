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
        // Dark theme colors
        dark: {
          bg: {
            primary: '#0A0E27',
            secondary: '#131829',
            tertiary: '#1A1F3A',
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#A0AEC0',
            muted: '#718096',
          },
          border: '#2D3748',
        },
        // Light theme colors
        light: {
          bg: {
            primary: '#F7FAFC',
            secondary: '#FFFFFF',
            tertiary: '#EDF2F7',
          },
          text: {
            primary: '#1A202C',
            secondary: '#4A5568',
            muted: '#718096',
          },
          border: '#E2E8F0',
        },
        // Accent colors (same for both themes)
        accent: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          green: '#10B981',
          red: '#EF4444',
          yellow: '#F59E0B',
          pink: '#EC4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'custom-light': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'custom-dark': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #06B6D4 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0A0E27 0%, #131829 100%)',
        'gradient-light': 'linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)',
      },
    },
  },
  plugins: [],
}
