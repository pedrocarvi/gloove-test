import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  CalendarIcon,
  UserIcon,
  CogIcon,
  ChatBubbleLeftRightIcon as ChatIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <HomeIcon className="h-6 w-6" /> },
    {
      name: "Proceso de reserva",
      path: "/reservations",
      icon: <CalendarIcon className="h-6 w-6" />,
    },
    { name: "Chat", path: "/chat", icon: <ChatIcon className="h-6 w-6" /> },
    {
      name: "Abrir vivienda",
      path: "/properties",
      icon: <HomeIcon className="h-6 w-6" />,
    },
    {
      name: "Incidencias",
      path: "/incidents",
      icon: <CogIcon className="h-6 w-6" />,
    },
    {
      name: "Mi perfil",
      path: "/profile",
      icon: <UserIcon className="h-6 w-6" />,
    },
    {
      name: "Configuraciones",
      path: "/settings",
      icon: <CogIcon className="h-6 w-6" />,
    },
    {
      name: "Sign Out",
      path: "/logout",
      icon: <LogoutIcon className="h-6 w-6" />,
    },
    {
      name: "Help",
      path: "/help",
      icon: <CogIcon className="h-6 w-6" />,
    },
  ];

  return (
    <aside className="bg-teal-700 text-white w-64 space-y-6 py-7 px-2">
      <div className="text-white text-3xl font-bold text-center">Gloove</div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center space-x-4 py-2 px-4 rounded-md hover:bg-teal-600 transition ${
              location.pathname === item.path ? "bg-teal-600" : ""
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
