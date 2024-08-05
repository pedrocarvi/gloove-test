import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Keyboard,
  Autoplay,
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
import { useInView } from "react-intersection-observer";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const cardImages = [
  "/RecursosWeb/img/Servicios/1/s1.png",
  "/RecursosWeb/img/Servicios/2/s2.png",
  "/RecursosWeb/img/Servicios/3/s3.png",
  "/RecursosWeb/img/Servicios/4/s4.png",
  "/RecursosWeb/img/Servicios/5/s5.png",
  "/RecursosWeb/img/Servicios/6/s6.png",
];

const cardTitles = [
  "Servicios de gestión financiera",
  "Servicios de mejora continua",
  "Servicios de tecnología y automatización",
  "Servicios de gestión de reservas y ocupación",
  "Servicios de marketing y publicidad",
  "Servicios de consultoría estratégica",
];

const cardDetails = [
  "Ofrecemos un resumen mensual de contabilidad para los propietarios, garantizando una gestión transparente y eficiente.",
  "Proporcionamos análisis de datos y optimización de procesos para mejorar continuamente el rendimiento.",
  "Implementamos soluciones tecnológicas avanzadas para la automatización y eficiencia operativa.",
  "Gestionamos reservas y ocupación para maximizar la rentabilidad de las propiedades.",
  "Desarrollamos campañas de marketing efectivas para promocionar las propiedades y atraer más huéspedes.",
  "Ofrecemos consultoría estratégica para ayudar a los propietarios a tomar decisiones informadas y planificar el futuro.",
];

const icons = [FaBuilding, FaUserTie, FaBuilding, FaHotel, FaStar, FaStar];

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
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col justify-end cursor-pointer bg-cover bg-center rounded-[20px] shadow-lg transition-all duration-500 ease-in-out mx-auto overflow-hidden"
      style={{
        width: "90%",
        maxWidth: "400px",
        height: "auto",
        backgroundImage: `url(${imageUrl})`,
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
      exit={{ opacity: 0, y: 50 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className="absolute inset-0 bg-gray-900 bg-opacity-60 rounded-[20px]"
        whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        transition={{ duration: 0.3 }}
      ></motion.div>
      <div className="relative z-10 p-4 md:p-8 bg-gray-800 bg-opacity-80 rounded-b-[20px]">
        <Icon className="text-glooveAccent text-4xl md:text-5xl mb-4" />
        <h2 className="text-xl md:text-3xl font-extrabold text-white uppercase mb-4">
          {title}
        </h2>
        <p className="text-sm md:text-lg text-gray-300 mb-4">{details}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-4 bg-glooveAccent text-white px-3 md:px-4 py-2 md:py-3 rounded-full shadow-md hover:bg-gloovePrimary-light transition"
        >
          Ver Más
        </motion.button>
      </div>
      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <FaFacebook className="text-white text-xl md:text-2xl hover:text-blue-600 transition" />
        <FaTwitter className="text-white text-xl md:text-2xl hover:text-blue-400 transition" />
        <FaInstagram className="text-white text-xl md:text-2xl hover:text-pink-600 transition" />
      </div>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-16 min-h-screen flex items-center justify-center bg-gradient-to-r from-gloovePrimary-light to-glooveSecondary-light">
      <div className="w-full max-w-[1400px] mx-auto">
        <div ref={titleRef} className="text-center mb-12 px-4">
          <motion.h1
            className="text-3xl md:text-6xl font-extrabold text-gloovePrimary-dark mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: titleInView ? 1 : 0, y: titleInView ? 0 : -50 }}
          >
            Características de Nuestra Empresa
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-glooveSecondary-dark md:block"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: titleInView ? 1 : 0, y: titleInView ? 0 : -50 }}
          >
            Conoce más sobre lo que nos hace especiales.
          </motion.p>
        </div>
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
          spaceBetween={-100} // Ajuste del espacio para un diseño más compacto
          pagination={{ clickable: true }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          keyboard={{
            enabled: true,
            onlyInViewport: true,
          }}
          autoplay={{ delay: 5000 }} // Cambio automático cada 5 segundos
          modules={[
            EffectCoverflow,
            Pagination,
            Navigation,
            Keyboard,
            Autoplay,
          ]}
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
              <FaChevronLeft className="text-white text-3xl md:text-4xl hover:text-glooveAccent transition" />
            </div>
            <div className="swiper-button-next slider-arrow">
              <FaChevronRight className="text-white text-3xl md:text-4xl hover:text-glooveAccent transition" />
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturesSection;
