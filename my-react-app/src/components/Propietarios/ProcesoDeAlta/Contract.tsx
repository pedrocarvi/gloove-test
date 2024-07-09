import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import SignatureCanvas from 'react-signature-canvas';
import { jsPDF } from 'jspdf';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

interface ContractProps {
  onNext: () => void;
}

const Contract: React.FC<ContractProps> = ({ onNext }) => {
  const [formData, setFormData] = useState<any>(null);
  const [technicalFormData, setTechnicalFormData] = useState<any>(null);
  const [isSigned, setIsSigned] = useState(false);
  const { user } = useAuth();
  const sigCanvas = useRef<SignatureCanvas>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const technicalFormRef = doc(db, `propietarios/${user.uid}/proceso_de_alta/technical_form`);
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
      const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      setFormData({ ...formData, signature: dataURL });
      setIsSigned(true);
    }
  };

  const generatePDFContent = (pdf: jsPDF) => {
    if (technicalFormData) {
      pdf.text('Contrato', 10, 10);
      pdf.text(`Nombre: ${technicalFormData.vivienda}`, 10, 20);
      pdf.text(`Dirección: ${technicalFormData.direccion}`, 10, 30);
      // Añadir más campos según sea necesario
      pdf.addImage(formData.signature, 'PNG', 10, 40, 50, 50);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    const pdf = new jsPDF();
    generatePDFContent(pdf);
    const pdfData = pdf.output('datauristring');

    const storage = getStorage();
    const pdfRef = ref(storage, `DocumentacionPropietarios/Contratos/contract_${user.uid}.pdf`);
    await uploadString(pdfRef, pdfData, 'data_url');

    const pdfUrl = await getDownloadURL(pdfRef);

    const docRef = doc(db, `propietarios/${user.uid}/proceso_de_alta/contract`);
    await setDoc(docRef, { ...formData, pdfUrl });

    await updateDoc(doc(db, 'users', user.uid), {
      processStatus: 'inventory_form',
      currentStep: 5,
    });

    onNext();
    navigate("/inventory_form"); // Move to the next step
  };

  if (!technicalFormData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="contract-container">
      <h2 className="text-4xl font-bold mb-8 text-primary-dark text-center">Contrato</h2>
      <p>{/* Aquí va el contenido del contrato */}</p>
      {isSigned && <img src={formData?.signature} alt="Signature" />}
      <SignatureCanvas ref={sigCanvas} canvasProps={{ className: 'signature-canvas' }} />
      <div className="button-group">
        <button onClick={handleSign} className="form-button">Firmar</button>
        {isSigned && <button onClick={handleSubmit} className="form-button">Enviar Contrato</button>}
      </div>
    </div>
  );
};

export default Contract;

