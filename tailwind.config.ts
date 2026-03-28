import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}","./components/**/*.{ts,tsx}","./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      colors: {
        brand: {
          bg: {
            primary: "#0B1120",
            secondary: "#111827",
          },
          accent: {
            DEFAULT: "#3B82F6",
            hover: "#2563EB",
          },
          text: {
            primary: "#E5E7EB",
            secondary: "#9CA3AF",
          }
        }
      },
      keyframes: {
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "flicker": {
          "0%,100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.4" },
          "94%": { opacity: "1" },
          "96%": { opacity: "0.6" },
          "97%": { opacity: "1" },
        },
        "glow-pulse": {
          "0%,100%": { boxShadow: "0 0 5px currentColor, 0 0 20px currentColor" },
          "50%": { boxShadow: "0 0 20px currentColor, 0 0 60px currentColor, 0 0 100px currentColor" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-left": {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "counter": {
          from: { opacity: "0", transform: "scale(0.8) translateY(8px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "border-spin": {
          "100%": { transform: "rotate(360deg)" },
        },
        "matrix-rain": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translateY(100px)" },
        },
      },
      animation: {
        "scan-line": "scan-line 4s linear infinite",
        "flicker": "flicker 5s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-left": "slide-left 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "counter": "counter 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        "border-spin": "border-spin 4s linear infinite",
        "matrix-rain": "matrix-rain 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
