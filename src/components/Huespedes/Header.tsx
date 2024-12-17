import { useState } from "react";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const EmployerHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img src="/gloove_marca.png" alt="Logo" className="h-12 w-auto" />
        <h1 className="text-xl font-bold text-gray-700">
          Gloove - Panel de Empleados
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        {/* <button
          aria-label="Notificaciones"
          className="relative text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-75"
        >
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"></span>
        </button> */}
        {/* <button
          aria-label="Perfil de Usuario"
          className="relative text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-75"
          onClick={toggleModal}
        >
          <UserCircleIcon className="h-8 w-8" />
          <span className="sr-only">Abrir modal de perfil de usuario</span>
        </button> */}
      </div>

      {isModalOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full"
            initial={{ y: "-100vh" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-700">
                Editar Perfil
              </h2>
              <button
                onClick={toggleModal}
                className="text-gray-600 hover:text-gray-800"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Tu Nombre"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-primary"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="Tu Correo Electrónico"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-primary"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Nueva Contraseña"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-primary"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  placeholder="Tu Número de Teléfono"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-primary"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  placeholder="Tu Dirección"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                  Guardar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </header>
  );
};

export default EmployerHeader;
