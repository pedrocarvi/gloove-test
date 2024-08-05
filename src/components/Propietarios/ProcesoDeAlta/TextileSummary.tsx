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
  onAccept: () => void;
  initialValues?: any;
}

interface TextileItem {
  medida: string;
  cantidad: string;
}

const TextileSummary: React.FC<TextileSummaryProps> = ({
  onAccept,
  initialValues = {},
}) => {
  const [formData, setFormData] = useState<any>(initialValues);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [isAccepted, setIsAccepted] = useState(false);
  const { user } = useAuth();

  const prices = {
    fundas_edredon: { pvc: 15.07, pvp: 17.26 },
    alfombrines: { pvc: 2.95, pvp: 3.38 },
    toallas: { pvc: 5.33, pvp: 6.4 }, // Promedio entre 50x100 y 100x150
    sabana_90: { pvc: 4.72, pvp: 5.66 },
    sabana_105: { pvc: 5.07, pvp: 6.08 },
    sabana_135: { pvc: 5.87, pvp: 7.04 },
    sabana_150: { pvc: 6.52, pvp: 7.83 },
    sabana_180: { pvc: 8.42, pvp: 10.11 },
    funda_almohada_95: { pvc: 1.22, pvp: 1.46 },
    relleno_almohada_90: { pvc: 9.99, pvp: 11.99 },
    funda_nordica_90: { pvc: 12.56, pvp: 15.07 },
    funda_nordica_105: { pvc: 14.38, pvp: 17.26 },
    funda_nordica_135: { pvc: 17.72, pvp: 21.26 },
    funda_nordica_150: { pvc: 18.88, pvp: 22.66 },
    funda_nordica_180: { pvc: 21.57, pvp: 25.88 },
    protector_colchon: { pvc: 8.96, pvp: 10.75 },
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const docRef = doc(
          db,
          "propietarios",
          user.uid,
          "proceso_de_alta",
          "textil_presupuesto"
        );
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

    const calculateTotal = (
      category: TextileItem[] | undefined,
      factor: number
    ): number => {
      return (category || []).reduce(
        (sum: number, item: TextileItem) =>
          sum + (parseInt(item.cantidad) || 0) * factor,
        0
      );
    };

    // Ajuste: Verificar si data.toalla está presente
    const newSummary = {
      fundas_edredon: calculateTotal(data.fundaNordica, 2) * num_viviendas,
      alfombrines: calculateTotal(data.alfombrin, 3) * num_viviendas,
      toallas: calculateTotal(data.toalla, 1) * num_viviendas, // No se necesita filtrar ya que se maneja como una sola categoría
      sabana_90:
        calculateTotal(
          data.sabanaEncimera?.filter(
            (item: TextileItem) => item.medida === "90"
          ),
          1
        ) * num_viviendas,
      sabana_105:
        calculateTotal(
          data.sabanaEncimera?.filter(
            (item: TextileItem) => item.medida === "105"
          ),
          1
        ) * num_viviendas,
      sabana_135:
        calculateTotal(
          data.sabanaEncimera?.filter(
            (item: TextileItem) => item.medida === "135"
          ),
          1
        ) * num_viviendas,
      sabana_150:
        calculateTotal(
          data.sabanaEncimera?.filter(
            (item: TextileItem) => item.medida === "150"
          ),
          1
        ) * num_viviendas,
      sabana_180:
        calculateTotal(
          data.sabanaEncimera?.filter(
            (item: TextileItem) => item.medida === "180"
          ),
          1
        ) * num_viviendas,
      funda_almohada_95:
        calculateTotal(
          data.fundaAlmohada?.filter(
            (item: TextileItem) => item.medida === "95"
          ),
          1
        ) * num_viviendas,
      relleno_almohada_90:
        calculateTotal(
          data.rellenoAlmohada?.filter(
            (item: TextileItem) => item.medida === "90"
          ),
          1
        ) * num_viviendas,
      funda_nordica_90:
        calculateTotal(
          data.fundaNordica?.filter(
            (item: TextileItem) => item.medida === "90"
          ),
          1
        ) * num_viviendas,
      funda_nordica_105:
        calculateTotal(
          data.fundaNordica?.filter(
            (item: TextileItem) => item.medida === "105"
          ),
          1
        ) * num_viviendas,
      funda_nordica_135:
        calculateTotal(
          data.fundaNordica?.filter(
            (item: TextileItem) => item.medida === "135"
          ),
          1
        ) * num_viviendas,
      funda_nordica_150:
        calculateTotal(
          data.fundaNordica?.filter(
            (item: TextileItem) => item.medida === "150"
          ),
          1
        ) * num_viviendas,
      funda_nordica_180:
        calculateTotal(
          data.fundaNordica?.filter(
            (item: TextileItem) => item.medida === "180"
          ),
          1
        ) * num_viviendas,
      protector_colchon:
        calculateTotal(data.protectorColchon, 1) * num_viviendas,
    };

    setSummary(newSummary);
    await generateAndUploadPDF(newSummary, user.uid, "pvc");

    const docRef = doc(
      db,
      "propietarios",
      user.uid,
      "proceso_de_alta",
      "textile_summaries"
    );
    await setDoc(docRef, {
      userId: user.uid,
      ...newSummary,
    });

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      currentStep: 3,
    });
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
      total:
        cantidad * (prices[concepto as keyof typeof prices]?.[priceType] || 0),
    }));

    const data: InventoryBudgetData = {
      presupuestoId: `TEXTIL-${userId.substring(0, 6)}`,
      fecha: new Date().toLocaleDateString(),
      iva: 21,
      items,
    };

    const pdfDoc = await generateInventoryBudgetPDF(data);
    const pdfData = pdfDoc.output("datauristring");

    const storage = getStorage();
    const pdfRef = ref(
      storage,
      `Presupuesto Textil/${
        priceType === "pvc" ? "Beneficio" : "textile_summary"
      }_${userId}.pdf`
    );
    await uploadString(pdfRef, pdfData, "data_url");

    if (priceType === "pvc") {
      const benefitData: BenefitData = {
        beneficioId: `BENEFICIO-${userId.substring(0, 6)}`,
        fecha: new Date().toLocaleDateString(),
        items: items.map((item) => ({
          concepto: item.concepto,
          cantidad: item.cantidad,
          pvp: prices[item.concepto as keyof typeof prices]?.pvp || 0,
          pvc: prices[item.concepto as keyof typeof prices]?.pvc || 0,
        })),
      };
      const benefitPDF = await generateBenefitPDF(benefitData);
      const benefitPDFData = benefitPDF.output("datauristring");

      const benefitPDFRef = ref(
        storage,
        `Presupuesto Textil/Beneficio_${userId}.pdf`
      );
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
          total: cantidad * (prices[concepto as keyof typeof prices]?.pvp || 0),
        })),
      });
      const pdfData = pdfDoc.output("datauristring");

      const link = document.createElement("a");
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
        <table className="w-full text-left mb-6">
          <thead>
            <tr>
              <th className="border-b-2 pb-2">Nombre del Producto</th>
              <th className="border-b-2 pb-2">Cantidad</th>
              <th className="border-b-2 pb-2">Precio Unitario</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summary).map(([key, value]) => (
              <tr key={key}>
                <td className="border-b py-2">
                  {key.replace(/_/g, " ").toUpperCase()}
                </td>
                <td className="border-b py-2">{value}</td>
                <td className="border-b py-2">
                  {prices[key as keyof typeof prices]?.pvp.toFixed(2)} €
                </td>
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
