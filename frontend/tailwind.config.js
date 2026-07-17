/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf9e7',
          100: '#faf0c3',
          200: '#f5e090',
          300: '#efcc56',
          400: '#e8b62a',
          500: '#d4a017',
          600: '#b87d10',
          700: '#8f5c0e',
          800: '#6b4110',
          900: '#5a3610',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
      },
    },
  },
  plugins: [],
}
