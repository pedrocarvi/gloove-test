// src/AppRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./components/Pages/Home";

import OwnerLayout from "./components/Propietarios/PropietariosValidados/OwnerLayout";
import OwnerDashboard from "./components/Propietarios/PropietariosValidados/OwnerDashboard";
import PropertyForm from "./components/Propietarios/PropietariosValidados/PropertyForm";
import Properties from "./components/Propietarios/PropietariosValidados/Properties";
import Chat from "./components/Propietarios/PropietariosValidados/Chat";
import ProcesoDeAlta from "./components/Propietarios/ProcesoDeAlta/ProcesoDeAlta";

import HuespedesLayout from "./components/Huespedes/HuespedesLayout";
import HuespedesDashboard from "./components/Huespedes/Dashboard";
import ReservationProcess from "./components/Huespedes/ReservationProcess";
import QuestionsSection from "./components/Huespedes/QuestionsSection";
import ControlPanel from "./components/Huespedes/ControlPanel";
import IncidentForm from "./components/Huespedes/IncidentForm";
import ProfilePage from "./components/Huespedes/ProfilePage";

import EmpleadosLayout from "./components/Empleados/EmpleadosLayout";
import EmpleadosDashboard from "./components/Empleados/Dashboard";
import Documentacion from "./components/Propietarios/PropietariosValidados/Documentacion";
import Documents from "./components/Propietarios/PropietariosValidados/Documents";
import OwnerProfile from "./components/Propietarios/PropietariosValidados/OwnerProfile";

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />

      {user && user.role === "propietario" && !user.completedRegistration && (
        <Route path="/proceso-de-alta" element={<ProcesoDeAlta />} />
      )}

      {user && user.role === "propietario" && (
        <Route path="/" element={<OwnerLayout />}>
          <Route path="/dashboard-propietarios" element={<OwnerDashboard />} />
          <Route path="/property-form" element={<PropertyForm />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/documentacion" element={<Documentacion />} />
          <Route path="/OwnerProfile" element={<OwnerProfile />} />
        </Route>
      )}

      {user && user.role === "huesped" && (
        <Route path="/" element={<HuespedesLayout />}>
          <Route path="/dashboard-huespedes" element={<HuespedesDashboard />} />
          <Route path="/reservation-process" element={<ReservationProcess />} />
          <Route path="/questions" element={<QuestionsSection />} />
          <Route path="/control-panel" element={<ControlPanel />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/incidencias" element={<IncidentForm />} />
        </Route>
      )}

      {user && user.role === "empleado" && (
        <Route path="/" element={<EmpleadosLayout />}>
          <Route path="/dashboard-empleados" element={<EmpleadosDashboard />} />
        </Route>
      )}

      {!user && <Route path="*" element={<Login />} />}
    </Routes>
  );
};

export default AppRoutes;
