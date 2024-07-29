import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import Home from "./components/Pages/Home";
import AppRoutes from "./routes";
import "./App.css"; // Importa el archivo App.css aquí

const App = () => {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </Router>
      </DarkModeProvider>
    </AuthProvider>
  );
};

export default App;
