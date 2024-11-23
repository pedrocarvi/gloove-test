import { jsPDF } from "jspdf";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

interface FormData {
  propietario: string;
  email: string;
  DNI: string;
  numCatastro: string;
  ciudad: string;
  provincia: string;
  cPostal: string;
  direccion: string;
  tipoVivienda: string;
  interior: boolean;
  exterior: boolean;
  ascensor: boolean;
  portero: boolean;
  porteroAutomatico: boolean;
  garaje: boolean;
  garajeConcertado: boolean;
  facilAparcamiento: boolean;
  piscina: boolean;
  jardin: boolean;
  vistas: string;
  habitaciones: number;
  banos: number;
  aseos: number;
  duchas: number;
  baneras: number;
  trastero: boolean;
  mascotas: boolean;
  cocina: string;
  capacidadMaxima: number;
  observaciones: string;
  camas90: number;
  camas105: number;
  camas135: number;
  camas150: number;
  camas180: number;
  camas200: number;
  edredon: number;
  almohadas: number;
  relleno_nordico: number;
  // camas: Array<{
  //   tipo: string;
  //   aireAcondicionado: boolean;
  //   calefaccion: boolean;
  //   ventilador: boolean;
  //   tv: boolean;
  //   mosquiteras: boolean;
  //   electrodomesticos: string;
  //   aguaCaliente: string;
  //   estadoPintura: string;
  //   reformaAno: string;
  //   estadoMobiliario: string;
  // }>;
}

export const generateCorporatePDF = async (
  title: string,
  formData: FormData
): Promise<jsPDF> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;

  // Funciones auxiliares
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
    isHeader: boolean = false
  ): void => {
    const cellText = text ? String(text) : ""; 
    if (isHeader) {
      doc.setFillColor(230, 243, 245);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(x, y, width, height, "F");
    doc.setTextColor(isHeader ? "#156b7a" : "#000000");
    doc.text(cellText, x + 2, y + 5);
  };

  const addRow = (
    data: string[],
    x: number,
    y: number,
    widths: number[],
    height: number
  ): void => {
    data.forEach((text, index) => {
      addCell(text, x, y, widths[index], height, index === 0);
      x += widths[index];
    });
  };

  // Función para añadir encabezado
  const addHeader = (pageNumber: number): void => {
    // Añadir logo
    doc.addImage(logoUrl, "PNG", margin, margin, 40, 20);

    // Añadir título
    doc.setFontSize(18);
    doc.setTextColor("#156b7a");
    addText(title, pageWidth / 2, 40, { align: "center" });

    // Añadir número de página
    doc.setFontSize(10);
    doc.setTextColor("#000000");
    addText(`Página ${pageNumber}`, pageWidth - margin, 10, { align: "right" });
  };

  // Función para añadir pie de página
  const addFooter = (): void => {
    doc.setFontSize(10);
    doc.setTextColor("#156b7a");
    addText("GLOOVE TU ALOJAMIENTO TURÍSTICO S.L.", margin, pageHeight - 10);
    addText("CIF: B-54796925", pageWidth - margin, pageHeight - 10, {
      align: "right",
    });
  };

  // Obtener logo
  const storage = getStorage();
  const logoRef = ref(storage, "glooveLogo.png");
  const logoUrl = await getDownloadURL(logoRef);

  // Iniciar primera página
  let pageNumber = 1;
  addHeader(pageNumber);
  addFooter();

  // Información del propietario
  doc.setFontSize(12);
  let yPos = 50;
  addRow(
    ["PROPIETARIO:", formData.propietario, "e-MAIL:", formData.email],
    margin,
    yPos,
    [30, 60, 30, 60],
    10
  );
  yPos += 10;
  addRow(
    ["DNI/PASAPORTE:", formData.DNI, "Num Catastro:", formData.numCatastro],
    margin,
    yPos,
    [40, 50, 40, 50],
    10
  );
  yPos += 10;
  addRow(
    [
      "Ciudad:",
      formData.ciudad,
      "Provincia:",
      formData.provincia,
      "C. Postal:",
      formData.cPostal,
    ],
    margin,
    yPos,
    [30, 30, 30, 30, 30, 30],
    10
  );
  yPos += 10;
  addRow(
    ["Dirección Exacta:", formData.direccion],
    margin,
    yPos,
    [40, 140],
    10
  );

  // Características del alojamiento
  yPos += 20;
  doc.setFillColor("#156b7a");
  doc.rect(margin, yPos, pageWidth - 2 * margin, 10, "F");
  doc.setTextColor("#FFFFFF");
  addText("CARACTERÍSTICAS DEL ALOJAMIENTO", pageWidth / 2, yPos + 7, {
    align: "center",
  });

  yPos += 15;
  const characteristicsData = [
    [
      "Tipo Vivienda:",
      formData.tipoVivienda,
      "Interior:",
      formData.interior ? "Sí" : "No",
      "Exterior:",
      formData.exterior ? "Sí" : "No",
      "Ascensor:",
      formData.ascensor ? "Sí" : "No",
    ],
    [
      "Portero:",
      formData.portero ? "Sí" : "No",
      "Portero Automático:",
      formData.porteroAutomatico ? "Sí" : "No",
      "Garaje:",
      formData.garaje ? "Sí" : "No",
      "Garaje Concertado:",
      formData.garajeConcertado ? "Sí" : "No",
    ],
    [
      "Fácil Aparcamiento:",
      formData.facilAparcamiento ? "Sí" : "No",
      "Piscina:",
      formData.piscina ? "Sí" : "No",
      "Jardín:",
      formData.jardin ? "Sí" : "No",
      "Vistas a:",
      formData.vistas,
    ],
    [
      "Habitaciones:",
      formData.habitaciones ? formData.habitaciones.toString() : "0",
      "Baños:",
      formData.banos ? formData.banos.toString() : "0",
      "Aseos:",
      formData.aseos ? formData.aseos.toString() : "0",
      "Ducha:",
      formData.duchas ? formData.duchas.toString() : "0"
    ],
    [
      "Bañera:",
      formData.baneras ? formData.baneras.toString() : "0",
      "Trastero:",
      formData.trastero ? "Sí" : "No",
      "Mascotas:",
      formData.mascotas ? "Sí" : "No",
      "Cocina Tipo:",
      formData.cocina,
    ],
    ["Capacidad Máxima:",  formData.capacidadMaxima ? formData.capacidadMaxima.toString() : '0'],
  ];

  characteristicsData.forEach((row) => {
    addRow(row, margin, yPos, [30, 20, 30, 20, 30, 20, 30, 20], 10);
    yPos += 10;
  });

  // Características y amueblamiento (ejemplo para una cama)
  yPos += 10;
  doc.setFillColor("#156b7a");
  doc.rect(margin, yPos, pageWidth - 2 * margin, 10, "F");
  doc.setTextColor("#FFFFFF");
  addText("CARACTERÍSTICAS Y AMUEBLAMIENTO", pageWidth / 2, yPos + 7, {
    align: "center",
  });

  yPos += 15;
  // if (formData.camas && formData.camas.length > 0) {
  //   const cama = formData.camas[0];
  //   const camaData = [
  //     [
  //       "Tipo:",
  //       cama.tipo,
  //       "Aire Acondicionado:",
  //       cama.aireAcondicionado ? "Sí" : "No",
  //       "Calefacción:",
  //       cama.calefaccion ? "Sí" : "No",
  //     ],
  //     [
  //       "Ventilador:",
  //       cama.ventilador ? "Sí" : "No",
  //       "TV:",
  //       cama.tv ? "Sí" : "No",
  //       "Mosquiteras:",
  //       cama.mosquiteras ? "Sí" : "No",
  //     ],
  //     ["Electrodomésticos:", cama.electrodomesticos],
  //     ["Agua Caliente:", cama.aguaCaliente],
  //     [
  //       "Estado Pintura:",
  //       cama.estadoPintura,
  //       "Reforma Año:",
  //       cama.reformaAno,
  //       "Estado Mobiliario:",
  //       cama.estadoMobiliario,
  //     ],
  //   ];

  //   camaData.forEach((row) => {
  //     addRow(
  //       row,
  //       margin,
  //       yPos,
  //       row.length === 2 ? [40, 140] : [30, 20, 30, 20, 30, 50],
  //       10
  //     );
  //     yPos += 10;
  //   });
  // }

  // Observaciones
  yPos += 10;
  doc.setFillColor("#156b7a");
  doc.rect(margin, yPos, pageWidth - 2 * margin, 10, "F");
  doc.setTextColor("#FFFFFF");
  addText("OBSERVACIONES", pageWidth / 2, yPos + 7, { align: "center" });

  yPos += 15;
  doc.setTextColor("#000000");
  // doc.text(formData.observaciones, margin, yPos, {
  //   maxWidth: pageWidth - 2 * margin,
  // });

  return doc;
};
