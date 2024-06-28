import React from 'react';
import EmpleadosLayout from './EmpleadosLayout';

const EmpleadosDashboard: React.FC = () => {
  return (
    <EmpleadosLayout>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Dashboard Empleados</h1>
        <p className="text-gray-700 mb-6">Este es el dashboard para el rol de empleado.</p>
        {/* Agrega el contenido del dashboard aquí */}
      </div>
    </EmpleadosLayout>
  );
};

export default EmpleadosDashboard;

