// src/components/Empleados/ControlPropietarios/ProcesoAlta.tsx

import React, { useState, useEffect } from 'react';
import { getPropietariosEnProceso, actualizarEstadoPropietario } from '@/services/propietarioService';

interface Propietario {
  id: string;
  // Agrega aquí cualquier otro campo que el propietario pueda tener
}

const ProcesoAlta: React.FC = () => {
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);

  useEffect(() => {
    const fetchPropietarios = async () => {
      const data = await getPropietariosEnProceso();
      setPropietarios(data); // TypeScript ahora sabe que `data` es de tipo `Propietario[]`
    };
    fetchPropietarios();
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Proceso de Alta</h1>
      {/* Tabla de propietarios */}
      {/* Añadir más lógica según sea necesario */}
    </div>
  );
};

export default ProcesoAlta;
