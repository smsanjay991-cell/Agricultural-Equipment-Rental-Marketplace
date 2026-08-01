/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          dark: '#0d2818',
          forest: '#16423C',
          emerald: '#047857',
          leaf: '#10B981',
          lime: '#84cc16',
          amber: '#F59E0B',
          earth: '#78350F',
          sand: '#FDFBF7',
          light: '#F3F4F6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
