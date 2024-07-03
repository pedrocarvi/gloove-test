import React, { useState } from "react";

interface TechnicalFormProps {
  onNext: () => void;
}

const TechnicalForm: React.FC<TechnicalFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    propertyType: "",
    address: "",
    ownerName: "",
    // Otros campos necesarios
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Guardar datos en Firestore
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Ficha Técnica</h2>
      <div className="flex flex-col space-y-2">
        <label className="text-gray-700">Tipo de Propiedad</label>
        <input
          type="text"
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-gray-700">Dirección</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-gray-700">Nombre del Propietario</label>
        <input
          type="text"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition"
      >
        Siguiente
      </button>
    </form>
  );
};

export default TechnicalForm;
