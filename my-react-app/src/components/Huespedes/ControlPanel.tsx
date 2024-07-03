import React, { useState } from "react";
import {
  FiSun,
  FiWind,
  FiHome,
  FiLock,
  FiThermometer,
  FiBarChart2,
} from "react-icons/fi";
import { WiSnowflakeCold } from "react-icons/wi"; // Weather Icons
import { FaLeaf } from "react-icons/fa"; // Font Awesome

const ControlPanel: React.FC = () => {
  const [isAirConditionerOn, setIsAirConditionerOn] = useState(true);
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [isLightOn, setIsLightOn] = useState(true);
  const [temperature, setTemperature] = useState(22);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary-light to-primary-dark p-6">
      <div className="bg-gradient-to-br from-primary-light to-primary-dark p-6 rounded-lg shadow-lg text-white w-full max-w-lg">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Tu vivienda</h2>
          <FiHome className="h-12 w-12" />
        </header>

        <div className="space-y-4">
          <ControlItem
            label="Aire acondicionado"
            isActive={isAirConditionerOn}
            toggleActive={() => setIsAirConditionerOn(!isAirConditionerOn)}
          />
          <ControlItem
            label="Ventana"
            isActive={isWindowOpen}
            toggleActive={() => setIsWindowOpen(!isWindowOpen)}
          />
          <ControlItem
            label="Luz"
            isActive={isLightOn}
            toggleActive={() => setIsLightOn(!isLightOn)}
          />
          <div className="flex items-center justify-between">
            <span className="font-bold">Temperatura</span>
            <div className="flex items-center">
              <FiThermometer className="mr-2" />
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-16 bg-gray-200 text-gray-800 rounded-md text-center"
              />
              <span className="ml-2">°C</span>
            </div>
          </div>
        </div>

        <div className="flex justify-around mt-6">
          <IconButton icon={<FiSun />} label="Sol" />
          <IconButton icon={<WiSnowflakeCold />} label="Nieve" />
          <IconButton icon={<FiWind />} label="Viento" />
          <IconButton icon={<FaLeaf />} label="Hoja" />
        </div>

        <div className="mt-8">
          <button className="bg-gradient-to-r from-primary-light to-primary-dark text-white text-lg font-bold py-4 px-8 rounded-full shadow-lg hover:from-primary-dark hover:to-primary-light transition transform hover:scale-105">
            Abrir vivienda
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-8">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Consumo Energético
          </h2>
          <FiBarChart2 className="h-6 w-6 text-gray-800" />
        </header>
        <div>
          <p className="text-gray-600">Consumo mensual: 450 kWh</p>
          <p className="text-gray-600">Costo aproximado: $60</p>
        </div>
      </div>
    </div>
  );
};

const ControlItem: React.FC<{
  label: string;
  isActive: boolean;
  toggleActive: () => void;
}> = ({ label, isActive, toggleActive }) => {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`font-bold ${isActive ? "text-green-500" : "text-red-500"}`}
      >
        {isActive ? "Activado" : "Desactivado"}
      </span>
      <label className="inline-flex items-center cursor-pointer">
        <span className="mr-2">{label}</span>
        <input
          type="checkbox"
          className="toggle-checkbox hidden"
          checked={isActive}
          onChange={toggleActive}
        />
        <div className="toggle-switch w-10 h-5 bg-gray-200 rounded-full shadow-inner">
          <div
            className={`toggle-dot w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
              isActive ? "translate-x-5" : "translate-x-0"
            }`}
          ></div>
        </div>
        <span className="ml-2">{isActive ? "Turn On" : "Turn Off"}</span>
      </label>
    </div>
  );
};

const IconButton: React.FC<{ icon: React.ReactNode; label: string }> = ({
  icon,
  label,
}) => {
  return (
    <button className="bg-white text-primary-dark rounded-full p-4 shadow-md hover:bg-primary-dark hover:text-white transition transform hover:scale-105">
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
};

export default ControlPanel;
