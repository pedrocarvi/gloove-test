// src/components/Empleados/EmployeeDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  getAllEmployees,
  updateEmployeeStatus,
} from "@/services/employeeService";

const EmployeeDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const employeesData = await getAllEmployees();
      setEmployees(employeesData);
    };
    fetchEmployees();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    await updateEmployeeStatus(id, status);
    const updatedEmployees = employees.map((employee) =>
      employee.id === id ? { ...employee, status } : employee
    );
    setEmployees(updatedEmployees);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="px-6 pb-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard de Empleados</h2>
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {employee.nombre}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {employee.status}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button
                    onClick={() => handleStatusUpdate(employee.id, "active")}
                    className="bg-green-500 text-white px-3 py-1 rounded-md"
                  >
                    Activar
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(employee.id, "inactive")}
                    className="bg-red-500 text-white px-3 py-1 rounded-md ml-2"
                  >
                    Desactivar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default EmployeeDashboard;