// src/components/Propietarios/Chat.jsx
import PropietariosLayout from './PropietariosLayout';

const Chat = () => {
  return (
    <PropietariosLayout>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Chat</h1>
        <p className="text-gray-700 mb-6">Este es un párrafo de descripción para la sección actual del flujo.</p>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gray-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Bloque 1</h2>
            <div className="bg-gray-300 h-32 mb-4"></div> {/* Placeholder for Photo */}
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">Botón</button>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Bloque 2</h2>
            <div className="bg-gray-300 h-32 mb-4"></div> {/* Placeholder for Photo */}
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">Botón</button>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Bloque 3</h2>
            <div className="bg-gray-300 h-32 mb-4"></div> {/* Placeholder for Photo */}
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">Botón</button>
          </div>
        </div>
      </div>
    </PropietariosLayout>
  );
};

export default Chat;
