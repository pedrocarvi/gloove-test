// src/components/Propietarios/Properties.jsx
import PropietariosLayout from './PropietariosLayout';

const Properties = () => {
  return (
    <PropietariosLayout>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Mis Viviendas</h1>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Casa 1</h2>
            <div className="bg-gray-300 h-32 mb-4"></div> {/* Placeholder for Photo */}
            <p className="text-gray-600">Front Side</p>
            <p className="text-gray-600">Living Room</p>
            <div className="bg-gray-300 h-32 mt-4 mb-4"></div> {/* Placeholder for Graph */}
          </div>
          <div className="bg-gray-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Casa 2</h2>
            <div className="bg-gray-300 h-32 mb-4"></div> {/* Placeholder for Photo */}
            <p className="text-gray-600">Front Side</p>
            <p className="text-gray-600">Living Room</p>
            <div className="bg-gray-300 h-32 mt-4 mb-4"></div> {/* Placeholder for Graph */}
          </div>
        </div>
      </div>
    </PropietariosLayout>
  );
};

export default Properties;
