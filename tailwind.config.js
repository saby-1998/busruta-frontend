/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ¡Esta línea es la más importante!
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#13ec13",
        "background-dark": "#102210",
        "card-dark": "#1a2e1a",
        "text-muted": "#9db99d",
      },
    },
  },
  plugins: [],
}