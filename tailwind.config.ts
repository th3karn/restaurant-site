import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Rich restaurant brand palette
        brand: {
          50: "#fdf8f0",
          100: "#faefd9",
          200: "#f4d9a8",
          300: "#edbc6d",
          400: "#e5983a",
          500: "#de7e1b",
          600: "#cf6411",
          700: "#ab4d10",
          800: "#893d14",
          900: "#703413",
          950: "#3d1906",
        },
        cream: {
          50: "#fefdf8",
          100: "#fdf8ec",
          200: "#faeed0",
          300: "#f5dea4",
          400: "#edc76e",
          500: "#e5b044",
          600: "#d6952a",
          700: "#b27320",
          800: "#905c1f",
          900: "#764c1c",
        },
        charcoal: {
          800: "#1a1208",
          900: "#0f0a04",
          950: "#080502",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
