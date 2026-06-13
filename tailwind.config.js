/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: [
          '"Source Serif 4"',
          '"Iowan Old Style"',
          "Georgia",
          "ui-serif",
          "serif",
        ],
        sans: [
          '"iA Writer Quattro"',
          '"Söhne"',
          '"Helvetica Neue"',
          "Arial",
          "ui-sans-serif",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          '"SF Mono"',
          "Menlo",
          "Consolas",
          "ui-monospace",
          "monospace",
        ],
      },
      colors: {
        paper: "#FAFAF8",
        "paper-edge": "#F2F2EE",
        ink: "#1B1F26",
        "ink-soft": "#4D525B",
        "ink-muted": "#888C94",
        rule: "#D5D6D9",
        "rule-faint": "#E5E6E8",
        accent: "#3F5A82",
        "accent-soft": "rgba(63, 90, 130, 0.12)",
      },
      fontSize: {
        display: [
          "clamp(2.5rem, 4.2vw + 1rem, 3.75rem)",
          { lineHeight: "1.05", letterSpacing: "-0.022em" },
        ],
        h1: ["2rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "h1-sm": ["1.75rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        h2: ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        h3: ["1.125rem", { lineHeight: "1.35", letterSpacing: "-0.005em" }],
        body: ["1rem", { lineHeight: "1.65" }],
        small: ["0.875rem", { lineHeight: "1.55" }],
        mono: ["0.875rem", { lineHeight: "1.55" }],
        code: ["0.8125rem", { lineHeight: "1.6" }],
      },
      maxWidth: {
        measure: "72ch",
      },
      transitionTimingFunction: {
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      zIndex: {
        nav: "10",
        dropdown: "20",
        "modal-backdrop": "40",
        modal: "50",
        toast: "60",
      },
    },
  },
  plugins: [],
};
