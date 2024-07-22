import { jsPDF } from "jspdf";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

interface ContractData {
  propietario: string;
  dni: string;
  domicilio: string;
  ciudad: string;
  direccion: string;
  numCatastro: string;
  numeroVUT: string;
  email: string;
  signature: string;
}

export const generateContractPDF = async (contractData: ContractData, contractText: string, employeeSignature: string): Promise<jsPDF> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const lineHeight = 7;

  // Función para añadir el encabezado a cada página
  const addHeader = (pageNumber: number) => {
    doc.addImage(logoUrl, 'PNG', margin, 10, 40, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Página ${pageNumber}`, pageWidth - margin, 10, { align: 'right' });
  };

  // Función para añadir el pie de página
  const addFooter = () => {
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('GLOOVE TU ALOJAMIENTO TURÍSTICO S.L. | CIF: B-54796925', pageWidth / 2, pageHeight - 10, { align: 'center' });
  };

  // Función para agregar texto con salto de línea automático
  const addText = (text: string, x: number, y: number, maxWidth: number) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * lineHeight;
  };

  // Obtener el logo
  const storage = getStorage();
  const logoRef = ref(storage, 'glooveLogo.png');
  const logoUrl = await getDownloadURL(logoRef);

  // Iniciar la primera página
  let pageNumber = 1;
  addHeader(pageNumber);
  addFooter();

  // Añadir título
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  let yPosition = addText('CONTRATO DE GESTIÓN INTEGRAL', margin, 40, pageWidth - 2 * margin);

  // Añadir contenido del contrato
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const paragraphs = contractText.split('\n\n');
  for (const paragraph of paragraphs) {
    if (yPosition > pageHeight - margin * 2) {
      doc.addPage();
      pageNumber++;
      addHeader(pageNumber);
      addFooter();
      yPosition = 40;
    }
    yPosition = addText(paragraph, margin, yPosition + 10, pageWidth - 2 * margin);
  }

  // Añadir sección de firmas
  yPosition += 20;
  doc.setFont('helvetica', 'bold');
  doc.text('FDO. LA PROPIEDAD', margin, yPosition);
  doc.text('FDO. GLOOVE', pageWidth / 2 + margin, yPosition);

  yPosition += 10;
  doc.addImage(contractData.signature, 'PNG', margin, yPosition, 70, 30);
  doc.addImage(employeeSignature, 'PNG', pageWidth / 2 + margin, yPosition, 70, 30);
  
  // Añadir espacio para la firma de GLOOVE
  doc.setFont('helvetica', 'normal');
  doc.text('(Espacio reservado para firma de GLOOVE)', pageWidth / 2 + margin, yPosition + 35);

  return doc;
};
