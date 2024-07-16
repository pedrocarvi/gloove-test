import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/tailwind.css';  // Ajusta la ruta según la estructura de tu proyecto
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
