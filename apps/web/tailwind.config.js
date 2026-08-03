/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary)",
        foreground: "var(--text-main)",
        card: "var(--bg-card)",
        border: "var(--border-subtle)",
        verified: "var(--accent-verified)",
        revoked: "var(--accent-revoked)",
        primary: "var(--accent-primary)",
        muted: "var(--text-muted)",
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
      }
    },
  },
  plugins: [],
};
