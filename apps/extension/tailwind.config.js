/** @type {import('tailwindcss').Config} */
export default {
  content: ['./entrypoints/**/*.{html,ts,tsx}', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#070709',
          900: '#0D0D10',
          800: '#16161B',
          700: '#1E1E24',
          600: '#2A2A33',
        },
        netflix: {
          red: '#E50914',
          hover: '#B80710',
        },
      },
    },
  },
  plugins: [],
};
