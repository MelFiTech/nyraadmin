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
        blue: {
          600: '#0052FF',
          700: '#0040CC',
        },
        yellow: {
          400: '#FFD43B',
          500: '#CEFE65',
        },
      },
    },
  },
  plugins: [],
};

export default config;
