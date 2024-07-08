import React, { useState, useCallback } from "react";

interface TechnicalFormProps {
  onNext: () => void;
}

const TechnicalForm: React.FC<TechnicalFormProps> = React.memo(({ onNext }) => {
  const [formData, setFormData] = useState({
    propertyType: "",
    address: "",
    ownerName: "",
    // Otros campos necesarios
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // Validar datos antes de guardar en Firestore
      if (formData.propertyType && formData.address && formData.ownerName) {
        // Guardar datos en Firestore
        onNext();
      } else {
        alert("Todos los campos son obligatorios");
      }
    },
    [formData, onNext]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Ficha Técnica</h2>
      <div className="flex flex-col space-y-2">
        <label htmlFor="propertyType" className="text-gray-700">
          Tipo de Propiedad
        </label>
        <input
          id="propertyType"
          type="text"
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="address" className="text-gray-700">
          Dirección
        </label>
        <input
          id="address"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="ownerName" className="text-gray-700">
          Nombre del Propietario
        </label>
        <input
          id="ownerName"
          type="text"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition duration-200"
      >
        Siguiente
      </button>
    </form>
  );
});

export default TechnicalForm;
