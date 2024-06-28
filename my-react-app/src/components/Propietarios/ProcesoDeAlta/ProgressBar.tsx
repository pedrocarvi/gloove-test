import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  currentStep: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = [
    'Documentación enviada',
    'Validación de documentos',
    'Ficha Técnica',
    'Formulario Textil',
    'Presupuesto Textil',
    'Contrato',
    'Formulario de Inventario'
  ];

  const currentStepIndex = steps.indexOf(currentStep);
  const stepPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${stepPercentage}%` }}></div>
      <div className="steps">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step ${currentStepIndex >= index ? 'active' : ''}`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;