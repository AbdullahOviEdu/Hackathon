/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'ninja-black': '#0A0A0A',
        'ninja-white': '#FFFFFF',
        'ninja-green': '#4ADE80',
        'ninja-purple': '#7C3AED',
        'ninja-orange': '#FF6B4A',
        'ninja-gray': '#1F1F1F'
      },
      fontFamily: {
        'monument': ['Monument Extended', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 1s ease-out forwards',
        'slide-down': 'slideDown 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
        'tooltip-fade': 'tooltipFade 0.2s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        tooltipFade: {
          '0%': { opacity: '0', transform: 'translate(-50%, 10px)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' },
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(74, 222, 128, 0.2)',
      }
    },
  },
  plugins: [],
}

