// src/components/Avatar.tsx
import React, { useState } from "react";

interface User {
  name: string;
  image: string;
}

interface AvatarProps {
  user: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative">
      <img
        src={user.image}
        alt={user.name}
        className="h-8 w-8 rounded-full cursor-pointer"
        onClick={toggleMenu}
      />
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50">
          <div className="py-2">
            <a
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Perfil
            </a>
            <a
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Configuración
            </a>
            <a
              href="/logout"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cerrar sesión
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
