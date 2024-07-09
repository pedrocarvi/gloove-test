import React, { useState, ChangeEvent } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";

interface TechnicalFormProps {
  onNext: () => void;
  onPrev: () => void;
}

const TechnicalForm: React.FC<TechnicalFormProps> = React.memo(({ onNext, onPrev }) => {
  const [formData, setFormData] = useState({
    fecha: '',
    agente: '',
    agencia: '',
    comisionista: '',
    fechaFirmaContrato: '',
    titular: '',
    propietario: '',
    email: '',
    telefono: '',
    horarioContacto: '',
    dniPasaporte: '',
    vivienda: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
    direccionExacta: '',
    tramitarLicencia: '',
    numVUT: '',
    numCuenta: '',
    numCatastro: '',
    nombreComercial: '',
  });

  const { user } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = async () => {
    if (!user) {
      console.error("Error: user is undefined");
      return;
    }

    try {
      const docRef = doc(db, `propietarios/${user.uid}/proceso_de_alta/technical_form`);
      await setDoc(docRef, {
        userId: user.uid,
        ...formData,
      });

      await updateDoc(doc(db, "users", user.uid), {
        currentStep: 1,
        processStatus: "textil",
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
        <form className="form-content">
          {Object.keys(formData).map((key) => (
            <div className="form-row" key={key}>
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                type="text"
                name={key}
                value={(formData as any)[key]} // Use `as any` to avoid TypeScript error
                onChange={handleChange}
              />
            </div>
          ))}
        </form>
        <div className="button-group">
          <button type="button" className="form-button" onClick={onPrev}>Anterior</button>
          <button type="button" className="form-button" onClick={handleNext}>Siguiente</button>
        </div>
      </div>
    </div>
  );
});

export default TechnicalForm;


