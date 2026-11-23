/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Misma paleta oficial del sistema original (inspirada en el logo)
        brand: {
          blue: '#1d4ed8',
          'blue-hover': '#1e40af',
          'blue-light': '#eff6ff',
          red: '#dc2626',
          'red-hover': '#b91c1c',
          yellow: '#d97706',
          'yellow-hover': '#b45309',
        },
      },
    },
  },
  plugins: [],
};
