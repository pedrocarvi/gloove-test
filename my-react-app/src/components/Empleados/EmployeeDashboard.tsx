// src/components/Empleados/EmployeeDashboard.tsx
import React, { useEffect, useState } from "react";
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
import {
  getTasks,
  getPerformanceData,
  getAttendanceData,
} from "../../services/employeeService";

// Define los tipos aquí
type Task = {
  name: string;
  value: number;
};

type Performance = {
  name: string;
  tasks: number;
};

type Attendance = {
  name: string;
  hours: number;
};

const COLORS = ["#0088FE", "#00C49F"];

const EmployeeDashboard: React.FC = () => {
  const [taskData, setTaskData] = useState<Task[]>([]);
  const [performanceData, setPerformanceData] = useState<Performance[]>([]);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const tasks = await getTasks();
      setTaskData(tasks as Task[]);

      const performance = await getPerformanceData();
      setPerformanceData(performance as Performance[]);

      const attendance = await getAttendanceData();
      setAttendanceData(attendance as Attendance[]);
    };

    fetchData();
  }, []);

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
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="hours" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Other sections of the dashboard */}
      </main>
    </div>
  );
};

export default EmployeeDashboard;
