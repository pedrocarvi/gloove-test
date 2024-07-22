// src/utils/inventoryBudgetGenerator.ts
import { jsPDF } from "jspdf";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

interface InventoryItem {
  concepto: string;
  cantidad: number;
  total: number;
}

export interface InventoryBudgetData { // Asegúrate de que esta línea esté exportando la interfaz
  presupuestoId: string;
  fecha: string;
  items: InventoryItem[];
  iva: number;
}

export const generateInventoryBudgetPDF = async (data: InventoryBudgetData): Promise<jsPDF> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const lineHeight = 10;

  // Funciones auxiliares
  const addText = (text: string, x: number, y: number, options: any = {}): void => {
    doc.text(text, x, y, options);
  };

  const addCell = (text: string, x: number, y: number, width: number, height: number, isHeader: boolean = false, align: 'left' | 'center' | 'right' = 'left'): void => {
    doc.setFillColor(isHeader ? '#e6f3f5' : '#ffffff');
    doc.rect(x, y, width, height, 'F');
    doc.setTextColor(isHeader ? '#156b7a' : '#000000');
    const textX = align === 'right' ? x + width - 2 : (align === 'center' ? x + width / 2 : x + 2);
    doc.text(text, textX, y + 5, { align });
  };

  const addHeader = (pageNumber: number): void => {
    doc.setFillColor('#ffffff');
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Añadir logo
    doc.addImage(logoUrl, 'PNG', margin, margin, 60, 30);

    // Añadir información del encabezado
    doc.setFontSize(12);
    doc.setTextColor('#156b7a');
    addText(`PRESUPUESTO: ${data.presupuestoId}`, pageWidth - margin, 20, { align: 'right' });
    addText(`FECHA: ${data.fecha}`, pageWidth - margin, 30, { align: 'right' });

    if (pageNumber > 1) {
      addText(`Página ${pageNumber}`, pageWidth / 2, 20, { align: 'center' });
    }
  };

  const addTableHeader = (y: number): void => {
    const colWidths = [100, 40, 40];
    doc.setFontSize(10);
    addCell('CONCEPTO', margin, y, colWidths[0], lineHeight, true);
    addCell('CANTIDAD', margin + colWidths[0], y, colWidths[1], lineHeight, true, 'right');
    addCell('TOTAL', margin + colWidths[0] + colWidths[1], y, colWidths[2], lineHeight, true, 'right');
  };

  // Obtener la URL del logo
  const storage = getStorage();
  const logoRef = ref(storage, 'glooveLogo.png');
  const logoUrl = await getDownloadURL(logoRef);

  // Iniciar la primera página
  let pageNumber = 1;
  addHeader(pageNumber);

  // Iniciar la tabla
  let yPos = 50;
  addTableHeader(yPos);
  yPos += lineHeight;

  // Añadir ítems a la tabla
  const colWidths = [100, 40, 40];
  let subtotal = 0;
  data.items.forEach((item, index) => {
    if (yPos > pageHeight - 60) {
      // Agregar nueva página
      doc.addPage();
      pageNumber++;
      addHeader(pageNumber);
      yPos = 40;
      addTableHeader(yPos);
      yPos += lineHeight;
    }

    addCell(item.concepto, margin, yPos, colWidths[0], lineHeight);
    addCell(item.cantidad.toString(), margin + colWidths[0], yPos, colWidths[1], lineHeight, false, 'right');
    addCell(`${item.total.toFixed(2)} €`, margin + colWidths[0] + colWidths[1], yPos, colWidths[2], lineHeight, false, 'right');
    yPos += lineHeight;
    subtotal += item.total;
  });

  // Añadir desglose total
  yPos += lineHeight;
  const ivaAmount = subtotal * (data.iva / 100);
  const total = subtotal + ivaAmount;

  addCell('SUBTOTAL', margin + colWidths[0], yPos, colWidths[1], lineHeight, true);
  addCell(`${subtotal.toFixed(2)} €`, margin + colWidths[0] + colWidths[1], yPos, colWidths[2], lineHeight, false, 'right');
  yPos += lineHeight;

  addCell(`IVA ${data.iva}%`, margin + colWidths[0], yPos, colWidths[1], lineHeight, true);
  addCell(`${ivaAmount.toFixed(2)} €`, margin + colWidths[0] + colWidths[1], yPos, colWidths[2], lineHeight, false, 'right');
  yPos += lineHeight;

  addCell('TOTAL', margin + colWidths[0], yPos, colWidths[1], lineHeight, true);
  addCell(`${total.toFixed(2)} €`, margin + colWidths[0] + colWidths[1], yPos, colWidths[2], lineHeight, false, 'right');

  // Añadir pie de página a todas las páginas
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor('#156b7a');
    addText('GLOOVE TU ALOJAMIENTO TURÍSTICO S.L.', margin, pageHeight - 10);
    addText('CIF: B-54796925', pageWidth - margin, pageHeight - 10, { align: 'right' });
  }

  return doc;
};
