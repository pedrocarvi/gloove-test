import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { jsPDF } from "jspdf";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import { generateCorporatePDF } from "@/utils/pdfGenerator";

interface TextileSummaryProps {
  onAccept: () => void;
  initialValues?: any;
}

const TextileSummary: React.FC<TextileSummaryProps> = ({ onAccept, initialValues = {} }) => {
  const [formData, setFormData] = useState<any>(initialValues);
  const [budget, setBudget] = useState<number>(0);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [isAccepted, setIsAccepted] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const docRef = doc(db, "propietarios", user.uid, "proceso_de_alta", "textil_presupuesto");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(data);
          await calculateBudget(data);
        }
      }
    };

    fetchData();
  }, [user]);

  const calculateBudget = async (data: any) => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    const userData = await getUserData(user.uid);
    const num_viviendas = parseInt(userData.num_viviendas || 1);

    const calculateTotal = (category: any[] | undefined, factor: number) => {
      return (category || []).reduce(
        (sum: number, item: any) => sum + parseInt(item.cantidad || 0) * factor,
        0
      );
    };

    const total_sabanas = calculateTotal(data.sabanaEncimera, 6) * num_viviendas;
    const total_fundas_edredon = calculateTotal(data.fundaNordica, 2) * num_viviendas;
    const total_alfombrines = calculateTotal(data.alfombrin, 3) * num_viviendas;
    const total_toallas_grandes = calculateTotal(data.toalla, 3) * num_viviendas;
    const total_toallas_pequenas = calculateTotal(data.toalla, 3) * num_viviendas;
    const total_fundas_almohada = calculateTotal(data.fundaAlmohada, 3) * num_viviendas;

    const newSummary = {
      total_sabanas,
      total_fundas_edredon,
      total_alfombrines,
      total_toallas_grandes,
      total_toallas_pequenas,
      total_fundas_almohada
    };

    setSummary(newSummary);

    const total = calculateTotalCost(newSummary);
    setBudget(total);

    // Generar y subir el PDF a Firebase Storage
    const pdfUrl = await generateAndUploadPDF(newSummary, total, user.uid);

    // Actualizar Firestore con la URL del PDF
    const docRef = doc(db, "propietarios", user.uid, "proceso_de_alta", "textile_summaries");
    await setDoc(docRef, {
      userId: user.uid,
      pdfUrl,
      ...newSummary
    });

    // Actualizar el currentStep del usuario en la colección 'users'
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      currentStep: 3, // Asumiendo que el siguiente paso es el 3
    });
  };

  const calculateTotalCost = (summary: Record<string, number>) => {
    const prices = {
      total_sabanas: 5.66,
      total_fundas_edredon: 15.07,
      total_alfombrines: 2.95,
      total_toallas_grandes: 9.41,
      total_toallas_pequenas: 3.38,
      total_fundas_almohada: 1.46,
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
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : {};
  };

  const generateAndUploadPDF = async (
    summary: Record<string, number>,
    budget: number,
    userId: string
  ) => {
    const doc = await generateCorporatePDF("Resumen de Textil", { ...summary, Total: budget });
    const pdfData = doc.output("datauristring");

    const storage = getStorage();
    const pdfRef = ref(storage, `Presupuesto Textil/textile_summary_${userId}.pdf`);
    await uploadString(pdfRef, pdfData, "data_url");

    const link = document.createElement('a');
    link.href = pdfData;
    link.download = `Resumen_Textil_${userId}.pdf`;
    link.click();

    return await getDownloadURL(pdfRef);
  };

  const handleAccept = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    setIsAccepted(true); // Indicar que el presupuesto ha sido aceptado
    // Actualizar el currentStep del usuario en la colección 'users'
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      currentStep: 3, // Asumiendo que el siguiente paso es el 3
    });
    onAccept();
    Swal.fire({
      icon: "success",
      title: "Presupuesto aceptado",
      text: "Puedes proceder al siguiente paso.",
    });
  };

  const handleChat = () => {
    console.log("Abrir chat para preguntas sobre el presupuesto textil.");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Presupuesto de Textil", 10, 10);

    let y = 20;
    Object.keys(summary).forEach((key) => {
      doc.text(`${key.replace(/_/g, " ")}: ${summary[key]}`, 10, y);
      y += 10;
    });

    doc.text(`Total: $${budget}`, 10, y);
    doc.save("presupuesto_textil.pdf");
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center bg-gray-100 py-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl">
        <h2 className="text-4xl font-bold mb-8 text-primary-dark text-center">
          Resumen de Textil
        </h2>
        <p className="text-lg mb-4">Presupuesto: ${budget}</p>
        <table className="w-full text-left mb-6">
          <thead>
            <tr>
              <th className="border-b-2 pb-2">Nombre del Producto</th>
              <th className="border-b-2 pb-2">Cantidad</th>
              <th className="border-b-2 pb-2">Precio Unitario</th>
              <th className="border-b-2 pb-2">Precio Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(summary).map((key) => (
              <tr key={key}>
                <td className="border-b py-2">{key.replace(/_/g, " ")}</td>
                <td className="border-b py-2">{summary[key]}</td>
                <td className="border-b py-2">
                  $
                  {
                    {
                      total_sabanas: 5.66,
                      total_fundas_edredon: 15.07,
                      total_alfombrines: 2.95,
                      total_toallas_grandes: 9.41,
                      total_toallas_pequenas: 3.38,
                      total_fundas_almohada: 1.46,
                    }[key]
                  }
                </td>
                <td className="border-b py-2">
                  $
                  {
                    {
                      total_sabanas: 5.66 * summary[key],
                      total_fundas_edredon: 15.07 * summary[key],
                      total_alfombrines: 2.95 * summary[key],
                      total_toallas_grandes: 9.41 * summary[key],
                      total_toallas_pequenas: 3.38 * summary[key],
                      total_fundas_almohada: 1.46 * summary[key],
                    }[key]
                  }
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="border-b-2 pb-2">
                Total
              </td>
              <td className="border-b-2 pb-2">${budget}</td>
            </tr>
          </tfoot>
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
