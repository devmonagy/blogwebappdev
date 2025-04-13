module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        header: "#f3f4f6",
        footer: "#f3f4f6",
        primaryText: "#111827",
        secondaryText: "#6B7280",
        href: "#1f2937",
        primaryButton: "#1f2937",
        buttonHover: "#374151",
        primaryButtonText: "#ffffff",
        secondaryButton: "#1f2937",
        secondaryHover: "#f3f4f6",
        secondaryButtonText: "#1f2937",
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
