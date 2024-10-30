import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  CogIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon,
  ClipboardIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  SunIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  TrashIcon,
  WrenchScrewdriverIcon,
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
      name: "Dashboard-empleados",
      path: "/dashboard-empleados",
      icon: <HomeIcon className="h-6 w-6" />,
    },
    {
      name: "Propietarios Activación",
      path: "/proceso-alta",
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
    {
      name: "Tareas",
      path: "/tasks",
      icon: <ClipboardIcon className="h-6 w-6" />,
    },
    {
      name: "Chat con Propietarios",
      path: "/chat",
      icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />,
    },
    {
      name: "Buscador",
      path: "/buscador",
      icon: <MagnifyingGlassIcon className="h-6 w-6" />,
    },
    {
      name: "Glovito",
      path: "/glovito",
      icon: <SunIcon className="h-6 w-6" />,
    },
    {
      name: "Inventario",
      path: "/inventario",
      icon: <PencilSquareIcon className="h-6 w-6" />,
    },
    {
      name: "Limpieza",
      path: "/limpieza",
      icon: <TrashIcon className="h-6 w-6" />,
    },
    {
      name: "Mantenimiento",
      path: "/mantenimiento",
      icon: <WrenchScrewdriverIcon className="h-6 w-6" />,
    },
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
    {
      name: "Ayuda",
      path: "/help",
      icon: <QuestionMarkCircleIcon className="h-6 w-6" />,
    },
    {
      name: "Cerrar Sesión",
      path: "#",
      icon: <ArrowRightOnRectangleIcon className="h-6 w-6" />,
      action: toggleLogoutModal,
    },
  ];

  return (
    <aside className="bg-gloovePrimary-dark text-glooveText-dark w-64 space-y-6 py-7 px-2 min-h-screen h-fit">
      <div className="text-glooveText-dark text-3xl font-bold text-center">
        Gloove
      </div>
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
            className={`w-full flex items-center space-x-4 py-2 px-4 rounded-md transition-all duration-200 ${
              location.pathname === item.path
                ? "bg-gloovePrimary-light text-gloovePrimary-dark"
                : "text-glooveText-dark hover:bg-gloovePrimary-light hover:text-gloovePrimary-dark"
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
                className="bg-gloovePrimary-dark text-white px-4 py-2 rounded-md hover:bg-gloovePrimary"
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
