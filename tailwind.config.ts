import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Brand Colors ──────────────────────────────────────────────────────
      colors: {
        brand: {
          // Dark backgrounds — from deepest to subtlest
          bg: {
            DEFAULT: "#000000",  // Main background — pure black
            surface: "#0A0A0A",  // Cards, panels
            elevated: "#111111", // Modals, dropdowns
            subtle: "#18181B",   // Dividers, code blocks
          },

          // Barsayans Yellow — primary action color
          accent: {
            DEFAULT: "#EAB308",
            50:  "#FEFCE8",
            100: "#FEF9C3",
            200: "#FEF08A",
            300: "#FDE047",
            400: "#FACC15",
            500: "#EAB308",
            600: "#CA8A04",
            700: "#A16207",
            800: "#854D0E",
            900: "#713F12",
            950: "#422006",
          },

          // Neutral zinc — text, borders, muted states
          zinc: {
            DEFAULT: "#18181B",
            50:  "#FAFAFA",
            100: "#F4F4F5",
            200: "#E4E4E7",
            300: "#D4D4D8",
            400: "#A1A1AA",
            500: "#71717A",
            600: "#52525B",
            700: "#3F3F46",
            800: "#27272A",
            900: "#18181B",
            950: "#09090B",
          },
        },
      },

      // ─── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        sans:    ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
        mono:    ["var(--font-geist-mono)", ...defaultTheme.fontFamily.mono],
        heading: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
      },

      // Display scale for hero sections and section headings
      fontSize: {
        "display-2xl": ["4.5rem",  { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-xl":  ["3.75rem", { lineHeight: "1.1",  letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg":  ["3rem",    { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md":  ["2.25rem", { lineHeight: "1.2",  letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-sm":  ["1.875rem",{ lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "600" }],
      },

      // ─── Spacing ───────────────────────────────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
      },

      // ─── Border Radius ─────────────────────────────────────────────────────
      borderRadius: {
        "4xl": "2rem",
      },

      // ─── Shadows ───────────────────────────────────────────────────────────
      boxShadow: {
        // Accent glow — for CTAs and focused interactive elements
        "accent":    "0 0 20px rgba(234, 179, 8, 0.25)",
        "accent-lg": "0 0 48px rgba(234, 179, 8, 0.18)",
        // Surface elevation
        "card":      "0 1px 3px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.7)",
        "card-hover":"0 8px 24px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.6)",
        // Inner border glow for dark cards
        "inner-accent": "inset 0 0 0 1px rgba(234, 179, 8, 0.2)",
      },

      // ─── Backgrounds ───────────────────────────────────────────────────────
      backgroundImage: {
        // Skeleton loader base — animated via `shimmer` keyframe
        "shimmer": "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
        // Hero section — subtle dot grid
        "hero-grid": "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
        // Accent radial — behind hero CTAs
        "accent-glow": "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(234,179,8,0.12) 0%, transparent 70%)",
      },

      backgroundSize: {
        "hero-grid": "32px 32px",
      },

      // ─── Animations ────────────────────────────────────────────────────────
      keyframes: {
        // Skeleton loader sweep
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        // Page/component entrance
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        // Accent pulse — for badge or CTA focus ring
        "pulse-accent": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(234, 179, 8, 0.35)" },
          "50%":       { boxShadow: "0 0 0 8px rgba(234, 179, 8, 0)" },
        },
      },

      animation: {
        shimmer:       "shimmer 2s linear infinite",
        "fade-up":     "fade-up 0.4s ease-out forwards",
        "fade-in":     "fade-in 0.3s ease-out forwards",
        "pulse-accent":"pulse-accent 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
