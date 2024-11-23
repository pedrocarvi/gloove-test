import jsPDF from "jspdf";
import GlooveLogo from "@/assets/gloove-pdf-logo.jpg"; // Ajusta el path según tu estructura

export const generateContractPDF = (
  textileData: any, 
  step1Data: any, 
  technicalFormData: any
): string => {
  // Crear instancia del PDF
  const pdfDoc = new jsPDF();

  // Agregar logo
  pdfDoc.addImage(GlooveLogo, "PNG", 10, 10, 50, 20);

  // Título del contrato
  pdfDoc.setFont("Helvetica", "bold");
  pdfDoc.setFontSize(20);
  pdfDoc.text("CONTRATO DE SERVICIO", 105, 50, { align: "center" });

  // Agregar datos del propietario
  pdfDoc.setFont("Helvetica", "normal");
  pdfDoc.setFontSize(12);
  pdfDoc.text(`Propietario: ${technicalFormData.propietario}`, 20, 70);
  pdfDoc.text(`DNI: ${technicalFormData.dni}`, 20, 80);
  pdfDoc.text(`Dirección: ${technicalFormData.direccion}`, 20, 90);

  // Agregar datos técnicos
  pdfDoc.text(`Camas: ${step1Data.camas90} camas de 90, ${step1Data.camas105} camas de 105`, 20, 110);

  // Pie de página
  pdfDoc.text("En Elche a [FECHA] de 2024", 105, 280, { align: "center" });

  // Retornar el PDF en formato DataURL
  return pdfDoc.output("datauristring");
};
