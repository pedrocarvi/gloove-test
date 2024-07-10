import React, { useState, ChangeEvent, FormEvent } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";

interface Propiedad {
  numero_habitaciones: string;
  numero_banos: string;
  aire_acondicionado: boolean;
  calefaccion: boolean;
  piscina: boolean;
}

interface CaracteristicasAdicionales {
  terraza: boolean;
  alarma: boolean;
  gimnasio: boolean;
  squash: boolean;
  balcon: boolean;
  padel: boolean;
  tenis: boolean;
  zonaInfantil: boolean;
  spa: boolean;
  animales: boolean;
  pesoLimiteAnimalesKg: string;
  seAceptanAnimalesRazaPeligrosa: boolean;
}

interface Piscina {
  tipoPiscina: string;
  fechaApertura: string;
  fechaCierre: string;
  dimensiones: string;
  profundidadMaxima: string;
  profundidadMinima: string;
  piscinaClimatizada: boolean;
  fechaAperturaClimatizada: string;
  fechaCierreClimatizada: string;
  dimensionesClimatizada: string;
  profundidadMaximaClimatizada: string;
  profundidadMinimaClimatizada: string;
}

interface Restricciones {
  noGruposJovenesMenosDe: string;
  fumarPermitido: boolean;
}

interface Vistas {
  mar: boolean;
  piscina: boolean;
  jardin: boolean;
  lago: boolean;
  golf: boolean;
  rio: boolean;
  montana: boolean;
  pistaSki: boolean;
  puertoDeportivo: boolean;
}

interface Extras {
  cuna: boolean;
  camaSupletoria: boolean;
  mascota: boolean;
  sillaBebe: boolean;
}

interface FormData {
  propiedad: Propiedad;
  caracteristicasAdicionales: CaracteristicasAdicionales;
  piscina: Piscina;
  restricciones: Restricciones;
  vistas: Vistas;
  extras: Extras;
}

interface InventoryFormProps {
  onAccept: () => void;
  initialValues?: FormData;
  setFormValues: (step: number, values: any) => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({
  onAccept,
  initialValues = {} as FormData,
  setFormValues,
}) => {
  const defaultFormData: FormData = {
    propiedad: {
      numero_habitaciones: "",
      numero_banos: "",
      aire_acondicionado: false,
      calefaccion: false,
      piscina: false,
    },
    caracteristicasAdicionales: {
      terraza: false,
      alarma: false,
      gimnasio: false,
      squash: false,
      balcon: false,
      padel: false,
      tenis: false,
      zonaInfantil: false,
      spa: false,
      animales: false,
      pesoLimiteAnimalesKg: "",
      seAceptanAnimalesRazaPeligrosa: false,
    },
    piscina: {
      tipoPiscina: "",
      fechaApertura: "",
      fechaCierre: "",
      dimensiones: "",
      profundidadMaxima: "",
      profundidadMinima: "",
      piscinaClimatizada: false,
      fechaAperturaClimatizada: "",
      fechaCierreClimatizada: "",
      dimensionesClimatizada: "",
      profundidadMaximaClimatizada: "",
      profundidadMinimaClimatizada: "",
    },
    restricciones: {
      noGruposJovenesMenosDe: "",
      fumarPermitido: false,
    },
    vistas: {
      mar: false,
      piscina: false,
      jardin: false,
      lago: false,
      golf: false,
      rio: false,
      montana: false,
      pistaSki: false,
      puertoDeportivo: false,
    },
    extras: {
      cuna: false,
      camaSupletoria: false,
      mascota: false,
      sillaBebe: false,
    },
  };

  const [formData, setFormData] = useState<FormData>(
    initialValues ? { ...defaultFormData, ...initialValues } : defaultFormData
  );

  const { user } = useAuth();
  const [errors, setErrors] = useState({
    numero_habitaciones: false,
    numero_banos: false,
  });

  const handleBlur = () => {
    setFormValues(5, formData); // Guarda el estado del formulario al perder el foco
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    const keys = name.split(".");

    setFormData((prevFormData) => {
      const updatedData: any = { ...prevFormData };
      if (keys.length === 2) {
        updatedData[keys[0]][keys[1]] = newValue;
      }
      return updatedData;
    });

    if (errors[keys[1] as keyof typeof errors]) {
      setErrors({ ...errors, [keys[1]]: false });
    }
  };

  const validateForm = () => {
    const newErrors = {
      numero_habitaciones: formData.propiedad.numero_habitaciones === "",
      numero_banos: formData.propiedad.numero_banos === "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      const missingFields = Object.keys(errors)
        .filter(
          (key) =>
            formData.propiedad[key as keyof typeof formData.propiedad] === ""
        )
        .map((key) => key.replace(/_/g, " "))
        .join(", ");

      Swal.fire({
        icon: "error",
        title: "Faltan campos obligatorios",
        html: `<p>Por favor, completa todos los campos obligatorios:</p><p style="color:red;">${missingFields}</p>`,
      });
      return;
    }
    if (!user) {
      console.error("Error: user is undefined");
      return;
    }

    try {
      const docRef = doc(
        db,
        `propietarios/${user.uid}/proceso_de_alta/inventario`
      );
      await setDoc(docRef, {
        userId: user.uid,
        ...formData,
      });

      await updateDoc(doc(db, "users", user.uid), {
        currentStep: 5,
        processStatus: "completed",
      });

      onAccept(); // Indicar que el formulario ha sido aceptado
      Swal.fire({
        icon: "success",
        title: "Formulario aceptado",
        text: "Puedes proceder al siguiente paso.",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Formulario de Inventario
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="numero_habitaciones"
                className="block text-sm font-medium text-gray-700"
              >
                Número de Habitaciones
              </label>
              <input
                type="number"
                id="numero_habitaciones"
                name="propiedad.numero_habitaciones"
                value={formData.propiedad.numero_habitaciones}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.numero_habitaciones
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                placeholder="Número de Habitaciones"
              />
            </div>
            <div>
              <label
                htmlFor="numero_banos"
                className="block text-sm font-medium text-gray-700"
              >
                Número de Baños
              </label>
              <input
                type="number"
                id="numero_banos"
                name="propiedad.numero_banos"
                value={formData.propiedad.numero_banos}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.numero_banos ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                placeholder="Número de Baños"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-semibold mb-2">
              Características de la Propiedad
            </h4>
            <label className="block">
              <input
                type="checkbox"
                name="propiedad.aire_acondicionado"
                checked={formData.propiedad.aire_acondicionado}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mr-2"
              />
              Aire Acondicionado
            </label>
            <label className="block">
              <input
                type="checkbox"
                name="propiedad.calefaccion"
                checked={formData.propiedad.calefaccion}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mr-2"
              />
              Calefacción
            </label>
            <label className="block">
              <input
                type="checkbox"
                name="propiedad.piscina"
                checked={formData.propiedad.piscina}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mr-2"
              />
              Piscina
            </label>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-semibold mb-2">
              Características Adicionales
            </h4>
            <label className="block">
              <input
                type="checkbox"
                name="caracteristicasAdicionales.terraza"
                checked={formData.caracteristicasAdicionales.terraza}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mr-2"
              />
              Terraza
            </label>
            <label className="block">
              <input
                type="checkbox"
                name="caracteristicasAdicionales.alarma"
                checked={formData.caracteristicasAdicionales.alarma}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mr-2"
              />
              Alarma
            </label>
            <label className="block">
              <input
                type="checkbox"
                name="caracteristicasAdicionales.gimnasio"
                checked={formData.caracteristicasAdicionales.gimnasio}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mr-2"
              />
              Gimnasio
            </label>
            <label className="block">
              <input
                type="checkbox"
                name="caracteristicasAdicionales.squash"
                checked={formData.caracteristicasAdicionales.squash}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mr-2"
              />
              Squash
            </label>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Guardar y Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;
