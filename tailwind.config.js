/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#7FD1E4",
          DEFAULT: "#38B2AC",
          dark: "#2C9C94",
        },
        secondary: {
          light: "#A3BFFA",
          DEFAULT: "#667EEA",
          dark: "#4C51BF",
        },
        accent: {
          light: "#FFDB7D",
          DEFAULT: "#F59E0B",
          dark: "#B45309",
        },
        neutral: {
          light: "#F7FAFC",
          DEFAULT: "#E2E8F0",
          dark: "#CBD5E0",
        },
        danger: {
          light: "#FEB2B2",
          DEFAULT: "#F56565",
          dark: "#C53030",
        },
        dark: {
          background: "#1A202C",
          text: "#A0AEC0",
          primary: "#2D3748",
          secondary: "#4A5568",
        },
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      screens: {
        xs: "480px", // Agrega un nuevo punto de quiebre para pantallas extra pequeñas
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
