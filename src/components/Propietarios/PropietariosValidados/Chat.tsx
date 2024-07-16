import React from "react";

const categories = [
  {
    title: "Sobre la vivienda",
    subtitle: "Dinos qué estás buscando",
    placeholder: "Escribe tu mensaje aquí...",
    buttonText: "Iniciar chat",
  },
  {
    title: "Reserva planificada",
    subtitle: "Quiero reservar mi vivienda",
    placeholder: "Escribe tu mensaje aquí...",
    buttonText: "Iniciar chat",
  },
  {
    title: "Mantenimiento",
    subtitle: "Dinos qué ha ocurrido ¿Hay algún desperfecto en la vivienda?",
    placeholder: "Escribe tu mensaje aquí...",
    buttonText: "Iniciar chat",
  },
];

const QuestionsSection = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Dudas y preguntas
          </h1>
          <p className="text-gray-600 mt-2">
            ¡Resuelve cualquier pregunta con nuestros chats automatizados al
            instante!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {category.title}
                </h2>
                <p className="text-gray-600 mt-2">{category.subtitle}</p>
              </div>
              <textarea
                placeholder={category.placeholder}
                className="w-full p-4 h-40 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light mb-4"
              />
              <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition">
                {category.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsSection;
