/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          25: '#F5F8FF',
        },
        green: {
          25: '#F5FFF8',
        },
        purple: {
          25: '#F9F5FF',
        },
        amber: {
          25: '#FFFBF5',
        },
        teal: {
          25: '#F5FFFD',
        },
        gray: {
          25: '#F9FAFB',
        },
        pink: {
          25: '#FFF5F9',
        },
      },
    },
  },
  plugins: [],
} 