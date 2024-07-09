/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#7FDDD6",
          DEFAULT: "#38B2AC",
          dark: "#2C9C94",
        },
        secondary: {
          light: "#A3BFFA",
          DEFAULT: "#667EEA",
          dark: "#4C51BF",
        },
        accent: {
          light: "#FBBF24",
          DEFAULT: "#F59E0B",
          dark: "#B45309",
        },
        neutral: {
          light: "#F7FAFC",
          DEFAULT: "#EDF2F7",
          dark: "#E2E8F0",
        },
        danger: {
          light: "#FED7D7",
          DEFAULT: "#F56565",
          dark: "#C53030",
        },
      },
    },
  },
  plugins: [],
};
