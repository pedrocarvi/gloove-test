// src/components/Empleados/ControlPropietarios/PropietariosValidados.tsx

import React, { useState, useEffect } from 'react';
import { getPropietariosValidados } from '@/services/propietarioService';

interface Propietario {
  id: string;
  // Otros campos del propietario
}

const PropietariosValidados: React.FC = () => {
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);

  useEffect(() => {
    const fetchPropietarios = async () => {
      const data = await getPropietariosValidados();
      setPropietarios(data);
    };
    fetchPropietarios();
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Propietarios Validados</h1>
      {/* Tabla de propietarios validados */}
      {/* Añadir más lógica según sea necesario */}
    </div>
  );
};

export default PropietariosValidados;
