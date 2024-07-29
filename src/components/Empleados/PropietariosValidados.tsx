import React, { useState, useEffect } from "react";
import { Download, MessageCircle } from "lucide-react";
import {
  getPropietariosValidados,
  Propietario,
  updatePropietarioDocuments,
} from "../../services/propietarioService";
import { useAuth } from "@/context/AuthContext";
import { Modal, Pagination } from "react-bootstrap";

const ITEMS_PER_PAGE = 10;

const PropietariosValidados: React.FC = () => {
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [filteredPropietarios, setFilteredPropietarios] = useState<
    Propietario[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPropietario, setSelectedPropietario] =
    useState<Propietario | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPropietarios();
    }
  }, [user]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, propietarios]);

  const fetchPropietarios = async () => {
    const data = await getPropietariosValidados();
    const propietariosConDocumentos = await Promise.all(
      data.map(async (propietario) => {
        const updatedPropietario = await updatePropietarioDocuments(
          propietario
        );
        return updatedPropietario;
      })
    );
    setPropietarios(propietariosConDocumentos);
    setFilteredPropietarios(propietariosConDocumentos);
    setLoading(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredPropietarios(propietarios);
    } else {
      const filtered = propietarios.filter(
        (propietario) =>
          propietario.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          propietario.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPropietarios(filtered);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePropietarioClick = (propietario: Propietario) => {
    setSelectedPropietario(propietario);
  };

  const paginatedPropietarios = filteredPropietarios.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Propietarios Validados</h1>
      <input
        type="text"
        placeholder="Buscar por nombre o email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Ficha Técnica</th>
              <th className="p-3 text-center">Presupuesto Textil</th>
              <th className="p-3 text-center">DNI</th>
              <th className="p-3 text-center">Referencia Catastral</th>
              <th className="p-3 text-center">VUT</th>
              <th className="p-3 text-center">Contrato</th>
              <th className="p-3 text-center">Inventario</th>
              <th className="p-3 text-center">Chat</th>
              <th className="p-3 text-center">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPropietarios.map((propietario) => (
              <tr key={propietario.id} className="border-b">
                <td className="p-3">{propietario.name}</td>
                <td className="p-3">{propietario.email}</td>
                <td className="p-3 text-center">
                  {propietario.fichaTecnica !== "pendiente" ? (
                    <a
                      href={propietario.fichaTecnica}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      <Download size={16} />
                    </a>
                  ) : (
                    <span className="text-red-500">Pendiente</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {propietario.presupuestoTextil !== "pendiente" ? (
                    <a
                      href={propietario.presupuestoTextil}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      <Download size={16} />
                    </a>
                  ) : (
                    <span className="text-red-500">Pendiente</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {propietario.dni !== "pendiente" ? (
                    <a
                      href={propietario.dni}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      <Download size={16} />
                    </a>
                  ) : (
                    <span className="text-red-500">Pendiente</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {propietario.referenciaCatastral !== "pendiente" ? (
                    <a
                      href={propietario.referenciaCatastral}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      <Download size={16} />
                    </a>
                  ) : (
                    <span className="text-red-500">Pendiente</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {propietario.vut !== "pendiente" ? (
                    <a
                      href={propietario.vut}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      <Download size={16} />
                    </a>
                  ) : (
                    <span className="text-red-500">Pendiente</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {propietario.contrato !== "pendiente" ? (
                    <a
                      href={propietario.contrato}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      <Download size={16} />
                    </a>
                  ) : (
                    <span className="text-red-500">Pendiente</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {propietario.inventario !== "pendiente" ? (
                    <a
                      href={propietario.inventario}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      <Download size={16} />
                    </a>
                  ) : (
                    <span className="text-red-500">Pendiente</span>
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
                <td className="p-3 text-center">
                  <button
                    className="bg-gray-200 text-gray-700 p-2 rounded"
                    onClick={() => handlePropietarioClick(propietario)}
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination className="mt-4">
        {Array.from(
          { length: Math.ceil(filteredPropietarios.length / ITEMS_PER_PAGE) },
          (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          )
        )}
      </Pagination>
      {selectedPropietario && (
        <Modal
          show={!!selectedPropietario}
          onHide={() => setSelectedPropietario(null)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Detalles del Propietario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Nombre: {selectedPropietario.name}</p>
            <p>Email: {selectedPropietario.email}</p>
            {/* Añadir más detalles según sea necesario */}
          </Modal.Body>
          <Modal.Footer>
            <button
              className="bg-gray-200 text-gray-700 p-2 rounded"
              onClick={() => setSelectedPropietario(null)}
            >
              Cerrar
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default PropietariosValidados;
