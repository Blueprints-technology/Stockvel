import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        brand: {
          DEFAULT: "#007AFF",
          light: "#EBF4FF",
          hover: "#0066DD",
        },
        success: {
          subtle: "#F0FDF6",
          DEFAULT: "#16C784",
          emphasis: "#0FA869",
        },
        danger: {
          subtle: "#FFF1F2",
          DEFAULT: "#E8434D",
          emphasis: "#C8303A",
        },
        warning: {
          subtle: "#FFFBEB",
          DEFAULT: "#F59E0B",
          emphasis: "#D97706",
        },
        info: {
          subtle: "#EFF6FF",
          DEFAULT: "#3B82F6",
          emphasis: "#2563EB",
        },
        // Surface / layout
        surface: "#F8F8F8",
        ink: "#0F172A",
        muted: {
          DEFAULT: "#64748B", // slate-500
          subtle: "#94A3B8", // slate-400
          faint: "#CBD5E1", // slate-300
        },
        chart: {
          1: "#007AFF",
          2: "#16C784",
          3: "#F59E0B",
          4: "#8B5CF6",
          5: "#EC4899",
          6: "#06B6D4",
          7: "#F97316",
          8: "#10B981",
        },
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.75rem",
        lg: "1rem",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        elevated: "0 10px 30px rgba(15,23,42,0.12)",
      },
      fontSize: {
        display: [
          "2.25rem",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        headline: [
          "1.5rem",
          { lineHeight: "1.3", letterSpacing: "-0.015em", fontWeight: "600" },
        ],
        title: [
          "1.125rem",
          { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        body: ["0.875rem", { lineHeight: "1.6" }],
        caption: ["0.75rem", { lineHeight: "1.5" }],
        data: ["0.875rem", { lineHeight: "1.5" }],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        ticker: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        ticker: "ticker 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
