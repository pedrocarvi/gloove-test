import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import TechnicalForm from "./TechnicalForm";
import TextileForm from "./TextileForm";
import DistinctDocument from "./DistinctDocument";
import Contract from "./Contract";
import InventoryForm from "./InventoryForm";

const steps = [
  "Ficha técnica",
  "Textil + Presupuesto",
  "Documentación",
  "Contrato",
  "Inventario",
];

const ProcesoDeAlta: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completar el proceso de alta
      navigate("/dashboard-propietarios");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-primary-dark text-center">
        Proceso de Alta
      </h1>
      <ProgressBar steps={steps} currentStep={currentStep} />
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        {currentStep === 0 && <TechnicalForm onNext={handleNextStep} />}
        {currentStep === 1 && <TextileForm onNext={handleNextStep} />}
        {currentStep === 2 && <DistinctDocument onNext={handleNextStep} />}
        {currentStep === 3 && <Contract onNext={handleNextStep} />}
        {currentStep === 4 && <InventoryForm onNext={handleNextStep} />}
        <div className="flex justify-between mt-4">
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(currentStep - 1)}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={handleNextStep}
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition"
          >
            {currentStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcesoDeAlta;
