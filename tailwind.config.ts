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
        brand: {
          DEFAULT: "#8B5A2B",
          dark: "#7a4e25",
          light: "#A67C52",
        },
        cream: "#FFF8F0",
        "off-white": "#F8F5F0",
        charcoal: {
          DEFAULT: "#333333",
          light: "#555555",
        },
        "warm-gray": "#E8E2DA",
      },
      transitionDuration: {
        400: "400ms",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        kenBurns: {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.1)" },
        },
        bannerIn: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.7s ease-out both",
        "ken-burns": "kenBurns 12s ease-in-out infinite alternate",
        "banner-in": "bannerIn 0.9s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
