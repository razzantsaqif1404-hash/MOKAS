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
        primary: {
          DEFAULT: "#004ac6",
          container: "#2563eb",
          fixed: "#dbe1ff",
          "fixed-dim": "#b4c5ff",
          "on-container": "#eeefff",
          dark: "#003ea8",
        },
        secondary: {
          DEFAULT: "#006398",
          container: "#5bb8fe",
          fixed: "#cce5ff",
        },
        tertiary: {
          DEFAULT: "#006242",
          container: "#007d55",
          "on-container": "#bdffdb",
          fixed: "#6ffbbe",
        },
        surface: {
          DEFAULT: "#f9f9ff",
          dim: "#cfdaf2",
          bright: "#f9f9ff",
          low: "#f0f3ff",
          container: "#e7eeff",
          high: "#dee8ff",
          highest: "#d8e3fb",
          lowest: "#ffffff",
          variant: "#d8e3fb",
        },
        "on-surface": {
          DEFAULT: "#111c2d",
          variant: "#434655",
        },
        outline: {
          DEFAULT: "#737686",
          variant: "#c3c6d7",
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
      },
      fontFamily: {
        headline: ["'Outfit'", "system-ui", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;

