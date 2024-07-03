module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#7FDDD6", // Azul Turquesa Claro
          DEFAULT: "#38B2AC", // Azul Turquesa
          dark: "#2C9C94", // Azul Turquesa Oscuro
        },
        secondary: {
          light: "#A3BFFA", // Azul Claro
          DEFAULT: "#667EEA", // Azul
          dark: "#4C51BF", // Azul Oscuro
        },
        accent: {
          light: "#FBBF24", // Amarillo Claro
          DEFAULT: "#F59E0B", // Amarillo
          dark: "#B45309", // Amarillo Oscuro
        },
        neutral: {
          light: "#F7FAFC", // Gris Claro
          DEFAULT: "#EDF2F7", // Gris
          dark: "#E2E8F0", // Gris Oscuro
        },
        danger: {
          light: "#FED7D7", // Rojo Claro
          DEFAULT: "#F56565", // Rojo
          dark: "#C53030", // Rojo Oscuro
        },
      },
    },
  },
  variants: {
    extend: {
      transform: ["hover", "focus"],
      scale: ["hover", "focus"],
      ringWidth: ["hover", "active"],
      ringColor: ["hover", "active"],
    },
  },
  plugins: [],
};
