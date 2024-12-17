// pdfGenerator.ts
import jsPDF from "jspdf";
import GlooveLogo from "../../../assets/gloove-pdf-logo.jpg";
import GlooveLogo2 from "../../../assets/gloove-logo.jpg";

export const ContractPdf = (
  technicalFormData: any,
  step1Data: any,
  signatureDataUrl: any
): string => {
  const pdfDoc = new jsPDF();
  
  const marginLeft = 50; 
  const marginRight = 50;  
  const pageWidth = pdfDoc.internal.pageSize.width; 
  // const centerX = pageWidth / 2;
  // Calcular el ancho disponible para el texto
  const availableWidth = pageWidth - marginLeft - marginRight;

  // Pagina 1
  const logoWidth = 100; 
  const logoHeight = 40; 
  const logoX = (pageWidth - logoWidth) / 2;
  pdfDoc.addImage(GlooveLogo, "PNG", logoX, 10, logoWidth, logoHeight);
  pdfDoc.setFont("Helvetica", "bold");
  pdfDoc.setFontSize(20);
  pdfDoc.setTextColor(21, 107, 122); 
  pdfDoc.text("CONTRATO DE SERVICIO", 105, 70, { align: "center" });
  pdfDoc.setFont("Helvetica", "normal"); 
  pdfDoc.setFontSize(15); 
  pdfDoc.setTextColor(0, 0, 0); 
  pdfDoc.text(`En Elche a [FECHA] de 2024`, 105, 280, { align: "center" });

  // Página 2
  pdfDoc.addPage();
  pdfDoc.addImage(GlooveLogo2, "PNG", 10, 10, 40, 14); 
  pdfDoc.setFontSize(12);
  pdfDoc.setFont("Helvetica", "bold");
  pdfDoc.text("REUNIDOS", pageWidth / 2, 30, { align: "center" });
  pdfDoc.setFont("Helvetica", "normal");
  const justifiedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const lines = pdfDoc.splitTextToSize(text, maxWidth);
    lines.forEach((line: any, i: any) => {
      pdfDoc.text(line.trim(), x, y + i * lineHeight);
    });
  };
  justifiedText(
    `De una parte, Don/Doña ${technicalFormData.propietario}, mayor de edad, con NIF ${step1Data.dni}, y domicilio a efectos 
    de notificaciones en ${technicalFormData.direccion}.`,
    20, 40, 400, 8
  );
  justifiedText(
    `Y, de otra parte, D. Víctor Verdú Vera, mayor de edad, con NIF.- 44767057H y domicilio 
    en Calle Reyes Católicos 25, entresuelo, ELDA (ALICANTE).`,
    20, 58, 400, 8
  );
  pdfDoc.setFontSize(12);
  pdfDoc.setFont("Helvetica", "bold");
  pdfDoc.text("INTERVIENEN", pageWidth / 2, 80, { align: "center" });
  pdfDoc.setFont("Helvetica", "normal");
  justifiedText(
    `Don/Doña ${technicalFormData.propietario} en representación de propietario/a del inmueble situado en la 
    ciudad de ${technicalFormData.ciudad}, CL ${technicalFormData.direccionExacta},  e identificado con la referencia catastral 
    ${technicalFormData.numCatastro} y número de VUT ${technicalFormData.numVUT}, en adelante, LA PROPIEDAD.`,
    20, 90, 300, 8
  );
  justifiedText(
    `D. Víctor Verdú Vera en nombre y representación de la mercantil GLOOVE TU ALOJAMIENTO 
    TURISTICO S.L con CIF- B-54796925, en adelante La Gestora o “GLOOVE”.`,
    20, 120, 400, 8
  );
  pdfDoc.setFontSize(12);
  pdfDoc.setFont("Helvetica", "bold");
  pdfDoc.text("EXPONEN", pageWidth / 2, 150, { align: "center" });
  pdfDoc.setFont("Helvetica", "normal");
  justifiedText(
    `1- Que ${technicalFormData.propietario} es propietario en pleno dominio de la/s vivienda/s vacacional/es, 
    que se reseña/n a continuación, completamente amueblada y equipada al efecto`,
    20, 160, 300, 8
  );
  justifiedText(
    `2- Que las citadas viviendas se hallan libres de ocupantes o arrendatarios, de cualquier carga
     o gravámenes y al corriente en el pago de comunidad, impuestos, tasas y arbitrios que gravan
    las mismas.`,
    20, 180, 300, 8
  );
  justifiedText(
    `3- Que LA PROPIEDAD desea arrendar en actividad vacacional los inmuebles descritos en el 
    expositivo I, estando interesada, a tal fin, en contratar los servicios de gestión de GLOOVE. `,
    20, 210, 300, 8
  );
  justifiedText(
    `4- Que GLOOVE tiene como actividad principal la explotación y gestión del negocio de 
    alojamientos turísticos, viviendas vacacionales, hoteles y otros alojamientos de corta 
    y larga estancia. `,
    20, 230, 300, 8
  );
  justifiedText(
    `  Para el desarrollo de su actividad cuenta con los recursos materiales y humanos * necesarios 
    para la explotación y gestión integral de inmuebles, tanto en régimen de hospedaje turístico 
    como en régimen de arrendamiento de larga temporada.`,
    20, 260, 300, 8
  );
  justifiedText(
    `  * Consultar zona geográfica`,
    20, 290, 300, 8
  );

    // Página 3
    pdfDoc.addPage();
    pdfDoc.addImage(GlooveLogo2, "PNG", 10, 10, 40, 14); 
    pdfDoc.setFontSize(12);
    pdfDoc.setFont("Helvetica", "normal");
    justifiedText(
      `Que las partes, de mutuo acuerdo y reconociéndose capacidad legal suficiente,` ,
      20, 30, 300, 8
    );
    pdfDoc.setFont("Helvetica", "bold");
    pdfDoc.text("ACUERDAN", pageWidth / 2, 40, { align: "center" });
    justifiedText(
      `PRIMERO. - AUTORIZACIÓN Y DURACIÓN DEL CONTRATO` ,
      20, 50, 300, 8
    );
    pdfDoc.setFont("Helvetica", "normal");
    justifiedText(
      `LA PROPIEDAD autoriza a GLOOVE para que, a partir de la fecha de firma del presente acuerdo, 
      promuevan el arrendamiento de las viviendas vacacionales a las que nos hemos referido en 
      el expositivo I. `,
      20, 60, 300, 8
    );
    justifiedText(
      `LOS PROPIETARIOS otorgan a GLOOVE cuantas facultades sean necesarias para, en su representación,
       poder celebrar estos contratos de arrendamientos y realizar cualquier actuación necesaria para 
       el debido cumplimiento de todos los acuerdos contenidos en el presente, igualmente para posicionamiento
      web, difusión, promoción y cualquier otra actuación destinada al buen fin de los servicios ofertados.  
      Sin perjuicio de la debida rendición de cuentas, estos contratos de arrendamiento se realizarán sin 
      necesidad de preaviso a LA PROPIEDAD.`,
      20, 85, 300, 8
    );
    justifiedText(
      `Los arrendamientos que se realicen como consecuencia de la captación de los clientes interesados 
      en la finca objeto del presente contrato serán única y exclusivamente de temporadas regulados en 
      el art. 3, párrafo 2 de la ley 29/1994 de Arrendamientos Urbanos. GLOOVE se obliga a respetar 
      escrupulosamente dicha Ley y a desarrollar su actividad referida solamente a los arrendamientos 
      de temporada tal y como están descritos en esta norma.`,
      20, 135, 300, 8
    );
    justifiedText(
      `LA PROPIEDAD, con la firma del presente, entrega a GLOOVE las llaves de las viviendas indicadas 
      en el expositivo I. `,
      20, 175, 300, 8
    );
    justifiedText(
      `La duración de este acuerdo es de 1 AÑO, prorrogándose automáticamente, en periodos anuales, 
      si ambas partes estuvieran de acuerdo.`,
      20, 195, 300, 8
    );
    justifiedText(
      `LA PROPIEDAD podrá desistir libremente de este contrato llegados los vencimientos, sin 
      perjuicio de que se deberá respetar los contratos de arrendamiento que a fecha del desistimiento 
      se hayan podido celebrar. En el supuesto que se tuviese que desviar al cliente porque no se puede 
      respetar la estancia del cliente, la propiedad asumirá los sobrecostes que  pudieran generarse, 
      incluido los servicios contratados  a GLOOVE.`,
      20, 215, 300, 8
    );
    justifiedText(
      `Las partes reconocen que, en la actualidad, se está tramitando a nivel nacional una ley para 
      la regularización del alquiler de viviendas a viajeros nacionales y extranjeros. Si el articulado 
      de la citada Ley dejase fuera de la misma todo o parte del condicionado del presente contrato, podrá 
      ser causa suficiente para la rescisión del mismo a propuesta de cualquiera de las partes. `,
      20, 255, 300, 8
    );

    // Página 4
    pdfDoc.addPage();
    pdfDoc.addImage(GlooveLogo2, "PNG", 10, 10, 40, 14); 
    pdfDoc.setFont("Helvetica", "bold");
    justifiedText(
      `SEGUNDO. -SERVICIOS DE LA GESTORA`,
      20, 40, 300, 8
    );
    pdfDoc.setFont("Helvetica", "normal");
    justifiedText(
      `a. Visita presencial del inmueble, creación descriptiva detallada del mismo incluyendo fotografías 
      interiores y exteriores, propuesta estimativa de precios acorde mercado según tipología y 
      ubicación del inmueble.`,
      20, 50, 300, 8
    );
    justifiedText(
      `b. Creación y alta del inmueble en la página web de los intermediarios y en cuantas páginas webs, 
      propias o de terceros, considere oportunas para promover el arrendamiento de las viviendas vacacionales, 
      como Booking, Airbnb, VRBO, Expedia, Google, etc… Igualmente, podrá adoptar y llevar a cabo todas las 
      medidas de marketing y venta que considere oportunas, tales como mailings, anuncios, colaboración con 
      otras agencias, colaboración con oficinas de turismo, relaciones públicas, venta activa a través de su 
      propio personal, etc.`,
      20, 75, 300, 8
    );
    justifiedText(
      `c. Gestión de reservas, pre-reservas, confirmación de reservas con envío de documentación, 
      gestión de los calendarios de ocupaciones, organización de entradas y salidas, entrega de llaves, 
      acceso a las viviendas, avisos e instrucciones al personal de limpieza y mantenimiento, gestión 
      de cobros y pagos.`,
      20, 125, 300, 8
    );
    justifiedText(
      `d. Servicio de Atención al cliente y a la propiedad, servicio que contará, como mínimo, 
      de un teléfono de servicio 24h.`,
      20, 160, 300, 8
    );
    justifiedText(
      `e. Gestión del servicio de limpieza inicial a fondo y servicio de limpieza, lavandería 
      y preparación de la vivienda para cada entrada de clientes.`,
      20, 180, 300, 8
    );
    justifiedText(
      `f. Los gastos derivados por el desarrollo de la actividad como limpieza, lavandería y 
      los directos de la explotación serán gestionados por LA GESTORA, dichos gastos serán 
      implementados al precio de la estancia y por tanto abonados por el huésped.`,
      20, 200, 300, 8
    ); 
    justifiedText(
      `g. En el caso de requerir y/o necesitar una limpieza inicial para la optimización y buen 
      estado del inmueble, GLOOVE se encargará de la misma repercutiendo el gasto a la PROPIEDAD.`,
      20, 225, 300, 8
    );   
    justifiedText(
      `GLOOVE deberá atender cualquier reparación necesaria tan pronto como le sea posible desde que
       se tenga conocimiento. Todas las obras, arreglos o mejoras, que superen los 100€ se pondrán en
        conocimiento inmediato de LA PROPIEDAD, para su visto bueno o, en caso contrario, para que 
        las contrate de modo directo e inmediato. Ello, sin perjuicio de:`,
      20, 245, 300, 8
    );    
    justifiedText(
      `1. Que el pago de estas obras de conservación, reparación y mantenimiento, en todo caso, 
      serán abonadas por LA PROPIEDAD.`,
      20, 280, 300, 8
    );    

    // Página 5
    pdfDoc.addPage();
    pdfDoc.addImage(GlooveLogo2, "PNG", 10, 10, 40, 14); 
    pdfDoc.setFontSize(12);
    pdfDoc.setFont("Helvetica", "normal");
    justifiedText(
      `2. Que, en caso de que los deterioros se deban a un uso indebido, negligente o doloso de la 
      vivienda, su mobiliario, equipamiento y enseres, GLOOVE facilitará a LA PROPIEDAD cuantos datos
      conozcan sobre los posibles responsables de estos daños, a fin de que LA PROPIEDAD pueda dar
      parte al seguro. Igualmente, la fianza depositada por el cliente final será retenida y aplicada
      a sufragar estos gastos.`,
      20, 30, 300, 8
    ); 
    justifiedText(
      `h. GLOOVE realizará una inversión inicial en cada vivienda, correspondiente a la instalación 
      del sistema informático, cerradura electrónica, Channel Manager, PMS personalizado y Plataforma 
      de Reservas GLOOVE.`,
      20, 75, 300, 8
    ); 
    justifiedText(
      `Dicha inversión será por cuenta exclusiva de GLOOVE y por tanto la misma será propiedad de GLOOVE.`,
      20, 100, 300, 8
    ); 
    justifiedText(
      `Siendo obligación de GLOOVE la gestión de los cobros y pagos, se realizará la correspondiente 
      liquidación de los mismos dentro de los 10 primeros días de cada mes.`,
      20, 115, 300, 8
    ); 
    justifiedText(
      `GLOOVE liquidará a LA PROPIEDAD las rentas cobradas, con su correspondiente IVA e impuestos que 
      en cada momento resulten vigentes.`,
      20, 135, 300, 8
    ); 
    justifiedText(
      `Igualmente GLOOVE queda autorizada, en su caso, a la liquidación de los gastos en los que se 
      haya incurrido para la explotación de los inmuebles objeto de este contrato, repercutiéndolos a
      la explotación siempre que  sean imputables a la gestión  propia de los mismos, como por ejemplo:`,
      20, 155, 300, 8
    ); 
    justifiedText(
      `1.Las comisiones de las agencias de viaje online - “OTAS”. Pasarelas de pago y plataformas 
      de gestión de fianzas.`,
      20, 180, 300, 8
    ); 
    justifiedText(
      `2.Honorarios y/o comisiones de otros intermediarios, con los que  GLOOVE  colabore.`,
      20, 195, 300, 8
    ); 
    justifiedText(
      `3.Los gastos de mantenimiento.`,
      20, 205, 300, 8
    ); 
    justifiedText(
      `4.Los gastos de los servicios y suministros `,
      20, 215, 300, 8
    ); 
    justifiedText(
      `5.Los gastos por obras de conservación, reparación y mantenimiento, de los inmuebles, 
      su mobiliario, equipamiento y enseres, incluidas la sustitución de los bienes citados 
      cuando sea antieconómica su reparación para un uso normal y en buen estado de ornato. `,
      20, 225, 300, 8
    ); 
    justifiedText(
      `6.El alcantarillado y servicio de recogida de basuras, IBI, comunidad de propietarios 
      o cualquier otro impuesto, arbitrio o tasa derivado de la mera propiedad.`,
      20, 250, 300, 8
    ); 
    justifiedText(
      `7.Los derivados de las mejoras que se acuerden entre la propiedad y la intermediadora.`,
      20, 270, 300, 8
    ); 
    justifiedText(
      `8.Los derivados de la contratación del seguro o seguros que cubra: (en caso de no 
      contratar la propiedad)`,
      20, 280, 300, 8
    ); 

     // Página 6
     pdfDoc.addPage();
     pdfDoc.addImage(GlooveLogo2, "PNG", 10, 10, 40, 14); 
     pdfDoc.setFontSize(12);
     pdfDoc.setFont("Helvetica", "normal");
     justifiedText(
       `  a.Los daños y perjuicios que puedan sufrir los inmuebles y su mobiliario, tanto por 
       accidentes como por actos vandálicos, robo y/o hurto.`,
       20, 30, 300, 8
     ); 
     justifiedText(
       `  b.La responsabilidad civil a los ocupantes o clientes finales, incluido, en su caso, 
       en las zonas comunes, terraza, garaje, jardín, piscina y demás zonas con derecho a uso.`,
       20, 50, 300, 8
     ); 
     pdfDoc.setFont("Helvetica", "bold");
     justifiedText(
       `TERCERO. - OBLIGACIONES Y RESPONSABILIDADES DE LA PROPIEDAD`,
       20, 70, 300, 8
     );
     pdfDoc.setFont("Helvetica", "normal");
     justifiedText(
       `a. Serán por cuenta de LA PROPIEDAD los gastos de los suministros de luz, agua, gas, 
       pellet, etc.…, así como de todos los tributos que conlleve dicha vivienda.`,
       20, 80, 300, 8
     ); 
     justifiedText(
      `b. Serán por cuenta de la propiedad y acorde a ley la contratación y mantenimiento 
      de internet WIFI.`,
      20, 100, 300, 8
    ); 
    justifiedText(
      `c, En cuanto al gas, sólo si la vivienda estuviera preparada para gas ciudad e internet 
      WIFI, LA PROPIEDAD se obliga a garantizar que los suministros no sufrirán cortes por 
      impagos o baja de los contratos.`,
      20, 120, 300, 8
    ); 
    justifiedText(
      `d. Los de conservación, reparación y mantenimiento, en los términos expresados en el 
      anterior acuerdo segundo.`,
      20, 150, 300, 8
    ); 
    justifiedText(
      `e. Será inicialmente por cuenta de LA PROPIEDAD la dotación mínima de tres juegos 
      completos de ajuares (ropa de cama y baño) que requiera la vivienda en base al número 
      máximo de huéspedes que pueda albergar la misma. `,
      20, 170, 300, 8
    );
    justifiedText(
      `f. Aquellos equipos domóticos optativos que requiera el inmueble para su máxima rentabilidad,
       éxito y funcionamiento. (Consultar con GLOOVE)`,
      20, 200, 300, 8
    ); 
    justifiedText(
      `g. El propietario deberá disponer de Licencia Turística o del permiso de uso turístico del 
      alojamiento (V.U.T) emitida por el órgano competente en cada Comunidad Autónoma y es de su 
      deber cumplir con la declaración correspondiente emitida.`,
      20, 220, 300, 8
    ); 
    justifiedText(
      `h. La vivienda deberá estar en perfecto estado de uso, equipamientos, mobiliario, limpieza, 
      ajuares, wifi y servicios básicos el día de la entrada en vigor en el sistema de gestión GLOOVE.`,
      20, 250, 300, 8
    ); 
    pdfDoc.setFont("Helvetica", "bold");
    justifiedText(
      `CUARTO. -PRECIOS Y PAGO DEL ALQUILER.`,
      20, 270, 300, 8
    );

     // Página 7
    pdfDoc.addPage();
    pdfDoc.addImage(GlooveLogo2, "PNG", 10, 10, 40, 14); 
    pdfDoc.setFontSize(12);
    pdfDoc.setFont("Helvetica", "normal");
    justifiedText(
      `a. Los precios serán establecidos por Gloove Tu Alojamiento Turístico, velando por la optimización 
      en la venta, comercialización y rentabilidad para la parte propietaria.`,
      20, 30, 300, 8
    ); 
    justifiedText(
      `Gloove se reserva el derecho de modificar dichos precios en función de temporada del año, ofertas, 
      descuentos por baja ocupación y/o reservas de “último minuto”, al igual que las penalizaciones 
      por cancelación de la reserva que se aplicarán.`,
      20, 50, 300, 8
    ); 
    justifiedText(
      `b. De las rentas cobradas descontando el importe de limpieza, incluidas las penalizaciones por 
      cancelación, corresponderá a GLOOVE percibir por:`,
      20, 80, 300, 8
    ); 
    pdfDoc.setFontSize(12);
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("- Gestión Integral", 20, 100); 
    pdfDoc.setFont("helvetica", "normal");
    pdfDoc.text("............................ 20 %.", 75, 100); // Puntos y porcentaje

    // Cuadro con la "X"
    pdfDoc.rect(130, 95, 8, 8); // Ajustar posición del cuadro más abajo
    pdfDoc.setFontSize(12);
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("X", 132, 101); // "X" dentro del cuadro

    // Detalles adicionales
    pdfDoc.setFont("helvetica", "normal");
    pdfDoc.setFontSize(10);
    pdfDoc.text(
      "(Comercialización, Check-in, Comunicación a las Autoridades,", 
      20, 
      110 
    );
    pdfDoc.text("Gestión de limpieza y lavandería, Entrega de Amenities y Kits)", 20, 115);

    justifiedText(
      `Las partes acuerdan la contratación para los activos vacacionales del presente 
      contrato la GESTIÓN INTEGRAL`,
      20, 125, 300, 8
    ); 
    justifiedText(
      `El importe correspondiente a LA PROPIEDAD le será transferido dentro de los 10 primeros días
      de cada mes vencido. Igualmente, dentro del mismo plazo, GLOOVE remitirá a LA PROPIEDAD un 
      listado de los contratos celebrados, duración y rentas cobradas. `,
      20, 145, 300, 8
    ); 
    pdfDoc.setFont("Helvetica", "bold");
    justifiedText(
      `QUINTO. – SEGURO `,
      20, 175, 300, 8
    );
    pdfDoc.setFont("helvetica", "normal");
    justifiedText(
      `LA PROPIEDAD se obliga a tener contratado, para cada vivienda, un seguro de hogar ampliado 
      al régimen de alquiler para asegurar: `,
      20, 185, 300, 8
    ); 
    justifiedText(
      `- Daños graves causados por los inquilinos, cuya cuantía supere mínimo los 100 €. `,
      20, 205, 300, 8
    ); 
    justifiedText(
      `- La responsabilidad civil para el caso que el cliente final sufra daños y perjuicios en 
      la vivienda y, en su caso, terraza, garaje, jardín, piscina y demás zonas con derecho a uso.`,
      20, 215, 300, 8
    ); 
    justifiedText(
      `- Actos vandálicos, robo y/o hurto.`,
      20, 235, 300, 8
    ); 
    pdfDoc.setFont("Helvetica", "bold");
    justifiedText(
      `SEXTO. - RESOLUCIÓN.`,
      20, 245, 300, 8
    );
    pdfDoc.setFont("helvetica", "normal");
    justifiedText(
      `Este acuerdo tendrá una duración mínima de 12 meses, pasados los cuales podrá ser rescindido 
      unilateralmente por cualquiera de las partes con un preaviso mínimo de 30 días naturales. Si, 
      a la finalización del acuerdo, existiesen reservas futuras el Propietario se compromete a pagar 
      un 20 % según el acuerdo contratado de gestión con Gloove (más IVA) de comisión por la obtención 
      de dichas reservas.`,
      20, 255, 300, 8
    );


     // Página 8
     pdfDoc.addPage();
     pdfDoc.addImage(GlooveLogo2, "PNG", 10, 10, 40, 14); 
     pdfDoc.setFontSize(12);
     pdfDoc.setFont("Helvetica", "normal");
     justifiedText(
       `El incumplimiento del período mínimo, o del preaviso, dará derecho a GLOOVE a percibir la 
       cantidad correspondiente por reubicación de las reservas existentes en el caso de que ésta 
       sea por un importe superior a las reservas efectuadas en su propiedad. `,
       20, 30, 300, 8
     ); 
     justifiedText(
      `En el caso de que algunas de las partes quisieran resolver el contrato, GLOOVE procedería a 
      la desinstalación de la cerradura electrónica y en su caso, todos los equipos domóticos 
      instalados y que sean propiedad de GLOOVE, salvo que ambas partes lleguen a un acuerdo. `,
      20, 60, 300, 8
    ); 
    pdfDoc.setFont("Helvetica", "bold");
    justifiedText(
      `SÉPTIMO. – FUERO Y COMUNICACIÓN.`,
      20, 90, 300, 8
    );
    pdfDoc.setFont("helvetica", "normal");
    justifiedText(
      `Las partes acuerdan como medio de comunicación los siguientes correos electrónicos, en caso 
      de cambio de los mismos se deberá comunicar de manera fehaciente. `,
      20, 100, 300, 8
    );
    justifiedText(
      `- admin@gloove.me`,
      20, 120, 300, 8
    );
    justifiedText(
      `- [EMAIL]`,
      20, 130, 300, 8
    );
    justifiedText(
      `Igualmente se someten de forma expresa, para cualquier disputa o interpretación que pudiera 
      suscitar el cumplimiento del presente contrato, a los Juzgados y Tribunales de Alicante. `,
      20, 150, 300, 8
    );
    justifiedText(
      `Y, con el carácter expresado en su intervención, y de plena conformidad con el contenido del 
      mismo, las partes firman el presente documento por duplicado, en todas sus hojas. `,
      20, 170, 300, 8
    );
    pdfDoc.setFont("Helvetica", "bold");
    if (signatureDataUrl) {
      const signatureWidth = 50; // Ancho de la firma en el PDF
      const signatureHeight = 20; // Alto de la firma en el PDF
      const xPosition = 20; // Coordenada X de la firma
      const yPosition = 220; // Coordenada Y de la firma
  
      pdfDoc.addImage(
        signatureDataUrl, // La firma como Data URL
        "PNG", // Formato de la imagen
        xPosition,
        yPosition,
        signatureWidth,
        signatureHeight
      );
    }
    pdfDoc.text("FDO. LA PROPIEDAD", 20, 250); 
    const textWidth = pdfDoc.getTextWidth("FDO. GLOOVE");
    pdfDoc.text("FDO. GLOOVE", pageWidth - textWidth - 20, 250);

    // Exportar como Data URI
  return pdfDoc.output("datauristring");
};
