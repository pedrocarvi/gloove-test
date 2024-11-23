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
  referenciaCatastral: string;
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
  camas90: number;
  camas105: number;
  camas135: number;
  camas150: number;
  camas180: number;
  camas200: number;
  edredon: number;
  almohadas: number;
  relleno_nordico: number;
}

interface TechnicalFormProps {
  onAccept: () => void;
  initialValues?: FormData;
  setStep1Data: React.Dispatch<React.SetStateAction<{
    camas90: number;
    camas105: number;
    camas135: number;
    camas150: number;
    camas180: number;
    camas200: number;
    banos: number;
    aseos: number;
    capacidadMaxima: number;
    propietario: string;
    dni: string;
    direccion: string;
  }>>;
}

const TechnicalForm: React.FC<TechnicalFormProps> = ({ onAccept, initialValues = {} as FormData, setStep1Data }) => {

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
    referenciaCatastral: initialValues.referenciaCatastral ?? "",
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
    camas90: initialValues.camas90 ?? 0,
    camas105: initialValues.camas105 ?? 0,
    camas135: initialValues.camas135 ?? 0,
    camas150: initialValues.camas150 ?? 0,
    camas180: initialValues.camas180 ?? 0,
    camas200: initialValues.camas200 ?? 0,
    edredon: initialValues.edredon ?? 0,
    almohadas: initialValues.almohadas ?? 0,
    relleno_nordico: initialValues.relleno_nordico ?? 0
    // camas: initialValues.camas ?? defaultCamas,
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

    // Actualizar los datos compartidos solo con las propiedades necesarias para TextileForm
    useEffect(() => {
      setStep1Data({
        camas90: formData.camas90,
        camas105: formData.camas105,
        camas135: formData.camas135,
        camas150: formData.camas150,
        camas180: formData.camas180,
        camas200: formData.camas200,
        banos: formData.banos,
        aseos: formData.aseos,
        capacidadMaxima: formData.capacidadMaxima,
        propietario: formData.propietario,
        dni: formData.DNI,
        direccion: formData.direccion,
      });
    }, [formData, setStep1Data]);
    
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
          <div className="flex w-100 gap-3">
            <div className="flex-1">
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
            <div className="flex-1">
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
          <div className="flex w-100 gap-3">
            <div className="flex-1">
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
            <div className="flex-1">
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
          <div className="flex w-100 gap-3">
            <div className="flex-1">
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
            <div className="flex-1">
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
          <div className="flex w-100 gap-3">
            <div className="flex-1">
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
            <div className="flex-1">
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
          <div className="flex w-100 gap-3">
            <div className="flex-1">
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
          </div>
          <div className="flex w-100 gap-3">
            <div className="flex-1">
                <label
                  htmlFor="referenciaCatastral"
                  className="block text-sm font-medium text-gray-700"
                >
                  Referencia catastral <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="referenciaCatastral"
                  name="referenciaCatastral"
                  value={formData.referenciaCatastral}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
                <p className="mt-2 text-sm text-gray-600">
                ¿Dónde conseguir su referencia catastral?: Facturas de servicios, IBI o en el catastro en el siguiente enlace:
                  <a
                    href="https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCBusqueda.aspx. "
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCBusqueda.aspx. 
                  </a>
                  .
                </p>
            </div>
          </div>
          <div className="flex w-100 gap-3">
            <div className="flex-1">
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
            <div className="flex-1">
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
          </div>
          <div className="flex w-100 gap-3">
            <div className="flex-1">
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
            <div className="flex-1">
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
          </div>
          <div className="flex w-100 gap-3">
            <div className="flex-1">
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
            <div className="flex-1">
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
          </div>
          <div className="flex w-100 gap-3">
            <div className="flex-1">
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
              <div className="flex-1">
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
          </div>
          <div className="flex w-100 gap-3">
            <div className="flex-1">
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
            <div className="flex-1">
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
          </div>
          <div className="flex w-100 gap-3">
            <div className="flex-1">
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
            <div className="flex-1">
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
          </div>
          <div className="flex w-100 gap-3">
            <div className="flex-1">
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
            <div className="flex-1">
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
          <div className="flex w-100 gap-3">
            <div className="flex-1">
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
                Aseos<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="aseos"
                name="aseos"
                value={formData.aseos}
                required
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
          <div className="space-y-4">
            <h4 className="text-xl font-semibold mb-2">Camas</h4>
            <div className="flex w-100 gap-3">
              <div className="flex-1">
                <label
                  htmlFor="camas90"
                  className="block text-sm font-medium text-gray-700"
                >
                  Numero camas 90
                </label>
                <input
                  type="text"
                  id="camas90"
                  name="camas90"
                  value={formData.camas90}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="camas105"
                  className="block text-sm font-medium text-gray-700"
                >
                  Numero camas 105
                </label>
                <input
                  type="text"
                  id="camas105"
                  name="camas105"
                  value={formData.camas105}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex-1">
              <label
                htmlFor="vistas"
                className="block text-sm font-medium text-gray-700"
              >
                Numero camas 135
              </label>
              <input
                type="text"
                id="camas135"
                name="camas135"
                value={formData.camas135}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            </div>
            <div className="flex w-100 gap-3">
              <div className="flex-1">
                <label
                  htmlFor="camas150"
                  className="block text-sm font-medium text-gray-700"
                >
                  Numero camas 150
                </label>
                <input
                  type="text"
                  id="camas150"
                  name="camas150"
                  value={formData.camas150}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="camas180"
                  className="block text-sm font-medium text-gray-700"
                >
                  Numero camas 180
                </label>
                <input
                  type="text"
                  id="camas180"
                  name="camas180"
                  value={formData.camas180}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex-1">
              <label
                htmlFor="camas200"
                className="block text-sm font-medium text-gray-700"
              >
                Numero camas 200
              </label>
              <input
                type="text"
                id="camas200"
                name="camas200"
                value={formData.camas200}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            </div>
            <p> Es obligatorio tener dentro de la vivienda: </p>
            <ul style={{listStyleType: 'disc'}}>
              <li> Por cada cama 3 sábanas. </li>
              <li> Por cada almohada por 3 fundas. </li>
              <li> Por cada cama 2 fundas de edredón. </li>
              <li> Por cada ducha 3 alfombrines. </li>
              <li> Por cada persona 3 toallas grandes. </li>
              <li> Por cada persona 3 toallas pequeñas.</li>
            </ul>
            <p> No es obligatorio, pero si debe tener dentro de la vivienda: </p>
            <ul style={{listStyleType: 'disc'}}>
              <li> Edredón. </li>
              <li> Por cada cama de matrimonio 2 almohadas. </li>
              <li> Almohadas. </li>
              <li> Relleno nórdico. </li>
            </ul>
            <p> Si no dispone de alguno, puede seleccionarlo aquí mismo </p>
            <div className="flex w-100 gap-3">
              <div className="flex-1">
                <label
                  htmlFor="edredon"
                  className="block text-sm font-medium text-gray-700"
                >
                  Edredón
                </label>
                <input
                  type="text"
                  id="edredon"
                  name="edredon"
                  value={formData.edredon}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="almohadas"
                  className="block text-sm font-medium text-gray-700"
                >
                  Numero Almohadas
                </label>
                <input
                  type="text"
                  id="almohadas"
                  name="almohadas"
                  value={formData.almohadas}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex-1">
              <label
                htmlFor="relleno-nordico"
                className="block text-sm font-medium text-gray-700"
              >
                Numero Relleno Nórdico
              </label>
              <input
                type="text"
                id="relleno-nordico"
                name="relleno-nordico"
                value={formData.relleno_nordico}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            </div>
          </div>

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
