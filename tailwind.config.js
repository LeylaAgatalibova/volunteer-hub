/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f4f4f0',
          100: '#e8e8e0',
          200: '#d0d0c0',
          300: '#b0b09a',
          400: '#888870',
          500: '#666650',
          600: '#4a4a38',
          700: '#333325',
          800: '#1e1e14',
          900: '#0f0f0a',
        },
        ember: {
          400: '#ff6b35',
          500: '#e85520',
          600: '#c43d10',
        },
        sage: {
          400: '#7eb89a',
          500: '#5a9d7c',
          600: '#3d8060',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-in': 'slideIn 0.4s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
