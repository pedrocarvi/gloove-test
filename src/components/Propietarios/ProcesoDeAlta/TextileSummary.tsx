import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import Swal from "sweetalert2";
import {
  generateInventoryBudgetPDF,
  InventoryBudgetData,
} from "@/utils/inventoryBudgetGenerator";
import { generateBenefitPDF, BenefitData } from "@/utils/benefitGenerator";

interface TextileSummaryProps {
  initialValues: {
    toallasGrandes: number;
    toallasPequenas: number;
    sabanas: number;
    sabanas90: number;
    sabanas105: number;
    sabanas135: number;
    sabanas150: number;
    sabanas180: number;
    sabanas200: number;
    alfombrines: number;
    fundasAlmohadaCamas150: number;
    fundasAlmohadaOtrasCamas: number;
    totalFundasAlmohada: number;
    fundasNordico: number;
  };
  step1Data: {
    camas90: number;
    camas105: number;
    camas135: number;
    camas150: number;
    camas180: number;
    camas200: number;
    banos: number;
    aseos: number;
    capacidadMaxima: number;
    propietario: string;
    dni: string;
    direccion: string;
  }
  onAccept: () => void;
}

const TextileSummary: React.FC<TextileSummaryProps> = ({
  onAccept,
  step1Data,
  initialValues,
}) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const { user } = useAuth();

  const prices = {
    toallasGrandes: 5.0,
    toallasPequenas: 3.0,
    sabanas: 15.0,
    alfombrines: 4.0,
    fundasAlmohadaCamas150: 10.0,
    fundasAlmohadaOtrasCamas: 8.0,
    totalFundasAlmohada: 9.0,
    fundasNordico: 20.0,
  };

  const itemLabels: { [key: string]: string } = {
    toallasGrandes: "Toallas baño",
    toallasPequenas: "Toallas lavabo",
    sabanas: "Sábanas",
    sabanas90: "Sábanas 90",
    sabanas105: "Sábanas 105",
    sabanas135: "Sábanas 135",
    sabanas150: "Sábanas 150",
    sabanas180: "Sábanas 180",
    sabanas200: "Sábanas 200",
    alfombrines: "Alfombrines",
    fundasAlmohadaCamas150: "Fundas de Almohada (Camas 150 cm)",
    fundasAlmohadaOtrasCamas: "Fundas de Almohada (Otras Camas)",
    totalFundasAlmohada: "Total de Fundas de Almohada",
    fundasNordico: "Fundas Nórdicas",
  };

  const handleAccept = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    setIsAccepted(true);
    Swal.fire({
      icon: "success",
      title: "Presupuesto aceptado",
      text: "Puedes proceder al siguiente paso.",
    });
    onAccept();
  };

  const handleChat = () => {
    console.log("Abrir chat para preguntas sobre el presupuesto textil.");
  };

  const handleDownloadPDF = async () => {
    console.log("Generar y descargar el PDF del resumen textil.");

    // if (user) {
    //   const pdfDoc = await generateInventoryBudgetPDF({
    //     presupuestoId: `TEXTIL-${user.uid.substring(0, 6)}`,
    //     fecha: new Date().toLocaleDateString(),
    //     iva: 21,
    //     items: Object.entries(summary).map(([concepto, cantidad]) => ({
    //       concepto,
    //       cantidad,
    //       total: cantidad * (prices[concepto as keyof typeof prices]?.pvp || 0),
    //     })),
    //   });
    //   const pdfData = pdfDoc.output("datauristring");

    //   const link = document.createElement("a");
    //   link.href = pdfData;
    //   link.download = `Resumen_Textil_${user.uid}.pdf`;
    //   link.click();
    // }
  };

  // if (!formData) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="flex items-center justify-center bg-gray-100 py-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl">
        <h2 className="text-4xl font-bold mb-8 text-primary-dark text-center">
          Resumen de Textil
        </h2>
        <p> Propietario: {step1Data.propietario}</p>
        <p> Dirección: {step1Data.direccion}</p>
        <p> DNI: {step1Data.dni} </p>
        <table className="w-full text-left mb-6">
          <thead>
            <tr>
              <th className="border-b-2 pb-2">Nombre del Producto</th>
              <th className="border-b-2 pb-2">Cantidad</th>
              <th className="border-b-2 pb-2">Precio Unitario</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(initialValues).map(([key, value]) => (
              <tr key={key}>
                <td className="border-b py-2">{itemLabels[key]}</td>                
                <td className="border-b py-2">{value}</td>
                <td className="border-b py-2">{prices[key as keyof typeof prices]} €</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            onClick={handleAccept}
            className={`py-2 px-4 rounded-md transition ${
              isAccepted
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Aceptar
          </button>
          <button
            onClick={handleChat}
            className="py-2 px-4 bg-secondary text-white font-semibold rounded-md shadow-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
          >
            Preguntar sobre el presupuesto
          </button>
          <button
            onClick={handleDownloadPDF}
            className="py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextileSummary;
