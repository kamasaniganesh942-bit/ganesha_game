/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        festival: {
          saffron: '#FF6F00',
          'saffron-light': '#FFA000',
          'saffron-dark': '#E65100',
          marigold: '#FFB300',
          gold: '#FFD700',
          vermillion: '#D81B60',
          crimson: '#C2185B',
          teal: '#00897B',
          'teal-light': '#26A69A',
          night: '#120A24',
          'night-light': '#1F1338',
          'night-card': '#2A1A4A',
          modak: '#FFF8E1',
          diya: '#FFE082'
        }
      },
      fontFamily: {
        festival: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Outfit', 'sans-serif'],
      },
      animation: {
        'diya-flicker': 'flicker 2s infinite ease-in-out',
        'float-slow': 'float 4s infinite ease-in-out',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'bounce-subtle': 'bounceSubtle 1.5s infinite ease-in-out',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1', filter: 'drop-shadow(0 0 8px rgba(255, 179, 0, 0.9))' },
          '50%': { transform: 'scale(1.12) rotate(2deg)', opacity: '0.9', filter: 'drop-shadow(0 0 16px rgba(255, 111, 0, 1))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255, 179, 0, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 111, 0, 0.8)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
}
