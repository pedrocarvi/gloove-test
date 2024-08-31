import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import {
  FaHotel,
  FaUserTie,
  FaBuilding,
  FaStar,
  FaHandPointRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Parallax } from "react-parallax"; // Importamos el componente Parallax

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const cardImages = [
  "/RecursosWeb/img/Servicios/1/s1.png",
  "/RecursosWeb/img/Servicios/2/s2.png",
  "/RecursosWeb/img/Servicios/3/s3.png",
  "/RecursosWeb/img/Servicios/4/s4_2.png",
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
      className="relative flex flex-col justify-between cursor-pointer rounded-[20px] shadow-lg transition-all duration-500 ease-in-out mx-auto overflow-hidden"
      style={{
        width: "85%",
        maxWidth: "360px",
        height: "auto",
        minHeight: "400px",
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
      exit={{ opacity: 0, y: 50 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Imagen de fondo con blur */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-lg"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      ></div>

      {/* Overlay para oscurecer un poco la imagen de fondo */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-60 rounded-[20px]"></div>

      {/* Contenido de la tarjeta */}
      <div className="relative z-10 p-4 md:p-6 bg-gray-800 bg-opacity-80 rounded-t-[20px] flex flex-col justify-center">
        <Icon className="text-glooveAccent text-3xl md:text-4xl mb-2" />
        <h2 className="text-lg md:text-2xl font-extrabold text-white uppercase mb-2">
          {title}
        </h2>
        <p className="text-xs md:text-sm text-gray-300 mb-4">{details}</p>
      </div>

      {/* Imagen 3D más pequeña y bien posicionada */}
      <img
        src={imageUrl}
        alt="Imagen 3D"
        className="relative z-20 mx-auto mb-2 w-20 h-20 md:w-28 md:h-28 transform -rotate-6 shadow-lg"
      />
    </motion.div>
  );
};

// Componente de la animación de la mano
const HandAnimation: React.FC = () => (
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
    <motion.div
      className="w-10 h-10 text-gloovePrimary-dark"
      initial={{ x: 0 }}
      animate={{ x: [10, -10, 10] }}
      transition={{
        repeat: Infinity,
        repeatType: "mirror",
        duration: 1.5,
      }}
    >
      <FaHandPointRight className="w-full h-full" />
    </motion.div>
  </div>
);

const FeaturesSection: React.FC = () => {
  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Parallax
      bgImage="/path-to-your-background-image.jpg" // Puedes usar una imagen si lo deseas
      strength={200}
      bgImageAlt="the background"
      bgStyle={{ backgroundColor: "#F6F7F5" }} // Color de fondo con efecto parallax
    >
      <section className="py-16 min-h-screen flex items-center justify-center relative">
        <div className="w-full max-w-[1400px] mx-auto">
          <div ref={titleRef} className="text-center mb-12 px-4">
            <motion.h1
              className="text-3xl md:text-5xl font-extrabold text-gloovePrimary-dark mb-4"
              initial={{ opacity: 0, y: -50 }}
              animate={{
                opacity: titleInView ? 1 : 0,
                y: titleInView ? 0 : -50,
              }}
            >
              Características de Nuestra Empresa
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-glooveSecondary-dark"
              initial={{ opacity: 0, y: -50 }}
              animate={{
                opacity: titleInView ? 1 : 0,
                y: titleInView ? 0 : -50,
              }}
            >
              Conoce más sobre lo que nos hace especiales.
            </motion.p>
          </div>
          <Swiper
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView={1}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 0,
              modifier: 0,
              slideShadows: false,
            }}
            spaceBetween={0}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              type: "bullets",
            }}
            autoplay={{ delay: 5000 }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
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
            <div className="swiper-pagination swiper-pagination-bullets"></div>
          </Swiper>
          {/* Añadir animación de mano en la pantalla móvil */}
          <HandAnimation />
        </div>
      </section>
    </Parallax>
  );
};

export default FeaturesSection;
