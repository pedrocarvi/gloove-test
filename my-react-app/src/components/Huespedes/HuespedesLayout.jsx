import PropTypes from "prop-types";
import { Outlet } from "react-router-dom"; // Importar Outlet
import Sidebar from "../Dashboard/Sidebar";
import Header from "../Dashboard/Header";

const HuespedesLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="overflow-auto p-8">
          <Outlet /> {/* Renderizar componentes hijos */}
        </main>
      </div>
    </div>
  );
};

// Validación de las props
HuespedesLayout.propTypes = {
  children: PropTypes.node,
};

export default HuespedesLayout;
