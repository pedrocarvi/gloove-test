import React from "react";
import { ProgressBar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const steps = [
  "Ficha técnica",
  "Textil + Presupuesto",
  "Documentación",
  "Contrato",
  "Inventario",
];

const Documentacion: React.FC = () => {
  const progressPercent = 60; // Ajusta esto según el progreso real

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <ProgressBar now={progressPercent} label={`${progressPercent}%`} />
        <div className="d-flex justify-content-between mt-2">
          {steps.map((step, index) => (
            <span
              key={index}
              className={`text-sm ${
                progressPercent >= (index + 1) * 20
                  ? "text-primary"
                  : "text-gray-400"
              }`}
            >
              {step}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src="/icon.png"
              alt="Document Icon"
              className="h-16 w-16 mb-4 text-primary"
            />
            <button className="bg-primary text-white py-2 px-4 rounded-md transition hover:bg-primary-dark">
              Descargar
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-around">
        <button className="border border-primary text-primary py-2 px-4 rounded-md transition hover:bg-primary hover:text-white">
          Ver y firmar
        </button>
        <button className="border border-primary text-primary py-2 px-4 rounded-md transition hover:bg-primary hover:text-white">
          Realizar
        </button>
      </div>
    </div>
  );
};

export default Documentacion;
