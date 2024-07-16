import React from "react";
import { FiFileText } from "react-icons/fi";

const documents = [
  {
    title: "Ficha técnica",
    icon: <FiFileText className="h-12 w-12 text-primary" />,
    buttonLabel: "Descargar",
    fileUrl: "/path/to/technical_sheet.pdf",
  },
  {
    title: "Textil + Presupuesto",
    icon: <FiFileText className="h-12 w-12 text-primary" />,
    buttonLabel: "Descargar",
    fileUrl: "/path/to/textile_budget.pdf",
  },
  {
    title: "Documentación",
    icon: <FiFileText className="h-12 w-12 text-primary" />,
    buttonLabel: "Descargar",
    fileUrl: "/path/to/documentation.pdf",
  },
  {
    title: "Contrato",
    icon: <FiFileText className="h-12 w-12 text-primary" />,
    buttonLabel: "Descargar",
    fileUrl: "/path/to/contract.pdf",
  },
  {
    title: "Inventario",
    icon: <FiFileText className="h-12 w-12 text-primary" />,
    buttonLabel: "Descargar",
    fileUrl: "/path/to/inventory.pdf",
  },
];

const DocumentationSection: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="flex flex-col items-center transform transition-transform hover:scale-105 hover:shadow-xl"
          >
            <div className="text-center mb-4">
              <div className="flex justify-center items-center bg-primary-light rounded-full p-4 shadow-md">
                {doc.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                {doc.title}
              </h3>
            </div>
            <a
              href={doc.fileUrl}
              download
              className="bg-primary text-white py-2 px-4 rounded-md transition hover:bg-primary-dark focus:ring-4 focus:ring-primary-light"
            >
              {doc.buttonLabel}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentationSection;
