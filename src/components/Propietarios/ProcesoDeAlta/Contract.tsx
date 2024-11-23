import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import SignatureCanvas from "react-signature-canvas";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import Swal from "sweetalert2";
// import { generateContractPDF } from "@/utils/contractPdfGenerator";
import jsPDF from "jspdf";
import PDFObject from 'pdfobject';
import GlooveLogo from '../../../assets/gloove-pdf-logo.jpg'
import { generateContractPDF } from "./ContractPdf";

type TextileData = {
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

type Step1Data = {
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
};

interface ContractProps {
  onAccept: () => void;
  initialValues?: any;
  textileData: TextileData;
  step1Data: Step1Data;
}

const Contract: React.FC<ContractProps> = ({
  onAccept,
  initialValues = {},
  textileData, 
  step1Data
}) => {
  const [formData, setFormData] = useState<any>(initialValues);
  const [technicalFormData, setTechnicalFormData] = useState<any>(null);
  const [isSigned, setIsSigned] = useState(!!initialValues.signature);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const { user } = useAuth();
  const sigCanvas = useRef<SignatureCanvas>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const technicalFormRef = doc(
          db,
          `propietarios/${user.uid}/proceso_de_alta/technical_form`
        );
        const technicalFormSnap = await getDoc(technicalFormRef);
        if (technicalFormSnap.exists()) {
          setTechnicalFormData(technicalFormSnap.data());
        }
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (technicalFormData) {
      const generatePDF = (textileData: TextileData, step1Data: Step1Data) => {
      // Generar el PDF
      const pdfDoc = new jsPDF();
      // Solo llamar a tu lógica deseada, sin duplicar funciones que pasen datos indebidamente.
      pdfDoc.addImage(GlooveLogo, "PNG", 10, 10, 50, 20);

      // Asegúrate de que el texto deseado sea añadido correctamente aquí.
      pdfDoc.setFont("Helvetica", "bold");
      pdfDoc.setFontSize(20);
      pdfDoc.text("CONTRATO DE SERVICIO", 105, 50, { align: "center" });

      // Validar si hay pie de página que quieras incluir. Asegúrate de que está después de los datos que necesitas.
      pdfDoc.setFont("Helvetica", "normal");
      pdfDoc.setFontSize(12);
      pdfDoc.text(`En Elche a [FECHA] de 2024`, 105, 280, { align: "center" });

        const pdfDataUri = pdfDoc.output("datauristring");
        setPdfUrl(pdfDataUri);

        PDFObject.embed(pdfDataUri, "#pdf-viewer");
      };

      generatePDF(textileData, step1Data);
    }
  }, [technicalFormData, textileData, step1Data]);

  const handleSign = () => {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current
        .getTrimmedCanvas()
        .toDataURL("image/png");
      setFormData({ ...formData, signature: dataURL });
      setIsSigned(true);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
  
    try {
      const contractData = {
        propietario: technicalFormData.propietario,
        dni: technicalFormData.dni,
        domicilio: `${technicalFormData.direccion}, ${technicalFormData.cPostal}, ${technicalFormData.ciudad}, ${technicalFormData.provincia}`,
        ciudad: technicalFormData.ciudad,
        direccion: technicalFormData.direccion,
        numCatastro: technicalFormData.numCatastro,
        numeroVUT: technicalFormData.numeroVUT,
        email: technicalFormData.email,
        signature: formData.signature,
      };
  
      // Generar el PDF
      const pdfDoc = new jsPDF();
      // Solo llamar a tu lógica deseada, sin duplicar funciones que pasen datos indebidamente.
      pdfDoc.addImage('gloove-pdf-logo.jpg', "PNG", 10, 10, 50, 20);

      // Asegúrate de que el texto deseado sea añadido correctamente aquí.
      pdfDoc.setFont("Helvetica", "bold");
      pdfDoc.setFontSize(20);
      pdfDoc.text("CONTRATO DE SERVICIO", 105, 50, { align: "center" });

      // Validar si hay pie de página que quieras incluir. Asegúrate de que está después de los datos que necesitas.
      pdfDoc.setFont("Helvetica", "normal");
      pdfDoc.setFontSize(12);
      pdfDoc.text(`En Elche a [FECHA] de 2024`, 105, 280, { align: "center" });
  
      // Convertir PDF a DataURL
      const pdfData = pdfDoc.output("datauristring");
  
      // Subir el PDF a Firebase Storage
      const storage = getStorage();
      const pdfRef = ref(
        storage,
        `DocumentacionPropietarios/Contratos/contract_${user.uid}.pdf`
      );
      await uploadString(pdfRef, pdfData, "data_url");
  
      const pdfUrl = await getDownloadURL(pdfRef);
  
      // Guardar la referencia del PDF en Firestore
      const docRef = doc(
        db,
        `propietarios/${user.uid}/proceso_de_alta/contract`
      );
      await setDoc(docRef, { ...formData, pdfUrl });
  
      await updateDoc(doc(db, "users", user.uid), {
        processStatus: "inventory_form",
        currentStep: 5,
      });
  
      Swal.fire({
        icon: "success",
        title: "Contrato guardado",
        text: "El contrato ha sido guardado. Puedes proceder al siguiente paso.",
      });
      onAccept();
    } catch (error) {
      console.error("Error al generar o guardar el contrato:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al generar o guardar el contrato. Por favor, inténtalo de nuevo.",
      });
    }
  };

  if (!technicalFormData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
        <h2 className="text-4xl font-bold mb-8 text-primary-dark text-center">
          Contrato
        </h2>
        <div id="pdf-viewer" className="h-[500px] mb-4"></div>
        {isSigned && (
          <img
            src={formData?.signature}
            alt="Signature"
            className="my-4 w-48 h-48 object-cover border border-gray-300 rounded-md"
          />
        )}
        {!isSigned && (
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              className:
                "signature-canvas w-full h-64 border border-gray-300 rounded-md",
            }}
          />
        )}
        <div className="flex justify-between mt-4">
          {!isSigned && (
            <button
              onClick={handleSign}
              className="py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Firmar
            </button>
          )}
          {isSigned && (
            <button
              onClick={handleSubmit}
              className="py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Enviar Contrato
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contract;
