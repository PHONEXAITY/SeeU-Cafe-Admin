/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          50: '#FAF3E0',
          100: '#F5E6CB',
          200: '#E6D2B5',
          300: '#D7BE9F',
          400: '#C8AA89',
          500: '#B99673',
          600: '#A47F5B',
          700: '#8F6B43',
          800: '#7A572B',
          900: '#654313',
        },
        beige: {
          50: '#FFFBF0',
          100: '#FFF7E6',
          200: '#FFF2D9',
          300: '#FFEDCC',
          400: '#FFE8BF',
          500: '#FFE3B3',
          600: '#FFD580',
          700: '#FFC74D',
          800: '#FFB91A',
          900: '#E6A200',
        },
      },
    },
  },
  plugins: [],
};
