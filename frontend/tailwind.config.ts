import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f8f5',
          100: '#e1efe8',
          200: '#c4dfd3',
          300: '#9bc6b5',
          400: '#6ea893',
          500: '#4c8c76',
          600: '#38705e',
          700: '#2e5b44',
          800: '#264e3b',
          900: '#1a3c2c',
          950: '#0b2419',
        },
        cream: {
          50: '#fdfcf9',
          100: '#fbf9f2',
          200: '#f5f0e3',
          300: '#ece3ce',
          400: '#dfd1b3',
          500: '#cebc95',
        },
        terracotta: {
          500: '#d97736',
          600: '#c46022',
        },
        olive: {
          500: '#8c9c3e',
          600: '#758430',
        },
        brand: {
          50: '#f2f8f5',
          100: '#e1efe8',
          200: '#c4dfd3',
          300: '#9bc6b5',
          400: '#6ea893',
          500: '#2e5b44',
          600: '#264e3b',
          700: '#1a3c2c',
          800: '#122c20',
          900: '#0b2419',
          950: '#05140d',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
