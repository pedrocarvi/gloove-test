import { jsPDF } from "jspdf";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import autoTable from 'jspdf-autotable';

interface FormData {
  distribucion: {
    superficieVivienda: number;
    superficieParcela: number;
    ascensor: boolean;
    ocupacionMaxAdultosNinos: number;
    ocupacionMaxSoloAdultos: number;
  };
  dormitorios: {
    numDormitorios: number;
    zonasComunes: string;
  };
  banos: {
    banosBanera: number;
    banosDucha: number;
    aseos: number;
    sauna: boolean;
    jacuzzi: boolean;
    secador: boolean;
    toallas: string;
    cambioToallas: string;
  };
  cocina: {
    numCocinas: number;
    clase: string;
    tipo: string;
    utensiliosCocina: boolean;
    cafetera: boolean;
    freidora: boolean;
    tostadora: boolean;
  };
  accesoriosHogar: {
    ropaCama: string;
    cambioRopa: string;
    lavadora: boolean;
    secadora: boolean;
    television: boolean;
    televisores: string;
    tvSatelite: boolean;
    radio: boolean;
    idiomasTvSatelite: string[];
    mosquiteras: string;
    ventiladores: number;
    dvd: string;
    aparatosAntiMosquitos: number;
  };
  caracteristicasAdicionales: {
    internetAccess: string;
    safeBox: boolean;
    miniBar: boolean;
    electronicLock: string;
    doorCode: string;
    parking: string;
    parkingLocation: string;
    parkingSpaces: string;
    parkingType: string;
    airConditioning: string;
    heating: string;
    disabledAccess: string;
    jardin: boolean;
    mobiliarioJardin: boolean;
    barbacoa: boolean;
    chimenea: boolean;
    parcelaVallada: boolean;
    terraza: boolean;
    alarma: boolean;
    gimnasio: boolean;
    squash: boolean;
    balcon: boolean;
    padel: boolean;
    tenis: boolean;
    zonaInfantil: boolean;
    spa: boolean;
    animals: string;
    weightLimit: number;
    noDangerousAnimals: boolean;
    pool: string;
    heatedPool: string;
    noYoungGroups: boolean;
    noSmoking: boolean;
    additionalFeatures: string;
  };
}

export const generateInventoryPDF = async (data: FormData): Promise<jsPDF> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colores corporativos
  const primaryColor = '#156b7a';

  // Obtener logo
  const storage = getStorage();
  const logoRef = ref(storage, 'glooveLogo.png');
  const logoUrl = await getDownloadURL(logoRef);

  // Función para añadir encabezado
  const addHeader = (pageNumber: number) => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.addImage(logoUrl, 'PNG', 10, 10, 40, 20);
    doc.setFontSize(20);
    doc.setTextColor(primaryColor);
    doc.text('Formulario de Inventario', pageWidth / 2, 25, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Página ${pageNumber}`, pageWidth - 20, 20, { align: 'right' });
  };

  // Función para añadir pie de página
  const addFooter = () => {
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('GLOOVE TU ALOJAMIENTO TURÍSTICO S.L. | CIF: B-54796925', pageWidth / 2, pageHeight - 10, { align: 'center' });
  };

  // Función para añadir una sección
  const addSection = (title: string, content: (startY: number) => number, currentPage: number) => {
    let yPos = currentPage === 1 ? 40 : 20;

    doc.setFillColor(primaryColor);
    doc.rect(10, yPos, pageWidth - 20, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(title, 15, yPos + 7);

    yPos += 15;
    yPos = content(yPos);

    if (yPos > pageHeight - 30) {
      doc.addPage();
      currentPage++;
      addHeader(currentPage);
      addFooter();
      yPos = 40;
    }

    return { yPos, currentPage };
  };

  // Iniciar primera página
  let currentPage = 1;
  addHeader(currentPage);
  addFooter();

  // Sección: DISTRIBUCIÓN
  let result = addSection('DISTRIBUCIÓN', (startY) => {
    const tableBody = [
      ['Superficie vivienda', data.distribucion.superficieVivienda.toString()],
      ['Superficie parcela', data.distribucion.superficieParcela.toString()],
      ['Ascensor', data.distribucion.ascensor ? 'Sí' : 'No'],
      ['Ocupación máxima adultos con niños', data.distribucion.ocupacionMaxAdultosNinos.toString()],
      ['Ocupación máxima sólo adultos', data.distribucion.ocupacionMaxSoloAdultos.toString()],
    ];

    autoTable(doc, {
      startY: startY,
      head: [['Campo', 'Valor']],
      body: tableBody,
      theme: 'striped',
      headStyles: { fillColor: [21, 107, 122] },
    });

    return (doc as any).lastAutoTable.finalY + 10;
  }, currentPage);

  // Sección: DORMITORIOS
  result = addSection('DORMITORIOS', (startY) => {
    const tableBody = [
      ['Número dormitorios', data.dormitorios.numDormitorios.toString()],
      ['Zonas comunes', data.dormitorios.zonasComunes],
    ];

    autoTable(doc, {
      startY: startY,
      head: [['Campo', 'Valor']],
      body: tableBody,
      theme: 'striped',
      headStyles: { fillColor: [21, 107, 122] },
    });

    return (doc as any).lastAutoTable.finalY + 10;
  }, result.currentPage);

  // Sección: BAÑOS
  result = addSection('BAÑOS', (startY) => {
    const tableBody = [
      ['Baños con bañera', data.banos.banosBanera.toString()],
      ['Baños con ducha', data.banos.banosDucha.toString()],
      ['Aseos', data.banos.aseos.toString()],
      ['Sauna', data.banos.sauna ? 'Sí' : 'No'],
      ['Jacuzzi', data.banos.jacuzzi ? 'Sí' : 'No'],
      ['Secador', data.banos.secador ? 'Sí' : 'No'],
      ['Toallas', data.banos.toallas],
      ['Cambio de toallas', data.banos.cambioToallas],
    ];

    autoTable(doc, {
      startY: startY,
      head: [['Campo', 'Valor']],
      body: tableBody,
      theme: 'striped',
      headStyles: { fillColor: [21, 107, 122] },
    });

    return (doc as any).lastAutoTable.finalY + 10;
  }, result.currentPage);

  // Sección: COCINA
  result = addSection('COCINA', (startY) => {
    const tableBody = [
      ['Número de cocinas', data.cocina.numCocinas.toString()],
      ['Clase', data.cocina.clase],
      ['Tipo', data.cocina.tipo],
      ['Utensilios cocina', data.cocina.utensiliosCocina ? 'Sí' : 'No'],
      ['Cafetera', data.cocina.cafetera ? 'Sí' : 'No'],
      ['Freidora', data.cocina.freidora ? 'Sí' : 'No'],
      ['Tostadora', data.cocina.tostadora ? 'Sí' : 'No'],
    ];

    autoTable(doc, {
      startY: startY,
      head: [['Campo', 'Valor']],
      body: tableBody,
      theme: 'striped',
      headStyles: { fillColor: [21, 107, 122] },
    });

    return (doc as any).lastAutoTable.finalY + 10;
  }, result.currentPage);

  // Sección: ACCESORIOS DEL HOGAR
  result = addSection('ACCESORIOS DEL HOGAR', (startY) => {
    const tableBody = [
      ['Ropa de cama', data.accesoriosHogar.ropaCama],
      ['Cambio de ropa', data.accesoriosHogar.cambioRopa],
      ['Lavadora', data.accesoriosHogar.lavadora ? 'Sí' : 'No'],
      ['Secadora', data.accesoriosHogar.secadora ? 'Sí' : 'No'],
      ['Televisión', data.accesoriosHogar.television ? 'Sí' : 'No'],
      ['Televisores', data.accesoriosHogar.televisores],
      ['TV Satélite', data.accesoriosHogar.tvSatelite ? 'Sí' : 'No'],
      ['Radio', data.accesoriosHogar.radio ? 'Sí' : 'No'],
      ['Idiomas TV Satélite', data.accesoriosHogar.idiomasTvSatelite.join(', ')],
      ['Mosquiteras', data.accesoriosHogar.mosquiteras],
      ['Ventiladores', data.accesoriosHogar.ventiladores.toString()],
      ['DVD', data.accesoriosHogar.dvd],
      ['Aparatos eléctricos anti-mosquitos', data.accesoriosHogar.aparatosAntiMosquitos.toString()],
    ];

    autoTable(doc, {
      startY: startY,
      head: [['Campo', 'Valor']],
      body: tableBody,
      theme: 'striped',
      headStyles: { fillColor: [21, 107, 122] },
    });

    return (doc as any).lastAutoTable.finalY + 10;
  }, result.currentPage);

  // Sección: CARACTERÍSTICAS ADICIONALES
  addSection('CARACTERÍSTICAS ADICIONALES', (startY) => {
    const tableBody = [
      ['Acceso internet', data.caracteristicasAdicionales.internetAccess],
      ['Caja fuerte', data.caracteristicasAdicionales.safeBox ? 'Sí' : 'No'],
      ['Mini bar', data.caracteristicasAdicionales.miniBar ? 'Sí' : 'No'],
      ['Cerradura electrónica asociada', data.caracteristicasAdicionales.electronicLock],
      ['Código de puerta', data.caracteristicasAdicionales.doorCode],
      ['Aparcamiento', data.caracteristicasAdicionales.parking],
      ['Ubicación del aparcamiento', data.caracteristicasAdicionales.parkingLocation],
      ['Plazas de aparcamiento', data.caracteristicasAdicionales.parkingSpaces],
      ['Tipo de aparcamiento', data.caracteristicasAdicionales.parkingType],
      ['Aire acondicionado', data.caracteristicasAdicionales.airConditioning],
      ['Calefacción', data.caracteristicasAdicionales.heating],
      ['Adaptado discapacitados', data.caracteristicasAdicionales.disabledAccess],
      ['Jardín', data.caracteristicasAdicionales.jardin ? 'Sí' : 'No'],
      ['Mobiliario jardín', data.caracteristicasAdicionales.mobiliarioJardin ? 'Sí' : 'No'],
      ['Barbacoa', data.caracteristicasAdicionales.barbacoa ? 'Sí' : 'No'],
      ['Chimenea', data.caracteristicasAdicionales.chimenea ? 'Sí' : 'No'],
      ['Parcela vallada', data.caracteristicasAdicionales.parcelaVallada ? 'Sí' : 'No'],
      ['Terraza', data.caracteristicasAdicionales.terraza ? 'Sí' : 'No'],
      ['Alarma', data.caracteristicasAdicionales.alarma ? 'Sí' : 'No'],
      ['Gimnasio', data.caracteristicasAdicionales.gimnasio ? 'Sí' : 'No'],
      ['Squash', data.caracteristicasAdicionales.squash ? 'Sí' : 'No'],
      ['Balcón', data.caracteristicasAdicionales.balcon ? 'Sí' : 'No'],
      ['Pádel', data.caracteristicasAdicionales.padel ? 'Sí' : 'No'],
      ['Tenis', data.caracteristicasAdicionales.tenis ? 'Sí' : 'No'],
      ['Zona infantil', data.caracteristicasAdicionales.zonaInfantil ? 'Sí' : 'No'],
      ['Spa', data.caracteristicasAdicionales.spa ? 'Sí' : 'No'],
      ['Animales', data.caracteristicasAdicionales.animals],
      ['Peso límite', data.caracteristicasAdicionales.weightLimit.toString()],
      ['No se aceptan animales de raza potencialmente peligrosa', data.caracteristicasAdicionales.noDangerousAnimals ? 'Sí' : 'No'],
      ['Piscina', data.caracteristicasAdicionales.pool],
      ['Piscina climatizada', data.caracteristicasAdicionales.heatedPool],
      ['No se aceptan grupos de jóvenes', data.caracteristicasAdicionales.noYoungGroups ? 'Sí' : 'No'],
      ['No se admite fumar', data.caracteristicasAdicionales.noSmoking ? 'Sí' : 'No'],
      ['Características adicionales', data.caracteristicasAdicionales.additionalFeatures],
    ];

    autoTable(doc, {
      startY: startY,
      head: [['Campo', 'Valor']],
      body: tableBody,
      theme: 'striped',
      headStyles: { fillColor: [21, 107, 122] },
    });

    return (doc as any).lastAutoTable.finalY + 10;
  }, result.currentPage);

  return doc;
};
