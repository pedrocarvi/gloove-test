// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import NavbarHome from './components/Layout/NavbarHome';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<NavbarHome />} />
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;




