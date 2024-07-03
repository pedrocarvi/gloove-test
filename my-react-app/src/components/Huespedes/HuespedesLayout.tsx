import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

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

HuespedesLayout.propTypes = {
  children: PropTypes.node,
};

export default HuespedesLayout;
