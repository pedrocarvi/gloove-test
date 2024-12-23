import React from "react";
import { Link } from "react-router-dom";
import { FiBell, FiMessageSquare, FiUser, FiSettings } from "react-icons/fi";

const EmployerHeader = () => {
  return (
    <header className="bg-white shadow p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/profile" className="flex items-center">
          <div className="bg-gray-300 w-10 h-10 rounded-full mr-4 flex items-center justify-center text-gray-700 font-bold">
            {localStorage.getItem('userName')?.charAt(0)}
          </div>
          <div>
            <div className="text-blue-600 font-bold text-black">Empleado</div>
            <div className="text-gray-600">Hola {localStorage.getItem('userName')}</div>
          </div>
        </Link>
      </div>
      {/* <div className="flex items-center space-x-4">
        <Link to="/messages" className="text-gray-700 hover:text-blue-600">
          <FiMessageSquare className="h-6 w-6" />
        </Link>
        <Link to="/notifications" className="text-gray-700 hover:text-blue-600">
          <FiBell className="h-6 w-6" />
        </Link>
        <Link to="/settings" className="text-gray-700 hover:text-blue-600">
          <FiSettings className="h-6 w-6" />
        </Link>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center">
          <span className="mr-2">Pregúntanos</span>
          <div className="bg-white w-4 h-4 rounded-full flex items-center justify-center transform rotate-45">
            <div className="bg-blue-500 w-2 h-2"></div>
          </div>
        </button>
      </div> */}
    </header>
  );
};

export default EmployerHeader;
