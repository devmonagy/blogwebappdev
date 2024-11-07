// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a2540",
        header: "#092139",
        footer: "#092139",
        primaryText: "#FFFFFF",
        secondaryText: "#B0BEC5",
        buttonBackground: "#1E88E5",
        salmon: "#e63946",
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [],
};
