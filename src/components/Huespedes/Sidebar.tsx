import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  CalendarIcon,
  UserIcon,
  CogIcon,
  ChatBubbleLeftRightIcon as ChatIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
  QuestionMarkCircleIcon as QuestionsIcon,
  HomeModernIcon as ControlPanelIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const toggleLogoutModal = () => {
    setIsLogoutModalOpen(!isLogoutModalOpen);
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate("/login");
    localStorage.removeItem('idToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    // Aquí puedes agregar cualquier lógica adicional para el cierre de sesión
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard-huespedes",
      icon: <HomeIcon className="h-6 w-6" />,
    },
    {
      name: "Proceso de reserva",
      path: "/reservation-process",
      icon: <CalendarIcon className="h-6 w-6" />,
    },
    // {
    //   name: "Dudas y Preguntas",
    //   path: "/questions",
    //   icon: <QuestionsIcon className="h-6 w-6" />,
    // },
    // {
    //   name: "Abrir viviendas",
    //   path: "/control-panel",
    //   icon: <ControlPanelIcon className="h-6 w-6" />,
    // },
    // {
    //   name: "Incidencias",
    //   path: "/incidencias",
    //   icon: <CogIcon className="h-6 w-6" />,
    // },
    {
      name: "Mi perfil",
      path: "/profile",
      icon: <UserIcon className="h-6 w-6" />,
    },
    {
      name: "Cerrar sesión",
      path: "#",
      icon: <LogoutIcon className="h-6 w-6" />,
      action: toggleLogoutModal,
    },
  ];

  return (
    <aside className="bg-gloovePrimary-dark text-white w-64 space-y-6 py-7 px-2" >
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

export default Sidebar;
