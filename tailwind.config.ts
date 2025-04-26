import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray_900: "#000000",
        gray_100: "#F9FAFA",
        Primary_heavy: "#320397",
        gray_600: "#A7A9B4",
        Label_natural: "#5E616E",
        gray_300: "#EEEFF1",
        gray_800: "#474953",
        error: "#D11111",
        Line_strong: "#D6D7DC",
        Primary_normal: "#6025E1",
      },
    },
  },
  plugins: [],
} satisfies Config;
