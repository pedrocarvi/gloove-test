import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiMessageSquare,
  FiClock,
} from "react-icons/fi";

const taskData = [
  { name: "Tareas Pendientes", value: 10 },
  { name: "Tareas Completadas", value: 30 },
];

const performanceData = [
  { name: "Lun", tasks: 4 },
  { name: "Mar", tasks: 7 },
  { name: "Mié", tasks: 6 },
  { name: "Jue", tasks: 5 },
  { name: "Vie", tasks: 8 },
];

const COLORS = ["#0088FE", "#00C49F"];

const EmployeeDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Resumen General</h2>
            <div className="flex justify-between items-center mb-4">
              <FiCheckCircle className="text-green-500 h-10 w-10" />
              <div>
                <p className="text-2xl font-bold">30</p>
                <p>Tareas Completadas</p>
              </div>
              <FiAlertCircle className="text-red-500 h-10 w-10" />
              <div>
                <p className="text-2xl font-bold">10</p>
                <p>Tareas Pendientes</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={taskData} dataKey="value" outerRadius={80} label>
                  {taskData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Rendimiento Semanal</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Horas Trabajadas</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tasks" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Gestión de Tareas</h2>
            <ul className="space-y-2">
              <li className="flex items-center justify-between bg-gray-200 p-3 rounded-lg">
                <span>Limpieza de la sala de estar</span>
                <button className="bg-green-500 text-white px-3 py-1 rounded-lg">
                  Completado
                </button>
              </li>
              <li className="flex items-center justify-between bg-gray-200 p-3 rounded-lg">
                <span>Revisión del sistema de seguridad</span>
                <button className="bg-red-500 text-white px-3 py-1 rounded-lg">
                  Pendiente
                </button>
              </li>
              <li className="flex items-center justify-between bg-gray-200 p-3 rounded-lg">
                <span>Mantenimiento del jardín</span>
                <button className="bg-green-500 text-white px-3 py-1 rounded-lg">
                  Completado
                </button>
              </li>
              <li className="flex items-center justify-between bg-gray-200 p-3 rounded-lg">
                <span>Inventario de suministros de limpieza</span>
                <button className="bg-red-500 text-white px-3 py-1 rounded-lg">
                  Pendiente
                </button>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Mensajes Importantes</h2>
            <div className="space-y-2">
              <div className="bg-gray-200 p-3 rounded-lg flex items-center">
                <FiMessageSquare className="text-gray-700 h-6 w-6 mr-2" />
                <span>Reunión semanal mañana a las 10 AM.</span>
              </div>
              <div className="bg-gray-200 p-3 rounded-lg flex items-center">
                <FiMessageSquare className="text-gray-700 h-6 w-6 mr-2" />
                <span>Recordatorio: limpieza profunda el viernes.</span>
              </div>
              <div className="bg-gray-200 p-3 rounded-lg flex items-center">
                <FiMessageSquare className="text-gray-700 h-6 w-6 mr-2" />
                <span>Actualización de inventario hoy a las 3 PM.</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg col-span-2">
            <h2 className="text-2xl font-bold mb-4">Control de Asistencia</h2>
            <div className="space-y-4">
              {["Juan Pérez", "María Gómez", "Carlos Díaz"].map((name) => (
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{name}</span>
                  <div className="flex items-center space-x-4">
                    <button className="bg-green-500 text-white px-3 py-1 rounded-lg">
                      Entrada
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded-lg">
                      Salida
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg col-span-2">
            <h2 className="text-2xl font-bold mb-4">
              Estado de Mantenimiento y Limpieza
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { area: "Baños", status: "Limpio", color: "green" },
                { area: "Cocina", status: "Sucio", color: "red" },
                { area: "Salón", status: "Limpio", color: "green" },
                { area: "Jardín", status: "Mantenimiento", color: "green" },
              ].map((item) => (
                <div className="flex items-center justify-between bg-gray-200 p-3 rounded-lg">
                  <span>{item.area}</span>
                  <button
                    className={`bg-${item.color}-500 text-white px-3 py-1 rounded-lg`}
                  >
                    {item.status}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
