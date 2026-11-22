/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Nordic theme palette
        "nordic-primary": "#9932CC", // Main purple
        "nordic-primary-light": "#A64DFF", // Light purple
        "nordic-primary-dark": "#800080", // Dark purple
        "nordic-secondary": "#AD5AD7", // Secondary purple
        "nordic-secondary-light": "#C792EA", // Light secondary
        "nordic-secondary-dark": "#9932CC", // Dark secondary
        "nordic-bg": "#f5f6fa", // Soft gray background
        "nordic-paper": "#fff", // Paper white
        "nordic-text": "#222", // Primary text
        "nordic-text-secondary": "#5E81AC", // Secondary text
        "nordic-info": "#ECEFF4", // Extra neutral
        "nordic-night": "#1a1a2e", // Dark night background
        "nordic-muted": "#94a3b8", // Muted text
        // Keep legacy names for backward compatibility during transition
        "nordic-dark": "#222",
        "nordic-blue": "#5E81AC",
        "nordic-accent": "#9932CC",
        "nordic-light": "#ECEFF4",
        "nordic-gray": "#5E81AC",
      },
      fontFamily: {
        sans: ["Inter", "Helvetica Neue", "Arial", "sans-serif"],
      },
      borderRadius: {
        nordic: "8px",
      },
    },
  },
  plugins: [],
};
