import React, { useState, useEffect } from "react";
import { Download, MessageCircle } from "lucide-react";
import {
  getPropietariosValidados,
  Propietario,
} from "../../services/propietarioService";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";

const documentsConfig = [
  {
    title: "Ficha técnica",
    storagePath: (uid: string) =>
      `DocumentacionPropietarios/FichaTecnica/ficha_tecnica_${uid}.pdf`,
  },
  {
    title: "Textil + Presupuesto",
    storagePath: (uid: string) =>
      `Presupuesto Textil/textile_summary_${uid}.pdf`,
  },
  {
    title: "Contrato",
    storagePath: (uid: string) =>
      `DocumentacionPropietarios/Contratos/contract_${uid}.pdf`,
  },
  {
    title: "Inventario",
    storagePath: (uid: string) =>
      `DocumentacionPropietarios/Inventario/inventario_${uid}.pdf`,
  },
];

const PropietariosValidados: React.FC = () => {
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const { user } = useAuth();
  const storage = getStorage();

  useEffect(() => {
    if (user) {
      fetchPropietarios();
    }
  }, [user]);

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
  };

  const updatePropietarioDocuments = async (propietario: Propietario) => {
    const urls: Record<string, string> = {};
    for (const docInfo of documentsConfig) {
      const storagePath = docInfo.storagePath(propietario.id);
      urls[docInfo.title] = await fetchDocumentURL(storagePath);
    }
    propietario.fichaTecnica = urls["Ficha técnica"];
    propietario.formularioTextil = urls["Textil + Presupuesto"];
    propietario.presupuestoTextil = urls["Textil + Presupuesto"];
    propietario.distintoDocument = urls["Distinto Document"];
    propietario.contrato = urls["Contrato"];
    propietario.inventario = urls["Inventario"];
    return propietario;
  };

  const fetchDocumentURL = async (docPath: string) => {
    try {
      const fileRef = ref(storage, docPath);
      return await getDownloadURL(fileRef);
    } catch (error) {
      if ((error as any).code === "storage/object-not-found") {
        console.warn(`Document ${docPath} not found.`);
      } else {
        console.error(`Error getting URL for document ${docPath}:`, error);
      }
      return "pendiente";
    }
  };

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
                      href={propietario.fichaTecnica}
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
                      href={propietario.formularioTextil}
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
                      href={propietario.presupuestoTextil}
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
                      href={propietario.distintoDocument}
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
                      href={propietario.contrato}
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
                      href={propietario.inventario}
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
