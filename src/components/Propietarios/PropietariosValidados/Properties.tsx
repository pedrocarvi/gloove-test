import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FiMoreVertical } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const houses = [
  {
    name: "Casa 1",
    mainImage: "/salon.jpg",
    thumbnails: ["/salon.jpg", "/salon.jpg", "/salon.jpg", "/salon.jpg"],
    description:
      "Una hermosa casa con una amplia sala de estar, cocina moderna y un jardín encantador. Perfecta para familias que buscan comodidad y estilo.",
    status: "Disponible",
    location: [40.7128, -74.006],
    details: {
      rooms: 3,
      bathrooms: 2,
      size: "120 m²",
    },
    ratings: 4,
    textileInventory: {
      bedLinen: "Ropa de cama de alta calidad",
      towels: "Toallas de algodón",
    },
    contract: {
      startDate: "2023-01-01",
      endDate: "2023-12-31",
    },
    inventory: {
      items: [
        { name: "Cama", quantity: 2 },
        { name: "Sofá", quantity: 1 },
      ],
    },
    budget: {
      amount: 1000,
    },
    documents: [
      { name: "Ficha técnica", url: "https://example.com/ficha_tecnica.pdf" },
      { name: "Contrato", url: "https://example.com/contract.pdf" },
      { name: "Inventario", url: "https://example.com/inventario.pdf" },
    ],
  },
  {
    name: "Casa 2",
    mainImage: "/salon.jpg",
    thumbnails: ["/salon.jpg", "/salon.jpg", "/salon.jpg", "/salon.jpg"],
    description:
      "Casa acogedora con vistas al mar, equipada con todas las comodidades modernas. Ideal para unas vacaciones relajantes o una segunda residencia.",
    status: "Vendido",
    location: [34.0522, -118.2437],
    details: {
      rooms: 4,
      bathrooms: 3,
      size: "200 m²",
    },
    ratings: 5,
    textileInventory: {
      bedLinen: "Ropa de cama de lujo",
      towels: "Toallas de felpa",
    },
    contract: {
      startDate: "2023-02-01",
      endDate: "2023-11-30",
    },
    inventory: {
      items: [
        { name: "Mesa", quantity: 1 },
        { name: "Sillas", quantity: 4 },
      ],
    },
    budget: {
      amount: 1500,
    },
    documents: [
      { name: "Ficha técnica", url: "https://example.com/ficha_tecnica2.pdf" },
      { name: "Contrato", url: "https://example.com/contract2.pdf" },
      { name: "Inventario", url: "https://example.com/inventario2.pdf" },
    ],
  },
];

const HousesSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentHouse, setCurrentHouse] = useState<number | null>(null);

  const handleEdit = (houseName: string) => {
    console.log(`Editando ${houseName}`);
  };

  const handleDelete = (houseName: string) => {
    console.log(`Eliminando ${houseName}`);
  };

  const filteredHouses = houses.filter((house) =>
    house.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar casa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredHouses.map((house, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gloovePrimary-dark">
                  {house.name}
                </h2>
                <div className="flex space-x-2">
                  <button
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => handleEdit(house.name)}
                  >
                    <PencilSquareIcon className="w-6 h-6" />
                  </button>
                  <button
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => handleDelete(house.name)}
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <FiMoreVertical className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="relative mb-4">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                    <div className="loader" />
                  </div>
                )}
                <img
                  src={house.mainImage}
                  alt="Living Room"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p className="text-white absolute bottom-4 left-4 bg-black bg-opacity-50 p-2 rounded">
                  Living Room
                </p>
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white ${
                    house.status === "Disponible"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {house.status}
                </span>
              </div>
              <div className="mb-4">
                <Carousel
                  showArrows={true}
                  showThumbs={false}
                  infiniteLoop={true}
                  autoPlay={true}
                  interval={5000}
                >
                  {house.thumbnails.map((thumbnail, idx) => (
                    <div key={idx}>
                      <img
                        src={thumbnail}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg transition-transform transform hover:scale-110"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
              <div className="text-gray-700 mb-4">
                <p className="mb-2">
                  <strong>Ubicación:</strong> Ubicación de ejemplo
                </p>
                <p className="mb-2">
                  <strong>Precio:</strong> $1,000,000
                </p>
                <p className="mb-2">
                  <strong>Habitaciones:</strong> {house.details.rooms}
                </p>
                <p className="mb-2">
                  <strong>Baños:</strong> {house.details.bathrooms}
                </p>
                <p className="mb-2">
                  <strong>Tamaño:</strong> {house.details.size}
                </p>
                <p>{house.description}</p>
              </div>
              {house.textileInventory && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Inventario Textil:</h3>
                  <p>
                    <strong>Ropa de cama:</strong>{" "}
                    {house.textileInventory.bedLinen}
                  </p>
                  <p>
                    <strong>Toallas:</strong> {house.textileInventory.towels}
                  </p>
                </div>
              )}
              {house.contract && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Contrato:</h3>
                  <p>
                    <strong>Fecha de inicio:</strong> {house.contract.startDate}
                  </p>
                  <p>
                    <strong>Fecha de fin:</strong> {house.contract.endDate}
                  </p>
                </div>
              )}
              {house.inventory && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">
                    Inventario Completo:
                  </h3>
                  <ul>
                    {house.inventory.items.map((item, index) => (
                      <li key={index}>
                        {item.name}: {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {house.budget && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Presupuesto Textil:</h3>
                  <p>
                    <strong>Monto aprobado:</strong> ${house.budget.amount}
                  </p>
                </div>
              )}
              {house.documents && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Documentación:</h3>
                  <ul>
                    {house.documents.map((doc, index) => (
                      <li key={index}>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {doc.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Valoraciones:</h3>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) =>
                    i < house.ratings ? (
                      <FaStar key={i} className="text-yellow-500" />
                    ) : (
                      <FaRegStar key={i} className="text-yellow-500" />
                    )
                  )}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Comentarios:</h3>
                <div className="bg-gray-100 p-3 rounded-lg shadow-inner">
                  <p>Usuario1: Hermosa casa, muy cómoda.</p>
                  <p>Usuario2: ¡Nos encantó la vista!</p>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Mapa:</h3>
                <MapContainer
                  center={house.location}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="h-64 w-full rounded-lg"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={house.location}>
                    <Popup>
                      <span>{house.name}</span>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              <div className="mb-4">
                <button
                  className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                  onClick={() => alert("Iniciar Tour Virtual")}
                >
                  Tour Virtual
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HousesSection;
