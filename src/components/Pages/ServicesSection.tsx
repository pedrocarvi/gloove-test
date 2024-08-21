import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHotel, FaUserTie, FaBuilding, FaStar } from "react-icons/fa";

const cardImages = [
  "/RecursosWeb/img/Pro/pexels-olly-915051.jpg",
  "/RecursosWeb/img/Res/pexels-ketut-subiyanto-4546018.jpg",
  "/RecursosWeb/img/Inm/pexels-maksgelatin-4352247.jpg",
  "/RecursosWeb/img/Exp/pexels-pixabay-327269.jpg",
];

const cardDescriptions = [
  "Ofrecemos un servicio integral para propietarios, gestionando sus inmuebles con profesionalidad y transparencia.",
  "Gestionamos reservas con un sistema ágil y eficiente, asegurando la mejor experiencia para nuestros huéspedes.",
  "Proveemos soluciones inmobiliarias adaptadas a las necesidades de cada cliente, garantizando seguridad y confianza.",
  "Creamos experiencias únicas e inolvidables, desde actividades culturales hasta aventuras extremas.",
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
      className={`relative flex flex-col md:flex-row items-center cursor-pointer bg-cover bg-center rounded-2xl shadow-lg transition-all duration-500 ease-in-out ${
        expanded
          ? "w-[320px] h-[540px] md:w-[700px] md:h-[400px] lg:w-[500px] lg:h-[700px]"
          : "w-[260px] h-[160px] md:w-[600px] md:h-[320px] lg:w-[350px] lg:h-[600px]"
      }`}
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
      onClick={onClick}
      whileHover={{ scale: expanded ? 1.05 : 1.1 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      <motion.div
        className="absolute inset-0 bg-gray-900 bg-opacity-60 rounded-2xl"
        whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        transition={{ duration: 0.3 }}
      ></motion.div>
      <div className="relative z-10 p-4 text-white text-center md:text-left md:w-1/2">
        <h2 className="text-lg md:text-2xl font-bold flex items-center justify-center md:justify-start">
          <Icon className="mr-2 text-xl md:text-2xl lg:text-3xl" /> {title}
        </h2>
        {expanded && (
          <div>
            <p className="mt-4 text-white text-sm md:text-base leading-relaxed">
              {description}
            </p>
            <motion.a
              href="#"
              className="mt-6 inline-block bg-teal-400 text-white px-6 py-3 rounded-full shadow-md hover:bg-teal-500 transition"
              whileHover={{ scale: 1.05 }}
            >
              Descubrir más
            </motion.a>
          </div>
        )}
      </div>
      {expanded && (
        <motion.div
          className="absolute bottom-4 right-4 transform transition-transform duration-500 ease-in-out"
          animate={{ x: expanded ? -10 : 0 }}
        >
          <Icon className="text-white text-3xl md:text-5xl lg:text-6xl" />
        </motion.div>
      )}
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
      title: "Huéspedes",
      icon: FaHotel,
      description: cardDescriptions[0],
      imageUrl: cardImages[0],
    },
    {
      title: "Propietarios",
      icon: FaUserTie,
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
    <section
      className="min-h-screen py-24 bg-gradient-to-b from-teal-300 to-blue-500 flex flex-col items-center"
      id="servicios"
    >
      <div className="text-center mb-12 max-w-5xl mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
          Servicios Destacados
        </h1>
        <p className="text-xl md:text-2xl text-teal-100 hidden md:block">
          Gloove ofrece una amplia gama de servicios como gestor turístico,
          asegurando la mejor experiencia tanto para propietarios como para
          viajeros. Conoce nuestros servicios y cómo podemos ayudarte a
          disfrutar al máximo de tus propiedades y viajes.
        </p>
      </div>
      <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-8 max-w-full px-4">
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
