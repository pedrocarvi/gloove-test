import { jsPDF } from "jspdf";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export interface FacturaData {
  facturaId: string;
  fecha: string;
  clienteNombre: string;
  clienteApellidos: string;
  clienteDNI: string;
  clienteDireccion: string;
  items: Array<{
    concepto: string;
    cantidad: number;
    pvp: number;
    total: number;
  }>;
}

export const generateFacturaPDF = async (data: FacturaData): Promise<jsPDF> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const lineHeight = 7;

  // Funciones auxiliares
  const addText = (text: string, x: number, y: number, options: any = {}): void => {
    doc.text(text, x, y, options);
  };

  const addHeader = (pageNumber: number): void => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Añadir logo
    doc.addImage(logoUrl, 'PNG', margin, 10, 40, 20);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    addText('GLOOVE TU ALOJAMIENTO TURÍSTICO S.L.', pageWidth - margin, 15, { align: 'right' });
    addText('Cl Reyes Católicos, 25-Bajo, 03600 Elda - ALICANTE', pageWidth - margin, 20, { align: 'right' });
    addText('Teléfono: 676 149 978', pageWidth - margin, 25, { align: 'right' });
    addText('Email: admin@gloove.me', pageWidth - margin, 30, { align: 'right' });
    addText('CIF: B-54796925', pageWidth - margin, 35, { align: 'right' });

    if (pageNumber > 1) {
      addText(`Página ${pageNumber}`, pageWidth / 2, 20, { align: 'center' });
    }
  };

  const addFooter = (): void => {
    doc.setFontSize(8);
    doc.setTextColor(100);
    addText('GLOOVE TU ALOJAMIENTO TURÍSTICO S.L. | CIF: B-54796925', pageWidth / 2, pageHeight - 10, { align: 'center' });
    addText('Registro Mercantil, Inscripción 4ª Tomo 3789 Folio 215 Hoja A-140881', pageWidth / 2, pageHeight - 5, { align: 'center' });
  };

  // Obtener la URL del logo
  const storage = getStorage();
  const logoRef = ref(storage, 'glooveLogo.png');
  const logoUrl = await getDownloadURL(logoRef);

  // Iniciar la primera página
  let pageNumber = 1;
  addHeader(pageNumber);

  // Información de la factura
  let yPos = 50;
  doc.setFontSize(12);
  doc.setTextColor(0);
  addText(`FACTURA NUM.: ${data.facturaId}`, margin, yPos);
  addText(`FECHA: ${data.fecha}`, pageWidth - margin, yPos, { align: 'right' });
  yPos += lineHeight * 2;

  // Información del cliente
  addText(`Cliente: ${data.clienteNombre} ${data.clienteApellidos}`, margin, yPos);
  yPos += lineHeight;
  addText(`Dirección: ${data.clienteDireccion}`, margin, yPos);
  yPos += lineHeight;
  addText(`DNI/CIF: ${data.clienteDNI}`, margin, yPos);
  yPos += lineHeight * 2;

  // Tabla de conceptos
  doc.setFontSize(10);
  const headers = ['CONCEPTO', 'CANTIDAD', 'PVP', 'TOTAL'];
  const columnWidths = [100, 25, 30, 35];
  
  headers.forEach((header, index) => {
    let xPos = margin;
    for (let i = 0; i < index; i++) {
      xPos += columnWidths[i];
    }
    doc.setFillColor(230, 230, 230);
    doc.rect(xPos, yPos, columnWidths[index], lineHeight, 'F');
    doc.text(header, xPos + 2, yPos + 5);
  });
  yPos += lineHeight;

  // Ítems de la factura
  let subtotal = 0;
  data.items.forEach((item) => {
    if (yPos > pageHeight - 60) {
      doc.addPage();
      pageNumber++;
      addHeader(pageNumber);
      yPos = 50;
    }

    let xPos = margin;
    doc.text(item.concepto, xPos, yPos + 5);
    xPos += columnWidths[0];
    doc.text(item.cantidad.toString(), xPos, yPos + 5, { align: 'right' });
    xPos += columnWidths[1];
    doc.text(item.pvp.toFixed(2) + ' €', xPos, yPos + 5, { align: 'right' });
    xPos += columnWidths[2];
    doc.text(item.total.toFixed(2) + ' €', xPos, yPos + 5, { align: 'right' });
    yPos += lineHeight;
    subtotal += item.total;
  });

  // Totales
  yPos += lineHeight;
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  doc.setFontSize(10);
  doc.setFont(doc.getFont().fontName, 'bold');
  let xPos = margin + columnWidths[0] + columnWidths[1] + columnWidths[2];
  doc.text('SUBTOTAL:', xPos, yPos + 5);
  doc.text(subtotal.toFixed(2) + ' €', pageWidth - margin, yPos + 5, { align: 'right' });
  yPos += lineHeight;
  doc.text('IVA (21%):', xPos, yPos + 5);
  doc.text(iva.toFixed(2) + ' €', pageWidth - margin, yPos + 5, { align: 'right' });
  yPos += lineHeight;
  doc.text('TOTAL:', xPos, yPos + 5);
  doc.text(total.toFixed(2) + ' €', pageWidth - margin, yPos + 5, { align: 'right' });

  // Información de pago
  yPos += lineHeight * 2;
  doc.setFontSize(10);
  doc.setFont(doc.getFont().fontName, 'normal');
  addText('FORMA DE PAGO: TRANSFERENCIA BANCARIA', margin, yPos);
  yPos += lineHeight;
  addText('BANCO: SABADELL', margin, yPos);
  yPos += lineHeight;
  addText('IBAN: ES35 0081 1376 6100 0112 4313', margin, yPos);

  addFooter();

  return doc;
};