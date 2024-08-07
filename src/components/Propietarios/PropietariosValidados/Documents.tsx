import React, { useState, useEffect } from "react";
import { FiFileText } from "react-icons/fi";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";
import { RingLoader } from "react-spinners";

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
    title: "Documentación",
    storagePath:
      "Documentacion obligatoria/Documentación necesaria para cumplimentación de contrato.pdf",
    directUrl:
      "https://firebasestorage.googleapis.com/v0/b/software-gloove.appspot.com/o/Documentacion%20obligatoria%2FDocumentacio%CC%81n%20necesaria%20para%20cumplimentacio%CC%81n%20de%20contrato.pdf?alt=media&token=1b8a312e-f7cc-4c02-ba0c-f536a871745c",
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

const DocumentationSection: React.FC = () => {
  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({});
  const [currentDocument, setCurrentDocument] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const storage = getStorage();

  useEffect(() => {
    if (user) {
      fetchDocumentUrls();
    }
  }, [user]);

  const fetchDocumentUrls = async () => {
    if (!user) return;

    setLoading(true);
    const urls: Record<string, string> = {};
    for (const docInfo of documentsConfig) {
      if (docInfo.directUrl) {
        urls[docInfo.title] = docInfo.directUrl;
        console.log(
          `Using direct URL for ${docInfo.title}: ${docInfo.directUrl}`
        );
      } else {
        let storagePath =
          typeof docInfo.storagePath === "function"
            ? docInfo.storagePath(user.uid)
            : docInfo.storagePath;

        console.log(
          `Fetching document ${docInfo.title} from path: ${storagePath}`
        );

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
    setLoading(false);
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
    <div className="p-6 bg-white dark:bg-dark-background rounded-lg shadow-lg">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <RingLoader color="#146b79" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {documentsConfig.map((docInfo, index) => (
              <div
                key={index}
                className="flex flex-col items-center transform transition-transform hover:scale-110 hover:shadow-2xl"
              >
                <div className="text-center mb-4">
                  <div className="flex justify-center items-center bg-gloovePrimary-light dark:bg-gloovePrimary-dark rounded-full p-6 shadow-md">
                    <FiFileText className="h-16 w-16 text-gloovePrimary dark:text-gloovePrimary-light" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-dark-text">
                    {docInfo.title}
                  </h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleVisualize(docInfo.title)}
                    className="bg-glooveSecondary text-glooveText-dark dark:bg-dark-primary dark:text-dark-text py-2 px-4 rounded-md transition hover:bg-glooveSecondary-dark dark:hover:bg-dark-secondary focus:ring-4 focus:ring-glooveSecondary-light"
                  >
                    Visualizar
                  </button>
                  <button
                    onClick={() => handleDownload(docInfo.title)}
                    className="bg-gloovePrimary text-white py-2 px-4 rounded-md transition hover:bg-gloovePrimary-dark focus:ring-4 focus:ring-gloovePrimary-light"
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
                className="w-full h-96 border-2 border-gray-300 dark:border-dark-secondary"
                title="Document Viewer"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentationSection;
