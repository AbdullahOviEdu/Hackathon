/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ninja-black': '#0A0A0A',
        'ninja-white': '#FFFFFF',
        'ninja-green': '#4ADE80',
        'ninja-purple': '#A855F7',
        'ninja-orange': '#FB923C',
        'ninja-gray': '#1F1F1F'
      },
      fontFamily: {
        'monument': ['Monument Extended', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'scroll': 'scroll 20s linear infinite',
        'gradient': 'gradient 6s ease infinite',
        'bounce': 'bounce 2s ease-in-out infinite',
        'slide-up': 'slideUp 1s ease-out forwards',
        'slide-down': 'slideDown 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
        'tooltip-fade': 'tooltipFade 0.2s ease-out forwards',
        'float-slow': 'float-slow 4s ease-in-out infinite',
        'float-delayed': 'float-delayed 3.5s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(12deg)' },
          '50%': { transform: 'translateY(-15px) rotate(12deg)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0) rotate(-12deg)' },
          '50%': { transform: 'translateY(-12px) rotate(-12deg)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        gradient: {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.3' }
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
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

