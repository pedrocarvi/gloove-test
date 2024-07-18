import { jsPDF } from "jspdf";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

// Función base para crear un PDF corporativo
async function createBasePDF(title: string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Añadir logo
  const storage = getStorage();
  const logoRef = ref(storage, 'glooveLogo.png'); // Ruta del logo en la raíz
  const logoUrl = await getDownloadURL(logoRef);
  doc.addImage(logoUrl, 'PNG', 10, 10, 30, 30);

  // Añadir título
  doc.setFontSize(20);
  doc.text(title, pageWidth / 2, 50, { align: 'center' });

  // Añadir pie de página
  doc.setFontSize(10);
  doc.text('GLOOVE TU ALOJAMIENTO TURÍSTICO S.L.', 10, doc.internal.pageSize.height - 20);
  doc.text('CIF: B-54796925', 10, doc.internal.pageSize.height - 15);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth - 10, doc.internal.pageSize.height - 10, { align: 'right' });

  return doc;
}

// Función para generar el PDF corporativo con datos del formulario
export const generateCorporatePDF = async (title: string, formData: any) => {
  const pdf = await createBasePDF(title);

  pdf.setFontSize(10);

  // Añadir los datos del formulario al PDF
  const addData = (data: any, prefix: string = "", indent: number = 0) => {
    const keys = Object.keys(data);
    keys.forEach((key, index) => {
      if (typeof data[key] === "object" && !Array.isArray(data[key])) {
        pdf.text(`${" ".repeat(indent)}${prefix}${key}:`, 10, 60 + (index * 10));
        addData(data[key], `${prefix}${key}.`, indent + 2);
      } else {
        pdf.text(`${" ".repeat(indent)}${prefix}${key}: ${data[key]}`, 10, 60 + (index * 10));
      }
    });
  };

  addData(formData);

  return pdf;
};

// Función para generar el contrato
export const generateContractPDF = async (formData: any, contractText: string) => {
  const pdf = await createBasePDF('Contrato de Gestión');

  // Agregar el texto del contrato
  pdf.text("Contrato", 10, 70);
  pdf.text(contractText, 10, 80);

  // Agregar la firma si existe
  if (formData.signature) {
    pdf.addImage(formData.signature, "PNG", 10, 240, 50, 50);
  }

  return pdf;
};

// Función para generar la ficha técnica
export const generateTechnicalSheetPDF = async (technicalData: any) => {
  const pdf = await createBasePDF('Ficha Técnica del Alojamiento Turístico');

  // Añadir contenido específico de la ficha técnica
  let yPosition = 70;
  pdf.setFontSize(12);
  pdf.text(`Ciudad: ${technicalData.ciudad}`, 10, yPosition);
  yPosition += 10;
  pdf.text(`Dirección Exacta: ${technicalData.direccionExacta}`, 10, yPosition);
  // ... Añadir más campos de la ficha técnica

  return pdf;
};

// Función para generar el inventario
export const generateInventoryPDF = async (inventoryData: any) => {
  const pdf = await createBasePDF('Inventario');

  // Añadir contenido específico del inventario
  let yPosition = 70;
  pdf.setFontSize(12);
  pdf.text('Habitación 1', 10, yPosition);
  yPosition += 10;
  // ... Añadir items del inventario

  return pdf;
};

// Función para generar el presupuesto textil
export const generateTextileBudgetPDF = async (budgetData: any) => {
  const pdf = await createBasePDF('Presupuesto Textil');

  // Añadir contenido específico del presupuesto
  let yPosition = 70;
  pdf.setFontSize(12);
  pdf.text('Concepto', 10, yPosition);
  pdf.text('Cantidad', 80, yPosition);
  pdf.text('PVP', 120, yPosition);
  pdf.text('Total', 160, yPosition);

  // Añadir items del presupuesto
  budgetData.items.forEach((item: any, index: number) => {
    yPosition += 10;
    pdf.text(item.concept, 10, yPosition);
    pdf.text(item.quantity.toString(), 80, yPosition);
    pdf.text(item.pvp.toFixed(2), 120, yPosition);
    pdf.text((item.quantity * item.pvp).toFixed(2), 160, yPosition);
  });

  return pdf;
};

// Función para generar la factura textil
export const generateTextileInvoicePDF = async (invoiceData: any) => {
  const pdf = await createBasePDF('Factura Textil');

  // Añadir contenido específico de la factura
  let yPosition = 70;
  pdf.setFontSize(12);
  pdf.text(`Cliente: ${invoiceData.cliente}`, 10, yPosition);
  yPosition += 10;
  pdf.text(`Dirección: ${invoiceData.direccion}`, 10, yPosition);
  // ... Añadir más detalles de la factura

  return pdf;
};

// Función para generar el resumen textil
export const generateTextileSummaryPDF = async (summary: any, userId: string) => {
  const pdf = await createBasePDF("Resumen de Textil");

  pdf.setFontSize(12);
  pdf.text("Resumen de Pedido de Textil", 20, 30);

  let yPosition = 50;
  Object.entries(summary).forEach(([key, value]) => {
    pdf.text(`${key.replace(/_/g, " ")}: ${value}`, 20, yPosition);
    yPosition += 10;
  });

  // Guardar y descargar el PDF...
  const pdfData = pdf.output("datauristring");
  const storage = getStorage();
  const pdfRef = ref(storage, `Presupuesto Textil/textile_summary_${userId}.pdf`);
  await uploadString(pdfRef, pdfData, "data_url");

  return pdfData;
};

// Función para generar y subir el PDF y devolver la URL
export const generateAndUploadPDF = async (
  summary: Record<string, number>,
  budget: number,
  userId: string
) => {
  const pdf = await generateCorporatePDF("Resumen de Textil", { ...summary, Total: budget });
  const pdfData = pdf.output("datauristring");

  const storage = getStorage();
  const pdfRef = ref(storage, `Presupuesto Textil/textile_summary_${userId}.pdf`);
  await uploadString(pdfRef, pdfData, "data_url");

  return await getDownloadURL(pdfRef);
};
