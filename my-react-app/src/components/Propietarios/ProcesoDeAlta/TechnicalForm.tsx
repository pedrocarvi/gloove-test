import React, { useState, ChangeEvent, FormEvent } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface FormData {
  propietario: string;
  email: string;
  ciudad: string;
  provincia: string;
  direccion: string;
  cPostal: string;
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
  const defaultCamas = Array(6).fill({
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
  });

  const [formData, setFormData] = useState<FormData>({
    propietario: initialValues.propietario || "",
    email: initialValues.email || "",
    ciudad: initialValues.ciudad || "",
    provincia: initialValues.provincia || "",
    direccion: initialValues.direccion || "",
    cPostal: initialValues.cPostal || "",
    licenciaTuristica: initialValues.licenciaTuristica || false,
    numeroVUT: initialValues.numeroVUT || "",
    comPropietarios: initialValues.comPropietarios || false,
    tipoVivienda: initialValues.tipoVivienda || "",
    exterior: initialValues.exterior || false,
    interior: initialValues.interior || false,
    portero: initialValues.portero || false,
    porteroAutomatico: initialValues.porteroAutomatico || false,
    ascensor: initialValues.ascensor || false,
    garaje: initialValues.garaje || false,
    garajeConcertado: initialValues.garajeConcertado || false,
    facilAparcamiento: initialValues.facilAparcamiento || false,
    vistas: initialValues.vistas || "",
    piscina: initialValues.piscina || false,
    jardin: initialValues.jardin || false,
    observaciones: initialValues.observaciones || "",
    zonasComunes: initialValues.zonasComunes || "",
    zonasTuristicas: initialValues.zonasTuristicas || "",
    accesibilidad: initialValues.accesibilidad || "",
    habitaciones: initialValues.habitaciones || 0,
    banos: initialValues.banos || 0,
    aseos: initialValues.aseos || 0,
    duchas: initialValues.duchas || 0,
    baneras: initialValues.baneras || 0,
    trastero: initialValues.trastero || false,
    mascotas: initialValues.mascotas || false,
    cocina: initialValues.cocina || "",
    capacidadMaxima: initialValues.capacidadMaxima || 0,
    camas: initialValues.camas || defaultCamas,
  });

  const { user } = useAuth();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleCamaChange = (index: number, name: string, value: any) => {
    const updatedCamas = formData.camas.map((cama, i) =>
      i === index ? { ...cama, [name]: value } : cama
    );
    setFormData({ ...formData, camas: updatedCamas });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(10);

    // Aquí se pueden añadir más campos al PDF
    doc.text(`Propietario: ${formData.propietario}`, 10, 10);
    doc.text(`e-Mail: ${formData.email}`, 10, 20);
    doc.text(`Ciudad: ${formData.ciudad}`, 10, 30);
    doc.text(`Provincia: ${formData.provincia}`, 10, 40);
    doc.text(`Dirección: ${formData.direccion}`, 10, 50);
    doc.text(`Código Postal: ${formData.cPostal}`, 10, 60);
    doc.text(
      `Licencia Turística: ${formData.licenciaTuristica ? "Sí" : "No"}`,
      10,
      70
    );
    doc.text(`Número VUT: ${formData.numeroVUT}`, 10, 80);
    doc.text(
      `Comunidad de Propietarios: ${formData.comPropietarios ? "Sí" : "No"}`,
      10,
      90
    );
    doc.text(`Tipo de Vivienda: ${formData.tipoVivienda}`, 10, 100);
    doc.text(`Exterior: ${formData.exterior ? "Sí" : "No"}`, 10, 110);
    doc.text(`Interior: ${formData.interior ? "Sí" : "No"}`, 10, 120);
    doc.text(`Portero: ${formData.portero ? "Sí" : "No"}`, 10, 130);
    doc.text(
      `Portero Automático: ${formData.porteroAutomatico ? "Sí" : "No"}`,
      10,
      140
    );
    doc.text(`Ascensor: ${formData.ascensor ? "Sí" : "No"}`, 10, 150);
    doc.text(`Garaje: ${formData.garaje ? "Sí" : "No"}`, 10, 160);
    doc.text(
      `Garaje Concertado: ${formData.garajeConcertado ? "Sí" : "No"}`,
      10,
      170
    );
    doc.text(
      `Fácil Aparcamiento: ${formData.facilAparcamiento ? "Sí" : "No"}`,
      10,
      180
    );
    doc.text(`Vistas: ${formData.vistas}`, 10, 190);
    doc.text(`Piscina: ${formData.piscina ? "Sí" : "No"}`, 10, 200);
    doc.text(`Jardín: ${formData.jardin ? "Sí" : "No"}`, 10, 210);
    doc.text(`Observaciones: ${formData.observaciones}`, 10, 220);
    doc.text(`Zonas Comunes: ${formData.zonasComunes}`, 10, 230);
    doc.text(`Zonas Turísticas: ${formData.zonasTuristicas}`, 10, 240);
    doc.text(`Accesibilidad: ${formData.accesibilidad}`, 10, 250);
    doc.text(`Habitaciones: ${formData.habitaciones}`, 10, 260);
    doc.text(`Baños: ${formData.banos}`, 10, 270);
    doc.text(`Aseos: ${formData.aseos}`, 10, 280);
    doc.text(`Ducha: ${formData.duchas}`, 10, 290);
    doc.text(`Bañera: ${formData.baneras}`, 10, 300);
    doc.text(`Trastero: ${formData.trastero ? "Sí" : "No"}`, 10, 310);
    doc.text(`Mascotas: ${formData.mascotas ? "Sí" : "No"}`, 10, 320);
    doc.text(`Cocina: ${formData.cocina}`, 10, 330);
    doc.text(`Capacidad Máxima: ${formData.capacidadMaxima}`, 10, 340);

    formData.camas.forEach((cama, index) => {
      const offsetY = 350 + index * 100;
      doc.text(`Cama ${index + 1}`, 10, offsetY);
      doc.text(`  Tipo: ${cama.tipo}`, 10, offsetY + 10);
      doc.text(
        `  Aire Acondicionado: ${cama.aireAcondicionado ? "Sí" : "No"}`,
        10,
        offsetY + 20
      );
      doc.text(
        `  Calefacción: ${cama.calefaccion ? "Sí" : "No"}`,
        10,
        offsetY + 30
      );
      doc.text(
        `  Ventilador: ${cama.ventilador ? "Sí" : "No"}`,
        10,
        offsetY + 40
      );
      doc.text(
        `  Electrodomésticos: ${cama.electrodomesticos}`,
        10,
        offsetY + 50
      );
      doc.text(`  Agua Caliente: ${cama.aguaCaliente}`, 10, offsetY + 60);
      doc.text(
        `  Estado de la Pintura: ${cama.estadoPintura}`,
        10,
        offsetY + 70
      );
      doc.text(`  Año de la Reforma: ${cama.reformaAno}`, 10, offsetY + 80);
      doc.text(
        `  Estado del Mobiliario: ${cama.estadoMobiliario}`,
        10,
        offsetY + 90
      );
      doc.text(
        `  Persianas: ${cama.persianas ? "Sí" : "No"}`,
        10,
        offsetY + 100
      );
      doc.text(`  TV: ${cama.tv ? "Sí" : "No"}`, 10, offsetY + 110);
      doc.text(
        `  Mosquiteras: ${cama.mosquiteras ? "Sí" : "No"}`,
        10,
        offsetY + 120
      );
    });

    doc.save("Ficha_Tecnica_Alojamiento_Turistico.pdf");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("Error: user is undefined");
      return;
    }

    try {
      const docRef = doc(
        db,
        `propietarios/${user.uid}/proceso_de_alta/technical_form`
      );
      await setDoc(docRef, {
        userId: user.uid,
        ...formData,
      });

      await updateDoc(doc(db, "users", user.uid), {
        currentStep: 1,
        processStatus: "textil",
      });

      onAccept();
      Swal.fire({
        icon: "success",
        title: "Formulario aceptado",
        text: "Puedes proceder al siguiente paso.",
      }).then(() => {
        generatePDF(); // Generar y descargar el PDF
      });
    } catch (error) {
      console.error("Error adding document: ", error);
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
              <label className="block text-sm font-medium text-gray-700">
                Propietario
              </label>
              <input
                type="text"
                name="propietario"
                value={formData.propietario}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                e-Mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Información de la propiedad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ciudad
              </label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Provincia
              </label>
              <input
                type="text"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Código Postal
              </label>
              <input
                type="text"
                name="cPostal"
                value={formData.cPostal}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Características adicionales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Licencia Turística
              </label>
              <input
                type="checkbox"
                name="licenciaTuristica"
                checked={formData.licenciaTuristica}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Número VUT
              </label>
              <input
                type="text"
                name="numeroVUT"
                value={formData.numeroVUT}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Comunidad de Propietarios
              </label>
              <input
                type="checkbox"
                name="comPropietarios"
                checked={formData.comPropietarios}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Vivienda
              </label>
              <input
                type="text"
                name="tipoVivienda"
                value={formData.tipoVivienda}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Más características adicionales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Exterior
              </label>
              <input
                type="checkbox"
                name="exterior"
                checked={formData.exterior}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Interior
              </label>
              <input
                type="checkbox"
                name="interior"
                checked={formData.interior}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Portero
              </label>
              <input
                type="checkbox"
                name="portero"
                checked={formData.portero}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Portero Automático
              </label>
              <input
                type="checkbox"
                name="porteroAutomatico"
                checked={formData.porteroAutomatico}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ascensor
              </label>
              <input
                type="checkbox"
                name="ascensor"
                checked={formData.ascensor}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Garaje
              </label>
              <input
                type="checkbox"
                name="garaje"
                checked={formData.garaje}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Garaje Concertado
              </label>
              <input
                type="checkbox"
                name="garajeConcertado"
                checked={formData.garajeConcertado}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fácil Aparcamiento
              </label>
              <input
                type="checkbox"
                name="facilAparcamiento"
                checked={formData.facilAparcamiento}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vistas
              </label>
              <input
                type="text"
                name="vistas"
                value={formData.vistas}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Piscina
              </label>
              <input
                type="checkbox"
                name="piscina"
                checked={formData.piscina}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Jardín
              </label>
              <input
                type="checkbox"
                name="jardin"
                checked={formData.jardin}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Observaciones
            </label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            ></textarea>
          </div>

          {/* Servicios adicionales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zonas Comunes
              </label>
              <input
                type="text"
                name="zonasComunes"
                value={formData.zonasComunes}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zonas Turísticas
              </label>
              <input
                type="text"
                name="zonasTuristicas"
                value={formData.zonasTuristicas}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Accesibilidad
              </label>
              <input
                type="text"
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
              <label className="block text-sm font-medium text-gray-700">
                Habitaciones
              </label>
              <input
                type="number"
                name="habitaciones"
                value={formData.habitaciones}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Baños
              </label>
              <input
                type="number"
                name="banos"
                value={formData.banos}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Aseos
              </label>
              <input
                type="number"
                name="aseos"
                value={formData.aseos}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ducha
              </label>
              <input
                type="number"
                name="duchas"
                value={formData.duchas}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bañera
              </label>
              <input
                type="number"
                name="baneras"
                value={formData.baneras}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Trastero
              </label>
              <input
                type="checkbox"
                name="trastero"
                checked={formData.trastero}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mascotas
              </label>
              <input
                type="checkbox"
                name="mascotas"
                checked={formData.mascotas}
                onChange={handleChange}
                className="mt-1 block"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cocina
              </label>
              <input
                type="text"
                name="cocina"
                value={formData.cocina}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacidad Máxima
              </label>
              <input
                type="number"
                name="capacidadMaxima"
                value={formData.capacidadMaxima}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Información de camas */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold mb-2">Camas</h4>
            {formData.camas.map((cama, index) => (
              <div
                key={index}
                className="space-y-4 bg-gray-100 p-4 rounded-md shadow-md"
              >
                <h5 className="font-bold text-gray-700">Cama {index + 1}</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo
                    </label>
                    <input
                      type="text"
                      name={`tipo-${index}`}
                      value={cama.tipo}
                      onChange={(e) =>
                        handleCamaChange(index, "tipo", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Aire Acondicionado
                    </label>
                    <input
                      type="checkbox"
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
                    <label className="block text-sm font-medium text-gray-700">
                      Calefacción
                    </label>
                    <input
                      type="checkbox"
                      name={`calefaccion-${index}`}
                      checked={cama.calefaccion}
                      onChange={(e) =>
                        handleCamaChange(index, "calefaccion", e.target.checked)
                      }
                      className="mt-1 block"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ventilador
                    </label>
                    <input
                      type="checkbox"
                      name={`ventilador-${index}`}
                      checked={cama.ventilador}
                      onChange={(e) =>
                        handleCamaChange(index, "ventilador", e.target.checked)
                      }
                      className="mt-1 block"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Electrodomésticos
                    </label>
                    <input
                      type="text"
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
                    <label className="block text-sm font-medium text-gray-700">
                      Agua Caliente
                    </label>
                    <input
                      type="text"
                      name={`aguaCaliente-${index}`}
                      value={cama.aguaCaliente}
                      onChange={(e) =>
                        handleCamaChange(index, "aguaCaliente", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Estado de la Pintura
                    </label>
                    <input
                      type="text"
                      name={`estadoPintura-${index}`}
                      value={cama.estadoPintura}
                      onChange={(e) =>
                        handleCamaChange(index, "estadoPintura", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Año de la Reforma
                    </label>
                    <input
                      type="text"
                      name={`reformaAno-${index}`}
                      value={cama.reformaAno}
                      onChange={(e) =>
                        handleCamaChange(index, "reformaAno", e.target.value)
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Estado del Mobiliario
                    </label>
                    <input
                      type="text"
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
                    <label className="block text-sm font-medium text-gray-700">
                      Persianas
                    </label>
                    <input
                      type="checkbox"
                      name={`persianas-${index}`}
                      checked={cama.persianas}
                      onChange={(e) =>
                        handleCamaChange(index, "persianas", e.target.checked)
                      }
                      className="mt-1 block"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      TV
                    </label>
                    <input
                      type="checkbox"
                      name={`tv-${index}`}
                      checked={cama.tv}
                      onChange={(e) =>
                        handleCamaChange(index, "tv", e.target.checked)
                      }
                      className="mt-1 block"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mosquiteras
                    </label>
                    <input
                      type="checkbox"
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
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Aceptar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TechnicalForm;
