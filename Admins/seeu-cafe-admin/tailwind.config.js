/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          light: '#F4ECE1', // Creamy latte
          DEFAULT: '#C29A6B', // Rich cappuccino
          dark: '#8A6D4B',   // Espresso
        },
        secondary: {
          light: '#F8F4ED', // Milk foam
          DEFAULT: '#E0D2BA', // Macchiato
          dark: '#AB9F8D',   // Mocha
        },
        accent: {
          light: '#E9DDD0', // Caramel
          DEFAULT: '#D8BC9A', // Toffee
          dark: '#9C6F49',   // Chocolate
        },
        neutral: {
          light: '#FFFFFF', // White
          DEFAULT: '#F7F5F2', // Cream
          dark: '#352617',   // Dark coffee
        },
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
        // เพิ่มสีสำหรับ shadcn/ui
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
