/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      colors: {
        "dark-bg": "#0A0E1A",
        "dark-secondary": "#111827",
        "dark-card": "#1A2035",
        "dark-border": "#2A3350",
        "dark-text": "#E8EDF5",
        "dark-text-secondary": "#8B9DC3",
        "light-bg": "#F5F0E8",
        "light-secondary": "#EDE8DC",
        "light-card": "#FFFFFF",
        "light-border": "#D4CEC4",
        "light-text": "#1A1A2E",
        "light-text-secondary": "#5A6480",
        "accent-cyan": "#00D4FF",
        "accent-amber": "#FFB347",
        "accent-red": "#FF6B6B",
        "accent-green": "#4ADE80",
        "accent-purple": "#A855F7",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "draw-in": "drawIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
      keyframes: {
        glow: {
          "0%, 100%": { textShadow: "0 0 5px rgba(0, 212, 255, 0.5)" },
          "50%": { textShadow: "0 0 20px rgba(0, 212, 255, 0.8)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        drawIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(0, 212, 255, 0.5)",
        "glow-amber": "0 0 20px rgba(255, 179, 71, 0.5)",
        "glow-red": "0 0 20px rgba(255, 107, 107, 0.5)",
      },
      backgroundImage: {
        scanlines: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.03) 2px,
          rgba(0, 0, 0, 0.03) 4px
        )`,
      },
    },
  },
  plugins: [],
};
