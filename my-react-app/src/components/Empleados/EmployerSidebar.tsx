// src/components/Empleados/EmployerSidebar.tsx

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  CogIcon,
  ChatBubbleLeftRightIcon as MessagesIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
  QuestionMarkCircleIcon as HelpIcon,
  ClipboardIcon as TasksIcon,
  UserGroupIcon,
  MagnifyingGlassIcon as SearchIcon,
  SunIcon,
  Cog6ToothIcon,
  PencilSquareIcon as InventoryIcon, // Icono para Inventario
  TrashIcon as CleaningIcon, // Icono para Limpieza
  WrenchScrewdriverIcon as MaintenanceIcon, // Icono para Mantenimiento
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const EmployerSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const toggleLogoutModal = () => {
    setIsLogoutModalOpen(!isLogoutModalOpen);
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <HomeIcon className="h-6 w-6" />,
    },
    {
      name: "Propietarios Activación",
      path: "/propietarios-activacion",
      icon: <UserGroupIcon className="h-6 w-6" />,
    },
    {
      name: "Propietarios Validados",
      path: "/propietarios-validados",
      icon: <UserIcon className="h-6 w-6" />,
    },
    {
      name: "Huespedes",
      path: "/huespedes",
      icon: <UserGroupIcon className="h-6 w-6" />,
    },
    { name: "Tareas", path: "/tasks", icon: <TasksIcon className="h-6 w-6" /> },
    {
      name: "Mensajes",
      path: "/messages",
      icon: <MessagesIcon className="h-6 w-6" />,
    },
    {
      name: "Buscador",
      path: "/buscador",
      icon: <SearchIcon className="h-6 w-6" />,
    },
    {
      name: "Glovito",
      path: "/glovito",
      icon: <SunIcon className="h-6 w-6" />,
    },
    {
      name: "Inventario",
      path: "/inventario",
      icon: <InventoryIcon className="h-6 w-6" />,
    }, // Nueva ruta para Inventario
    {
      name: "Limpieza",
      path: "/limpieza",
      icon: <CleaningIcon className="h-6 w-6" />,
    }, // Nueva ruta para Limpieza
    {
      name: "Mantenimiento",
      path: "/mantenimiento",
      icon: <MaintenanceIcon className="h-6 w-6" />,
    }, // Nueva ruta para Mantenimiento
    {
      name: "Mi Perfil",
      path: "/profile",
      icon: <UserIcon className="h-6 w-6" />,
    },
    {
      name: "Configuraciones",
      path: "/settings",
      icon: <Cog6ToothIcon className="h-6 w-6" />,
    },
    { name: "Ayuda", path: "/help", icon: <HelpIcon className="h-6 w-6" /> },
    {
      name: "Cerrar Sesión",
      path: "#",
      icon: <LogoutIcon className="h-6 w-6" />,
      action: toggleLogoutModal,
    },
  ];

  return (
    <aside className="bg-primary-dark text-white w-64 space-y-6 py-7 px-2">
      <div className="text-white text-3xl font-bold text-center">Gloove</div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={
              item.action
                ? (e) => {
                    e.preventDefault();
                    item.action();
                  }
                : undefined
            }
            className={`w-full flex items-center space-x-4 py-2 px-4 rounded-md hover:bg-primary-light transition ${
              location.pathname === item.path ? "bg-primary-light" : ""
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      {isLogoutModalOpen && (
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
                Cerrar Sesión
              </h2>
              <button
                onClick={toggleLogoutModal}
                className="text-gray-600 hover:text-gray-800"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="text-gray-700 mb-4">
              ¿Deseas cerrar tu sesión actual?
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={toggleLogoutModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
              >
                Cerrar Sesión
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </aside>
  );
};

export default EmployerSidebar;
