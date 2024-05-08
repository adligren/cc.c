import { text } from "stream/consumers";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-blue": "linear-gradient(to right, #6366f1 0%, #0ea5e9 15%, #2dffba 50%, #0ea5e9 85%, #6366f1 100%)",
      },
      backgroundSize: {
        huge: "128rem",
      },
      backgroundColor: {
        "whiteish": "rgb(244, 249, 240)",
      },
      minHeight: {
        "128": "32rem",
      },
    },
  },
  plugins: [],
};
export default config;
