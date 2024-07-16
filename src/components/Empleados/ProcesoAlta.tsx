import React, { useState, useEffect } from "react";
import {
  ArrowDown,
  Check,
  X,
  Download,
  MessageCircle,
  Send,
} from "lucide-react";
import {
  getPropietariosEnProceso,
  enviarInvitacion,
  actualizarEstadoPropietario,
} from "../../services/propietarioService";

const ProcesoAlta = () => {
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [propietarios, setPropietarios] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPropietarios = async () => {
      const data = await getPropietariosEnProceso();
      setPropietarios(data);
    };
    fetchPropietarios();
  }, []);

  const handleAddNewOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    await enviarInvitacion(newOwnerEmail);
    setNewOwnerEmail("");
  };

  const handleAction = async (id: string, action: string) => {
    await actualizarEstadoPropietario(id, action);
    const data = await getPropietariosEnProceso();
    setPropietarios(data);
  };

  const renderActionButton = (status: any, id: string, action: string) => {
    if (status === true) {
      return (
        <button
          onClick={() => handleAction(id, action)}
          className="bg-blue-500 text-white p-1 rounded"
        >
          <Download size={16} />
        </button>
      );
    } else if (status === "pendiente") {
      return (
        <div className="flex space-x-1">
          <button
            onClick={() => handleAction(id, action)}
            className="bg-green-500 text-white p-1 rounded"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => handleAction(id, action)}
            className="bg-blue-500 text-white p-1 rounded"
          >
            <Send size={16} />
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Dashboard de Empleados - Proceso de Alta
      </h1>
      <form onSubmit={handleAddNewOwner} className="mb-4">
        <input
          type="email"
          value={newOwnerEmail}
          onChange={(e) => setNewOwnerEmail(e.target.value)}
          placeholder="Correo del nuevo propietario"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Enviar Invitación
        </button>
      </form>
      <div className="mb-4 flex space-x-2">
        <select className="border p-2">
          <option>Filtrar por región</option>
        </select>
        <select className="border p-2">
          <option>Ordenar por</option>
          <option>Alfabético</option>
          <option>Más antiguos</option>
          <option>Acciones pendientes</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nombre</th>
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
            {propietarios
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((propietario) => (
                <tr key={propietario.id} className="border-b">
                  <td className="p-3">
                    {propietario.presupuestoTextil === "pendiente" ||
                    propietario.contrato === "pendiente" ? (
                      <span className="mr-2 text-yellow-500">
                        <ArrowDown size={16} />
                      </span>
                    ) : null}
                    {propietario.nombre}
                  </td>
                  <td className="p-3 text-center">
                    {propietario.fichaTecnica ? (
                      <Check className="inline text-green-500" />
                    ) : (
                      <X className="inline text-red-500" />
                    )}
                    {propietario.fichaTecnica &&
                      renderActionButton(
                        propietario.fichaTecnica,
                        propietario.id,
                        "fichaTecnica"
                      )}
                  </td>
                  <td className="p-3 text-center">
                    {propietario.formularioTextil ? (
                      <Check className="inline text-green-500" />
                    ) : (
                      <X className="inline text-red-500" />
                    )}
                    {propietario.formularioTextil &&
                      renderActionButton(
                        propietario.formularioTextil,
                        propietario.id,
                        "formularioTextil"
                      )}
                  </td>
                  <td
                    className={`p-3 text-center ${
                      propietario.presupuestoTextil === "pendiente"
                        ? "bg-yellow-100"
                        : ""
                    }`}
                  >
                    {propietario.presupuestoTextil === true ? (
                      <Check className="inline text-green-500" />
                    ) : propietario.presupuestoTextil === "pendiente" ? (
                      <span className="text-yellow-500">Pendiente</span>
                    ) : (
                      <X className="inline text-red-500" />
                    )}
                    {renderActionButton(
                      propietario.presupuestoTextil,
                      propietario.id,
                      "presupuesto"
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {propietario.distintoDocument ? (
                      <Check className="inline text-green-500" />
                    ) : (
                      <X className="inline text-red-500" />
                    )}
                    {propietario.distintoDocument &&
                      renderActionButton(
                        propietario.distintoDocument,
                        propietario.id,
                        "distintoDocument"
                      )}
                  </td>
                  <td
                    className={`p-3 text-center ${
                      propietario.contrato === "pendiente"
                        ? "bg-yellow-100"
                        : ""
                    }`}
                  >
                    {propietario.contrato === true ? (
                      <Check className="inline text-green-500" />
                    ) : propietario.contrato === "pendiente" ? (
                      <span className="text-yellow-500">Pendiente</span>
                    ) : (
                      <X className="inline text-red-500" />
                    )}
                    {renderActionButton(
                      propietario.contrato,
                      propietario.id,
                      "contrato"
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {propietario.inventario ? (
                      <Check className="inline text-green-500" />
                    ) : (
                      <X className="inline text-red-500" />
                    )}
                    {propietario.inventario &&
                      renderActionButton(
                        propietario.inventario,
                        propietario.id,
                        "inventario"
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
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="mx-1 p-2 border rounded"
        >
          Anterior
        </button>
        <span className="mx-1 p-2">Página {currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="mx-1 p-2 border rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ProcesoAlta;
