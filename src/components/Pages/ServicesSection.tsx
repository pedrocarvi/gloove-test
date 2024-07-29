import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaHotel,
  FaUserTie,
  FaBuilding,
  FaStar,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

const cardImages = [
  "/RecursosWeb/img/Pro/pro.png",
  "/RecursosWeb/img/Res/res.png",
  "/RecursosWeb/img/Inm/Inm.png",
  "/RecursosWeb/img/Exp/Exp.png",
];

const cardDescriptions = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
];

type CardProps = {
  title: string;
  description: string;
  imageUrl: string;
  icon: React.ElementType;
  expanded: boolean;
  onClick: () => void;
};

const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  icon: Icon,
  expanded,
  onClick,
}) => {
  return (
    <motion.div
      className={`relative flex flex-col justify-end cursor-pointer bg-cover bg-center rounded-[20px] shadow-lg transition-all duration-500 ease-in-out ${
        expanded ? "w-[450px] h-[600px]" : "w-[250px] h-[350px]"
      }`}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundColor: expanded ? "#f0f4f8" : "#e0e7ea",
      }}
      onClick={onClick}
      whileHover={{ scale: expanded ? 1.05 : 1.1 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-[20px]"></div>
      <div className="relative z-10 p-4 bg-gray-800 bg-opacity-75 rounded-b-[20px]">
        <h2 className="text-2xl font-bold text-white text-center">{title}</h2>
        {expanded && (
          <div className="text-center">
            <Icon className="text-4xl text-white mb-4" />
            <p className="mt-2 text-gray-300">{description}</p>
            <motion.a
              href="#"
              className="mt-4 inline-block bg-white text-gray-800 px-4 py-2 rounded-full shadow-md hover:bg-gray-200 transition"
              whileHover={{ scale: 1.05 }}
            >
              Ir a la página
            </motion.a>
          </div>
        )}
      </div>
      {expanded && (
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-[20px]"
          />
        </motion.div>
      )}
      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <FaFacebook className="text-white text-2xl hover:text-blue-600 transition" />
        <FaTwitter className="text-white text-2xl hover:text-blue-400 transition" />
        <FaInstagram className="text-white text-2xl hover:text-pink-600 transition" />
      </div>
    </motion.div>
  );
};

const ServicesSection: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const cards = [
    {
      title: "Propietarios",
      icon: FaUserTie,
      description: cardDescriptions[0],
      imageUrl: cardImages[0],
    },
    {
      title: "Reservas",
      icon: FaHotel,
      description: cardDescriptions[1],
      imageUrl: cardImages[1],
    },
    {
      title: "Inmobiliaria",
      icon: FaBuilding,
      description: cardDescriptions[2],
      imageUrl: cardImages[2],
    },
    {
      title: "Experiencias",
      icon: FaStar,
      description: cardDescriptions[3],
      imageUrl: cardImages[3],
    },
  ];

  return (
    <section className="py-16 min-h-screen bg-gradient-to-r from-[#146b79] to-[#08090a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-white">
          Servicios Destacados
        </h1>
        <p className="mt-4 text-2xl text-gray-300">
          Descubre nuestros últimos trabajos
        </p>
      </div>
      <div className="mt-12 flex flex-wrap justify-center items-center gap-5">
        {cards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            description={card.description}
            imageUrl={card.imageUrl}
            icon={card.icon}
            expanded={expandedIndex === index}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
