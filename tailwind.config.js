/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // Ensures Tailwind scans all files in src/
  theme: {
    extend: {
      scrollbar: {
        hide: 'scrollbar-hide',
      }
    },
  },
  plugins: [],
};
