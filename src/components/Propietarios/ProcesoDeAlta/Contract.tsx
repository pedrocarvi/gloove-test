import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import SignatureCanvas from "react-signature-canvas";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import Swal from "sweetalert2";
import { generateContractPDF } from "@/utils/contractPdfGenerator";

interface ContractProps {
  onAccept: () => void;
  initialValues?: any;
}

const Contract: React.FC<ContractProps> = ({
  onAccept,
  initialValues = {},
}) => {
  const [formData, setFormData] = useState<any>(initialValues);
  const [technicalFormData, setTechnicalFormData] = useState<any>(null);
  const [isSigned, setIsSigned] = useState(!!initialValues.signature);
  const [contractText, setContractText] = useState<string>("");
  const { user } = useAuth();
  const sigCanvas = useRef<SignatureCanvas>(null);

  const contractTextExample = `
    En Elche a [Fecha Alta] de 2024
    REUNIDOS
    De una parte, Don/Doña [Propietario], mayor de edad, con NIF [DNI], y domicilio a efectos de notificaciones en [Domicilio] Y, de otra parte, D. Víctor Verdú Vera, mayor de edad, con NIF.- 44767057 H y domicilio en Calle Reyes Católicos 25, entresuelo, ELDA (ALICANTE)

    INTERVIENEN
    Don/Doña [Propietario] en representación de propietario/a del inmueble situado en la ciudad de [Ciudad], CL [Dirección Exacta] e identificado con la referencia catastral [numCatastro], y número de VUT [Número VUT] en adelante, LA PROPIEDAD. 
    D. Víctor Verdú Vera en nombre y representación de la mercantil GLOOVE TU ALOJAMIENTO TURISTICO S.L con CIF- B-54796925, en adelante La Gestora o “GLOOVE”.

    EXPONEN
    Que. [Propietario] es propietario en pleno dominio de la/s vivienda/s vacacional/es, que se reseña/n a continuación, completamente amueblada y equipada al efecto.
    […..]
    […..]
    Que las citadas viviendas se hallan libres de ocupantes o arrendatarios, de cualquier carga o gravámenes y al corriente en el pago de comunidad, impuestos, tasas y arbitrios que gravan las mismas.

    Que LA PROPIEDAD desea arrendar en actividad vacacional los inmuebles descritos en el expositivo I, estando interesada, a tal fin, en contratar los servicios de gestión de GLOOVE. 
    Que GLOOVE tiene como actividad principal la explotación y gestión del negocio de alojamientos turísticos, viviendas vacacionales, hoteles y otros alojamientos de corta y larga estancia. 

    Para el desarrollo de su actividad cuenta con los recursos materiales y humanos * necesarios para la explotación y gestión integral de inmuebles, tanto en régimen de hospedaje turístico como en régimen de arrendamiento de larga temporada.

    * Consultar zona geográfica 

    Que las partes, de mutuo acuerdo y reconociéndose capacidad legal suficiente, 

    ACUERDAN

    PRIMERO. - AUTORIZACIÓN Y DURACIÓN DEL CONTRATO

    LA PROPIEDAD autoriza a GLOOVE para que, a partir de la fecha de firma del presente acuerdo, promuevan el arrendamiento de las viviendas vacacionales a las que nos hemos referido en el expositivo I. 
    LOS PROPIETARIOS otorgan a GLOOVE cuantas facultades sean necesarias para, en su representación, poder celebrar estos contratos de arrendamientos y realizar cualquier actuación necesaria para el debido 
    cumplimiento de todos los acuerdos contenidos en el presente, igualmente para posicionamiento web, difusión, promoción y cualquier otra actuación destinada al buen fin de los servicios ofertados.  Sin perjuicio de la debida rendición de cuentas, estos contratos de arrendamiento se realizarán sin necesidad de preaviso a LA PROPIEDAD.

    Los arrendamientos que se realicen como consecuencia de la captación de los clientes interesados en la finca objeto del presente contrato serán única y exclusivamente de temporadas regulados en el art. 3, párrafo 2 de la ley 29/1994 de Arrendamientos Urbanos. GLOOVE se obliga a respetar escrupulosamente dicha Ley y a desarrollar su actividad referida solamente a los arrendamientos de temporada tal y como están descritos en esta norma.
    LA PROPIEDAD, con la firma del presente, entrega a GLOOVE las llaves de las viviendas indicadas en el expositivo I. 
    La duración de este acuerdo es de 1 AÑO, prorrogándose automáticamente, en periodos anuales, si ambas partes estuvieran de acuerdo.
    LA PROPIEDAD podrá desistir libremente de este contrato llegados los vencimientos, sin perjuicio de que se deberá respetar los contratos de arrendamiento que a fecha del desistimiento se hayan podido celebrar. En el supuesto que se tuviese que desviar al cliente porque no se puede respetar la estancia del cliente, la propiedad asumirá los sobrecostes que  pudieran generarse, incluido los servicios contratados  a GLOOVE.

    Las partes reconocen que, en la actualidad, se está tramitando a nivel nacional una ley para la regularización del alquiler de viviendas a viajeros nacionales y extranjeros. Si el articulado de la citada Ley dejase fuera de la misma todo o parte del condicionado del presente contrato, podrá ser 
    causa suficiente para la rescisión del mismo a propuesta de cualquiera de las partes.

    SEGUNDO. -SERVICIOS DE LA GESTORA

    Visita presencial del inmueble, creación descriptiva detallada del mismo incluyendo fotografías interiores y exteriores, propuesta estimativa de precios acorde mercado según tipología y ubicación del inmueble.
    Creación y alta del inmueble en la página web de los intermediarios y en cuantas páginas webs, propias o de terceros, considere oportunas para promover el arrendamiento de las viviendas vacacionales, como Booking, Airbnb, VRBO, Expedia, Google, etc… Igualmente, podrá adoptar y llevar a cabo todas las medidas de marketing y venta que considere oportunas, tales como mailings, anuncios, colaboración con otras agencias, colaboración con oficinas de turismo, relaciones públicas, venta activa a través de su propio personal, etc.
    Gestión de reservas, pre-reservas, confirmación de reservas con envío de documentación, gestión de los calendarios de ocupaciones, organización de entradas y salidas, entrega de llaves, acceso a las viviendas, avisos e instrucciones al personal de limpieza y mantenimiento, gestión de cobros y pagos.
    Servicio de Atención al cliente y a la propiedad, servicio que contará, como mínimo, de un teléfono de servicio 24h.
    Gestión del servicio de limpieza inicial a fondo y servicio de limpieza, lavandería y preparación de la vivienda para cada entrada de clientes. 
    Los gastos derivados por el desarrollo de la actividad como limpieza, lavandería y los directos de la explotación serán gestionados por LA GESTORA, dichos gastos serán implementados al precio de la estancia y por tanto abonados por el huésped.
    En el caso de requerir y/o necesitar una limpieza inicial para la optimización y buen estado del inmueble, GLOOVE se encargará de la misma repercutiendo el gasto a la PROPIEDAD.

    GLOOVE deberá atender cualquier reparación necesaria tan pronto como le sea posible desde que se tenga conocimiento. Todas las obras, arreglos o mejoras, que superen los 100€ se pondrán en conocimiento inmediato de LA PROPIEDAD, para su visto bueno o, en caso contrario, para que las contrate de modo directo e inmediato. Ello, sin perjuicio de:

    Que el pago de estas obras de conservación, reparación y mantenimiento, en todo caso, serán abonadas por LA PROPIEDAD. 

    Que, en caso de que los deterioros se deban a un uso indebido, negligente o doloso de la vivienda, su mobiliario, equipamiento y enseres, GLOOVE facilitará a LA PROPIEDAD cuantos datos conozcan sobre los posibles responsables de estos daños, a fin de que LA PROPIEDAD pueda dar parte al seguro. Igualmente, la fianza depositada por el cliente final será retenida y aplicada a sufragar estos gastos.

    GLOOVE realizará una inversión inicial en cada vivienda, correspondiente a la instalación del sistema informático, cerradura electrónica, Channel Manager, PMS personalizado y Plataforma de Reservas GLOOVE. 

    Dicha inversión será por cuenta exclusiva de GLOOVE y por tanto la misma será propiedad de GLOOVE.

    Siendo obligación de GLOOVE la gestión de los cobros y pagos, se realizará la correspondiente liquidación de los mismos dentro de los 10 primeros días de cada mes. 

    GLOOVE liquidará a LA PROPIEDAD las rentas cobradas, con su correspondiente IVA e impuestos que en cada momento resulten vigentes.

    Igualmente GLOOVE queda autorizada, en su caso, a la liquidación de los gastos en los que se haya incurrido para la explotación de los inmuebles objeto de este contrato, repercutiéndolos a la explotación siempre que  sean imputables a la gestión  propia de los mismos, como por ejemplo:

    1.Las comisiones de las agencias de viaje online - “OTAS”. Pasarelas de pago y plataformas de gestión de fianzas.
    2.Honorarios y/o comisiones de otros intermediarios, con los que  GLOOVE  colabore.
    3.Los gastos de mantenimiento.
    4.Los gastos de los servicios y suministros 
    5.Los gastos por obras de conservación, reparación y mantenimiento, de los inmuebles, su mobiliario, equipamiento y enseres, incluidas la sustitución de los bienes citados cuando sea antieconómica su reparación para un uso normal y en buen estado de ornato.
    6.El alcantarillado y servicio de recogida de basuras, IBI, comunidad de propietarios o cualquier otro impuesto, arbitrio o tasa derivado de la mera propiedad.
    7.Los derivados de las mejoras que se acuerden entre la propiedad y la intermediadora.
    8.Los derivados de la contratación del seguro o seguros que cubra: (en caso de no contratar la propiedad)
    a.	Los daños y perjuicios que puedan sufrir los inmuebles y su mobiliario, tanto por accidentes como por actos vandálicos, robo y/o hurto.
    b.	La responsabilidad civil a los ocupantes o clientes finales, incluido, en su caso, en las zonas comunes, terraza, garaje, jardín, piscina y demás zonas con derecho a uso.

    TERCERO. - OBLIGACIONES Y RESPONSABILIDADES DE LA PROPIEDAD

    Serán por cuenta de LA PROPIEDAD los gastos de los suministros de luz, agua, gas, pellet, etc.…, así como de todos los tributos que conlleve dicha vivienda. 
    Serán por cuenta de la propiedad y acorde a ley la contratación y mantenimiento de internet WIFI.
    En cuanto al gas, sólo si la vivienda estuviera preparada para gas ciudad e internet WIFI, LA PROPIEDAD se obliga a garantizar que los suministros no sufrirán cortes por impagos o baja de los contratos.
    Los de conservación, reparación y mantenimiento, en los términos expresados en el anterior acuerdo segundo.
    Será inicialmente por cuenta de LA PROPIEDAD la dotación mínima de tres juegos completos de ajuares (ropa de cama y baño) que requiera la vivienda en base al número máximo de huéspedes que pueda albergar la misma. 
    Aquellos equipos domóticos optativos que requiera el inmueble para su máxima rentabilidad, éxito y funcionamiento. (Consultar con GLOOVE)
    El propietario deberá disponer de Licencia Turística o del permiso de uso turístico del alojamiento (V.U.T) emitida por el órgano competente en cada Comunidad Autónoma y es de su deber cumplir con la declaración correspondiente emitida.
    La vivienda deberá estar en perfecto estado de uso, equipamientos, mobiliario, limpieza, ajuares, wifi y servicios básicos el día de la 
    entrada en vigor en el sistema de gestión GLOOVE.

    CUARTO. -PRECIOS Y PAGO DEL ALQUILER.

    Los precios serán establecidos por Gloove Tu Alojamiento Turístico, velando por la optimización en la venta, comercialización y rentabilidad para la parte propietaria.
    Gloove se reserva el derecho de modificar dichos precios en función de temporada del año, ofertas, descuentos por baja ocupación y/o reservas de “último minuto”, al igual que las penalizaciones por cancelación de la reserva que se aplicarán. 

    De las rentas cobradas descontando el importe de limpieza, incluidas las penalizaciones por cancelación, corresponderá a GLOOVE percibir por:

    Gestión Integral……………………… 20 %.      
                            (Comercialización, Check-in, Comunicación a las Autoridades, 
                              Gestión de limpieza y lavandería, Entrega de Amenities y Kits)


    Las partes acuerdan la contratación para los activos vacacionales del
    presente contrato la GESTIÓN INTEGRAL

    El importe correspondiente a LA PROPIEDAD le será transferido dentro de los 10 primeros días de cada mes vencido. Igualmente, dentro del mismo plazo, GLOOVE remitirá a LA PROPIEDAD un listado de los contratos celebrados, duración y rentas cobradas. 


    QUINTO. – SEGURO 

    LA PROPIEDAD se obliga a tener contratado, para cada vivienda, un seguro de hogar ampliado al régimen de alquiler para asegurar:

    Daños graves causados por los inquilinos, cuya cuantía supere mínimo los 100 €. 
    La responsabilidad civil para el caso que el cliente final sufra daños y perjuicios en la vivienda y, en su caso, terraza, garaje, jardín, piscina y demás zonas con derecho a uso.
    Actos vandálicos, robo y/o hurto.

    SEXTO. - RESOLUCIÓN.


    Este acuerdo tendrá una duración mínima de 12 meses, pasados los cuales podrá ser rescindido unilateralmente por cualquiera de las partes con un preaviso mínimo de 30 días naturales. Si, a la finalización del acuerdo, existiesen reservas futuras el Propietario se compromete a pagar un 20 % según el acuerdo contratado de gestión con Gloove (más IVA) de comisión por la obtención de dichas reservas.


    El incumplimiento del período mínimo, o del preaviso, dará derecho a GLOOVE a percibir la cantidad correspondiente por reubicación de las reservas existentes en el caso de que ésta sea por un importe superior a las reservas efectuadas en su propiedad. 

    En el caso de que algunas de las partes quisieran resolver el contrato, GLOOVE procedería a la desinstalación de la cerradura electrónica y en su caso, todos los equipos domóticos instalados y que sean propiedad de GLOOVE, salvo que ambas partes lleguen a un acuerdo.

    SÉPTIMO. – FUERO Y COMUNICACIÓN

    Las partes acuerdan como medio de comunicación los siguientes correos electrónicos, en caso de cambio de los mismos se deberá comunicar de manera fehaciente. 

    admin@gloove.me
    [Email]

    Igualmente se someten de forma expresa, para cualquier disputa o interpretación que pudiera suscitar el cumplimiento del presente contrato, a los Juzgados y Tribunales de Alicante.

    Y, con el carácter expresado en su intervención, y de plena conformidad con el contenido del mismo, las partes firman el presente documento por duplicado, en todas sus hojas.



    FDO. LA PROPIEDAD			                 FDO. GLOOVE
  `;

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const technicalFormRef = doc(
          db,
          `propietarios/${user.uid}/proceso_de_alta/technical_form`
        );
        const technicalFormSnap = await getDoc(technicalFormRef);
        if (technicalFormSnap.exists()) {
          setTechnicalFormData(technicalFormSnap.data());
        }
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (technicalFormData) {
      const replaceContractPlaceholders = (text: string, data: any) => {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}/${
          currentDate.getMonth() + 1
        }/${currentDate.getFullYear()}`;

        return text
          .replace("[Fecha Alta]", formattedDate)
          .replace("[Propietario]", data.propietario || "")
          .replace("[DNI]", data.dni || "")
          .replace(
            "[Domicilio]",
            `${data.direccion}, ${data.cPostal}, ${data.ciudad}, ${data.provincia}` ||
              ""
          )
          .replace("[Ciudad]", data.ciudad || "")
          .replace("[Dirección Exacta]", data.direccion || "")
          .replace("[numCatastro]", data.numCatastro || "")
          .replace("[Número VUT]", data.numeroVUT || "")
          .replace("[Email]", data.email || "");
      };

      const updatedText = replaceContractPlaceholders(
        contractTextExample,
        technicalFormData
      );
      setContractText(updatedText);
    }
  }, [technicalFormData]);

  const handleSign = () => {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current
        .getTrimmedCanvas()
        .toDataURL("image/png");
      setFormData({ ...formData, signature: dataURL });
      setIsSigned(true);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const contractData = {
        propietario: technicalFormData.propietario,
        dni: technicalFormData.DNI,
        domicilio: `${technicalFormData.direccion}, ${technicalFormData.cPostal}, ${technicalFormData.ciudad}, ${technicalFormData.provincia}`,
        ciudad: technicalFormData.ciudad,
        direccion: technicalFormData.direccion,
        numCatastro: technicalFormData.numCatastro,
        numeroVUT: technicalFormData.numeroVUT,
        email: technicalFormData.email,
        signature: formData.signature,
      };

      // Firma de empleado predeterminada (puedes ajustarla según sea necesario)
      const employeeSignature =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAYAAADQmU3KAAAA...";

      // Generar el PDF del contrato
      const pdfDoc = await generateContractPDF(
        contractData,
        contractText,
        employeeSignature
      );
      const pdfData = pdfDoc.output("datauristring");

      // Subir el PDF a Firebase Storage
      const storage = getStorage();
      const pdfRef = ref(
        storage,
        `DocumentacionPropietarios/Contratos/contract_${user.uid}.pdf`
      );
      await uploadString(pdfRef, pdfData, "data_url");

      const pdfUrl = await getDownloadURL(pdfRef);

      // Guardar la referencia del PDF en Firestore
      const docRef = doc(
        db,
        `propietarios/${user.uid}/proceso_de_alta/contract`
      );
      await setDoc(docRef, { ...formData, pdfUrl });

      await updateDoc(doc(db, "users", user.uid), {
        processStatus: "inventory_form",
        currentStep: 5,
      });

      Swal.fire({
        icon: "success",
        title: "Contrato guardado",
        text: "El contrato ha sido guardado. Puedes proceder al siguiente paso.",
      });
      onAccept();
    } catch (error) {
      console.error("Error al generar o guardar el contrato:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al generar o guardar el contrato. Por favor, inténtalo de nuevo.",
      });
    }
  };

  if (!technicalFormData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
        <h2 className="text-4xl font-bold mb-8 text-primary-dark text-center">
          Contrato
        </h2>
        <pre className="whitespace-pre-wrap mb-4">{contractText}</pre>
        {isSigned && (
          <img
            src={formData?.signature}
            alt="Signature"
            className="my-4 w-48 h-48 object-cover border border-gray-300 rounded-md"
          />
        )}
        {!isSigned && (
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              className:
                "signature-canvas w-full h-64 border border-gray-300 rounded-md",
            }}
          />
        )}
        <div className="flex justify-between mt-4">
          {!isSigned && (
            <button
              onClick={handleSign}
              className="py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Firmar
            </button>
          )}
          {isSigned && (
            <button
              onClick={handleSubmit}
              className="py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Enviar Contrato
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contract;
