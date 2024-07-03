import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc } from "firebase/firestore";

interface ContractProps {
  onNext: () => void;
}

const Contract: React.FC<ContractProps> = ({ onNext }) => {
  const [signature, setSignature] = useState<string | null>(null);
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const navigate = useNavigate();

  const handleClear = () => {
    sigCanvasRef.current?.clear();
    setSignature(null);
  };

  const handleSave = () => {
    if (sigCanvasRef.current) {
      setSignature(
        sigCanvasRef.current.getTrimmedCanvas().toDataURL("image/png")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signature) {
      const db = getFirestore();
      const userDoc = doc(db, "contracts", "contractId"); // Ajusta el ID del documento según sea necesario
      await setDoc(userDoc, { signature });
      onNext();
    } else {
      alert("Por favor, firma el contrato antes de continuar.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-primary">Contrato</h2>
      <p className="text-gray-700">Contenido del contrato...</p>
      <div>
        <SignatureCanvas
          ref={sigCanvasRef}
          canvasProps={{ width: 500, height: 200, className: "border" }}
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleClear}
          className="bg-red-500 text-white py-2 px-4 rounded-md transition hover:bg-red-600"
        >
          Borrar
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white py-2 px-4 rounded-md transition hover:bg-blue-600"
        >
          Guardar
        </button>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-primary text-white py-2 px-4 rounded-md transition hover:bg-primary-dark mt-4"
      >
        Firmar y Siguiente
      </button>
    </div>
  );
};

export default Contract;
