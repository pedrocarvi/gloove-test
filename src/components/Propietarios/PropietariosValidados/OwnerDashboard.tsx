import React, { useEffect, useState } from "react";
import * as xmljs from "xml-js";
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
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Cargar el XML
        const response = await fetch("./accommodations.xml");
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const text = await response.text();

        const result: any = xmljs.xml2js(text, { compact: true });

        // Extraer las propiedades
        const accommodations = result.AccommodationList?.Accommodation;
        const accommodationsFilterByCompany = accommodations.filter(
          // 739, 553, 362, 3351
          (a: { CompanyId: { _text: string } }) => a.CompanyId._text === "3351"
        ).slice(0, 4);
        console.log("Todas las propiedades", accommodations);
        console.log("Filtrado de la compañía con id", accommodationsFilterByCompany);
        if (Array.isArray(accommodationsFilterByCompany)) {
          setProperties(accommodationsFilterByCompany);
          console.log("Loaded Properties:", accommodationsFilterByCompany);
        } else if (accommodationsFilterByCompany) {
          // Si solo hay un <Accommodation>, xml-js lo parsea como un objeto
          setProperties([accommodationsFilterByCompany]);
          console.log("Loaded Single Property:", accommodationsFilterByCompany);
        } else {
          console.log("No accommodations found in XML.");
        }
      } catch (error) {
        console.error("Error al cargar el XML:", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-left mb-6">
        Dashboard de Propietarios
      </h1>
      <div className="owner-viviendas-container">
        <h3 className="text-xl font-bold text-left"> Viviendas destacadas </h3>
        <Link to="/properties" className="text-left underline"> Ver todas </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {properties.map((property, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">
              {property.AccommodationName?._text || "Propiedad sin nombre"}
            </h2>
            <p className="mb-2">
              <strong>ID:</strong> {property.AccommodationId?._text || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Compañía:</strong> {property.Company?._text || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Unidades disponibles:</strong>{" "}
              {property.AccommodationUnits?._text || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Tipo:</strong> {property.UserKind?._text || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Ubicación:</strong>{" "}
              {property.LocalizationData?.City?.Name?._text || "Ciudad no especificada"},{" "}
              {property.LocalizationData?.Country?.Name?._text || "País no especificado"}
            </p>
            <div className="mb-4">
              <h3 className="text-lg font-bold">Características principales:</h3>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Capacidad:</strong>{" "}
                  {property.Features?.PeopleCapacity?._text || "No especificado"}
                </li>
                <li>
                  <strong>Acepta jóvenes:</strong>{" "}
                  {property.Features?.AcceptYoungsters?._text === "true"
                    ? "Sí"
                    : "No"}
                </li>
                <li>
                  <strong>Camas:</strong> King:{" "}
                  {property.Features?.KingBeds?._text || 0}, Queen:{" "}
                  {property.Features?.QueenBeds?._text || 0}, Individual:{" "}
                  {property.Features?.IndividualBeds?._text || 0}
                </li>
                <li>
                  <strong>Balcón:</strong>{" "}
                  {property.HouseCharacteristics?.Balcony?._text === "true"
                    ? "Sí"
                    : "No"}
                </li>
                <li>
                  <strong>Barbacoa:</strong>{" "}
                  {property.HouseCharacteristics?.Barbacue?._text === "true"
                    ? "Sí"
                    : "No"}
                </li>
                <li>
                  <strong>Jardín:</strong>{" "}
                  {property.HouseCharacteristics?.Garden?._text === "true"
                    ? "Sí"
                    : "No"}
                </li>
                <li>
                  <strong>Jacuzzi:</strong>{" "}
                  {property.HouseCharacteristics?.Jacuzzi?._text === "true"
                    ? "Sí"
                    : "No"}
                </li>
                <li>
                  <strong>Sauna:</strong>{" "}
                  {property.HouseCharacteristics?.Sauna?._text === "true"
                    ? "Sí"
                    : "No"}
                </li>
                <li>
                  <strong>Televisión:</strong>{" "}
                  {property.HouseCharacteristics?.TV?._text === "true"
                    ? "Sí"
                    : "No"}
                </li>
                <li>
                  <strong>Terraza:</strong>{" "}
                  {property.HouseCharacteristics?.Terrace?._text === "true"
                    ? "Sí"
                    : "No"}
                </li>
                <li>
                  <strong>Permite fumar:</strong>{" "}
                  {property.HouseCharacteristics?.SmokingAllowed?._text === "true"
                    ? "Sí"
                    : "No"}
                </li>
              </ul>
            </div>

            {property.LocalizationData?.GoogleMaps?.Latitude &&
              property.LocalizationData?.GoogleMaps?.Longitude && (
                <MapContainer
                  center={[
                    parseFloat(property.LocalizationData.GoogleMaps.Latitude._text),
                    parseFloat(property.LocalizationData.GoogleMaps.Longitude._text),
                  ]}
                  zoom={10}
                  style={{ height: "200px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[
                      parseFloat(property.LocalizationData.GoogleMaps.Latitude._text),
                      parseFloat(property.LocalizationData.GoogleMaps.Longitude._text),
                    ]}
                  >
                    <Popup>{property.AccommodationName?._text || "Propiedad"}</Popup>
                  </Marker>
                </MapContainer>
              )}
          </div>
        ))}
      </div>
      {/* Paneles Adicionales */}
      <div className="grid grid-cols-4 gap-6 mt-6">
        <Link
          to="/statistics"
          className="block bg-white p-6 rounded-lg hover:bg-gray-50 transition"
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
          className="block bg-white p-6 rounded-lg hover:bg-gray-50 transition"
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
          className="block bg-white p-6 rounded-lg hover:bg-gray-50 transition"
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
          className="block bg-white p-6 rounded-lg hover:bg-gray-50 transition"
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
  );
};

export default OwnerDashboard;
