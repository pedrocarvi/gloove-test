import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const ProcesoDeAlta: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<string>('Documentación enviada'); // Estado inicial del proceso
  const [completed, setCompleted] = useState<boolean>(false); // Estado inicial del proceso completado

  const handleNextStep = async () => {
    const nextStep = step === 'Documentación enviada' ? 'Validación de documentos' : 'Finalizado';
    const isCompleted = nextStep === 'Finalizado';

    setStep(nextStep);
    setCompleted(isCompleted);

    // Actualiza el proceso de alta en Firestore
    if (user) {
      const processRef = doc(db, 'propietarios', user.uid, 'proceso_de_alta', 'registration-process-id');
      await updateDoc(processRef, {
        step: nextStep,
        completed: isCompleted,
      });

      if (isCompleted) {
        // Actualiza el estado de registro completo en el documento del usuario
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          completedRegistration: true,
        });
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Proceso de Alta</h1>
      <p className="text-gray-700 mb-6">Paso actual: {step}</p>
      <button
        onClick={handleNextStep}
        className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
      >
        {completed ? 'Proceso Completo' : 'Siguiente Paso'}
      </button>
    </div>
  );
};

export default ProcesoDeAlta;
