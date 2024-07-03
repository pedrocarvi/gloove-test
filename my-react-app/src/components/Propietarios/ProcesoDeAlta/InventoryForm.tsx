import React, { useState } from "react";

interface InventoryFormProps {
  onNext: () => void;
}

interface InventoryFormData {
  exampleField: string;
  // Añadir más campos según sea necesario
}

const InventoryForm: React.FC<InventoryFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState<InventoryFormData>({
    exampleField: "",
    // Inicializar más campos según sea necesario
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // lógica para guardar los datos en Firestore
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Campo de ejemplo
        </label>
        <input
          type="text"
          name="exampleField"
          value={formData.exampleField}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-white py-2 px-4 rounded-md transition hover:bg-primary-dark"
      >
        Completar
      </button>
    </form>
  );
};

export default InventoryForm;
