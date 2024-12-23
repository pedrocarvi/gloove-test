import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  FiHome,
  FiTrendingUp,
  FiCalendar,
  FiUser,
  FiMessageSquare,
} from "react-icons/fi";
import { AiOutlineBarChart } from "react-icons/ai";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const data = [
  { name: "Jan", inquiries: 30, income: 2400, source: "Web" },
  { name: "Feb", inquiries: 20, income: 2210, source: "Email" },
  { name: "Mar", inquiries: 25, income: 2290, source: "Instagram" },
  { name: "Apr", inquiries: 27, income: 2000, source: "TikTok" },
  { name: "May", inquiries: 18, income: 2181, source: "Pinterest" },
  { name: "Jun", inquiries: 23, income: 2500, source: "Web" },
  { name: "Jul", inquiries: 34, income: 2100, source: "Email" },
  { name: "Aug", inquiries: 29, income: 2100, source: "Instagram" },
  { name: "Sep", inquiries: 35, income: 2100, source: "TikTok" },
  { name: "Oct", inquiries: 40, income: 2100, source: "Pinterest" },
  { name: "Nov", inquiries: 32, income: 2100, source: "Web" },
  { name: "Dec", inquiries: 25, income: 2100, source: "Email" },
];

const properties = [
  {
    id: 1,
    name: "Casa 1",
    images: ["/cama.jpg", "/casa.jpg", "/casa.jpg", "/casa.jpg"],
  },
  {
    id: 2,
    name: "Casa 2",
    images: [
      "/dormitorio.jpg",
      "/dormitorio.jpg",
      "/dormitorio.jpg",
      "/dormitorio.jpg",
    ],
  },
];

const CustomXAxis = (props: {
  [x: string]: any;
  dataKey?: "name" | undefined;
}) => {
  const { dataKey = "name", ...rest } = props;
  return <XAxis dataKey={dataKey} {...rest} />;
};

const CustomYAxis = (props: { [x: string]: any }) => {
  const { ...rest } = props;
  return <YAxis {...rest} />;
};

const OwnerDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* <h1 className="text-3xl font-bold text-center mb-6">
        Dashboard de Propietarios
      </h1> */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{property.name}</h2>
              <Link
                to={`/property/${property.id}`}
                className="text-gloovePrimary-dark font-bold"
              >
                <FiHome className="inline mr-2" /> Ver Detalles
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <img
                  src={property.images[0]}
                  alt={property.name}
                  className="rounded-md w-full h-48 object-cover"
                />
              </div>
              {property.images.slice(1).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${property.name} ${index + 2}`}
                  className="rounded-md h-24 object-cover"
                />
              ))}
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-bold">Facturación:</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <CustomXAxis />
                  <CustomYAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-bold">Reservas en el mes:</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <CustomXAxis />
                  <CustomYAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="inquiries" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}

        {/* Paneles Adicionales */}
        <div className="grid grid-cols-1 gap-6">
          <Link
            to="/statistics"
            className="block bg-white p-6 shadow-lg rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold mb-4 text-gloovePrimary-dark flex items-center">
              <AiOutlineBarChart className="mr-2" /> Estadísticas
            </h2>
            <p className="text-gray-700">
              Visualiza y analiza las estadísticas de rendimiento de tus
              propiedades.
            </p>
          </Link>

          <Link
            to="/calendar"
            className="block bg-white p-6 shadow-lg rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold mb-4 text-gloovePrimary-dark flex items-center">
              <FiCalendar className="mr-2" /> Calendario de Reservas
            </h2>
            <p className="text-gray-700">
              Consulta y gestiona las reservas de tus propiedades.
            </p>
          </Link>

          <Link
            to="/messages"
            className="block bg-white p-6 shadow-lg rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold mb-4 text-gloovePrimary-dark flex items-center">
              <FiMessageSquare className="mr-2" /> Mensajes
            </h2>
            <p className="text-gray-700">
              Revisa y responde a los mensajes de tus huéspedes.
            </p>
          </Link>

          <Link
            to="/profile"
            className="block bg-white p-6 shadow-lg rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold mb-4 text-gloovePrimary-dark flex items-center">
              <FiUser className="mr-2" /> Perfil del Propietario
            </h2>
            <p className="text-gray-700">
              Edita y actualiza la información de tu perfil.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
