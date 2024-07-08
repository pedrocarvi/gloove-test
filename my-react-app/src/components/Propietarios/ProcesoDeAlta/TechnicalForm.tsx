// src/components/Propietarios/ProcesoDeAlta/TechnicalForm.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";


interface TechnicalFormProps {
  onNext: () => void;
}

const TechnicalForm: React.FC<TechnicalFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    vivienda: "",
    direccion: "",
    num_habitaciones: "",
    num_banos: "",
    superficie: "",
    otros_detalles: "",
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("Error: user is undefined");
      return;
    }

    try {
      const docRef = doc(db, "procesos_de_alta/technical_forms", user.uid);
      await setDoc(docRef, {
        userId: user.uid,
        ...formData,
      });

      await updateDoc(doc(db, "users", user.uid), {
        currentStep: 1, // assuming currentStep 1 corresponds to the next step in the process
      });

      onNext(); // Move to the next step using the onNext prop
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="text-4xl font-bold mb-8 text-primary-dark text-center">Ficha Técnica</h1>
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-row">
            <label>Nombre de la Vivienda</label>
            <input type="text" name="vivienda" value={formData.vivienda} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Dirección</label>
            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Número de Habitaciones</label>
            <input type="text" name="num_habitaciones" value={formData.num_habitaciones} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Número de Baños</label>
            <input type="text" name="num_banos" value={formData.num_banos} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Superficie (m²)</label>
            <input type="text" name="superficie" value={formData.superficie} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Otros Detalles</label>
            <textarea name="otros_detalles" value={formData.otros_detalles} onChange={handleChange}></textarea>
          </div>
          <button type="submit" className="form-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TechnicalForm;
