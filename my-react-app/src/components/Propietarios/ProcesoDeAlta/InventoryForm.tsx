import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';

// Definición de interfaces
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

// Componente InventoryForm
interface InventoryFormProps {
  onNext: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState<FormData>({
    propiedad: {
      numero_habitaciones: '',
      numero_banos: '',
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
      pesoLimiteAnimalesKg: '',
      seAceptanAnimalesRazaPeligrosa: false,
    },
    piscina: {
      tipoPiscina: '',
      fechaApertura: '',
      fechaCierre: '',
      dimensiones: '',
      profundidadMaxima: '',
      profundidadMinima: '',
      piscinaClimatizada: false,
      fechaAperturaClimatizada: '',
      fechaCierreClimatizada: '',
      dimensionesClimatizada: '',
      profundidadMaximaClimatizada: '',
      profundidadMinimaClimatizada: '',
    },
    restricciones: {
      noGruposJovenesMenosDe: '',
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
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    const keys = name.split('.');

    setFormData((prevFormData) => {
      const updatedData: any = { ...prevFormData };
      if (keys.length === 2) {
        updatedData[keys[0]][keys[1]] = newValue;
      }
      return updatedData;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    try {
      const docRef = doc(db, 'procesos_de_alta/inventario', user.uid);
      await setDoc(docRef, {
        userId: user.uid,
        ...formData,
      });

      await updateDoc(doc(db, 'users', user.uid), {
        currentStep: 6, // assuming currentStep 6 corresponds to the next step in the process
      });

      onNext(); // Mover al siguiente paso usando el prop onNext
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Formulario de Inventario</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-xl font-semibold mb-2">Propiedad</h4>
            <input
              type="number"
              name="propiedad.numero_habitaciones"
              value={formData.propiedad.numero_habitaciones}
              onChange={handleChange}
              placeholder="Número de Habitaciones"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              name="propiedad.numero_banos"
              value={formData.propiedad.numero_banos}
              onChange={handleChange}
              placeholder="Número de Baños"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <label className="block">
              <input
                type="checkbox"
                name="propiedad.aire_acondicionado"
                checked={formData.propiedad.aire_acondicionado}
                onChange={handleChange}
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
                className="mr-2"
              />
              Piscina
            </label>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold mb-2">Características Adicionales</h4>
            <label className="block">
              <input
                type="checkbox"
                name="caracteristicasAdicionales.terraza"
                checked={formData.caracteristicasAdicionales.terraza}
                onChange={handleChange}
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
                className="mr-2"
              />
              Squash
            </label>
          </div>

          {/* Add more sections as needed, following the pattern above */}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Guardar y Continuar
          </button>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;
