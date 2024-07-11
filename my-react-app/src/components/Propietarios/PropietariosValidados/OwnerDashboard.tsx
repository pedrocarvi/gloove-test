import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import {
  FiHome,
  FiTrendingUp,
  FiCalendar,
  FiUser,
  FiMessageSquare,
} from "react-icons/fi";
import { AiOutlineBarChart } from "react-icons/ai";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";

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

const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [propertyData, setPropertyData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (user) {
        try {
          const docRef = doc(db, "propietarios", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setPropertyData(docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching property data: ", error);
          setError(
            "Error al cargar los datos de la propiedad. Intente nuevamente más tarde."
          );
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al cargar los datos de la propiedad. Intente nuevamente más tarde.",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPropertyData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        Dashboard de Propietarios
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {propertyData && propertyData.houses ? (
          propertyData.houses.map((house: any) => (
            <div key={house.id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{house.name}</h2>
                <Link
                  to={`/property/${house.id}`}
                  className="text-primary font-bold"
                >
                  <FiHome className="inline mr-2" /> Ver Detalles
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <img
                    src={house.images[0]}
                    alt={house.name}
                    className="rounded-md w-full h-48 object-cover"
                  />
                </div>
                {house.images.slice(1).map((img: string, index: number) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${house.name} ${index + 2}`}
                    className="rounded-md h-24 object-cover"
                  />
                ))}
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold">Facturación:</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
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
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="inquiries" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 lg:col-span-3 text-center">
            <p className="text-gray-700">
              No hay datos de propiedades disponibles.
            </p>
          </div>
        )}

        {/* Paneles Adicionales */}
        <div className="grid grid-cols-1 gap-6">
          <Link
            to="/statistics"
            className="block bg-white p-6 shadow-lg rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold mb-4 text-primary-dark flex items-center">
              <AiOutlineBarChart className="mr-2" /> Estadísticas
            </h2>
            <p className="text-gray-700">En proceso</p>
          </Link>

          <Link
            to="/calendar"
            className="block bg-white p-6 shadow-lg rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold mb-4 text-primary-dark flex items-center">
              <FiCalendar className="mr-2" /> Calendario de Reservas
            </h2>
            <p className="text-gray-700">En proceso</p>
          </Link>

          <Link
            to="/messages"
            className="block bg-white p-6 shadow-lg rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold mb-4 text-primary-dark flex items-center">
              <FiMessageSquare className="mr-2" /> Mensajes
            </h2>
            <p className="text-gray-700">En proceso</p>
          </Link>

          <Link
            to="/OwnerProfile"
            className="block bg-white p-6 shadow-lg rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold mb-4 text-primary-dark flex items-center">
              <FiUser className="mr-2" /> Perfil del Propietario
            </h2>
            <p className="text-gray-700">En proceso</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
