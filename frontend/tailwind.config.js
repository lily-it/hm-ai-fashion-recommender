/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./styles/**/*.css", // Correct glob pattern
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6F61",
        secondary: "#6B5B95",
        accent: "#88B04B",
      },
      spacing: {
        "128": "32rem",
        "144": "36rem",
      },
    },
  },
  plugins: [],
};