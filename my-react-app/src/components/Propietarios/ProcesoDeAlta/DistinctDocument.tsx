import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface DistinctDocumentProps {
  onNext: () => void;
}

interface DistinctDocumentData {
  dni: File | null;
  referenciaCatastral: File | null;
  vut: File | null;
}

const DistinctDocument: React.FC<DistinctDocumentProps> = ({ onNext }) => {
  const [documents, setDocuments] = useState<DistinctDocumentData>({
    dni: null,
    referenciaCatastral: null,
    vut: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setDocuments((prevDocs) => ({ ...prevDocs, [name]: files[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // lógica para guardar los documentos en Firestore
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">DNI</label>
        <input
          type="file"
          name="dni"
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Referencia Catastral
        </label>
        <input
          type="file"
          name="referenciaCatastral"
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">VUT</label>
        <input
          type="file"
          name="vut"
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-white py-2 px-4 rounded-md transition hover:bg-primary-dark"
      >
        Siguiente
      </button>
    </form>
  );
};

export default DistinctDocument;
