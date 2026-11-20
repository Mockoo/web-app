/** @type {import('tailwindcss').Config} */
module.exports = {
  // lib/ and content/ are scanned because badge/tone classes live there.
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
    './content/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-vazir)', 'Tahoma', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Deep indigo ink – text and dark surfaces
        ink: {
          950: '#100D3A',
          900: '#17124A',
          700: '#3B3768',
          500: '#6C6990',
          300: '#B7B5CF',
        },
        // Violet – primary brand
        brand: {
          50: '#F2F1FF',
          100: '#E7E5FF',
          200: '#D0CCFF',
          300: '#B0A8FF',
          400: '#8B80FA',
          500: '#6B5CF6',
          600: '#5642E8',
          700: '#4533C7',
          800: '#382BA0',
          900: '#251D6B',
        },
        // Mint – success / progress
        accent: {
          50: '#ECFDF8',
          100: '#D2F9EE',
          200: '#A6F0DC',
          400: '#34D9B3',
          500: '#17BFA0',
          600: '#0E9C84',
          700: '#0F7C6B',
        },
        // Sun – scores and highlights
        sun: {
          100: '#FFF1D6',
          400: '#FFB547',
          500: '#F59E0B',
        },
        paper: '#F8F8FD',
      },
      boxShadow: {
        soft: '0 14px 40px -14px rgba(86, 66, 232, 0.35)',
        card: '0 1px 2px rgba(23, 18, 74, 0.04), 0 10px 28px -12px rgba(23, 18, 74, 0.14)',
      },
    },
  },
  plugins: [],
};
