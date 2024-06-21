import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    let role;
    if (email === 'propietario@example.com') {
      role = 'propietario';
    } else if (email === 'huesped@example.com') {
      role = 'huesped';
    } else if (email === 'empleado@example.com') {
      role = 'empleado';
    }

    const userData = { email, role };
    setUser(userData);
    return userData;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
