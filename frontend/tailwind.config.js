/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: ['bg-sky-50'],
  theme: {
    extend: {
      fontFamily: {
        myfont: ['MyFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

