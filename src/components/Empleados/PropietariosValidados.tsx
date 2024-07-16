import React, { useState, useEffect } from "react";
import { Download, MessageCircle } from "lucide-react";
import { getPropietariosValidados } from "../../services/propietarioService";

const PropietariosValidados = () => {
  const [propietarios, setPropietarios] = useState([]);

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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-center">Documentos</th>
              <th className="p-3 text-center">Chat</th>
            </tr>
          </thead>
          <tbody>
            {propietarios.map((propietario) => (
              <tr key={propietario.id} className="border-b">
                <td className="p-3">{propietario.nombre}</td>
                <td className="p-3 text-center">
                  {propietario.documentos ? (
                    <button className="bg-blue-500 text-white p-1 rounded">
                      <Download size={16} />
                    </button>
                  ) : null}
                </td>
                <td className="p-3 text-center">
                  <button className="bg-blue-500 text-white p-2 rounded relative">
                    <MessageCircle size={16} />
                    {propietario.chat > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                        {propietario.chat}
                      </span>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropietariosValidados;
