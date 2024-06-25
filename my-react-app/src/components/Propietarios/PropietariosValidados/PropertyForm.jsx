// src/components/Propietarios/PropertyForm.jsx
import PropietariosLayout from './PropietariosLayout';

const PropertyForm = () => {
  return (
    <PropietariosLayout>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Alta de Vivienda</h1>
        <div className="flex space-x-6">
          <div className="bg-gray-200 p-4 rounded-lg flex-1">
            <h2 className="text-lg font-semibold mb-2">Ficha técnica</h2>
            <div className="bg-gray-300 h-32 mb-4"></div> {/* Placeholder for Photo */}
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">Botón</button>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg flex-1">
            <h2 className="text-lg font-semibold mb-2">Textil + Presupuesto</h2>
            <div className="bg-gray-300 h-32 mb-4"></div> {/* Placeholder for Photo */}
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">Botón</button>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg flex-1">
            <h2 className="text-lg font-semibold mb-2">Documentación</h2>
            <div className="bg-gray-300 h-32 mb-4"></div> {/* Placeholder for Photo */}
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">Botón</button>
          </div>
        </div>
        <div className="flex space-x-6 mt-6">
          <div className="bg-gray-200 p-4 rounded-lg flex-1">
            <h2 className="text-lg font-semibold mb-2">Contrato</h2>
            <div className="bg-gray-300 h-32 mb-4"></div> {/* Placeholder for Photo */}
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">Botón</button>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg flex-1">
            <h2 className="text-lg font-semibold mb-2">Inventario</h2>
            <div className="bg-gray-300 h-32 mb-4"></div> {/* Placeholder for Photo */}
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">Botón</button>
          </div>
        </div>
      </div>
    </PropietariosLayout>
  );
};

export default PropertyForm;
