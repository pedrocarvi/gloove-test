import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import OwnerSidebar from "./OwnerSidebar";
import Header from "./OwnerHeader";

interface OwnerLayoutProps {
  children?: ReactNode;
}

const OwnerLayout: React.FC<OwnerLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <OwnerSidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="overflow-auto p-8">{children || <Outlet />}</main>
      </div>
    </div>
  );
};

export default OwnerLayout;
