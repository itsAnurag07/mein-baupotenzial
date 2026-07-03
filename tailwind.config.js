/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Style Guide Palette ─────────────────────────────
        "primary":              "#1F2328",   // Primary Dark
        "primary-container":    "#2A2F35",
        "on-primary":           "#FFFFFF",
        "on-primary-container": "#EBEBEB",

        "secondary":            "#234436",   // CTA Green
        "secondary-container":  "#EAF0EC",   // Light green tint (badge bg)
        "on-secondary":         "#FFFFFF",
        "on-secondary-container": "#234436",

        "accent":               "#A67C52",   // Bronze — badges, dividers, small highlights only
        "accent-container":     "#F5EDE3",   // Light bronze tint

        "surface-white":        "#F8F7F4",   // Page / section background (warm off-white)
        "surface-bright":       "#ECECEA",   // Elevated card surface
        "surface-dim":          "#D0CFCB",   // Subtle dividers / borders
        "surface-variant":      "#E5E4E0",

        "background":           "#F8F7F4",
        "surface":              "#F8F7F4",

        "on-surface":           "#1F2328",
        "on-surface-variant":   "#5E646B",   // Body text
        "on-background":        "#1F2328",

        "outline":              "#A09E9A",
        "outline-variant":      "#D0CFCB",

        // ── Error / Warning ──────────────────────────────────
        "error":                "#ba1a1a",
        "error-red":            "#B91C1C",
        "error-container":      "#ffdad6",
        "on-error":             "#ffffff",
        "on-error-container":   "#93000a",
        "warning-amber":        "#B45309",

        // ── Legacy aliases (keep existing class names working) ─
        "cta-hover":            "#2F5A49",
        "primary-navy":         "#1F2328",
        "accent-teal":          "#234436",
        "ui-steel":             "#94A3B8",
        "text-slate":           "#1F2328",
        "surface-container":    "#ECECEA",
        "surface-container-high": "#E5E4E0",
        "surface-container-low": "#F2F1EE",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-highest": "#E0DFD9",
        "inverse-surface":      "#2A2F35",
        "inverse-on-surface":   "#F0EFEB",
        "inverse-primary":      "#C5CAD0",
        "tertiary":             "#2A2F35",
        "tertiary-container":   "#2A2F35",
        "on-tertiary":          "#FFFFFF",
        "on-tertiary-container": "#EBEBEB",
        "tertiary-fixed":       "#D4D8DC",
        "tertiary-fixed-dim":   "#B9BEC4",
        "on-tertiary-fixed":    "#0d1c2d",
        "on-tertiary-fixed-variant": "#39485a",
        "primary-fixed":        "#D6DADE",
        "primary-fixed-dim":    "#B5BCC4",
        "on-primary-fixed":     "#071c36",
        "on-primary-fixed-variant": "#364764",
        "secondary-fixed":      "#C5D9CB",
        "secondary-fixed-dim":  "#9DBFAA",
        "on-secondary-fixed":   "#00201d",
        "on-secondary-fixed-variant": "#00504a",
        "surface-tint":         "#5E6A78",
      },

      fontFamily: {
        sans: [
          'var(--font-inter)',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },

      fontSize: {
        // Style guide scale
        "h1":         ["60px",  { lineHeight: "1.1",  letterSpacing: "-0.025em", fontWeight: "700" }],
        "h2":         ["42px",  { lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "700" }],
        "h3":         ["28px",  { lineHeight: "1.3",  letterSpacing: "-0.01em",  fontWeight: "600" }],
        "body":       ["18px",  { lineHeight: "1.55", fontWeight: "400" }],
        "small":      ["15px",  { lineHeight: "1.55", fontWeight: "400" }],
        "btn":        ["16px",  { lineHeight: "1",    fontWeight: "600" }],
        // Legacy aliases
        "headline-xl": ["48px", { lineHeight: "1.1",  letterSpacing: "-0.02em",  fontWeight: "700" }],
        "headline-lg": ["36px", { lineHeight: "1.2",  letterSpacing: "-0.01em",  fontWeight: "600" }],
        "headline-md": ["28px", { lineHeight: "1.3",  letterSpacing: "-0.01em",  fontWeight: "600" }],
        "headline-sm": ["22px", { lineHeight: "1.4",  fontWeight: "600" }],
        "body-lg":     ["18px", { lineHeight: "1.55", fontWeight: "400" }],
        "body-md":     ["15px", { lineHeight: "1.55", fontWeight: "400" }],
        "label-md":    ["15px", { lineHeight: "1.55", letterSpacing: "0.02em",   fontWeight: "500" }],
        "caption":     ["13px", { lineHeight: "1.5",  fontWeight: "400" }],
      },

      spacing: {
        "section":    "120px",
        "card-gap":   "32px",
        "content-max":"1280px",
        "canvas-max": "1440px",
        "container-max": "1280px",
        "gutter":     "24px",
        "margin-mobile": "16px",
        "margin-desktop": "40px",
        "base":       "8px",
        "section-gap":"120px",
      },

      borderRadius: {
        "card":   "18px",
        "btn":    "14px",
      },

      boxShadow: {
        "card": "0 2px 12px rgba(31,35,40,0.06)",
        "card-hover": "0 4px 24px rgba(31,35,40,0.10)",
        "soft": "0 1px 6px rgba(31,35,40,0.05)",
      },

      transitionDuration: {
        "hover": "120ms",
        "fade":  "250ms",
      },
    },
  },
  plugins: [],
};
