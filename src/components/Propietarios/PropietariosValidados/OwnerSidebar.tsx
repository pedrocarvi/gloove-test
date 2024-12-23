import React, { useState, useEffect } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";

interface Property {
  id: string;
  name: string;
  [key: string]: any;
}

const OwnerSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);

  const toggleLogoutModal = () => {
    setIsLogoutModalOpen(!isLogoutModalOpen);
  };

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      if (user && user.uid) {
        const q = query(
          collection(db, "properties"),
          where("ownerId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const propertiesList: Property[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Property[];
        setProperties(propertiesList);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard-propietarios",
      icon: <HomeIcon className="h-6 w-6" />,
    },
    {
      name: "Alta de vivienda",
      path: "/proceso-de-alta/0",
      icon: <DocumentPlusIcon className="h-6 w-6" />,
    },
    {
      name: "Mis viviendas",
      path: "/properties",
      icon: <HomeModernIcon className="h-6 w-6" />,
    },
    // {
    //   name: "Chat",
    //   path: "/chat",
    //   icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />,
    // },
    // {
    //   name: "Mi documentación",
    //   path: "/documents",
    //   icon: <DocumentTextIcon className="h-6 w-6" />,
    // },
    // {
    //   name: "Notificaciones",
    //   path: "/notifications",
    //   icon: <BellIcon className="h-6 w-6" />,
    // },
    {
      name: "Preguntas Frecuentes",
      path: "/faq",
      icon: <QuestionMarkCircleIcon className="h-6 w-6" />,
    },
    {
      name: "Mi perfil",
      path: "/OwnerProfile",
      icon: <UserIcon className="h-6 w-6" />,
    },
    // {
    //   name: "Configuraciones",
    //   path: "/settings",
    //   icon: <CogIcon className="h-6 w-6" />,
    // },
    {
      name: "Cerrar sesión",
      path: "#",
      icon: <ArrowRightOnRectangleIcon className="h-6 w-6" />,
      action: toggleLogoutModal,
    },
    // Nuevo ítem del menú para PropertyDetails
    // {
    //   name: "Detalles de la propiedad",
    //   path: properties.length > 0 ? `/property/${properties[0].id}` : "#",
    //   icon: <HomeModernIcon className="h-6 w-6" />,
    // },
  ];

  return (
    <aside className="bg-gloovePrimary-dark text-glooveText-dark w-64 space-y-6 py-7 px-2 h-screen">
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
        {properties.map((property) => (
          <Link
            key={property.id}
            to={`/property/${property.id}`}
            className={`w-full flex items-center space-x-4 py-2 px-4 rounded-md transition-all duration-200 ${
              location.pathname === `/property/${property.id}`
                ? "bg-gloovePrimary-light text-gloovePrimary-dark"
                : "text-glooveText-dark hover:bg-gloovePrimary-light hover:text-gloovePrimary-dark"
            }`}
          >
            <HomeModernIcon className="h-6 w-6" />
            <span>{property.name}</span>
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

export default OwnerSidebar;
