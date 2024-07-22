import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import EmployeeDashboard from "./components/Empleados/EmployeeDashboard";
import ProcesoAlta from "./components/Empleados/ProcesoAlta";
import PropietariosValidados from "./components/Empleados/PropietariosValidados";
import NuevoPropietarioForm from "./components/Empleados/ControlPropietarios/NuevoPropietarioForm";
import SearchPage from "./components/Empleados/ControlPropietarios/SearchPage";
import InventoryPage from "./components/Empleados/InventoryPage";
import CleaningPage from "./components/Empleados/CleaningPage";
import MaintenancePage from "./components/Empleados/MaintenancePage";
import Documentacion from "./components/Propietarios/PropietariosValidados/Documentacion";
import Documents from "./components/Propietarios/PropietariosValidados/Documents";
import OwnerProfile from "./components/Propietarios/PropietariosValidados/OwnerProfile";
import UnderConstruction from "./components/UnderConstruction";
import PresupuestoTextil from "./components/Empleados/PresupuestoTextil";
import Contrato from "./components/Empleados/Contrato";

const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  console.log("Current user in AppRoutes:", user);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />

      {user && user.role === "propietario" && !user.completedRegistration && (
        <Route path="/proceso-de-alta/:step" element={<ProcesoDeAlta />} />
      )}
        
      {user && user.role === "propietario" && user.completedRegistration && (
        <Route path="/" element={<OwnerLayout />}>
          <Route path="/dashboard-propietarios" element={<OwnerDashboard />} />
          <Route path="/property-form" element={<PropertyForm />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/documentacion" element={<Documentacion />} />
          <Route path="/OwnerProfile" element={<OwnerProfile />} />
          <Route path="/notifications" element={<UnderConstruction />} />
          <Route path="/settings" element={<UnderConstruction />} />
          <Route path="/help" element={<UnderConstruction />} />
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
          <Route path="/dashboard-empleados" element={<EmployeeDashboard />} />
          <Route path="/proceso-alta" element={<ProcesoAlta />} />
          <Route path="/propietarios-validados" element={<PropietariosValidados />} />
          <Route path="/nuevo-propietario" element={<NuevoPropietarioForm />} />
          <Route path="/buscador" element={<SearchPage />} />
          <Route path="/inventario" element={<InventoryPage />} />
          <Route path="/limpieza" element={<CleaningPage />} />
          <Route path="/mantenimiento" element={<MaintenancePage />} />
          <Route path="/presupuesto-textil/:id" element={<PresupuestoTextil />} />
          <Route path="/contrato/:id" element={<Contrato />} />
          <Route path="/huespedes" element={<UnderConstruction />} />
          <Route path="/tasks" element={<UnderConstruction />} />
          <Route path="/messages" element={<UnderConstruction />} />
          <Route path="/glovito" element={<UnderConstruction />} />
          <Route path="/profile" element={<UnderConstruction />} />
          <Route path="/settings" element={<UnderConstruction />} />
          <Route path="/help" element={<UnderConstruction />} />
        </Route>
      )}
      
      {!user && <Route path="*" element={<Login />} />}
    </Routes>
  );
};

export default AppRoutes;
