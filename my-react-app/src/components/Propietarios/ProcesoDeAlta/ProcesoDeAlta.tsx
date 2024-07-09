import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import TechnicalForm from "./TechnicalForm";
import TextileForm from "./TextileForm";
import TextileSummary from "./TextileSummary";
import DistinctDocument from "./DistinctDocument";
import Contract from "./Contract";
import InventoryForm from "./InventoryForm";

const steps = [
  "Ficha técnica",
  "Textil",
  "Presupuesto Textil",
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

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-primary-dark text-center">
        Proceso de Alta
      </h1>
      <ProgressBar steps={steps} currentStep={currentStep} />
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        {currentStep === 0 && <TechnicalForm onNext={handleNextStep} onPrev={handlePrevStep} />}
        {currentStep === 1 && <TextileForm onNext={handleNextStep} onPrev={handlePrevStep} />}
        {currentStep === 2 && <TextileSummary onNext={handleNextStep} onPrev={handlePrevStep} />}
        {currentStep === 3 && <DistinctDocument onNext={handleNextStep} onPrev={handlePrevStep} />}
        {currentStep === 4 && <Contract onNext={handleNextStep} onPrev={handlePrevStep} />}
        {currentStep === 5 && <InventoryForm onNext={handleNextStep} onPrev={handlePrevStep} />}
      </div>
    </div>
  );
};

export default ProcesoDeAlta;
