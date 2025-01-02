module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#fff",
        header: "#f9f9f9",
        footer: "#f9f9f9",
        primaryText: "#000",
        secondaryText: "#818589",
        buttonBackground: "#1E88E5",
        href: "#6F8FAF",
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      container: {
        center: true,
        padding: "2rem", // This sets 1rem padding to the left and right of the container.
      },
    },
  },
  plugins: [],
};
