import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

import PropietariosLayout from './components/Propietarios/PropietariosLayout';
import PropietariosDashboard from './components/Propietarios/Dashboard';
import PropertyForm from './components/Propietarios/PropertyForm';
import Properties from './components/Propietarios/Properties';
import Chat from './components/Propietarios/Chat';

import HuespedesLayout from './components/Huespedes/HuespedesLayout';
import HuespedesDashboard from './components/Huespedes/Dashboard';

import EmpleadosLayout from './components/Empleados/EmpleadosLayout';
import EmpleadosDashboard from './components/Empleados/Dashboard';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {user && user.role === 'propietario' && (
        <Route element={<PropietariosLayout />}>
          <Route path="/dashboard-propietarios" element={<PropietariosDashboard />} />
          <Route path="/property-form" element={<PropertyForm />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      )}

      {user && user.role === 'huesped' && (
        <Route element={<HuespedesLayout />}>
          <Route path="/dashboard-huespedes" element={<HuespedesDashboard />} />
          {/* Agrega las demás rutas de huéspedes aquí */}
        </Route>
      )}

      {user && user.role === 'empleado' && (
        <Route element={<EmpleadosLayout />}>
          <Route path="/dashboard-empleados" element={<EmpleadosDashboard />} />
          {/* Agrega las demás rutas de empleados aquí */}
        </Route>
      )}

      {!user && <Route path="*" element={<Login />} />}
    </Routes>
  );
};

export default AppRoutes;



