import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/firebaseConfig";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
import Swal from "sweetalert2";
import { generateFacturaPDF, FacturaData } from "@/utils/facturaGenerator";
import { sendEmail } from "@/utils/emailService";

// Definición de precios (asegúrate de que esto coincida con la estructura en TextileSummary)
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

const PresupuestoTextil: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [presupuestoUrl, setPresupuestoUrl] = useState<string | null>(null);
  const [beneficioUrl, setBeneficioUrl] = useState<string | null>(null);
  const [facturaUrl, setFacturaUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "presupuesto" | "beneficio" | "factura"
  >("presupuesto");
  const [emails, setEmails] = useState<string[]>([""]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchPdfUrls();
    }
  }, [id]);

  const fetchPdfUrls = async () => {
    if (!id) return;
    try {
      const storage = getStorage();
      // console.log("ID DEL USER ID ", id)
      const presupuestoRef = ref(
        storage,
        `DocumentacionPropietarios/PresupuestoTextil/presupuestoTextil_${id}.pdf`
      );
      // const beneficioRef = ref(
      //   storage,
      //   `Presupuesto Textil/Beneficio_${id}.pdf`
      // );
      // const facturaRef = ref(storage, `Presupuesto Textil/Factura_${id}.pdf`);

      const presupuestoUrl = await getDownloadURL(presupuestoRef);
      setPresupuestoUrl(presupuestoUrl);

      // try {
      //   const beneficioUrl = await getDownloadURL(beneficioRef);
      //   setBeneficioUrl(beneficioUrl);
      // } catch (error) {
      //   console.log("Beneficio aún no generado");
      // }

      // try {
      //   const facturaUrl = await getDownloadURL(facturaRef);
      //   setFacturaUrl(facturaUrl);
      // } catch (error) {
      //   console.log("Factura aún no generada");
      // }
    } catch (error) {
      console.error("Error fetching PDF URLs:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los documentos. Por favor, inténtalo de nuevo.",
      });
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAccept = async () => {
    if (!id) return;
    try {
      const userDocRef = doc(db, "users", id);
      await updateDoc(userDocRef, {
        presupuestoTextilActioned: true,
      });
      Swal.fire({
        icon: "success",
        title: "Presupuesto aceptado",
        text: "El presupuesto ha sido aceptado exitosamente.",
      });
      navigate(-1);
    } catch (error) {
      console.error("Error al aceptar el presupuesto:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al aceptar el presupuesto. Por favor, inténtalo de nuevo.",
      });
    }
  };

  const handleGenerateBeneficio = async () => {
    // Lógica para generar el beneficio
    // Después de generarlo, actualizar beneficioUrl y refrescar la vista
    await fetchPdfUrls();
  };

  const handleGenerateFactura = async () => {
    if (!id) return;
    try {
      const propietarioRef = doc(db, "propietarios", id);
      const propietarioSnap = await getDoc(propietarioRef);
      const propietarioData = propietarioSnap.data();

      const facturaData: FacturaData = {
        facturaId: `FAC-${id.substring(0, 6)}`,
        fecha: new Date().toLocaleDateString(),
        clienteNombre: propietarioData?.propietario || "",
        clienteApellidos: "", // Asumiendo que no tienes apellidos separados
        clienteDNI: propietarioData?.DNI || "",
        clienteDireccion: propietarioData?.direccion || "",
        items: [],
      };

      const presupuestoRef = doc(
        db,
        "propietarios",
        id,
        "proceso_de_alta",
        "textile_summaries"
      );
      const presupuestoSnap = await getDoc(presupuestoRef);
      const presupuestoData = presupuestoSnap.data();

      if (presupuestoData) {
        facturaData.items = Object.entries(presupuestoData)
          .filter(([key]) => key !== "userId") // Excluir la propiedad userId
          .map(([concepto, cantidad]) => ({
            concepto,
            cantidad: cantidad as number,
            pvp: prices[concepto as keyof typeof prices]?.pvp || 0,
            total:
              (cantidad as number) *
              (prices[concepto as keyof typeof prices]?.pvp || 0),
          }));
      }

      const facturaPdf = await generateFacturaPDF(facturaData);
      const pdfDataUri = facturaPdf.output("datauristring");
      setFacturaUrl(pdfDataUri);

      // Subir el PDF a Firebase Storage
      const storage = getStorage();
      const facturaRef = ref(
        storage,
        `Facturas/${id}/Factura_${facturaData.facturaId}.pdf`
      );
      await uploadString(facturaRef, pdfDataUri, "data_url");

      Swal.fire({
        icon: "success",
        title: "Factura generada",
        text: "La factura ha sido generada y guardada exitosamente.",
      });

      await fetchPdfUrls();
    } catch (error) {
      console.error("Error generando factura:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo generar la factura. Por favor, inténtalo de nuevo.",
      });
    }
  };

  const handleDownloadFactura = () => {
    if (facturaUrl) {
      const link = document.createElement("a");
      link.href = facturaUrl;
      link.download = `Factura_${id}.pdf`;
      link.click();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No hay factura disponible para descargar.",
      });
    }
  };

  const handleAddEmail = () => {
    setEmails([...emails, ""]);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleDocumentSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedDocuments(selectedOptions);
  };

  const handleSendEmail = async () => {
    const validEmails = emails.filter((email) => email.trim() !== "");
    const documents = selectedDocuments
      .map((doc) => {
        switch (doc) {
          case "presupuesto":
            return presupuestoUrl;
          case "beneficio":
            return beneficioUrl;
          case "factura":
            return facturaUrl;
          default:
            return null;
        }
      })
      .filter((url): url is string => url !== null);

    try {
      await sendEmail({
        to: validEmails,
        subject: "Documentos de Presupuesto Textil",
        body: "Adjunto encontrará los documentos solicitados.",
        attachments: documents,
      });
      Swal.fire({
        icon: "success",
        title: "Correo enviado",
        text: "Los documentos han sido enviados exitosamente.",
      });
    } catch (error) {
      console.error("Error enviando correo:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo enviar el correo. Por favor, inténtalo de nuevo.",
      });
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Presupuesto Textil
      </h1>
      {/* <div className="mb-4 flex justify-center space-x-4">
        <button
          onClick={() => setActiveTab("presupuesto")}
          className={`py-2 px-4 rounded-md ${
            activeTab === "presupuesto"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Ver Presupuesto
        </button>
        {beneficioUrl && (
          <button
            onClick={() => setActiveTab("beneficio")}
            className={`py-2 px-4 rounded-md ${
              activeTab === "beneficio"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Ver Beneficio
          </button>
        )}
        {facturaUrl && (
          <button
            onClick={() => setActiveTab("factura")}
            className={`py-2 px-4 rounded-md ${
              activeTab === "factura" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Ver Factura
          </button>
        )}
      </div> */}
      {activeTab === "presupuesto" && presupuestoUrl && (
        <iframe
          src={presupuestoUrl}
          className="w-full h-screen border-2 border-gray-300"
          title="Presupuesto Textil"
        />
      )}
      {/* {activeTab === "beneficio" && beneficioUrl && (
        <iframe
          src={beneficioUrl}
          className="w-full h-screen border-2 border-gray-300"
          title="Beneficio Textil"
        />
      )}
      {activeTab === "factura" && facturaUrl && (
        <iframe
          src={facturaUrl}
          className="w-full h-screen border-2 border-gray-300"
          title="Factura Textil"
        />
      )} */}
      <div className="mt-4 flex space-x-2 justify-center">
        <button
          onClick={handleAccept}
          className="bg-green-500 text-white py-2 px-4 rounded-md"
        >
          Aceptar Presupuesto
        </button>
        {/* <button
          onClick={handleGenerateBeneficio}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Descargar Beneficio
        </button>
        <button
          onClick={handleGenerateFactura}
          className="bg-yellow-500 text-white py-2 px-4 rounded-md"
        >
          Generar Factura
        </button>
        <button
          onClick={handleDownloadFactura}
          className="bg-purple-500 text-white py-2 px-4 rounded-md"
        >
          Descargar Factura
        </button> */}
        <button
          onClick={handleBackClick}
          className="bg-gray-500 text-white py-2 px-4 rounded-md"
        >
          Volver
        </button>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Enviar documentos por correo
        </h2>
        {emails.map((email, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
              placeholder="Correo electrónico"
              className="flex-grow p-2 border rounded"
            />
            {index === emails.length - 1 && (
              <button
                onClick={handleAddEmail}
                className="ml-2 bg-green-500 text-white py-2 px-4 rounded-md"
              >
                +
              </button>
            )}
          </div>
        ))}
        <select
          multiple
          onChange={handleDocumentSelection}
          className="w-full p-2 border rounded mb-4"
          value={selectedDocuments}
        >
          <option value="presupuesto">Presupuesto</option>
          <option value="beneficio">Beneficio</option>
          <option value="factura">Factura</option>
        </select>
        <button
          onClick={handleSendEmail}
          className="bg-green-500 text-white py-2 px-4 rounded-md"
        >
          Enviar Documentos
        </button>
      </div>
    </div>
  );
};

export default PresupuestoTextil;
