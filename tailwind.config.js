/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rain-dark': '#1a1a2e',
        'rain-light': '#16213e',
      },
    },
  },
  plugins: [],
}

