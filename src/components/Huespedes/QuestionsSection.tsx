// src/components/QuestionsSection.tsx
import React from "react";

const QuestionsSection: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Dudas y Preguntas
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            ¡Resuelve cualquier pregunta con nuestros chats automatizados al
            instante!
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Tarjetas */}
          <QuestionCard
            title="Sobre la vivienda"
            description="Dinos qué estás buscando"
          />
          <QuestionCard title="Limpieza" description="Dinos qué ha ocurrido" />
          <QuestionCard
            title="Mantenimiento"
            description="Dinos qué ha ocurrido ¿Hay algún desperfecto en la vivienda?"
          />
        </div>
      </div>
    </section>
  );
};

interface QuestionCardProps {
  title: string;
  description: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <label className="block text-gray-700 font-bold mb-2" htmlFor="message">
        Message
      </label>
      <textarea
        id="message"
        rows={4}
        className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Escribe tu mensaje aquí..."
      ></textarea>
      <button className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition">
        Iniciar chat
      </button>
    </div>
  );
};

export default QuestionsSection;
