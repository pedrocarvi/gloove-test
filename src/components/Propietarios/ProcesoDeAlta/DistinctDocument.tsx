import React, { useState } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { getStorage, ref, uploadString } from "firebase/storage";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

interface ImageState {
  dni: string;
  referenciaCatastral: string;
  vut: string;
}

interface DistinctDocumentProps {
  onAccept: () => void;
}

const DistinctDocument: React.FC<DistinctDocumentProps> = ({ onAccept }) => {
  const [images, setImages] = useState<ImageState>({
    dni: "",
    referenciaCatastral: "",
    vut: "",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const generateUniqueId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Función para subir un archivo a Firebase Storage
  // Los paths de almacenamiento son los siguientes
  //
  // Para el DNI:
  //   gs://software-gloove.appspot.com/DocumentacionPropietarios/DNI
  //   Archivo: "DocumentacionPropietarios/DNI/archivoDNI_<uniqueId>.pdf"
  //
  // Para el VUT:
  //   gs://software-gloove.appspot.com/DocumentacionPropietarios/VUT
  //   Archivo: "DocumentacionPropietarios/VUT/archivoVUT_<uniqueId>.pdf"
  //
  // Para la Referencia Catastral:
  //   gs://software-gloove.appspot.com/DocumentacionPropietarios/RefCatastral
  //   Archivo: "DocumentacionPropietarios/RefCatastral/archivoRefCatastral_<uniqueId>.pdf"
  const uploadFile = async (
    file: string,
    documentType: string
  ): Promise<string> => {
    // Genera el nombre del archivo. Por ejemplo, para DNI:
    const fileName = `archivo${documentType}_${user ? user.uid : 'ErrorUser'}.pdf`;
    // Se arma el path de almacenamiento usando la carpeta correspondiente:
    const path = `DocumentacionPropietarios/${documentType}/${fileName}`;
    const storage = getStorage();
    const storageRef = ref(storage, path);
    console.log("Subiendo archivo a:", path);
    await uploadString(storageRef, file, "data_url");
    return path;
  };

  const handleUpload = async (): Promise<void> => {
    if (!user) {
      console.error("Usuario no autenticado");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No estás autenticado. Por favor, inicia sesión nuevamente.",
      });
      return;
    }

    console.log("ID de usuario autenticado:", user.uid);
    setLoading(true);

    try {
      const uploadedPaths = {
        // Guarda el archivo en la ruta para DNI:
        // "DocumentacionPropietarios/DNI/archivoDNI_<uniqueId>.pdf"
        dni: images.dni ? await uploadFile(images.dni, "DNI") : "",
        // Guarda el archivo en la ruta para VUT:
        // "DocumentacionPropietarios/VUT/archivoVUT_<uniqueId>.pdf"
        vut: images.vut ? await uploadFile(images.vut, "VUT") : "",
        // Guarda el archivo en la ruta para Referencia Catastral:
        // "DocumentacionPropietarios/RefCatastral/archivoRefCatastral_<uniqueId>.pdf"
        referenciaCatastral: images.referenciaCatastral
          ? await uploadFile(images.referenciaCatastral, "RefCatastral")
          : "",
      };

      console.log("Documentos subidos exitosamente.");

      await setDoc(
        doc(db, `propietarios/${user.uid}/proceso_de_alta/distinct_documents`),
        uploadedPaths
      );
      await updateDoc(doc(db, "users", user.uid), {
        processStatus: "contract",
        currentStep: 4,
      });

      Swal.fire({
        icon: "success",
        title: "Documentos subidos exitosamente",
        text: "Puedes proceder al siguiente paso.",
      });
      onAccept();
    } catch (error) {
      console.error("Error al subir documentos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al subir los documentos. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const pdfUrl =
    "https://firebasestorage.googleapis.com/v0/b/software-gloove.appspot.com/o/Documentacion%20obligatoria%2FDocumentacio%CC%81n%20necesaria%20para%20cumplimentacio%CC%81n%20de%20contrato.pdf?alt=media&token=1b8a312e-f7cc-4c02-ba0c-f536a871745c";

  const handleDownloadPdf = (): void => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Documentación_necesaria.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof ImageState
  ): void => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          icon: "error",
          title: "Archivo no válido",
          text: "Solo se permiten archivos PDF",
        });
        return;
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages({
            ...images,
            [type]: reader.result as string,
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg mb-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Documentación Necesaria
        </h2>
        <div className="mb-6">
          <p className="text-gray-600 mb-4 text-center">
            Aquí puedes visualizar y descargar la documentación necesaria para
            cumplimentar el contrato.
          </p>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={`${pdfUrl}#view=FitH`}
              className="w-full h-96 border border-gray-300 rounded-md"
              title="Documentación necesaria"
            />
          </div>
        </div>
        <button
          onClick={handleDownloadPdf}
          className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 mb-8"
        >
          Descargar PDF
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <ClipLoader size={50} color={"#123abc"} loading={loading} />
          </div>
        )}
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Sube tus documentos
        </h2>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p className="font-bold">Importante</p>
          <p>Los documentos deben ser en formato PDF y originales.</p>
        </div>
        {Object.keys(images).map((type) => (
          <div key={type} className="mb-6">
            <h3 className="text-xl font-semibold mb-4 capitalize text-gray-700">
              {type.replace(/_/g, " ")}
            </h3>
            {images[type as keyof ImageState] ? (
              <div className="flex items-center justify-between">
                <div className="d-flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>

                  <p>
                    El archivo fue subido correctamente.
                  </p>
                </div>
                <button
                  onClick={() => setImages({ ...images, [type]: "" })}
                  className="py-2 px-4 text-red-500 border border-red-500 font-semibold rounded-md hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Eliminar
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  accept=".jpeg,.jpg,.png,.pdf"
                  onChange={(e) =>
                    handleFileChange(e, type as keyof ImageState)
                  }
                  className="mb-2"
                />
              </div>
            )}
          </div>
        ))}
        <div className="mt-6">
          <button
            onClick={handleUpload}
            disabled={
              !images.dni ||
              !images.referenciaCatastral ||
              !images.vut ||
              loading
            }
            className={`w-full py-3 px-4 font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${images.dni && images.referenciaCatastral && images.vut && !loading
                ? "bg-primary text-white hover:bg-primary-dark focus:ring-primary"
                : "bg-gray-300 text-gray-800 cursor-not-allowed focus:ring-gray-300"
              }`}
          >
            {loading ? "Subiendo..." : "Subir Documentos"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistinctDocument;
