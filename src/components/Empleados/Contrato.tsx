import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/firebaseConfig";
import SignatureCanvas from "react-signature-canvas";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import { generateContractPDF } from "@/utils/contractPdfGenerator";

const Contrato: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isSigned, setIsSigned] = useState(false);
  const navigate = useNavigate();
  const sigCanvas = useRef<SignatureCanvas>(null);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const storage = getStorage();
        const pdfRef = ref(storage, `DocumentacionPropietarios/Contratos/contract_${id}.pdf`);
        const url = await getDownloadURL(pdfRef);
        setPdfUrl(url);
      } catch (error) {
        console.error("Error fetching PDF URL:", error);
        console.log("No se encontró el documento del contrato.");
      }
    };

    fetchPdfUrl();
  }, [id]);

  useEffect(() => {
    const fetchFormData = async () => {
      if (!id) return;

      const docRef = doc(db, `propietarios/${id}/proceso_de_alta/technical_form`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      } else {
        console.error(`No se encontró la ficha técnica del propietario ${id}`);
      }
    };

    fetchFormData();
  }, [id]);

  const handleSign = () => {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
      setFormData({ ...formData, signature: dataURL });
      setIsSigned(true);
    }
  };

  const handleSubmit = async () => {
    if (!id || !formData) {
      console.error("Propietario ID o datos del formulario no están disponibles");
      return;
    }

    try {
      const contractData = { ...formData };

      // Generar el PDF del contrato
      const pdfDoc = await generateContractPDF(contractData, contractData.contractText);
      const pdfData = pdfDoc.output("datauristring");

      // Subir el PDF a Firebase Storage
      const pdfRef = ref(storage, `DocumentacionPropietarios/Contratos/contract_${id}.pdf`);
      await uploadString(pdfRef, pdfData, "data_url");

      const pdfUrl = await getDownloadURL(pdfRef);

      // Guardar la referencia del PDF en Firestore
      const docRef = doc(db, `propietarios/${id}/proceso_de_alta/contract`);
      await setDoc(docRef, { ...formData, pdfUrl });

      await updateDoc(doc(db, "users", id), {
        processStatus: "inventory_form",
        currentStep: 5,
      });

      // Descargar el PDF
      const link = document.createElement('a');
      link.href = pdfData;
      link.download = `Contrato_${id}.pdf`;
      link.click();

      Swal.fire({
        icon: "success",
        title: "Contrato enviado y descargado",
        text: "El contrato ha sido guardado y descargado. Puedes proceder al siguiente paso.",
      });
    } catch (error) {
      console.error("Error al generar o guardar el contrato:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al generar o guardar el contrato. Por favor, inténtalo de nuevo.",
      });
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Contrato</h1>
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          className="w-full h-screen border-2 border-gray-300"
          title="Contrato"
        />
      ) : (
        <p>Cargando...</p>
      )}
      <div className="mt-4 flex space-x-2 justify-center">
        {!isSigned && (
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              className: "signature-canvas w-full h-64 border border-gray-300 rounded-md",
            }}
          />
        )}
        <button
          onClick={handleSign}
          className="bg-green-500 text-white py-2 px-4 rounded-md"
        >
          Firmar
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Enviar Contrato
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

export default Contrato;
