/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#7C6FE9",
        success: "#34D399",
      },
    },
  },
  plugins: [],
}

