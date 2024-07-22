import React, { useState, useEffect } from "react";
import { Download, MessageCircle } from "lucide-react";
import {
  getPropietariosValidados,
  Propietario,
} from "../../services/propietarioService";

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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Ficha Técnica</th>
              <th className="p-3 text-center">Formulario Textil</th>
              <th className="p-3 text-center">Presupuesto Textil</th>
              <th className="p-3 text-center">Distinto Document</th>
              <th className="p-3 text-center">Contrato</th>
              <th className="p-3 text-center">Inventario</th>
              <th className="p-3 text-center">Chat</th>
            </tr>
          </thead>
          <tbody>
            {propietarios.map((propietario) => (
              <tr key={propietario.id} className="border-b">
                <td className="p-3">{propietario.name}</td>
                <td className="p-3">{propietario.email}</td>
                <td className="p-3 text-center">
                  {propietario.fichaTecnica !== "pendiente" ? (
                    <a
                      href={propietario.fichaTecnica as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      <Download size={16} />
                    </a>
                  ) : (
                    "Pendiente"
                  )}
                </td>
                <td className="p-3 text-center">
                  {propietario.formularioTextil !== "pendiente" ? (
                    <a
                      href={propietario.formularioTextil as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      <Download size={16} />
                    </a>
                  ) : (
                    "Pendiente"
                  )}
                </td>
                <td className="p-3 text-center">
                  {propietario.presupuestoTextil !== "pendiente" ? (
                    <a
                      href={propietario.presupuestoTextil as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      <Download size={16} />
                    </a>
                  ) : (
                    "Pendiente"
                  )}
                </td>
                <td className="p-3 text-center">
                  {propietario.distintoDocument !== "pendiente" ? (
                    <a
                      href={propietario.distintoDocument as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      <Download size={16} />
                    </a>
                  ) : (
                    "Pendiente"
                  )}
                </td>
                <td className="p-3 text-center">
                  {propietario.contrato !== "pendiente" ? (
                    <a
                      href={propietario.contrato as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      <Download size={16} />
                    </a>
                  ) : (
                    "Pendiente"
                  )}
                </td>
                <td className="p-3 text-center">
                  {propietario.inventario !== "pendiente" ? (
                    <a
                      href={propietario.inventario as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      <Download size={16} />
                    </a>
                  ) : (
                    "Pendiente"
                  )}
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
