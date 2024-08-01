import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Keyboard,
} from "swiper/modules";
import {
  FaHotel,
  FaUserTie,
  FaBuilding,
  FaStar,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

const cardImages = [
  "/RecursosWeb/img/Pro/pexels-olly-915051.jpg",
  "/RecursosWeb/img/Res/pexels-ketut-subiyanto-4546018.jpg",
  "/RecursosWeb/img/Inm/pexels-maksgelatin-4352247.jpg",
  "/RecursosWeb/img/Exp/pexels-maksgelatin-4352247.jpg",
];

const cardTitles = [
  "Servicios de gestión financiera",
  "Servicios de mejora continua",
  "Servicios de tecnología y automatización",
  "Servicios de gestión de reservas y ocupación",
];

const cardDetails = [
  "Resumen mensual de contabilidad para el propietario...",
  "Análisis de datos, optimización de procesos...",
  "Domotización de acceso, gestión de check-in...",
  "Sesión y edición fotográfica, publicación en plataformas...",
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
}) => (
  <motion.div
    className="relative flex flex-col justify-end cursor-pointer bg-cover bg-center rounded-[20px] shadow-lg transition-all duration-500 ease-in-out mx-auto overflow-hidden"
    style={{
      width: "500px",
      height: "700px",
      backgroundImage: `url(${imageUrl})`,
    }}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    whileHover={{ scale: 1.05 }}
  >
    <motion.div
      className="absolute inset-0 bg-gray-900 bg-opacity-60 rounded-[20px]"
      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      transition={{ duration: 0.3 }}
    ></motion.div>
    <div className="relative z-10 p-8 bg-gray-800 bg-opacity-80 rounded-b-[20px]">
      <Icon className="text-glooveAccent text-6xl mb-4" />
      <h2 className="text-4xl font-extrabold text-white uppercase mb-4">
        {title}
      </h2>
      <p className="text-lg text-gray-300 mb-4">{details}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        className="mt-4 bg-glooveAccent text-white px-6 py-3 rounded-full shadow-md hover:bg-gloovePrimary-light transition"
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

const FeaturesSection: React.FC = () => (
  <section className="py-16 min-h-screen bg-gradient-to-r from-gloovePrimary-light to-glooveSecondary-light">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold text-gloovePrimary-dark mb-4">
        Características de Nuestra Empresa
      </h1>
      <p className="text-xl md:text-2xl text-glooveSecondary-dark hidden md:block">
        Conoce más sobre lo que nos hace especiales.
      </p>
    </div>
    <div className="mt-12">
      <Swiper
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 1.5,
          slideShadows: true,
        }}
        spaceBetween={-150} // Ajuste del espacio para un diseño más compacto
        pagination={{ clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation, Keyboard]}
        className="swiper_container"
      >
        {cardTitles.map((title, index) => (
          <SwiperSlide key={index}>
            <Card
              title={title}
              details={cardDetails[index]}
              imageUrl={cardImages[index]}
              icon={icons[index]}
            />
          </SwiperSlide>
        ))}
        <div className="slider-controler">
          <div className="swiper-button-prev slider-arrow">
            <FaChevronLeft className="text-white text-4xl hover:text-glooveAccent transition" />
          </div>
          <div className="swiper-button-next slider-arrow">
            <FaChevronRight className="text-white text-4xl hover:text-glooveAccent transition" />
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
    </div>
  </section>
);

export default FeaturesSection;
