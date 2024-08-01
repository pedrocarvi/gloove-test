import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css"; // Importa el archivo App.css aquí
import "./assets/styles/tailwind.css"; // Ajusta la ruta según la estructura de tu proyecto

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  throw new Error("Failed to find the root element");
}
