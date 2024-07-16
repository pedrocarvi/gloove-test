import React, { useState } from "react";

const IncidentForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [priority, setPriority] = useState("media");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Manejar el envío del formulario
    console.log({ name, email, priority, message });
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-4">Incidencias</h1>
      <p className="text-center text-gray-600 mb-8">
        Si no se ha podido resolver sus dudas con nuestro chat automatizado y el
        problema persiste, no dudes en contactar con nosotros mediante la
        creación de un nuevo ticket. Responderemos a la mayor brevedad posible.
        Disculpar las molestias. Muchas gracias.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-bold mb-1"
            >
              Nombre
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-1"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="priority"
            className="block text-gray-700 font-bold mb-1"
          >
            Prioridad
          </label>
          <select
            id="priority"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-primary"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-gray-700 font-bold mb-1"
          >
            Mensaje
          </label>
          <textarea
            id="message"
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-primary"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncidentForm;
