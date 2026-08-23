/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: '#FAFAF8', 100: '#F3F2ED', 200: '#E7E4DA' },
        ink: { 950: '#12141B', 900: '#191C24', 800: '#22252F', 700: '#2C303C', 600: '#454A59' },
        accent: {
          50: '#FFF8EB', 100: '#FEECC7', 200: '#FDD98A', 300: '#FBC24D',
          400: '#F5A623', 500: '#E2900F', 600: '#C1780C', 700: '#93590A',
        },
        column: {
          backlog: '#8A8F9C',
          progress: '#2F6FED',
          review: '#8B5CF6',
          done: '#1F9D55',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.06), 0 1px 3px 0 rgb(0 0 0 / 0.08)',
        rail: 'inset 3px 0 0 0 var(--tw-rail-color, transparent)',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'slide-in': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        'slide-up': { from: { transform: 'translateY(8px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
      },
      animation: {
        'fade-in': 'fade-in 150ms ease-out',
        'slide-in': 'slide-in 200ms ease-out',
        'slide-up': 'slide-up 150ms ease-out',
      },
    },
  },
  plugins: [],
};
