import React, { useState, ChangeEvent, FormEvent } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";

interface TextileFormProps {
  onAccept: () => void;
}

interface TextileItem {
  medida: string;
  cantidad: string;
}

interface TextileFormData {
  toalla: TextileItem[];
  alfombrin: TextileItem[];
  sabanaEncimera: TextileItem[];
  fundaAlmohada: TextileItem[];
  rellenoAlmohada: TextileItem[];
  fundaNordica: TextileItem[];
  rellenoNordico: TextileItem[];
  protectorColchon: TextileItem[];
}

type Category = keyof TextileFormData;

const TextileForm: React.FC<TextileFormProps> = ({ onAccept }) => {
  const initialProductState = { medida: "", cantidad: "" };

  const [formData, setFormData] = useState<TextileFormData>({
    toalla: [initialProductState],
    alfombrin: [initialProductState],
    sabanaEncimera: [initialProductState],
    fundaAlmohada: [initialProductState],
    rellenoAlmohada: [initialProductState],
    fundaNordica: [initialProductState],
    rellenoNordico: [initialProductState],
    protectorColchon: [initialProductState],
  });

  const { user } = useAuth();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    category: Category,
    index: number
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedCategory = [...prevData[category]];
      updatedCategory[index] = { ...updatedCategory[index], [name]: value };
      return { ...prevData, [category]: updatedCategory };
    });
  };

  const handleAdd = (category: Category) => {
    setFormData((prevData) => ({
      ...prevData,
      [category]: [...prevData[category], initialProductState],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("Error: user is undefined");
      return;
    }

    try {
      // Guardar los datos del formulario en Firestore
      const docRef = doc(db, `propietarios/${user.uid}/proceso_de_alta/textil_presupuesto`);
      await setDoc(docRef, {
        userId: user.uid,
        ...formData,
      });

      // Actualizar el estado del proceso
      await updateDoc(doc(db, "users", user.uid), {
        currentStep: 2,
        processStatus: "textile_summary",
      });

      Swal.fire({
        icon: "success",
        title: "Datos textiles guardados",
        text: "Puedes proceder al siguiente paso.",
      });
      onAccept();
    } catch (error) {
      console.error("Error al guardar los datos textiles:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al guardar los datos textiles. Por favor, inténtalo de nuevo.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Formulario de Textiles
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "toalla", label: "Toalla", options: ["50x100", "100x150"] },
            { name: "alfombrin", label: "Alfombrín", options: ["50x65"] },
            {
              name: "sabanaEncimera",
              label: "Sábana Encimera",
              options: ["90", "105", "150", "180"],
            },
            {
              name: "fundaAlmohada",
              label: "Funda Almohada",
              options: ["75", "90"],
            },
            {
              name: "rellenoAlmohada",
              label: "Relleno Almohada",
              options: ["75", "90"],
            },
            {
              name: "fundaNordica",
              label: "Funda Nórdica",
              options: ["90", "105", "135", "150", "180", "200"],
            },
            {
              name: "rellenoNordico",
              label: "Relleno Nórdico",
              options: ["90", "105", "135", "150", "180", "200"],
            },
            {
              name: "protectorColchon",
              label: "Protector Colchón",
              options: ["90", "105", "135", "150", "180"],
            },
          ].map(({ name, label, options }) => (
            <div key={name} className="mb-4">
              <h3 className="text-lg font-semibold mb-2">{label}</h3>
              {formData[name as Category].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <select
                    name="medida"
                    value={item.medida}
                    onChange={(e) => handleChange(e, name as Category, index)}
                    className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="">Seleccione medida</option>
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="cantidad"
                    value={item.cantidad}
                    onChange={(e) => handleChange(e, name as Category, index)}
                    placeholder="Cantidad"
                    className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAdd(name as Category)}
                className="py-1 px-2 bg-primary text-white rounded-md"
              >
                Añadir {label}
              </button>
            </div>
          ))}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Enviar Formulario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TextileForm;
