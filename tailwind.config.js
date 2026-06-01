/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        noto: ['Noto Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#EAF3DE',
          100: '#C0DD97',
          200: '#97C459',
          600: '#3B6D11',
          800: '#27500A',
        }
      }
    },
  },
  plugins: [],
}
