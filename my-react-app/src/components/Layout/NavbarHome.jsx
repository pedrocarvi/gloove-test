import { useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Modal from "../Modals/Modal"; // Asegúrate de tener esta imagen en tu carpeta public

const NavbarHome = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <img
              className="h-12 w-auto"
              src="/gloove_marca.png"
              alt="Gloove Logo"
            />
          </div>
          <div className="hidden md:flex md:items-center md:space-x-10">
            <Link
              to="/"
              className="text-gray-800 hover:text-teal-600 text-lg font-medium"
            >
              Home
            </Link>
            <Link
              to="/features"
              className="text-gray-800 hover:text-teal-600 text-lg font-medium"
            >
              Features
            </Link>
            <Link
              to="/team"
              className="text-gray-800 hover:text-teal-600 text-lg font-medium"
            >
              Team
            </Link>
            <Link
              to="/contact"
              className="text-gray-800 hover:text-teal-600 text-lg font-medium"
            >
              Contact
            </Link>
            <button
              onClick={toggleModal}
              className="text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md text-lg font-medium"
            >
              Iniciar Sesión
            </button>
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-800 hover:text-teal-600 focus:outline-none focus:text-teal-600"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="text-gray-800 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/features"
              className="text-gray-800 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Features
            </Link>
            <Link
              to="/team"
              className="text-gray-800 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Team
            </Link>
            <Link
              to="/contact"
              className="text-gray-800 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            <button
              onClick={() => {
                toggleMenu();
                toggleModal();
              }}
              className="text-white bg-teal-600 hover:bg-teal-700 block w-full px-3 py-2 rounded-md text-base font-medium"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      )}
      {modalOpen && (
        <Modal onClose={toggleModal}>
          {/* Contenido del modal */}
          <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>
          <form>
            <label className="block mb-2">
              Email
              <input
                type="email"
                className="block w-full mt-1 p-2 border rounded-md"
                placeholder="you@example.com"
              />
            </label>
            <label className="block mb-4">
              Password
              <input
                type="password"
                className="block w-full mt-1 p-2 border rounded-md"
                placeholder="********"
              />
            </label>
            <button
              type="submit"
              className="w-full text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md"
            >
              Iniciar Sesión
            </button>
          </form>
        </Modal>
      )}
    </nav>
  );
};

export default NavbarHome;
