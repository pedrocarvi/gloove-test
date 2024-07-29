import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  MessageCircle,
  ArrowDown,
  Download,
  Send,
} from "lucide-react";
import {
  getPropietariosEnProceso,
  actualizarEstadoPropietario,
  Propietario,
} from "../../services/propietarioService";
import { getFunctions, httpsCallable } from 'firebase/functions';

const ProcesoAlta: React.FC = () => {
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const functions = getFunctions();

  useEffect(() => {
    const fetchPropietarios = async () => {
      try {
        const data = await getPropietariosEnProceso();
        setPropietarios(data);
      } catch (error) {
        console.error("Error fetching propietarios en proceso:", error);
      }
    };
    fetchPropietarios();
  }, []);

  const handleAddNewOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sendInvitation = httpsCallable(functions, 'sendInvitation');
      await sendInvitation({ email: newOwnerEmail });
      setNewOwnerEmail("");
    } catch (error) {
      console.error("Error sending invitation:", error);
    }
  };

  const handleAction = async (id: string, action: string) => {
    try {
      await actualizarEstadoPropietario(id, action);
      const data = await getPropietariosEnProceso();
      setPropietarios(data);
    } catch (error) {
      console.error(
        `Error updating state for propietario with ID ${id}:`,
        error
      );
    }
  };

  const renderStatusIcon = (step: number, currentStep: number) => {
    return step <= currentStep ? (
      <CheckCircle className="text-green-500" size={20} />
    ) : (
      <XCircle className="text-red-500" size={20} />
    );
  };

  const renderActionButton = (
    status: boolean | "pendiente" | string,
    id: string,
    action: string,
    url?: string
  ) => {
    if (typeof status === "string" && status !== "pendiente") {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Download size={16} />
        </a>
      );
    }
    if (status === true) {
      return <CheckCircle className="text-green-500" size={16} />;
    } else if (status === "pendiente") {
      return (
        <div className="flex space-x-1">
          <button
            onClick={() => handleAction(id, action)}
            className="bg-green-500 text-white p-1 rounded"
          >
            <CheckCircle size={16} />
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
    return <XCircle className="text-red-500" size={16} />;
  };

  const handleNavigate = (path: string, id: string, action: string) => {
    handleAction(id, action);
    navigate(path);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Dashboard de Empleados - Proceso de Alta
      </h1>
      <form onSubmit={handleAddNewOwner} className="mb-6 flex justify-center">
        <input
          type="email"
          value={newOwnerEmail}
          onChange={(e) => setNewOwnerEmail(e.target.value)}
          placeholder="Correo del nuevo propietario"
          className="border p-2 rounded-l-lg w-80"
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded-r-lg"
        >
          Enviar Invitación
        </button>
      </form>
      <div className="mb-6 flex justify-center space-x-4">
        <select className="border p-2 rounded-lg bg-white">
          <option>Filtrar por región</option>
        </select>
        <select className="border p-2 rounded-lg bg-white">
          <option>Ordenar por</option>
          <option>Alfabético</option>
          <option>Más antiguos</option>
          <option>Acciones pendientes</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-left font-medium text-gray-700">
                Nombre
              </th>
              <th className="p-4 text-left font-medium text-gray-700">Email</th>
              <th className="p-4 text-center font-medium text-gray-700">
                Ficha Técnica
              </th>
              <th className="p-4 text-center font-medium text-gray-700">
                Formulario Textil
              </th>
              <th className="p-4 text-center font-medium text-gray-700">
                Presupuesto Textil
              </th>
              <th className="p-4 text-center font-medium text-gray-700">
                Distinto Document
              </th>
              <th className="p-4 text-center font-medium text-gray-700">
                Contrato
              </th>
              <th className="p-4 text-center font-medium text-gray-700">
                Inventario
              </th>
              <th className="p-4 text-center font-medium text-gray-700">
                Chat
              </th>
              <th className="p-4 text-center font-medium text-gray-700">
                Estado
              </th>
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
                  <td className="p-4 flex items-center space-x-2">
                    {propietario.presupuestoTextil === "pendiente" ||
                    propietario.contrato === "pendiente" ? (
                      <ArrowDown className="text-yellow-500" size={16} />
                    ) : null}
                    <span>{propietario.name}</span>
                  </td>
                  <td className="p-4 text-left">{propietario.email}</td>
                  <td className="p-4 text-center">
                    {renderStatusIcon(1, propietario.currentStep)}
                  </td>
                  <td className="p-4 text-center">
                    {renderStatusIcon(2, propietario.currentStep)}
                  </td>
                  <td
                    className={`p-4 text-center ${
                      propietario.presupuestoTextil === "pendiente"
                        ? "bg-yellow-100"
                        : ""
                    }`}
                  >
                    {renderActionButton(
                      propietario.presupuestoTextil,
                      propietario.id,
                      "presupuestoTextil",
                      typeof propietario.presupuestoTextil === "string"
                        ? propietario.presupuestoTextil
                        : undefined
                    )}
                    <button
                      onClick={() => handleNavigate(`/presupuesto-textil/${propietario.id}`, propietario.id, "presupuestoTextil")}
                      className="ml-2 bg-blue-500 text-white p-1 rounded"
                    >
                      Ir a Presupuesto
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    {renderStatusIcon(4, propietario.currentStep)}
                  </td>
                  <td
                    className={`p-4 text-center ${
                      propietario.contrato === "pendiente"
                        ? "bg-yellow-100"
                        : ""
                    }`}
                  >
                    {renderActionButton(
                      propietario.contrato,
                      propietario.id,
                      "contrato",
                      typeof propietario.contrato === "string"
                        ? propietario.contrato
                        : undefined
                    )}
                    <button
                      onClick={() => handleNavigate(`/contrato/${propietario.id}`, propietario.id, "contrato")}
                      className="ml-2 bg-blue-500 text-white p-1 rounded"
                    >
                      Ir a Contrato
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    {renderStatusIcon(6, propietario.currentStep)}
                  </td>
                  <td className="p-4 text-center">
                    <button className="bg-blue-500 text-white p-2 rounded relative">
                      <MessageCircle size={16} />
                      {propietario.chat > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                          {propietario.chat}
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    {renderStatusIcon(
                      propietario.completedRegistration ? 7 : 0,
                      7
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="mx-2 p-2 border rounded bg-gray-200"
        >
          Anterior
        </button>
        <span className="mx-2 p-2">Página {currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="mx-2 p-2 border rounded bg-gray-200"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ProcesoAlta;