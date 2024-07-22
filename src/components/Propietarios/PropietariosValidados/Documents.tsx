import React, { useState, useEffect } from "react";
import { FiFileText } from "react-icons/fi";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";

const documentsConfig = [
  {
    title: "Ficha técnica",
    storagePath: (uid: string) => `DocumentacionPropietarios/FichaTecnica/ficha_tecnica_${uid}.pdf`,
  },
  {
    title: "Textil + Presupuesto",
    storagePath: (uid: string) => `Presupuesto Textil/textile_summary_${uid}.pdf`,
  },
  {
    title: "Documentación",
    storagePath: "Documentacion obligatoria/Documentación necesaria para cumplimentación de contrato.pdf",
    directUrl: "https://firebasestorage.googleapis.com/v0/b/software-gloove.appspot.com/o/Documentacion%20obligatoria%2FDocumentacio%CC%81n%20necesaria%20para%20cumplimentacio%CC%81n%20de%20contrato.pdf?alt=media&token=1b8a312e-f7cc-4c02-ba0c-f536a871745c"
  },
  {
    title: "Contrato",
    storagePath: (uid: string) => `DocumentacionPropietarios/Contratos/contract_${uid}.pdf`,
  },
  {
    title: "Inventario",
    storagePath: (uid: string) => `DocumentacionPropietarios/Inventario/inventario_${uid}.pdf`,
  },
];

const DocumentationSection: React.FC = () => {
  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({});
  const [currentDocument, setCurrentDocument] = useState<string | null>(null);
  const { user } = useAuth();
  const storage = getStorage();

  useEffect(() => {
    if (user) {
      fetchDocumentUrls();
    }
  }, [user]);

  const fetchDocumentUrls = async () => {
    if (!user) return;

    const urls: Record<string, string> = {};
    for (const docInfo of documentsConfig) {
      if (docInfo.directUrl) {
        urls[docInfo.title] = docInfo.directUrl;
        console.log(`Using direct URL for ${docInfo.title}: ${docInfo.directUrl}`);
      } else {
        let storagePath = typeof docInfo.storagePath === 'function'
          ? docInfo.storagePath(user.uid)
          : docInfo.storagePath;

        console.log(`Fetching document ${docInfo.title} from path: ${storagePath}`);

        try {
          const storageRef = ref(storage, storagePath);
          const url = await getDownloadURL(storageRef);
          console.log(`Generated URL for ${docInfo.title}: ${url}`);
          urls[docInfo.title] = url;
        } catch (error) {
          console.error(`Error getting URL for ${docInfo.title}:`, error);
        }
      }
    }
    setDocumentUrls(urls);
  };


  const handleVisualize = (title: string) => {
    const url = documentUrls[title];
    if (url) {
      setCurrentDocument(url);
    } else {
      alert(`No se pudo encontrar el documento: ${title}`);
    }
  };

  const handleDownload = (title: string) => {
    const url = documentUrls[title];
    if (url) {
      window.open(url, "_blank");
    } else {
      alert(`No se pudo encontrar el documento: ${title}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {documentsConfig.map((docInfo, index) => (
          <div
            key={index}
            className="flex flex-col items-center transform transition-transform hover:scale-105 hover:shadow-xl"
          >
            <div className="text-center mb-4">
              <div className="flex justify-center items-center bg-primary-light rounded-full p-4 shadow-md">
                <FiFileText className="h-12 w-12 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                {docInfo.title}
              </h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleVisualize(docInfo.title)}
                className="bg-secondary text-white py-2 px-4 rounded-md transition hover:bg-secondary-dark focus:ring-4 focus:ring-secondary-light"
              >
                Visualizar
              </button>
              <button
                onClick={() => handleDownload(docInfo.title)}
                className="bg-primary text-white py-2 px-4 rounded-md transition hover:bg-primary-dark focus:ring-4 focus:ring-primary-light"
              >
                Descargar
              </button>
            </div>
          </div>
        ))}
      </div>
      {currentDocument && (
        <div className="mt-6">
          <iframe
            src={currentDocument}
            className="w-full h-96 border-2 border-gray-300"
            title="Document Viewer"
          />
        </div>
      )}
    </div>
  );
};

export default DocumentationSection;