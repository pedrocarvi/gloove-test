import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import { generateInventoryBudgetPDF, InventoryBudgetData } from '@/utils/inventoryBudgetGenerator';
import { generateBenefitPDF, BenefitData } from '@/utils/benefitGenerator';

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

  const prices = {
    total_sabanas: { pvc: 5.66, pvp: 7.84 },
    total_fundas_edredon: { pvc: 15.07, pvp: 17.26 },
    total_alfombrines: { pvc: 2.95, pvp: 3.38 },
    total_toallas_grandes: { pvc: 9.41, pvp: 10.60 },
    total_toallas_pequenas: { pvc: 3.38, pvp: 2.82 },
    total_fundas_almohada: { pvc: 1.46, pvp: 1.22 },
    // Añadir todos los precios restantes aquí
    toalla_ducha: { pvc: 7.84, pvp: 9.41 },
    toalla_lavabo: { pvc: 2.82, pvp: 3.38 },
    alfombrin: { pvc: 2.46, pvp: 2.95 },
    sabana_90x200: { pvc: 4.72, pvp: 5.66 },
    sabana_105: { pvc: 5.07, pvp: 6.08 },
    sabana_150x200: { pvc: 6.89, pvp: 8.27 },
    sabana_180x200: { pvc: 10.20, pvp: 12.24 },
    funda_almohada_45x95: { pvc: 1.22, pvp: 1.46 },
    funda_almohada_45x110: { pvc: 1.38, pvp: 1.66 },
    relleno_almohada_45x75: { pvc: 8.83, pvp: 10.60 },
    relleno_almohada_45x90: { pvc: 9.99, pvp: 11.99 },
    relleno_almohada_45x105: { pvc: 12.24, pvp: 14.69 },
    relleno_almohada_45x135: { pvc: 15.76, pvp: 18.91 },
    funda_nordica_90: { pvc: 12.56, pvp: 15.07 },
    funda_nordica_105: { pvc: 14.38, pvp: 17.26 },
    funda_nordica_135: { pvc: 17.72, pvp: 21.26 },
    funda_nordica_150: { pvc: 18.88, pvp: 22.66 },
    funda_nordica_180: { pvc: 21.57, pvp: 25.88 },
    funda_nordica_200: { pvc: 21.73, pvp: 26.08 },
    relleno_nordico_90: { pvc: 18.09, pvp: 21.71 },
    relleno_nordico_105: { pvc: 19.87, pvp: 23.84 },
    relleno_nordico_135: { pvc: 26.06, pvp: 31.27 },
    relleno_nordico_150: { pvc: 27.89, pvp: 33.47 },
    relleno_nordico_180: { pvc: 29.54, pvp: 35.45 },
    relleno_nordico_200: { pvc: 32.94, pvp: 39.53 },
    relleno_nordico_90_alt: { pvc: 14.46, pvp: 17.35 },
    relleno_nordico_105_alt: { pvc: 12.62, pvp: 15.14 },
    relleno_nordico_135_alt: { pvc: 11.63, pvp: 13.96 },
    relleno_nordico_150_alt: { pvc: 10.98, pvp: 13.18 },
    relleno_nordico_180_alt: { pvc: 9.86, pvp: 11.83 },
    relleno_nordico_200_alt: { pvc: 9.19, pvp: 11.03 },
    protector_colchon: { pvc: 8.96, pvp: 10.75 },
  };

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

    const newSummary = {
      total_sabanas: calculateTotal(data.sabanaEncimera, 6) * num_viviendas,
      total_fundas_edredon: calculateTotal(data.fundaNordica, 2) * num_viviendas,
      total_alfombrines: calculateTotal(data.alfombrin, 3) * num_viviendas,
      total_toallas_grandes: calculateTotal(data.toalla, 3) * num_viviendas,
      total_toallas_pequenas: calculateTotal(data.toalla, 3) * num_viviendas,
      total_fundas_almohada: calculateTotal(data.fundaAlmohada, 3) * num_viviendas,
      // Añadir todos los cálculos restantes aquí
      toalla_ducha: calculateTotal(data.toallaDucha, 1) * num_viviendas,
      toalla_lavabo: calculateTotal(data.toallaLavabo, 1) * num_viviendas,
      alfombrin: calculateTotal(data.alfombrin, 1) * num_viviendas,
      sabana_90x200: calculateTotal(data.sabana90x200, 1) * num_viviendas,
      sabana_105: calculateTotal(data.sabana105, 1) * num_viviendas,
      sabana_150x200: calculateTotal(data.sabana150x200, 1) * num_viviendas,
      sabana_180x200: calculateTotal(data.sabana180x200, 1) * num_viviendas,
      funda_almohada_45x95: calculateTotal(data.fundaAlmohada45x95, 1) * num_viviendas,
      funda_almohada_45x110: calculateTotal(data.fundaAlmohada45x110, 1) * num_viviendas,
      relleno_almohada_45x75: calculateTotal(data.rellenoAlmohada45x75, 1) * num_viviendas,
      relleno_almohada_45x90: calculateTotal(data.rellenoAlmohada45x90, 1) * num_viviendas,
      relleno_almohada_45x105: calculateTotal(data.rellenoAlmohada45x105, 1) * num_viviendas,
      relleno_almohada_45x135: calculateTotal(data.rellenoAlmohada45x135, 1) * num_viviendas,
      funda_nordica_90: calculateTotal(data.fundaNordica90, 1) * num_viviendas,
      funda_nordica_105: calculateTotal(data.fundaNordica105, 1) * num_viviendas,
      funda_nordica_135: calculateTotal(data.fundaNordica135, 1) * num_viviendas,
      funda_nordica_150: calculateTotal(data.fundaNordica150, 1) * num_viviendas,
      funda_nordica_180: calculateTotal(data.fundaNordica180, 1) * num_viviendas,
      funda_nordica_200: calculateTotal(data.fundaNordica200, 1) * num_viviendas,
      relleno_nordico_90: calculateTotal(data.rellenoNordico90, 1) * num_viviendas,
      relleno_nordico_105: calculateTotal(data.rellenoNordico105, 1) * num_viviendas,
      relleno_nordico_135: calculateTotal(data.rellenoNordico135, 1) * num_viviendas,
      relleno_nordico_150: calculateTotal(data.rellenoNordico150, 1) * num_viviendas,
      relleno_nordico_180: calculateTotal(data.rellenoNordico180, 1) * num_viviendas,
      relleno_nordico_200: calculateTotal(data.rellenoNordico200, 1) * num_viviendas,
      relleno_nordico_90_alt: calculateTotal(data.rellenoNordico90Alt, 1) * num_viviendas,
      relleno_nordico_105_alt: calculateTotal(data.rellenoNordico105Alt, 1) * num_viviendas,
      relleno_nordico_135_alt: calculateTotal(data.rellenoNordico135Alt, 1) * num_viviendas,
      relleno_nordico_150_alt: calculateTotal(data.rellenoNordico150Alt, 1) * num_viviendas,
      relleno_nordico_180_alt: calculateTotal(data.rellenoNordico180Alt, 1) * num_viviendas,
      relleno_nordico_200_alt: calculateTotal(data.rellenoNordico200Alt, 1) * num_viviendas,
      protector_colchon: calculateTotal(data.protectorColchon, 1) * num_viviendas,
    };

    setSummary(newSummary);

    const total = calculateTotalCost(newSummary, "pvp");
    setBudget(total);

    await generateAndUploadPDF(newSummary, user.uid, "pvc");

    const docRef = doc(db, "propietarios", user.uid, "proceso_de_alta", "textile_summaries");
    await setDoc(docRef, {
      userId: user.uid,
      ...newSummary
    });

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      currentStep: 3,
    });
  };

  const calculateTotalCost = (summary: Record<string, number>, priceType: "pvc" | "pvp") => {
    return Object.entries(summary).reduce((total, [key, value]) => {
      return total + (prices[key as keyof typeof prices]?.[priceType] || 0) * value;
    }, 0);
  };

  const getUserData = async (userId: string) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : {};
  };

  const generateAndUploadPDF = async (
    summary: Record<string, number>,
    userId: string,
    priceType: "pvc" | "pvp"
  ) => {
    const items = Object.entries(summary).map(([concepto, cantidad]) => ({
      concepto,
      cantidad,
      total: cantidad * (prices[concepto as keyof typeof prices]?.[priceType] || 0)
    }));

    const data: InventoryBudgetData = {
      presupuestoId: `TEXTIL-${userId.substring(0, 6)}`,
      fecha: new Date().toLocaleDateString(),
      iva: 21,
      items
    };

    const pdfDoc = await generateInventoryBudgetPDF(data);
    const pdfData = pdfDoc.output("datauristring");

    const storage = getStorage();
  const pdfRef = ref(storage, `Presupuesto Textil/${priceType === "pvc" ? "Beneficio" : "textile_summary"}_${userId}.pdf`);
  await uploadString(pdfRef, pdfData, "data_url");

  if (priceType === "pvc") {
    const benefitData: BenefitData = {
      beneficioId: `BENEFICIO-${userId.substring(0, 6)}`,
      fecha: new Date().toLocaleDateString(),
      items: items.map(item => ({
        concepto: item.concepto,
        cantidad: item.cantidad,
        pvp: prices[item.concepto as keyof typeof prices]?.pvp || 0,
        pvc: prices[item.concepto as keyof typeof prices]?.pvc || 0
      }))
    };
    const benefitPDF = await generateBenefitPDF(benefitData);
    const benefitPDFData = benefitPDF.output("datauristring");

    const benefitPDFRef = ref(storage, `Presupuesto Textil/Beneficio_${userId}.pdf`);
    await uploadString(benefitPDFRef, benefitPDFData, "data_url");
  }

  return await getDownloadURL(pdfRef);
};

  const handleAccept = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    setIsAccepted(true);
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      currentStep: 3,
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

  const handleDownloadPDF = async () => {
    if (user) {
      const pdfDoc = await generateInventoryBudgetPDF({ 
        presupuestoId: `TEXTIL-${user.uid.substring(0, 6)}`,
        fecha: new Date().toLocaleDateString(),
        iva: 21,
        items: Object.entries(summary).map(([concepto, cantidad]) => ({
          concepto,
          cantidad,
          total: cantidad * (prices[concepto as keyof typeof prices]?.pvp || 0)
        }))
      });
      const pdfData = pdfDoc.output("datauristring");

      const link = document.createElement('a');
      link.href = pdfData;
      link.download = `Resumen_Textil_${user.uid}.pdf`;
      link.click();
    }
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
        <p className="text-lg mb-4">Presupuesto: {budget.toFixed(2)} €</p>
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
            {Object.entries(summary).map(([key, value]) => (
              <tr key={key}>
                <td className="border-b py-2">{key.replace(/_/g, " ")}</td>
                <td className="border-b py-2">{value}</td>
                <td className="border-b py-2">
                  {prices[key as keyof typeof prices]?.pvp.toFixed(2)} €
                </td>
                <td className="border-b py-2">
                  {(prices[key as keyof typeof prices]?.pvp * value).toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="border-b-2 pb-2 font-bold">
                Total
              </td>
              <td className="border-b-2 pb-2 font-bold">{budget.toFixed(2)} €</td>
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

