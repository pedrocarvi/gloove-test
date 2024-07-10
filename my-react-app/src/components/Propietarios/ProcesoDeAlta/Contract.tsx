import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import SignatureCanvas from "react-signature-canvas";
import { jsPDF } from "jspdf";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import Swal from "sweetalert2";

interface ContractProps {
  onAccept: () => void;
  initialValues?: any;
}

const Contract: React.FC<ContractProps> = ({
  onAccept,
  initialValues = {},
}) => {
  const [formData, setFormData] = useState<any>(initialValues);
  const [technicalFormData, setTechnicalFormData] = useState<any>(null);
  const [isSigned, setIsSigned] = useState(!!initialValues.signature);
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

  const handleSign = () => {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current
        .getTrimmedCanvas()
        .toDataURL("image/png");
      setFormData({ ...formData, signature: dataURL });
      setIsSigned(true);
    }
  };

  const generatePDFContent = (pdf: jsPDF) => {
    if (technicalFormData) {
      pdf.text("Contrato", 10, 10);
      pdf.text(`Nombre: ${technicalFormData.vivienda}`, 10, 20);
      pdf.text(`Dirección: ${technicalFormData.direccion}`, 10, 30);
      // Añadir más campos según sea necesario
      pdf.addImage(formData.signature, "PNG", 10, 40, 50, 50);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    const pdf = new jsPDF();
    generatePDFContent(pdf);
    const pdfData = pdf.output("datauristring");

    const storage = getStorage();
    const pdfRef = ref(
      storage,
      `DocumentacionPropietarios/Contratos/contract_${user.uid}.pdf`
    );
    await uploadString(pdfRef, pdfData, "data_url");

    const pdfUrl = await getDownloadURL(pdfRef);

    const docRef = doc(db, `propietarios/${user.uid}/proceso_de_alta/contract`);
    await setDoc(docRef, { ...formData, pdfUrl });

    await updateDoc(doc(db, "users", user.uid), {
      processStatus: "inventory_form",
      currentStep: 5,
    });

    Swal.fire({
      icon: "success",
      title: "Contrato enviado",
      text: "Puedes proceder al siguiente paso.",
    });
    onAccept();
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
        <p>{/* Aquí va el contenido del contrato */}</p>
        {isSigned && (
          <img
            src={formData?.signature}
            alt="Signature"
            className="my-4 w-48 h-48 object-cover border border-gray-300 rounded-md"
          />
        )}
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            className:
              "signature-canvas w-full h-64 border border-gray-300 rounded-md",
          }}
        />
        <div className="flex justify-between mt-4">
          <button
            onClick={handleSign}
            className="py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            Firmar
          </button>
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
