/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#0E0D0B",
        surface: "#16140F",
        "surface-2": "#1C1A14",
        "surface-3": "#23201A",
        rule: "#2A2620",
        "rule-strong": "#3A352C",
        ink: "#F2EFE6",
        "ink-2": "#B8B2A1",
        "ink-3": "#6E685A",
        "ink-4": "#3F3B33",
        accent: "#D8FF3D",
        "accent-dim": "#A8C82E",
        alarm: "#FF6452",
        "alarm-dim": "#C84032",
        gold: "#C9A961",
      },
      fontFamily: {
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        sans: ['"Geist"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.025em",
        wide: "0.04em",
        wider: "0.08em",
        widest: "0.18em",
      },
      fontSize: {
        "display-1": ["clamp(2.75rem, 7vw, 5.5rem)", { lineHeight: "0.92", letterSpacing: "-0.04em" }],
        "display-2": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.18em" }],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out both",
        "rise-in": "riseIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "tick": "tick 1.1s steps(8) infinite",
        "pulse-dot": "pulseDot 1.8s ease-in-out infinite",
        "marquee": "marquee 28s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        tick: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-1px)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.85)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
