// src/utils/inventoryBudgetGenerator.ts
import { jsPDF } from "jspdf";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

interface InventoryItem {
  concepto: string;
  cantidad: number;
  precio: number; // Agregamos la propiedad "precio" para poder mostrarlo y calcular totales
}

export interface InventoryBudgetData {
  presupuestoId: string;
  fecha: string;
  items: InventoryItem[];
  iva: number;
}

export const generateInventoryBudgetPDF = async (
  data: InventoryBudgetData
): Promise<jsPDF> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const lineHeight = 10;

  // === 1. OBTENER LOGO DESDE FIREBASE STORAGE ===
  const storage = getStorage();
  const logoRef = ref(storage, "glooveLogo.png");
  const logoUrl = await getDownloadURL(logoRef);

  // === 2. FUNCIONES AUXILIARES ===
  const addText = (
    text: string,
    x: number,
    y: number,
    options: any = {}
  ): void => {
    doc.text(text, x, y, options);
  };

  const addCell = (
    text: string,
    x: number,
    y: number,
    width: number,
    height: number,
    isHeader: boolean = false,
    align: "left" | "center" | "right" = "left"
  ): void => {
    // Color de fondo (cabecera o celdas normales)
    doc.setFillColor(isHeader ? "#e6f3f5" : "#ffffff");
    doc.rect(x, y, width, height, "F");

    // Color de texto (cabecera vs resto)
    doc.setTextColor(isHeader ? "#156b7a" : "#000000");

    // Calculamos la posición donde se dibuja el texto, según el alineado
    let textX = x + 2; // izquierda por defecto
    if (align === "right") {
      textX = x + width - 2;
    } else if (align === "center") {
      textX = x + width / 2;
    }

    doc.text(text, textX, y + 5, { align });
  };

  const addHeader = (pageNumber: number): void => {
    // Dibujar un rectángulo blanco donde irá el header
    doc.setFillColor("#ffffff");
    doc.rect(0, 0, pageWidth, 40, "F");

    // Añadir logo
    doc.addImage(logoUrl, "PNG", margin, margin, 60, 30);

    // Añadir información del encabezado
    doc.setFontSize(12);
    doc.setTextColor("#156b7a");
    addText(
      `PRESUPUESTO: ${data.presupuestoId}`,
      pageWidth - margin,
      20,
      { align: "right" }
    );
    addText(`FECHA: ${data.fecha}`, pageWidth - margin, 30, {
      align: "right",
    });

    // Si es la segunda página en adelante
    if (pageNumber > 1) {
      addText(`Página ${pageNumber}`, pageWidth / 2, 20, { align: "center" });
    }
  };

  // Cabeceras de la tabla
  const addTableHeader = (y: number): void => {
    doc.setFontSize(10);
    // Ajusta los anchos a tu gusto
    addCell("CONCEPTO", margin, y, 70, lineHeight, true, "left");
    addCell("CANT.", margin + 70, y, 30, lineHeight, true, "right");
    addCell("P. UNIT.", margin + 100, y, 30, lineHeight, true, "right");
    addCell("TOTAL", margin + 130, y, 40, lineHeight, true, "right");
  };

  // === 3. INICIAR PRIMERA PÁGINA Y DIBUJAR EL HEADER ===
  let pageNumber = 1;
  doc.setFontSize(10);
  addHeader(pageNumber);

  // Coordenada inicial donde comenzará la tabla
  let yPos = 50;
  addTableHeader(yPos);
  yPos += lineHeight;

  // === 4. RECORRER ÍTEMS DE LA TABLA ===
  let subtotal = 0;
  data.items.forEach((item) => {
    // Cada "línea" de la tabla ocupa lineHeight
    // Verificamos si necesitamos crear otra página
    if (yPos > pageHeight - 60) {
      doc.addPage();
      pageNumber++;
      addHeader(pageNumber);
      yPos = 40;
      addTableHeader(yPos);
      yPos += lineHeight;
    }

    // Calculamos el total de esa línea
    const totalLinea = item.cantidad * item.precio;

    // Dibujamos las 4 celdas:
    addCell(item.concepto, margin, yPos, 70, lineHeight, false, "left");
    addCell(
      item.cantidad.toString(),
      margin + 70,
      yPos,
      30,
      lineHeight,
      false,
      "right"
    );
    addCell(
      `${item.precio.toFixed(2)} €`,
      margin + 100,
      yPos,
      30,
      lineHeight,
      false,
      "right"
    );
    addCell(
      `${totalLinea.toFixed(2)} €`,
      margin + 130,
      yPos,
      40,
      lineHeight,
      false,
      "right"
    );

    yPos += lineHeight;
    subtotal += totalLinea;
  });

  // === 5. DESGLOSE DEL TOTAL (SUBTOTAL, IVA, TOTAL) ===
  const ivaAmount = subtotal * (data.iva / 100);
  const total = subtotal + ivaAmount;

  // Un pequeño espacio antes del desglose
  yPos += lineHeight;

  // SUBTOTAL
  addCell("SUBTOTAL", margin + 70, yPos, 60, lineHeight, true, "right");
  addCell(
    `${subtotal.toFixed(2)} €`,
    margin + 130,
    yPos,
    40,
    lineHeight,
    false,
    "right"
  );
  yPos += lineHeight;

  // IVA
  addCell(`IVA ${data.iva}%`, margin + 70, yPos, 60, lineHeight, true, "right");
  addCell(
    `${ivaAmount.toFixed(2)} €`,
    margin + 130,
    yPos,
    40,
    lineHeight,
    false,
    "right"
  );
  yPos += lineHeight;

  // TOTAL
  addCell("TOTAL", margin + 70, yPos, 60, lineHeight, true, "right");
  addCell(
    `${total.toFixed(2)} €`,
    margin + 130,
    yPos,
    40,
    lineHeight,
    false,
    "right"
  );

  // === 6. PIE DE PÁGINA PARA TODAS LAS PÁGINAS ===
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor("#156b7a");
    addText(
      "GLOOVE TU ALOJAMIENTO TURÍSTICO S.L.",
      margin,
      pageHeight - 10
    );
    addText("CIF: B-54796925", pageWidth - margin, pageHeight - 10, {
      align: "right",
    });
  }

  return doc;
};
