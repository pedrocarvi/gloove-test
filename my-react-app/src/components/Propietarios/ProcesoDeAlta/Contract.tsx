// src/components/Propietarios/ProcesoDeAlta/Contract.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import SignatureCanvas from 'react-signature-canvas';
import { jsPDF } from 'jspdf';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage'; // Asegúrate de importar getDownloadURL


interface ContractProps {
  onNext: () => void;
}

const Contract: React.FC<ContractProps> = ({ onNext }) => {
  const [formData, setFormData] = useState<any>(null);
  const [technicalFormData, setTechnicalFormData] = useState<any>(null);
  const [isSigned, setIsSigned] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const sigCanvas = useRef<SignatureCanvas>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        // Fetch technical form data
        const technicalFormRef = doc(db, 'procesos_de_alta/technical_forms', user.uid);
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
      pdf.text(`Nombre: ${technicalFormData.nombre}`, 10, 20);
      pdf.text(`Dirección: ${technicalFormData.direccion}`, 10, 30);
      pdf.text(`Ciudad: ${technicalFormData.ciudad}`, 10, 40);
      pdf.text(`País: ${technicalFormData.pais}`, 10, 50);
      pdf.text(`Teléfono: ${technicalFormData.telefono}`, 10, 60);
      pdf.text(`Email: ${technicalFormData.email}`, 10, 70);
      // Add more fields as necessary
      pdf.addImage(formData.signature, 'PNG', 10, 80, 50, 50);
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

    const pdfUrl = await getDownloadURL(pdfRef); // Corregir el uso de getDownloadURL

    const docRef = doc(db, 'contracts', `contract_${user.uid}`);
    await setDoc(docRef, { ...formData, pdfUrl });

    await updateDoc(doc(db, 'users', user.uid), {
      processStatus: 'inventory_form',
      currentStep: 4, // Assuming next step is 4
    });

    onNext(); // Mover al siguiente paso usando el prop onNext
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
