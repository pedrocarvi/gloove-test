import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebaseConfig";

import ProgressBar from "./ProgressBar";
import TechnicalForm from "./TechnicalForm";
import TextileForm from "./TextileForm";
import TextileSummary from "./TextileSummary";
import DistinctDocument from "./DistinctDocument";
import Contract from "./Contract";
import InventoryForm from "./InventoryForm";

import GlooveLogo from "../../../assets/gloove-logo.jpg"

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
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<any>({});

  const [step1Data, setStep1Data] = useState({
    camas90: 0,
    camas105: 0,
    camas135: 0,
    camas150: 0,
    camas180: 0,
    camas200: 0,
    banos: 0,
    aseos: 0,
    capacidadMaxima: 0,
    propietario: '',
    dni: '',
    direccion: '',
  });

  const [textileData, setTextileData] = useState({
    toallasGrandes: 0,
    toallasPequenas: 0,
    sabanas: 0,
    sabanas90: 0,
    sabanas105 : 0,
    sabanas135 : 0,
    sabanas150 : 0,
    sabanas180 : 0,
    sabanas200 : 0,
    alfombrines: 0,
    fundasAlmohadaCamas150: 0,
    fundasAlmohadaOtrasCamas: 0,
    totalFundasAlmohada: 0,
    fundasNordico: 0,
  });

  const handleTextileDataChange = (newData: typeof textileData) => {
    setTextileData(newData);
    console.log("Info del step 2");
    console.log(newData);
  };

  useEffect(() => {
    console.log("ProcesoDeAlta mounted, currentStep:", currentStep);
    console.log("User in ProcesoDeAlta:", user);
    setIsAccepted(false);
  }, [currentStep]);

  const handleNextStep = async () => {
    if (currentStep < steps.length - 1) {
      console.log("Moving to next step:", currentStep + 1);
      setCurrentStep(currentStep + 1);
      navigate(`/proceso-de-alta/${currentStep + 1}`);
    } else {
      console.log("Completing the registration process");
      try {
        if (user) {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, { completedRegistration: true });
        }
        navigate("/dashboard-propietarios");
      } catch (error) {
        console.error("Error updating completed registration status:", error);
      }
    }
  };

  const handleSaveFormValues = (step: number, values: any) => {
    setFormValues((prevValues: any) => ({
      ...prevValues,
      [step]: values,
    }));
  };

  // useEffect(() => {
  //   console.log("Form values updated:", formValues);
  // }, [formValues]);

   
  return (
    <div className="container mx-auto p-4">
      <img src={GlooveLogo} alt="Logo de Gloove" width={220} />
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
              setStep1Data={setStep1Data}
            />
          )}
          {currentStep === 1 && (
            <TextileForm onAccept={() => setIsAccepted(true)} data={step1Data} onDataChange={handleTextileDataChange} />
          )}
          {currentStep === 2 && (
            <TextileSummary
              onAccept={() => setIsAccepted(true)}
              step1Data={step1Data}
              initialValues={textileData}
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
              textileData={textileData} 
              step1Data={step1Data}   
            />
          )}
          {currentStep === 5 && (
            <InventoryForm
              onAccept={() => {
                handleSaveFormValues(5, formValues[5]);
                setIsAccepted(true);
              }}
              initialValues={formValues[5] ?? {}}
              setFormValues={handleSaveFormValues}
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
