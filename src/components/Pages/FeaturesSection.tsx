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
import Carousel from "./Carousel";

const cardImages = [
  "/RecursosWeb/img/Pro/pro.png",
  "/RecursosWeb/img/Res/res.png",
  "/RecursosWeb/img/Inm/Inm.png",
  "/RecursosWeb/img/Exp/Exp.png",
];

const cardTitles = [
  "Servicios de gestión financiera",
  "Servicios de mejora continua",
  "Servicios de tecnología y automatización",
  "Servicios de gestión de reservas y ocupación",
];

const cardDetails = [
  "Resumen mensual de contabilidad para el propietario. Gestión de pagos de limpieza, lavandería y otros servicios. Liquidación y pago mensual de beneficios al propietario. Análisis y optimización financiera para maximizar la rentabilidad.",
  "Análisis de datos, optimización de procesos y estrategias comerciales. Gestión dinámica de precios. Mejora de la experiencia mediante encuestas. Actualización en nuevas tecnologías. Deep-learning para mejorar la eficiencia y rentabilidad.",
  "Domotización de acceso (Gratuita). Gestión de check-in y check-out de huéspedes. Acceso a toda la información sobre la gestión en tiempo real. Amplio catálogo opcional de domótica para un mayor ahorro y eficiencia energética. Servicios tecnológicos para mejorar la experiencia del huésped.",
  "Sesión y edición fotográfica. Publicación en las principales plataformas comerciales. Atención al huésped 24h. Marketing para aumentar ingresos. Creación y optimización de perfiles. Centralización de reservas. Seguimiento de la ocupación. Estrategia de precios dinámicos. Aviso a la policía de cada check-in.",
];

const icons = [FaBuilding, FaStar, FaBuilding, FaHotel];

type CardProps = {
  title: string;
  details: string;
  imageUrl: string;
  icon: React.ElementType;
};

const Card: React.FC<CardProps> = ({
  title,
  details,
  imageUrl,
  icon: Icon,
}) => {
  return (
    <motion.div
      className="relative flex flex-col justify-end cursor-pointer bg-cover bg-center rounded-[20px] shadow-lg transition-all duration-500 ease-in-out mx-auto"
      style={{
        width: "486px",
        height: "643px",
        backgroundImage: `url(${imageUrl})`,
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-[20px]"></div>
      <div className="relative z-10 p-8 bg-gray-800 bg-opacity-75 rounded-b-[20px]">
        <Icon className="text-white text-6xl mb-4" />
        <h2 className="text-4xl font-extrabold text-white uppercase mb-4">
          {title}
        </h2>
        <p className="text-lg text-white">{details}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-4 bg-white text-gray-800 px-4 py-2 rounded-full shadow-md hover:bg-gray-200 transition"
        >
          Ver Más
        </motion.button>
      </div>
      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <FaFacebook className="text-white text-2xl hover:text-blue-600 transition" />
        <FaTwitter className="text-white text-2xl hover:text-blue-400 transition" />
        <FaInstagram className="text-white text-2xl hover:text-pink-600 transition" />
      </div>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const cards = cardTitles.map((title, index) => ({
    title,
    icon: icons[index],
    details: cardDetails[index],
    imageUrl: cardImages[index],
  }));

  const slides = cards.map((card, index) => (
    <Card
      key={index}
      title={card.title}
      details={card.details}
      imageUrl={card.imageUrl}
      icon={card.icon}
    />
  ));

  return (
    <section className="py-16 min-h-screen bg-gradient-to-r from-[#146b79] to-[#08090a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-white">
          Características de Nuestra Empresa
        </h1>
        <p className="mt-4 text-2xl text-gray-300">
          Conoce más sobre lo que nos hace especiales.
        </p>
      </div>
      <div className="mt-12 flex justify-center">
        <Carousel slides={slides} autoSlide={true} autoSlideInterval={5000} />
      </div>
    </section>
  );
};

export default FeaturesSection;
