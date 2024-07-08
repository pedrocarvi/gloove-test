// src/components/Propietarios/ProcesoDeAlta/TextileSummary.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { jsPDF } from 'jspdf';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';


const TextileSummary: React.FC = () => {
  const [formData, setFormData] = useState<any>(null);
  const [budget, setBudget] = useState<number>(0);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const docRef = doc(db, 'procesos_de_alta/textil_presupuesto', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
          await calculateBudget(docSnap.data());
        }
      }
    };

    fetchData();
  }, [user]);

  const calculateBudget = async (data: any) => {
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    const userData = await getUserData(user.uid);
    const {
      sabanaEncimera90 = parseInt(data.sabanaEncimera90 || 0),
      sabanaEncimera105 = parseInt(data.sabanaEncimera105 || 0),
      sabanaEncimera150 = parseInt(data.sabanaEncimera150 || 0),
      sabanaEncimera180 = parseInt(data.sabanaEncimera180 || 0),
      fundaAlmohada75 = parseInt(data.fundaAlmohada75 || 0),
      alfombrin = parseInt(data.alfombrin || 0),
      toallaDucha = parseInt(data.toallaDucha || 0),
      num_viviendas = parseInt(userData.num_viviendas || 1),
    } = data;

    const sabanas_por_cama = 6;
    const fundas_edredon_por_cama = 2;
    const alfombrines_por_ducha = 3;
    const toallas_grandes_por_persona = 3;
    const toallas_pequenas_por_persona = 3;
    const fundas_almohada_75 = 3;
    const fundas_almohada_90 = 3;
    const fundas_almohada_105 = 3;
    const fundas_almohada_135 = 3;
    const fundas_almohada_150 = 2 * 3; // 2 fundas multiplicadas por 3

    const total_sabanas = (sabanaEncimera90 + sabanaEncimera105 + sabanaEncimera150 + sabanaEncimera180 + fundaAlmohada75) * sabanas_por_cama * num_viviendas;
    const total_fundas_edredon = (sabanaEncimera90 + sabanaEncimera105 + sabanaEncimera150 + sabanaEncimera180 + fundaAlmohada75) * fundas_edredon_por_cama * num_viviendas;
    const total_alfombrines = alfombrin * alfombrines_por_ducha * num_viviendas;
    const total_toallas_grandes = toallaDucha * toallas_grandes_por_persona * num_viviendas;
    const total_toallas_pequenas = toallaDucha * toallas_pequenas_por_persona * num_viviendas;

    const fundas_75 = sabanaEncimera90 * fundas_almohada_75;
    const fundas_90 = sabanaEncimera105 * fundas_almohada_90;
    const fundas_105 = sabanaEncimera150 * fundas_almohada_105;
    const fundas_135 = sabanaEncimera180 * fundas_almohada_135;
    const fundas_150 = fundaAlmohada75 * fundas_almohada_150;
    const total_fundas_almohada = (fundas_75 + fundas_90 + fundas_105 + fundas_135 + fundas_150) * num_viviendas;

    const newSummary = {
      total_sabanas,
      total_fundas_edredon,
      total_alfombrines,
      total_toallas_grandes,
      total_toallas_pequenas,
      total_fundas_almohada,
    };

    setSummary(newSummary);

    const total = calculateTotalCost(newSummary);
    setBudget(total);

    // Generar y subir el PDF a Firebase Storage
    const pdfUrl = await generateAndUploadPDF(newSummary, total, user.uid);

    // Actualizar Firestore con la URL del PDF
    const docRef = doc(db, 'procesos_de_alta/textile_summaries', user.uid);
    await setDoc(docRef, {
      userId: user.uid,
      pdfUrl,
      ...newSummary,
    });

    // Actualizar el currentStep del usuario en la colección 'users'
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
      currentStep: 3, // Asumiendo que el siguiente paso es el 3
    });
  };

  const calculateTotalCost = (summary: Record<string, number>) => {
    const prices = {
      total_sabanas: 10,
      total_fundas_edredon: 20,
      total_alfombrines: 5,
      total_toallas_grandes: 15,
      total_toallas_pequenas: 10,
      total_fundas_almohada: 7,
    };

    return (
      summary.total_sabanas * prices.total_sabanas +
      summary.total_fundas_edredon * prices.total_fundas_edredon +
      summary.total_alfombrines * prices.total_alfombrines +
      summary.total_toallas_grandes * prices.total_toallas_grandes +
      summary.total_toallas_pequenas * prices.total_toallas_pequenas +
      summary.total_fundas_almohada * prices.total_fundas_almohada
    );
  };

  const getUserData = async (userId: string) => {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : {};
  };

  const generateAndUploadPDF = async (summary: Record<string, number>, budget: number, userId: string) => {
    const doc = new jsPDF();
    doc.text('Presupuesto de Textil', 10, 10);

    let y = 20;
    Object.keys(summary).forEach(key => {
      doc.text(`${key.replace(/_/g, ' ')}: ${summary[key]}`, 10, y);
      y += 10;
    });

    doc.text(`Total: $${budget}`, 10, y);

    const pdfData = doc.output('datauristring');
    const storage = getStorage();
    const pdfRef = ref(storage, `Presupuesto Textil/textile_summary_${userId}.pdf`);
    await uploadString(pdfRef, pdfData, 'data_url');
    return await getDownloadURL(pdfRef);
  };

  const handleAccept = async () => {
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    // Actualizar el currentStep del usuario en la colección 'users'
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
      currentStep: 3, // Asumiendo que el siguiente paso es el 3
    });
    navigate('/distinct_document');
  };

  const handleChat = () => {
    console.log("Abrir chat para preguntas sobre el presupuesto textil.");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Presupuesto de Textil', 10, 10);

    let y = 20;
    Object.keys(summary).forEach(key => {
      doc.text(`${key.replace(/_/g, ' ')}: ${summary[key]}`, 10, y);
      y += 10;
    });

    doc.text(`Total: $${budget}`, 10, y);
    doc.save('presupuesto_textil.pdf');
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="summary-container">
      <h2 className="text-4xl font-bold mb-8 text-primary-dark text-center">Resumen de Textil</h2>
      <p className="text-lg mb-4">Presupuesto: ${budget}</p>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Nombre del Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Precio Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(summary).map(key => (
            <tr key={key}>
              <td>{key.replace(/_/g, ' ')}</td>
              <td>{summary[key]}</td>
              <td>${
                {
                  total_sabanas: 10,
                  total_fundas_edredon: 20,
                  total_alfombrines: 5,
                  total_toallas_grandes: 15,
                  total_toallas_pequenas: 10,
                  total_fundas_almohada: 7,
                }[key]
              }</td>
              <td>${
                {
                  total_sabanas: 10 * summary[key],
                  total_fundas_edredon: 20 * summary[key],
                  total_alfombrines: 5 * summary[key],
                  total_toallas_grandes: 15 * summary[key],
                  total_toallas_pequenas: 10 * summary[key],
                  total_fundas_almohada: 7 * summary[key],
                }[key]
              }</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>Total</td>
            <td>${budget}</td>
          </tr>
        </tfoot>
      </table>
      <div className="button-group">
        <button onClick={handleAccept} className="form-button">Aceptar</button>
        <button onClick={handleChat} className="form-button">Preguntar sobre el presupuesto</button>
        <button onClick={handleDownloadPDF} className="form-button">Descargar PDF</button>
      </div>
    </div>
  );
};

export default TextileSummary;
