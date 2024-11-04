import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { generateCorporatePDF } from "@/utils/pdfGenerator";

interface FormData {
  propietario: string;
  email: string;
  ciudad: string;
  provincia: string;
  direccion: string;
  cPostal: string;
  DNI: string;
  numCatastro: string;
  licenciaTuristica: boolean;
  numeroVUT: string;
  comPropietarios: boolean;
  tipoVivienda: string;
  exterior: boolean;
  interior: boolean;
  portero: boolean;
  porteroAutomatico: boolean;
  ascensor: boolean;
  garaje: boolean;
  garajeConcertado: boolean;
  facilAparcamiento: boolean;
  vistas: string;
  piscina: boolean;
  jardin: boolean;
  observaciones: string;
  zonasComunes: string;
  zonasTuristicas: string;
  accesibilidad: string;
  habitaciones: number;
  banos: number;
  aseos: number;
  duchas: number;
  baneras: number;
  trastero: boolean;
  mascotas: boolean;
  cocina: string;
  capacidadMaxima: number;
  camas: Array<{
    tipo: string;
    aireAcondicionado: boolean;
    calefaccion: boolean;
    ventilador: boolean;
    electrodomesticos: string;
    aguaCaliente: string;
    estadoPintura: string;
    reformaAno: string;
    estadoMobiliario: string;
    persianas: boolean;
    tv: boolean;
    mosquiteras: boolean;
  }>;
}

interface TechnicalFormProps {
  onAccept: () => void;
  initialValues?: FormData;
}

const TechnicalForm: React.FC<TechnicalFormProps> = ({
  onAccept,
  initialValues = {} as FormData,
}) => {
  const defaultCamas = new Array(6).fill(null).map(() => ({
    tipo: "",
    aireAcondicionado: false,
    calefaccion: false,
    ventilador: false,
    electrodomesticos: "",
    aguaCaliente: "",
    estadoPintura: "",
    reformaAno: "",
    estadoMobiliario: "",
    persianas: false,
    tv: false,
    mosquiteras: false,
  }));

  const [formData, setFormData] = useState<FormData>({
    propietario: initialValues.propietario ?? "",
    email: initialValues.email ?? "",
    ciudad: initialValues.ciudad ?? "",
    provincia: initialValues.provincia ?? "",
    direccion: initialValues.direccion ?? "",
    cPostal: initialValues.cPostal ?? "",
    DNI: initialValues.DNI ?? "",
    numCatastro: initialValues.numCatastro ?? "",
    licenciaTuristica: initialValues.licenciaTuristica ?? false,
    numeroVUT: initialValues.numeroVUT ?? "",
    comPropietarios: initialValues.comPropietarios ?? false,
    tipoVivienda: initialValues.tipoVivienda ?? "",
    exterior: initialValues.exterior ?? false,
    interior: initialValues.interior ?? false,
    portero: initialValues.portero ?? false,
    porteroAutomatico: initialValues.porteroAutomatico ?? false,
    ascensor: initialValues.ascensor ?? false,
    garaje: initialValues.garaje ?? false,
    garajeConcertado: initialValues.garajeConcertado ?? false,
    facilAparcamiento: initialValues.facilAparcamiento ?? false,
    vistas: initialValues.vistas ?? "",
    piscina: initialValues.piscina ?? false,
    jardin: initialValues.jardin ?? false,
    observaciones: initialValues.observaciones ?? "",
    zonasComunes: initialValues.zonasComunes ?? "",
    zonasTuristicas: initialValues.zonasTuristicas ?? "",
    accesibilidad: initialValues.accesibilidad ?? "",
    habitaciones: initialValues.habitaciones ?? 0,
    banos: initialValues.banos ?? 0,
    aseos: initialValues.aseos ?? 0,
    duchas: initialValues.duchas ?? 0,
    baneras: initialValues.baneras ?? 0,
    trastero: initialValues.trastero ?? false,
    mascotas: initialValues.mascotas ?? false,
    cocina: initialValues.cocina ?? "",
    capacidadMaxima: initialValues.capacidadMaxima ?? 0,
    camas: initialValues.camas ?? defaultCamas,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const docRef = doc(
          db,
          `propietarios/${user.uid}/proceso_de_alta/technical_form`
        );
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data() as FormData);
        }
      }
    };
    fetchData();
  }, [user]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: newValue });
    console.log("Changed form data", formData);
  };

  // const handleCamaChange = (index: number, name: string, value: any) => {
  //   const updatedCamas = formData.camas.map((cama, i) =>
  //     i === index ? { ...cama, [name]: value } : cama
  //   );
  //   setFormData({ ...formData, camas: updatedCamas });
  // };

  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault();
    if (isSubmitting || !user) return;

    if (!user) {
      console.error("El objeto 'user' no está definido");
      return;
    } else {
      console.log("El usuario esta bien")
    }

    setIsSubmitting(true);
    try {
      // Generar y subir el PDF
      console.log("Generando el PDF con los siguientes datos:", formData);
      // Aca todo bien con FormData.
      const pdfDoc = await generateCorporatePDF(
        "Ficha Técnica del Alojamiento Turístico",
        formData
      );
      const pdfData = pdfDoc.output("datauristring");
      const storage = getStorage();
      const pdfRef = ref(
        storage,
        `DocumentacionPropietarios/FichaTecnica/ficha_tecnica_${user.uid}.pdf`
      );
      await uploadString(pdfRef, pdfData, "data_url");
      const pdfUrl = await getDownloadURL(pdfRef);

      // Guardar la información en Firestore
      const docRef = doc(
        db,
        `propietarios/${user.uid}/proceso_de_alta/technical_form`
      );
      await setDoc(docRef, { userId: user.uid, pdfUrl, ...formData });

      await updateDoc(doc(db, "users", user.uid), {
        currentStep: 1,
        processStatus: "textil",
      });

      onAccept();
      Swal.fire({
        icon: "success",
        title: "Ficha técnica guardada",
        text: "Puedes proceder al siguiente paso.",
      });
    } catch (error) {
      console.error("Error al generar o guardar la ficha técnica:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al generar o guardar la ficha técnica. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Ficha Técnica del Alojamiento Turístico
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información del propietario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="propietario"
                className="block text-sm font-medium text-gray-700"
              >
                Propietario <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="propietario"
                name="propietario"
                value={formData.propietario}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                e-Mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="DNI"
                className="block text-sm font-medium text-gray-700"
              >
                DNI/PASAPORTE <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="DNI"
                name="DNI"
                value={formData.DNI}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="numCatastro"
                className="block text-sm font-medium text-gray-700"
              >
                Num Catastro <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="numCatastro"
                name="numCatastro"
                value={formData.numCatastro}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
              <p className="mt-2 text-sm text-gray-600">
                Puedes encontrar la referencia catastral en tus facturas de
                servicios, IBI o en el{" "}
                <a
                  href="https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCBusqueda.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  sitio web del catastro
                </a>
                .
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="ciudad"
                className="block text-sm font-medium text-gray-700"
              >
                Ciudad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="provincia"
                className="block text-sm font-medium text-gray-700"
              >
                Provincia <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="provincia"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="direccion"
                className="block text-sm font-medium text-gray-700"
              >
                Dirección <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="cPostal"
                className="block text-sm font-medium text-gray-700"
              >
                Código Postal <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cPostal"
                name="cPostal"
                value={formData.cPostal}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Características adicionales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="licenciaTuristica"
                className="block text-sm font-medium text-gray-700"
              >
                Licencia Turística
              </label>
              <input
                type="checkbox"
                id="licenciaTuristica"
                name="licenciaTuristica"
                checked={formData.licenciaTuristica}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="numeroVUT"
                className="block text-sm font-medium text-gray-700"
              >
                Número VUT <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="numeroVUT"
                name="numeroVUT"
                value={formData.numeroVUT}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
              <p className="mt-2 text-sm text-gray-600">
                Este número hace referencia a la licencia turística de la
                vivienda. Se consigue mediante la presentación de los documentos
                en los organismos gubernamentales correspondientes de cada
                comunidad autónoma. Más información disponible en el{" "}
                <a
                  href="https://www.turisme.gva.es/opencms/opencms/turisme/es/contents/tramitacion/viviendas_turisticas/viviendas_turisticas.html?tam="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  sitio web de tramitación de viviendas turísticas
                </a>
                .
              </p>
            </div>

            <div>
              <label
                htmlFor="comPropietarios"
                className="block text-sm font-medium text-gray-700"
              >
                Comunidad de Propietarios
              </label>
              <input
                type="checkbox"
                id="comPropietarios"
                name="comPropietarios"
                checked={formData.comPropietarios}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label
                htmlFor="tipoVivienda"
                className="block text-sm font-medium text-gray-700"
              >
                Tipo de Vivienda <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="tipoVivienda"
                name="tipoVivienda"
                value={formData.tipoVivienda}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Más características adicionales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="exterior"
                className="block text-sm font-medium text-gray-700"
              >
                Exterior
              </label>
              <input
                type="checkbox"
                id="exterior"
                name="exterior"
                checked={formData.exterior}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label
                htmlFor="interior"
                className="block text-sm font-medium text-gray-700"
              >
                Interior
              </label>
              <input
                type="checkbox"
                id="interior"
                name="interior"
                checked={formData.interior}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label
                htmlFor="portero"
                className="block text-sm font-medium text-gray-700"
              >
                Portero
              </label>
              <input
                type="checkbox"
                id="portero"
                name="portero"
                checked={formData.portero}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label
                htmlFor="porteroAutomatico"
                className="block text-sm font-medium text-gray-700"
              >
                Portero Automático
              </label>
              <input
                type="checkbox"
                id="porteroAutomatico"
                name="porteroAutomatico"
                checked={formData.porteroAutomatico}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label
                htmlFor="ascensor"
                className="block text-sm font-medium text-gray-700"
              >
                Ascensor <span className="text-red-500">*</span>
              </label>
              <input
                type="checkbox"
                id="ascensor"
                name="ascensor"
                checked={formData.ascensor}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label
                htmlFor="garaje"
                className="block text-sm font-medium text-gray-700"
              >
                Garaje
              </label>
              <input
                type="checkbox"
                id="garaje"
                name="garaje"
                checked={formData.garaje}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label
                htmlFor="garajeConcertado"
                className="block text-sm font-medium text-gray-700"
              >
                Garaje Concertado
              </label>
              <input
                type="checkbox"
                id="garajeConcertado"
                name="garajeConcertado"
                checked={formData.garajeConcertado}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label
                htmlFor="facilAparcamiento"
                className="block text-sm font-medium text-gray-700"
              >
                Fácil Aparcamiento
              </label>
              <input
                type="checkbox"
                id="facilAparcamiento"
                name="facilAparcamiento"
                checked={formData.facilAparcamiento}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label
                htmlFor="vistas"
                className="block text-sm font-medium text-gray-700"
              >
                Vistas
              </label>
              <input
                type="text"
                id="vistas"
                name="vistas"
                value={formData.vistas}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="piscina"
                className="block text-sm font-medium text-gray-700"
              >
                Piscina
              </label>
              <input
                type="checkbox"
                id="piscina"
                name="piscina"
                checked={formData.piscina}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label
                htmlFor="jardin"
                className="block text-sm font-medium text-gray-700"
              >
                Jardín
              </label>
              <input
                type="checkbox"
                id="jardin"
                name="jardin"
                checked={formData.jardin}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label
              htmlFor="observaciones"
              className="block text-sm font-medium text-gray-700"
            >
              Observaciones
            </label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            ></textarea>
          </div>

          {/* Servicios adicionales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="zonasComunes"
                className="block text-sm font-medium text-gray-700"
              >
                Zonas Comunes
              </label>
              <input
                type="text"
                id="zonasComunes"
                name="zonasComunes"
                value={formData.zonasComunes}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="zonasTuristicas"
                className="block text-sm font-medium text-gray-700"
              >
                Zonas Turísticas
              </label>
              <input
                type="text"
                id="zonasTuristicas"
                name="zonasTuristicas"
                value={formData.zonasTuristicas}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="accesibilidad"
                className="block text-sm font-medium text-gray-700"
              >
                Accesibilidad
              </label>
              <input
                type="text"
                id="accesibilidad"
                name="accesibilidad"
                value={formData.accesibilidad}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Características y amueblamiento */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="habitaciones"
                className="block text-sm font-medium text-gray-700"
              >
                Habitaciones <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="habitaciones"
                name="habitaciones"
                value={formData.habitaciones}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="banos"
                className="block text-sm font-medium text-gray-700"
              >
                Baños <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="banos"
                name="banos"
                value={formData.banos}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="aseos"
                className="block text-sm font-medium text-gray-700"
              >
                Aseos
              </label>
              <input
                type="number"
                id="aseos"
                name="aseos"
                value={formData.aseos}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="duchas"
                className="block text-sm font-medium text-gray-700"
              >
                Ducha
              </label>
              <input
                type="number"
                id="duchas"
                name="duchas"
                value={formData.duchas}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="baneras"
                className="block text-sm font-medium text-gray-700"
              >
                Bañera
              </label>
              <input
                type="number"
                id="baneras"
                name="baneras"
                value={formData.baneras}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="trastero"
                className="block text-sm font-medium text-gray-700"
              >
                Trastero
              </label>
              <input
                type="checkbox"
                id="trastero"
                name="trastero"
                checked={formData.trastero}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label
                htmlFor="mascotas"
                className="block text-sm font-medium text-gray-700"
              >
                Mascotas
              </label>
              <input
                type="checkbox"
                id="mascotas"
                name="mascotas"
                checked={formData.mascotas}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label
                htmlFor="cocina"
                className="block text-sm font-medium text-gray-700"
              >
                Cocina
              </label>
              <input
                type="text"
                id="cocina"
                name="cocina"
                value={formData.cocina}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="capacidadMaxima"
                className="block text-sm font-medium text-gray-700"
              >
                Capacidad Máxima <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="capacidadMaxima"
                name="capacidadMaxima"
                value={formData.capacidadMaxima}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Información de camas */}
          {/* CAMAS NO ESTA INICIALIZADO */}
          {/* <div className="space-y-4">
            <h4 className="text-xl font-semibold mb-2">Camas</h4>
            {formData.camas && formData.camas.length > 0 && formData.camas.map((cama, index) => (
              <div
                key={index}
                className="space-y-4 bg-gray-100 p-4 rounded-md shadow-md"
              >
                <h5 className="font-bold text-gray-700">Cama {index + 1}</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor={`tipo-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tipo de habitación
                    </label>
                    <input
                      type="text"
                      id={`tipo-${index}`}
                      name={`tipo-${index}`}
                      value={cama.tipo}
                      onChange={(e) =>
                        handleCamaChange(index, "tipo", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`aireAcondicionado-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Aire Acondicionado
                    </label>
                    <input
                      type="checkbox"
                      id={`aireAcondicionado-${index}`}
                      name={`aireAcondicionado-${index}`}
                      checked={cama.aireAcondicionado}
                      onChange={(e) =>
                        handleCamaChange(
                          index,
                          "aireAcondicionado",
                          e.target.checked
                        )
                      }
                      className="mt-1 block"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`calefaccion-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Calefacción
                    </label>
                    <input
                      type="checkbox"
                      id={`calefaccion-${index}`}
                      name={`calefaccion-${index}`}
                      checked={cama.calefaccion}
                      onChange={(e) =>
                        handleCamaChange(index, "calefaccion", e.target.checked)
                      }
                      className="mt-1 block"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`ventilador-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Ventilador
                    </label>
                    <input
                      type="checkbox"
                      id={`ventilador-${index}`}
                      name={`ventilador-${index}`}
                      checked={cama.ventilador}
                      onChange={(e) =>
                        handleCamaChange(index, "ventilador", e.target.checked)
                      }
                      className="mt-1 block"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`electrodomesticos-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Electrodomésticos
                    </label>
                    <input
                      type="text"
                      id={`electrodomesticos-${index}`}
                      name={`electrodomesticos-${index}`}
                      value={cama.electrodomesticos}
                      onChange={(e) =>
                        handleCamaChange(
                          index,
                          "electrodomesticos",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`aguaCaliente-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Agua Caliente
                    </label>
                    <input
                      type="text"
                      id={`aguaCaliente-${index}`}
                      name={`aguaCaliente-${index}`}
                      value={cama.aguaCaliente}
                      onChange={(e) =>
                        handleCamaChange(index, "aguaCaliente", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`estadoPintura-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Estado de la Pintura
                    </label>
                    <input
                      type="text"
                      id={`estadoPintura-${index}`}
                      name={`estadoPintura-${index}`}
                      value={cama.estadoPintura}
                      onChange={(e) =>
                        handleCamaChange(index, "estadoPintura", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`reformaAno-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Año de la Reforma
                    </label>
                    <input
                      type="text"
                      id={`reformaAno-${index}`}
                      name={`reformaAno-${index}`}
                      value={cama.reformaAno}
                      onChange={(e) =>
                        handleCamaChange(index, "reformaAno", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`estadoMobiliario-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Estado del Mobiliario
                    </label>
                    <input
                      type="text"
                      id={`estadoMobiliario-${index}`}
                      name={`estadoMobiliario-${index}`}
                      value={cama.estadoMobiliario}
                      onChange={(e) =>
                        handleCamaChange(
                          index,
                          "estadoMobiliario",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`persianas-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Persianas
                    </label>
                    <input
                      type="checkbox"
                      id={`persianas-${index}`}
                      name={`persianas-${index}`}
                      checked={cama.persianas}
                      onChange={(e) =>
                        handleCamaChange(index, "persianas", e.target.checked)
                      }
                      className="mt-1 block"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`tv-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      TV
                    </label>
                    <input
                      type="checkbox"
                      id={`tv-${index}`}
                      name={`tv-${index}`}
                      checked={cama.tv}
                      onChange={(e) =>
                        handleCamaChange(index, "tv", e.target.checked)
                      }
                      className="mt-1 block"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`mosquiteras-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mosquiteras
                    </label>
                    <input
                      type="checkbox"
                      id={`mosquiteras-${index}`}
                      name={`mosquiteras-${index}`}
                      checked={cama.mosquiteras}
                      onChange={(e) =>
                        handleCamaChange(index, "mosquiteras", e.target.checked)
                      }
                      className="mt-1 block"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div> */}

          <div className="mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Guardando..." : "Aceptar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TechnicalForm;
