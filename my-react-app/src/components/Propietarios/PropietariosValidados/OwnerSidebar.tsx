import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  DocumentPlusIcon,
  HomeModernIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  BellIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const OwnerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const toggleLogoutModal = () => {
    setIsLogoutModalOpen(!isLogoutModalOpen);
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate("/login");
    // Aquí puedes agregar cualquier lógica adicional para el cierre de sesión
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard-propietarios",
      icon: <HomeIcon className="h-6 w-6" />,
    },
    {
      name: "Alta de vivienda",
      path: "/Documentacion",
      icon: <DocumentPlusIcon className="h-6 w-6" />,
    },
    {
      name: "Mis viviendas",
      path: "/properties",
      icon: <HomeModernIcon className="h-6 w-6" />,
    },
    {
      name: "Chat",
      path: "/chat",
      icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />,
    },
    {
      name: "Mi documentación",
      path: "/Documents",
      icon: <DocumentTextIcon className="h-6 w-6" />,
    },
    {
      name: "Notificaciones",
      path: "/notifications",
      icon: <BellIcon className="h-6 w-6" />,
    },
    {
      name: "Mi perfil",
      path: "/OwnerProfile",
      icon: <UserIcon className="h-6 w-6" />,
    },
    {
      name: "Configuraciones",
      path: "/settings",
      icon: <CogIcon className="h-6 w-6" />,
    },
    {
      name: "Cerrar sesión",
      path: "#",
      icon: <ArrowRightOnRectangleIcon className="h-6 w-6" />,
      action: toggleLogoutModal,
    },
    {
      name: "Help",
      path: "/help",
      icon: <QuestionMarkCircleIcon className="h-6 w-6" />,
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

export default OwnerSidebar;
