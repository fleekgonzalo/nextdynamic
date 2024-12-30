module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',  // Enables class-based dark mode
  theme: {
    extend: {
      colors: {
        darkGray: '#404040',
        lightBackground: '#ffffff',
        darkBackground: '#121212',
        lightText: '#000000',
        darkText: '#e5e5e5',
        primary: '#2563eb',  // Tailwind blue-600
        secondary: '#f59e0b',  // Tailwind amber-500
      },
    },
    fontFamily: {
      sans: 'barlow, sans-serif',
    },
  },
  plugins: [],
};