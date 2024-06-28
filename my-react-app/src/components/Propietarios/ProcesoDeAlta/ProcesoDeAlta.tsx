import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useAuth } from '../../../context/AuthContext';
import TechnicalForm from './TechnicalForm';
import TextileForm from './TextileForm';
import TextileSummary from './TextileSummary';
import Contract from './Contract';
import InventoryForm from './InventoryForm';
import ProgressBar from './ProgressBar';

const ProcesoDeAlta: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<string>('Documentación enviada');
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      const checkProcessStatus = async () => {
        const processRef = doc(db, 'propietarios', user.uid, 'proceso_de_alta', 'registration-process-id');
        const processDoc = await getDoc(processRef);
        if (processDoc.exists()) {
          const processData = processDoc.data();
          setStep(processData.step);
          setCompleted(processData.completed);
        }
      };
      checkProcessStatus();
    }
  }, [user]);

  const handleNextStep = async () => {
    let nextStep: string;
    switch (step) {
      case 'Documentación enviada':
        nextStep = 'Validación de documentos';
        break;
      case 'Validación de documentos':
        nextStep = 'technical_form';
        break;
      case 'technical_form':
        nextStep = 'textile_form';
        break;
      case 'textile_form':
        nextStep = 'textile_summary';
        break;
      case 'textile_summary':
        nextStep = 'contract';
        break;
      case 'contract':
        nextStep = 'inventory_form';
        break;
      case 'inventory_form':
        nextStep = 'Finalizado';
        break;
      default:
        nextStep = 'Finalizado';
    }

    const isCompleted = nextStep === 'Finalizado';

    setStep(nextStep);
    setCompleted(isCompleted);

    if (user) {
      const processRef = doc(db, 'propietarios', user.uid, 'proceso_de_alta', 'registration-process-id');
      await updateDoc(processRef, {
        step: nextStep,
        completed: isCompleted,
      });

      if (isCompleted) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          completedRegistration: true,
        });
        navigate('/propietarios/dashboard');
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'Documentación enviada':
      case 'Validación de documentos':
        return (
          <div>
            <p className="text-gray-700 mb-6">Paso actual: {step}</p>
            <button
              onClick={handleNextStep}
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
            >
              {completed ? 'Proceso Completo' : 'Siguiente Paso'}
            </button>
          </div>
        );
      case 'technical_form':
        return <TechnicalForm onComplete={handleNextStep} />;
      case 'textile_form':
        return <TextileForm onComplete={handleNextStep} />;
      case 'textile_summary':
        return <TextileSummary onComplete={handleNextStep} />;
      case 'contract':
        return <Contract onComplete={handleNextStep} />;
      case 'inventory_form':
        return <InventoryForm onComplete={handleNextStep} />;
      default:
        return <div>Paso no reconocido</div>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Proceso de Alta</h1>
      <ProgressBar currentStep={step} />
      {renderStep()}
    </div>
  );
};

export default ProcesoDeAlta;