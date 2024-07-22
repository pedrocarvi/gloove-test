// src/utils/benefitGenerator.ts
import { jsPDF } from "jspdf";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import autoTable from 'jspdf-autotable';

interface BenefitItem {
  concepto: string;
  cantidad: number;
  pvp: number;
  pvc: number;
}

export interface BenefitData {  // Asegúrate de exportar esta interfaz
  beneficioId: string;
  fecha: string;
  items: BenefitItem[];
}

export const generateBenefitPDF = async (data: BenefitData): Promise<jsPDF> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 10;

  // Colores corporativos
  const primaryColor = '#156b7a';
  const secondaryColor = '#e6f3f5';

  // Variable para rastrear el número de página
  let pageNumber = 1;

  // Funciones auxiliares
  const addText = (text: string, x: number, y: number, options: any = {}): void => {
    doc.text(text, x, y, options);
  };

  const addHeader = (): void => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Añadir logo
    doc.addImage(logoUrl, 'PNG', margin, 10, 40, 20);

    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    addText(`BENEFICIO: ${data.beneficioId}`, pageWidth - margin, 20, { align: 'right' });
    addText(`FECHA: ${data.fecha}`, pageWidth - margin, 30, { align: 'right' });

    if (pageNumber > 1) {
      addText(`Página ${pageNumber}`, pageWidth / 2, 20, { align: 'center' });
    }
  };

  const addFooter = (): void => {
    doc.setFontSize(8);
    doc.setTextColor(primaryColor);
    addText('GLOOVE TU ALOJAMIENTO TURÍSTICO S.L.', margin, pageHeight - 10);
    addText('CIF: B-54796925', pageWidth - margin, pageHeight - 10, { align: 'right' });
    addText(`Página ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  };

  // Obtener la URL del logo
  const storage = getStorage();
  const logoRef = ref(storage, 'glooveLogo.png');
  const logoUrl = await getDownloadURL(logoRef);

  // Calcular totales y beneficios
  let totalPVP = 0;
  let totalPVC = 0;
  let totalBeneficio = 0;

  const tableData = data.items.map(item => {
    const itemTotalPVP = item.cantidad * item.pvp;
    const itemTotalPVC = item.cantidad * item.pvc;
    const beneficio = itemTotalPVP - itemTotalPVC;
    
    totalPVP += itemTotalPVP;
    totalPVC += itemTotalPVC;
    totalBeneficio += beneficio;

    return [
      item.concepto,
      item.cantidad,
      `${item.pvp.toFixed(2)} €`,
      `${itemTotalPVP.toFixed(2)} €`,
      `${item.pvc.toFixed(2)} €`,
      `${beneficio.toFixed(2)} €`
    ];
  });

  // Añadir tabla
  autoTable(doc, {
    startY: 50,
    head: [['CONCEPTO', 'CANTIDAD', 'PVP', 'TOTAL', 'PVC', 'BENEFICIO']],
    body: tableData,
    foot: [
      ['', '', 'TOTAL', `${totalPVP.toFixed(2)} €`, `${totalPVC.toFixed(2)} €`, `${totalBeneficio.toFixed(2)} €`]
    ],
    theme: 'striped',
    headStyles: { fillColor: [21, 107, 122], textColor: [255, 255, 255] },
    footStyles: { fillColor: [21, 107, 122], textColor: [255, 255, 255] },
    styles: { cellPadding: 5, fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' }
    },
    didDrawPage: function(data: any) {
      // Incrementar el número de página
      pageNumber++;
      // Llamar a addHeader y addFooter en cada página
      addHeader();
      addFooter();
    }
  });

  return doc;
};

