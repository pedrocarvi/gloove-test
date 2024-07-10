import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const { step } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(
    parseInt(step ?? "0", 10)
  );
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<any>({});

  useEffect(() => {
    console.log("ProcesoDeAlta mounted, currentStep:", currentStep);
    setIsAccepted(false); // Reset acceptance state on step change
  }, [currentStep]);

  const handleNextStep = async () => {
    if (currentStep < steps.length - 1) {
      console.log("Moving to next step");
      setCurrentStep(currentStep + 1);
      navigate(`/proceso-de-alta/${currentStep + 1}`);
    } else {
      console.log("Completing the registration process");
      navigate("/dashboard-propietarios");
    }
  };

  const handleSaveFormValues = (step: number, values: any) => {
    setFormValues((prevValues: any) => ({
      ...prevValues,
      [step]: values,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-primary-dark text-center">
        Proceso de Alta
      </h1>
      <ProgressBar steps={steps} currentStep={currentStep} />
      <div className="mt-4 bg-white p-4 rounded-lg shadow-lg">
        <div className="mb-2">
          {currentStep === 0 && (
            <TechnicalForm
              onAccept={() => setIsAccepted(true)}
              initialValues={formValues[0] ?? {}}
            />
          )}
          {currentStep === 1 && (
            <TextileForm onAccept={() => setIsAccepted(true)} />
          )}
          {currentStep === 2 && (
            <TextileSummary
              onAccept={() => setIsAccepted(true)}
              initialValues={formValues[2] ?? {}}
            />
          )}
          {currentStep === 3 && (
            <DistinctDocument onAccept={() => setIsAccepted(true)} />
          )}
          {currentStep === 4 && (
            <Contract
              onAccept={() => {
                handleSaveFormValues(4, formValues[4]);
                setIsAccepted(true);
              }}
              initialValues={formValues[4] ?? {}}
            />
          )}
          {currentStep === 5 && (
            <InventoryForm
              onAccept={() => {
                handleSaveFormValues(5, formValues[5]);
                setIsAccepted(true);
              }}
              initialValues={formValues[5] ?? {}}
              setFormValues={handleSaveFormValues} // Pasar la función aquí
            />
          )}
        </div>
        <div className="flex justify-between mt-2">
          <button
            disabled={currentStep === 0}
            onClick={() => {
              setCurrentStep(currentStep - 1);
              navigate(`/proceso-de-alta/${currentStep - 1}`);
            }}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            disabled={!isAccepted}
            onClick={handleNextStep}
            className={`py-2 px-4 rounded-md transition ${
              isAccepted
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {currentStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcesoDeAlta;
