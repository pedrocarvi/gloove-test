// src/components/Huespedes/Dashboard.jsx
import React from 'react';
import HuespedesLayout from './HuespedesLayout';

const HuespedesDashboard = () => {
  return (
    <HuespedesLayout>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Dashboard Huespedes</h1>
        <p className="text-gray-700 mb-6">Este es el dashboard para el rol de huésped.</p>
        {/* Agrega el contenido del dashboard aquí */}
      </div>
    </HuespedesLayout>
  );
};

export default HuespedesDashboard;
