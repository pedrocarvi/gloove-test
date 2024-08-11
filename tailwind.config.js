module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gloovePrimary: {
          // Nombre único para evitar conflictos
          DEFAULT: "#146b79",
          dark: "#0e505e",
          light: "#b0d4e3",
        },
        glooveSecondary: {
          // Nombre único para evitar conflictos
          light: "#f1f5f9",
          DEFAULT: "#c2d3cd",
          dark: "#4A5568",
        },
        glooveText: {
          // Nombre único para evitar conflictos
          DEFAULT: "#333333",
          dark: "#ffffff",
        },
        glooveAccent: {
          // Nuevo color de acento basado en la paleta existente
          DEFAULT: "#20a4f3", // Un azul más vibrante como acento
          light: "#78c0e0", // Azul más claro
          dark: "#1c84d1", // Azul más oscuro para dark mode
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
        heading: ["'Open Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
