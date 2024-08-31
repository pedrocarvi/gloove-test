import React from "react";
import { motion } from "framer-motion";
import { FaHotel, FaUserTie, FaBuilding, FaStar } from "react-icons/fa";

// Datos de las tarjetas
const cardDetails = [
  {
    title: "Huéspedes",
    icon: FaHotel,
    description:
      "Ofrecemos un servicio integral para propietarios, gestionando sus inmuebles con profesionalidad y transparencia.",
    imageUrl: "/RecursosWeb/img/Pro/pexels-olly-915051.jpg",
    socialLinks: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
    },
  },
  {
    title: "Propietarios",
    icon: FaUserTie,
    description:
      "Gestionamos reservas con un sistema ágil y eficiente, asegurando la mejor experiencia para nuestros huéspedes.",
    imageUrl: "/RecursosWeb/img/Res/pexels-ketut-subiyanto-4546018.jpg",
    socialLinks: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
    },
  },
  {
    title: "Inmobiliaria",
    icon: FaBuilding,
    description:
      "Proveemos soluciones inmobiliarias adaptadas a las necesidades de cada cliente, garantizando seguridad y confianza.",
    imageUrl: "/RecursosWeb/img/Inm/pexels-maksgelatin-4352247.jpg",
    socialLinks: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
    },
  },
  {
    title: "Experiencias",
    icon: FaStar,
    description:
      "Creamos experiencias únicas e inolvidables, desde actividades culturales hasta aventuras extremas.",
    imageUrl: "/RecursosWeb/img/Exp/pexels-pixabay-327269.jpg",
    socialLinks: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
    },
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#F6F7F5] overflow-hidden py-12 sm:py-16 lg:py-24">
      {/* Fondo ajustado */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.h2
          className="text-3xl md:text-5xl font-extrabold text-gloovePrimary-dark text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Servicios Destacados
        </motion.h2>

        {/* Subtítulo añadido */}
        <motion.p
          className="text-lg md:text-xl text-glooveSecondary-dark text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Descubre nuestros servicios que te garantizan una experiencia
          excepcional.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cardDetails.map((card, index) => (
            <motion.div
              key={index}
              className="relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.3,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.4)",
              }}
            >
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-gray-800">
                    {card.title}
                  </div>
                  <card.icon className="text-3xl text-[#106a8a]" />
                </div>
                <p className="text-sm text-gray-600 mt-2 mb-4">
                  {card.description}
                </p>
                <motion.a
                  href="#contacto"
                  className="block text-center bg-gradient-to-r from-[#106a8a] via-[#1e8bc3] to-[#20a4f3] text-white px-4 py-2 rounded-full shadow-md transition-transform duration-300"
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Descubrir más
                </motion.a>
                {/* Redes Sociales */}
                <div className="mt-4 flex justify-center space-x-4">
                  <motion.a
                    href={card.socialLinks.facebook}
                    className="text-[#106a8a] hover:text-[#1e8bc3]"
                    whileHover={{ scale: 1.2 }}
                  >
                    <i className="fab fa-facebook-f"></i>
                  </motion.a>
                  <motion.a
                    href={card.socialLinks.twitter}
                    className="text-[#106a8a] hover:text-[#1e8bc3]"
                    whileHover={{ scale: 1.2 }}
                  >
                    <i className="fab fa-twitter"></i>
                  </motion.a>
                  <motion.a
                    href={card.socialLinks.instagram}
                    className="text-[#106a8a] hover:text-[#1e8bc3]"
                    whileHover={{ scale: 1.2 }}
                  >
                    <i className="fab fa-instagram"></i>
                  </motion.a>
                </div>
              </div>
              {/* Indicador visual */}
              <div className="absolute inset-0 border-2 border-transparent hover:border-[#20a4f3] transition-all duration-300 rounded-xl"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
