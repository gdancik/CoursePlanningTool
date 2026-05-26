/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    'border-brand',
    'border-sidebarYellow',
  ],
  theme: {
    extend: {
      colors: {
        brand: "#002656",
        sidebarYellow: "#ffc107"
      }
    },
  },
  plugins: [],
};
