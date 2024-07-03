import React, { useState } from "react";

interface TextileFormProps {
  onNext: () => void;
}

const TextileForm: React.FC<TextileFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    towels: 0,
    bedSheets: 0,
    // Otros campos necesarios
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Guardar datos en Firestore
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Textil + Presupuesto</h2>
      <div className="flex flex-col space-y-2">
        <label className="text-gray-700">Toallas</label>
        <input
          type="number"
          name="towels"
          value={formData.towels}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-gray-700">Sábanas</label>
        <input
          type="number"
          name="bedSheets"
          value={formData.bedSheets}
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

export default TextileForm;
