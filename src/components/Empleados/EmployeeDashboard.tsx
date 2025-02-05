import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllEmployees,
  updateEmployeeStatus,
} from "@/services/employeeService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AiOutlineBarChart } from "react-icons/ai";
import {
  FiUser,
  FiMessageSquare,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";

const employeeData = [
  { name: "Jan", tasksCompleted: 30, hoursWorked: 240, department: "IT" },
  { name: "Feb", tasksCompleted: 20, hoursWorked: 221, department: "HR" },
  { name: "Mar", tasksCompleted: 25, hoursWorked: 229, department: "Finance" },
  {
    name: "Apr",
    tasksCompleted: 27,
    hoursWorked: 200,
    department: "Marketing",
  },
  { name: "May", tasksCompleted: 18, hoursWorked: 218, department: "IT" },
  { name: "Jun", tasksCompleted: 23, hoursWorked: 250, department: "HR" },
  { name: "Jul", tasksCompleted: 34, hoursWorked: 210, department: "Finance" },
  {
    name: "Aug",
    tasksCompleted: 29,
    hoursWorked: 210,
    department: "Marketing",
  },
  { name: "Sep", tasksCompleted: 35, hoursWorked: 210, department: "IT" },
  { name: "Oct", tasksCompleted: 40, hoursWorked: 210, department: "HR" },
  { name: "Nov", tasksCompleted: 32, hoursWorked: 210, department: "Finance" },
  {
    name: "Dec",
    tasksCompleted: 25,
    hoursWorked: 210,
    department: "Marketing",
  },
];

const EmployeeDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const employeesData = await getAllEmployees();
      console.log("Employees fetched:", employeesData); // Debug
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        Dashboard de Empleados
      </h1>
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <table className="min-w-full bg-white border border-gray-200 rounded shadow-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b">
                  <td className="px-5 py-5 bg-white text-sm">
                    {employee.name}
                  </td>
                  <td className="px-5 py-5 bg-white text-sm">
                    {employee.email}
                  </td>
                  <td className="px-5 py-5 bg-white text-sm">
                    {employee.status}
                  </td>
                  <td className="px-5 py-5 bg-white text-sm">
                    <button
                      onClick={() => handleStatusUpdate(employee.id, "active")}
                      className="bg-green-500 text-white px-3 py-1 rounded-md"
                    >
                      Activar
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(employee.id, "inactive")
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded-md ml-2"
                    >
                      Desactivar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Tareas Completadas</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={employeeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasksCompleted" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Horas Trabajadas</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={employeeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hoursWorked" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <Link
            to="/statistics"
            className="block bg-white p-6 shadow-lg rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold mb-4 text-primary-dark flex items-center">
              <AiOutlineBarChart className="mr-2" /> Estadísticas
            </h2>
            <p className="text-gray-700">
              Visualiza y analiza las estadísticas de rendimiento de los
              empleados.
            </p>
          </Link>

          <Link
            to="/calendar"
            className="block bg-white p-6 shadow-lg rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold mb-4 text-primary-dark flex items-center">
              <FiCalendar className="mr-2" /> Calendario de Tareas
            </h2>
            <p className="text-gray-700">
              Consulta y gestiona las tareas asignadas a los empleados.
            </p>
          </Link>

          <Link
            to="/messages"
            className="block bg-white p-6 shadow-lg rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold mb-4 text-primary-dark flex items-center">
              <FiMessageSquare className="mr-2" /> Mensajes
            </h2>
            <p className="text-gray-700">
              Revisa y responde a los mensajes de los empleados.
            </p>
          </Link>

          <Link
            to="/profile"
            className="block bg-white p-6 shadow-lg rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold mb-4 text-primary-dark flex items-center">
              <FiUser className="mr-2" /> Perfil del Empleado
            </h2>
            <p className="text-gray-700">
              Edita y actualiza la información de los empleados.
            </p>
          </Link>
        </div>
      </div> */}
    </div>
  );
};

export default EmployeeDashboard;
