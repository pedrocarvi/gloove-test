import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { jsPDF } from "jspdf";

interface TextileSummaryProps {
  onNext: () => void;
}

const TextileSummary: React.FC<TextileSummaryProps> = ({ onNext }) => {
  const [textileData, setTextileData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const docRef = doc(db, "textile_forms", "documentId");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTextileData(docSnap.data());
      }
    };
    fetchData();
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Resumen Textil", 10, 10);
    // Lógica para añadir contenido al PDF
    doc.save("resumen_textil.pdf");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-primary">Resumen Textil</h2>
      <p className="text-gray-700">Contenido del resumen textil...</p>
      <button
        onClick={handleDownloadPDF}
        className="bg-primary text-white py-2 px-4 rounded-md transition hover:bg-primary-dark"
      >
        Descargar PDF
      </button>
      <button
        onClick={onNext}
        className="bg-primary text-white py-2 px-4 rounded-md transition hover:bg-primary-dark"
      >
        Siguiente
      </button>
    </div>
  );
};

export default TextileSummary;
