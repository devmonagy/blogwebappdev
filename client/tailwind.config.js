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
      fontSize: {
        xxs: "0.65rem",
      },
      container: {
        center: true,
        padding: "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
