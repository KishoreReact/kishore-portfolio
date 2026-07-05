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
        obsidian: "#050505",
        "cyber-blue": "#00F0FF",
        "neon-violet": "#8A2BE2",
        "ghost-white": "#F0F0F0",
        "deep-space": "#0A0A1A",
        "card-glass": "rgba(255,255,255,0.04)",
        "border-glass": "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-grotesk)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-gradient": "linear-gradient(135deg, #00F0FF 0%, #8A2BE2 100%)",
        "dark-gradient": "linear-gradient(180deg, #050505 0%, #0A0A1A 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(0,240,255,0.05) 0%, rgba(138,43,226,0.05) 100%)",
      },
      boxShadow: {
        "cyber-blue": "0 0 20px rgba(0,240,255,0.3), 0 0 60px rgba(0,240,255,0.1)",
        "neon-violet": "0 0 20px rgba(138,43,226,0.3), 0 0 60px rgba(138,43,226,0.1)",
        "card-glow": "0 8px 32px rgba(0,240,255,0.08), 0 0 0 1px rgba(255,255,255,0.06)",
        "card-hover": "0 16px 48px rgba(0,240,255,0.15), 0 0 0 1px rgba(0,240,255,0.2)",
        "glass": "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "spin-slow": "spin 20s linear infinite",
        "orbit": "orbit 12s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,240,255,0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(0,240,255,0.5), 0 0 80px rgba(138,43,226,0.3)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(80px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(80px) rotate(-360deg)" },
        },
      },
      screens: {
        xs: "480px",
        "3xl": "1920px",
      },
    },
  },
  plugins: [],
};

export default config;
