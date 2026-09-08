import type { Config } from "tailwindcss";

/**
 * Two themes, one vocabulary. Components use bg-bg / text-fg / text-muted / border-fg so they never
 * know whether they sit on paper or on ink; the section decides with data-theme="ink|paper".
 */
export default {
  darkMode: ["class"],
  future: { hoverOnlyWhenSupported: true },
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "2rem" },
    extend: {
      fontFamily: {
        sans: ['"Inter Tight"', "Inter", '"Helvetica Neue"', "Arial", "sans-serif"],
        mono: ['"Geist Mono"', '"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        fg2: "rgb(var(--fg2) / <alpha-value>)",
        grey: "rgb(var(--grey) / <alpha-value>)",
        ink: "#0B0B0B",
        paper: "#F2F2F0",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
      },
      fontSize: {
        display: ["clamp(3.25rem, 9vw, 11rem)", { lineHeight: "0.92", letterSpacing: "-0.035em", fontWeight: "450" }],
        h2: ["clamp(2rem, 4.2vw, 4.5rem)", { lineHeight: "1", letterSpacing: "-0.025em", fontWeight: "450" }],
        h3: ["clamp(1.5rem, 2.6vw, 2.75rem)", { lineHeight: "1.08", letterSpacing: "-0.02em", fontWeight: "450" }],
        h4: ["clamp(1.125rem, 1.4vw, 1.375rem)", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "500" }],
        statement: ["clamp(1.625rem, 2.8vw, 3rem)", { lineHeight: "1.12", letterSpacing: "-0.015em", fontWeight: "400" }],
        body: ["1.0625rem", { lineHeight: "1.5", letterSpacing: "0.005em" }],
        meta: ["0.75rem", { lineHeight: "1.3", letterSpacing: "0.1em" }],
        ui: ["0.9375rem", { lineHeight: "1", fontWeight: "500" }],
        wordmark: ["20vw", { lineHeight: "0.8", letterSpacing: "-0.05em", fontWeight: "500" }],
        "wordmark-sm": ["24vw", { lineHeight: "0.8", letterSpacing: "-0.05em", fontWeight: "500" }],
      },
      spacing: {
        section: "clamp(5rem, 11vw, 11rem)",
        gutter: "clamp(1rem, 2.5vw, 2.5rem)",
        nav: "5rem",
        "nav-sm": "3.5rem",
      },
      maxWidth: { site: "1680px", prose: "40em", statement: "26ch" },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      transitionDuration: { 250: "250ms", 400: "400ms", 600: "600ms", 800: "800ms" },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
