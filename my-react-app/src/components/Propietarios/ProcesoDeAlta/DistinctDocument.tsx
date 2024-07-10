import React, { useState, useRef } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import Webcam from "react-webcam";
import { getStorage, ref, uploadString } from "firebase/storage";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

interface ImageState {
  dni: string;
  referenciaCatastral: string;
  vut: string;
}

interface WebcamState {
  dni: boolean;
  referenciaCatastral: boolean;
  vut: boolean;
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
  const [showWebcam, setShowWebcam] = useState<WebcamState>({
    dni: false,
    referenciaCatastral: false,
    vut: false,
  });
  const webcamRefs = {
    dni: useRef<Webcam>(null),
    referenciaCatastral: useRef<Webcam>(null),
    vut: useRef<Webcam>(null),
  };
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCapture = (type: keyof ImageState) => {
    const imageSrc = webcamRefs[type].current?.getScreenshot();
    if (imageSrc) {
      setImages({ ...images, [type]: imageSrc });
      setShowWebcam({ ...showWebcam, [type]: false });
    }
  };

  const handleUpload = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    const storage = getStorage();

    const uploadFile = async (file: string, path: string) => {
      const storageRef = ref(storage, path);
      await uploadString(storageRef, file, "data_url");
    };

    if (images.dni) {
      await uploadFile(
        images.dni,
        `DocumentacionPropietarios/DNI/dni_${user.uid}.jpg`
      );
    }
    if (images.vut) {
      await uploadFile(
        images.vut,
        `DocumentacionPropietarios/VUT/vut_${user.uid}.jpg`
      );
    }
    if (images.referenciaCatastral) {
      await uploadFile(
        images.referenciaCatastral,
        `DocumentacionPropietarios/RefCatastral/refCatastral_${user.uid}.jpg`
      );
    }

    await setDoc(
      doc(db, `propietarios/${user.uid}/proceso_de_alta/distinct_documents`),
      images
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
  };

  const pdfUrl = "https://firebasestorage.googleapis.com/v0/b/software-gloove.appspot.com/o/Documentacion%20obligatoria%2FDocumentacio%CC%81n%20necesaria%20para%20cumplimentacio%CC%81n%20de%20contrato.pdf?alt=media&token=1b8a312e-f7cc-4c02-ba0c-f536a871745c";

  const handleDownloadPdf = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Documentación_necesaria.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Sube tus documentos
        </h2>
        {Object.keys(images).map((type) => (
          <div key={type} className="mb-4">
            <h3 className="text-lg font-semibold mb-2 capitalize">
              {type.replace(/_/g, " ")}
            </h3>
            {images[type as keyof ImageState] ? (
              <div className="flex flex-col items-center">
                <img
                  src={images[type as keyof ImageState]}
                  alt={`${type} document`}
                  className="w-32 h-32 object-cover mb-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={() => setImages({ ...images, [type]: "" })}
                  className="py-1 px-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Eliminar
                </button>
              </div>
            ) : showWebcam[type as keyof ImageState] ? (
              <div className="flex flex-col items-center">
                <Webcam
                  audio={false}
                  ref={webcamRefs[type as keyof ImageState]}
                  screenshotFormat="image/jpeg"
                  className="w-32 h-32 mb-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={() => handleCapture(type as keyof ImageState)}
                  className="py-1 px-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Capturar
                </button>
                <button
                  onClick={() =>
                    setShowWebcam({ ...showWebcam, [type]: false })
                  }
                  className="mt-2 py-1 px-2 bg-gray-300 text-gray-800 font-semibold rounded-md shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImages({
                          ...images,
                          [type]: reader.result as string,
                        });
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                  className="mb-2"
                />
                <button
                  onClick={() => setShowWebcam({ ...showWebcam, [type]: true })}
                  className="py-1 px-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                >
                  Tomar Foto
                </button>
              </div>
            )}
          </div>
        ))}
        <div className="mt-4">
          <button
            onClick={handleUpload}
            disabled={!images.dni || !images.referenciaCatastral || !images.vut}
            className={`w-full py-2 px-4 font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              images.dni && images.referenciaCatastral && images.vut
                ? "bg-primary text-white hover:bg-primary-dark focus:ring-primary"
                : "bg-gray-300 text-gray-800 cursor-not-allowed focus:ring-gray-300"
            }`}
          >
            Subir Documentos
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Documentación Necesaria
        </h2>
        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            Aquí puedes visualizar y descargar la documentación necesaria para cumplimentar el contrato.
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
          className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          Descargar PDF
        </button>
      </div>
    </div>
  );
};

export default DistinctDocument;

