export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0fce4',
          100: '#d4f7a8',
          200: '#a8e063',
          400: '#61c411',
          600: '#3b6d11',
          800: '#27500a',
        },
        dark: {
          900: '#0f1117',
          800: '#161b24',
          700: '#1e2535',
          600: '#252d3d',
          500: '#2e3748',
        }
      }
    },
  },
  plugins: [],
}
