import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        obsidian: {
          950: "#02040a",
          900: "#060a17",
          850: "#0b1126",
          800: "#111936",
          700: "#1a244d",
          600: "#26356e",
        },
        cyber: {
          cyan: "#00e5ff",
          "cyan-dim": "#06b6d4",
          blue: "#3b82f6",
          emerald: "#10b981",
          rose: "#f43f5e",
        },
        luxury: {
          gold: "#f59e0b",
          amber: "#d97706",
          bronze: "#92400e",
          "gold-light": "#fde68a",
        },
      },
      boxShadow: {
        "glass-sm": "0 4px 16px 0 rgba(0, 0, 0, 0.4)",
        "glass-md": "0 8px 32px 0 rgba(0, 0, 0, 0.55)",
        "glass-lg": "0 16px 48px 0 rgba(0, 0, 0, 0.7)",
        "glow-cyan": "0 0 25px -5px rgba(0, 229, 255, 0.35)",
        "glow-gold": "0 0 25px -5px rgba(245, 158, 11, 0.3)",
      },
      animation: {
        "subtle-pulse": "subtlePulse 4s ease-in-out infinite",
        "breathing-loop": "breathingLoop 6s ease-in-out infinite",
        "glow-sweep": "glowSweep 3s ease-in-out infinite alternate",
      },
      keyframes: {
        subtlePulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        breathingLoop: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.015)" },
        },
        glowSweep: {
          "0%": { filter: "drop-shadow(0 0 8px rgba(0, 229, 255, 0.2))" },
          "100%": { filter: "drop-shadow(0 0 16px rgba(0, 229, 255, 0.5))" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
