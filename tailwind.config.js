/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './constants/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0E0E11',
        surface: '#18181D',
        card: '#1E1E24',
        border: '#2A2A30',
        accent: '#00D4FF',
        'accent-orange': '#FF9F1C',
      },
    },
  },
  plugins: [],
};
