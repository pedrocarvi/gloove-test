import React from "react";
import { Outlet } from "react-router-dom";
import EmployerSidebar from "./EmployerSidebar";
import EmployerHeader from "./EmployerHeader";

const EmpleadosLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <EmployerSidebar />
      <div className="flex flex-col flex-1">
        <EmployerHeader />
        <main className="overflow-auto p-8">
          <Outlet /> {/* Renderizar componentes hijos */}
        </main>
      </div>
    </div>
  );
};

export default EmpleadosLayout;
