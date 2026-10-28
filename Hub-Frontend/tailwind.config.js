/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandRed: '#880043',
        brandBlue: '#66B5CB',
      }
    },
  },
  plugins: [],
}