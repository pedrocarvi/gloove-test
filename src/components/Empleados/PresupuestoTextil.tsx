import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const PresupuestoTextil: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const storage = getStorage();
        const pdfRef = ref(storage, `Presupuesto Textil/textile_summary_${id}.pdf`);
        const url = await getDownloadURL(pdfRef);
        setPdfUrl(url);
      } catch (error) {
        console.error("Error fetching PDF URL:", error);
        console.log("No se encontró el documento del presupuesto textil.");
      }
    };

    fetchPdfUrl();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleGenerateBenefit = () => {
    // Lógica para generar beneficio
  };

  const handleGenerateBudget = () => {
    // Lógica para generar presupuesto
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Presupuesto Textil</h1>
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          className="w-full h-screen border-2 border-gray-300"
          title="Presupuesto Textil"
        />
      ) : (
        <p>Cargando...</p>
      )}
      <div className="mt-4 flex space-x-2 justify-center">
        <button
          onClick={handleGenerateBenefit}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Generar Beneficio
        </button>
        <button
          onClick={handleGenerateBudget}
          className="bg-green-500 text-white py-2 px-4 rounded-md"
        >
          Generar Presupuesto
        </button>
        <button
          onClick={handleBackClick}
          className="bg-gray-500 text-white py-2 px-4 rounded-md"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default PresupuestoTextil;
