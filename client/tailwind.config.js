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
        href: "#1E3A8A",
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
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        spin: "spin 1s linear infinite",
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
