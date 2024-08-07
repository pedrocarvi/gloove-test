import React from "react";

const FAQs = [
  {
    question: "¿Cómo puedo agregar una nueva vivienda?",
    answer:
      "Para agregar una nueva vivienda, navega a la sección 'Alta de vivienda' en el menú lateral y sigue las instrucciones proporcionadas.",
  },
  {
    question: "¿Cómo puedo contactar al soporte técnico?",
    answer:
      "Puedes contactar al soporte técnico enviando un mensaje a través del chat disponible en la sección 'Chat' del menú lateral.",
  },
  {
    question: "¿Dónde puedo ver mis notificaciones?",
    answer:
      "Las notificaciones se pueden ver en la sección 'Notificaciones' del menú lateral.",
  },
  {
    question: "¿Cómo puedo actualizar mi perfil?",
    answer:
      "Para actualizar tu perfil, navega a la sección 'Mi perfil' en el menú lateral y realiza los cambios necesarios.",
  },
  {
    question: "¿Qué debo hacer si olvido mi contraseña?",
    answer:
      "Si olvidas tu contraseña, puedes restablecerla haciendo clic en '¿Olvidaste tu contraseña?' en la página de inicio de sesión.",
  },
];

const FaqPage = () => {
  return (
    <div className="p-6 bg-white dark:bg-dark-background rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-gloovePrimary-dark dark:text-dark-text">
        Preguntas Frecuentes
      </h1>
      <div className="space-y-4">
        {FAQs.map((faq, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gloovePrimary-dark dark:text-dark-text">
              {faq.question}
            </h2>
            <p className="mt-2 text-gray-700 dark:text-dark-text">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
