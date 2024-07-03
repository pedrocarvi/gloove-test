import React from "react";
import { FiMoreVertical } from "react-icons/fi";

const houses = [
  {
    name: "Casa 1",
    mainImage: "/salon.jpg",
    thumbnails: ["/salon.jpg", "/salon.jpg", "/salon.jpg", "/salon.jpg"],
    description:
      "Una hermosa casa con una amplia sala de estar, cocina moderna y un jardín encantador. Perfecta para familias que buscan comodidad y estilo.",
  },
  {
    name: "Casa 2",
    mainImage: "/salon.jpg",
    thumbnails: ["/salon.jpg", "/salon.jpg", "/salon.jpg", "/salon.jpg"],
    description:
      "Casa acogedora con vistas al mar, equipada con todas las comodidades modernas. Ideal para unas vacaciones relajantes o una segunda residencia.",
  },
];

const HousesSection: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {houses.map((house, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-primary-dark">
                {house.name}
              </h2>
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <FiMoreVertical className="w-6 h-6" />
              </button>
            </div>
            <div className="relative mb-4">
              <img
                src={house.mainImage}
                alt="Living Room"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-white absolute bottom-4 left-4 bg-black bg-opacity-50 p-2 rounded">
                Living Room
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {house.thumbnails.map((thumbnail, idx) => (
                <img
                  key={idx}
                  src={thumbnail}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-24 object-cover rounded-lg transition-transform transform hover:scale-110"
                />
              ))}
            </div>
            <div className="text-gray-700">
              <p className="mb-2">
                <strong>Location:</strong> Example Location
              </p>
              <p className="mb-2">
                <strong>Price:</strong> $1,000,000
              </p>
              <p>{house.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HousesSection;
