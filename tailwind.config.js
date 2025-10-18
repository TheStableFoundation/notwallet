/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary: {
        main: "#9932CC", // Main purple
        light: "#A64DFF",
        dark: "#800080",
        contrastText: "#fff",
      },
      secondary: {
        main: "#AD5AD7", // Updated secondary color
        light: "#C792EA",
        dark: "#9932CC",
        contrastText: "#fff",
      },
      background: {
        default: "#f5f6fa", // Soft gray
        paper: "#fff",
      },
      text: {
        primary: "#222",
        secondary: "#5E81AC",
      },
      info: {
        main: "#ECEFF4", // Extra neutral
      },
    },
    extend: {},
  },
  plugins: [],
};
