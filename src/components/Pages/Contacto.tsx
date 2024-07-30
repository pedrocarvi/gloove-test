import React from "react";
import {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

const scrollVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

const Contacto = () => {
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.2 });
  const { scrollYProgress } = useScroll();

  const yTransform = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scaleTransform = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  return (
    <section className="relative flex flex-col md:flex-row items-center justify-center min-h-screen bg-white p-8 overflow-hidden mb-0">
      {/* Fondo Parallax */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 to-teal-500 clip-path-diagonal"
        style={{ y: yTransform }}
      />

      {/* Texto e Información */}
      <motion.div
        className="md:w-1/2 p-8 text-center md:text-left relative z-10"
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={scrollVariants}
      >
        <motion.h2
          className="text-white text-4xl md:text-5xl font-extrabold uppercase mb-4"
          variants={scrollVariants}
        >
          SOBRE NOSOTROS
        </motion.h2>
        <motion.p className="text-white mb-6" variants={scrollVariants}>
          Gloove, el gestor de viviendas vacacionales que se apoya en la
          experiencia de un amplio equipo de profesionales y en las últimas
          tecnologías para ayudarte a alcanzar los mejores resultados.
        </motion.p>
        <motion.p className="text-white mb-6" variants={scrollVariants}>
          Logramos ofreceros una alta rentabilidad como propietarios, y a su
          vez, aportar una gran experiencia con un excelente servicio de calidad
          para los huéspedes.
        </motion.p>
        <div className="flex justify-center md:justify-start space-x-4 mb-6">
          <motion.div
            variants={scrollVariants}
            whileHover={{ scale: 1.2, rotateY: 20, rotateX: -10 }}
            className="transition-transform duration-300 ease-out"
          >
            <FaInstagram className="text-white cursor-pointer" size={36} />
          </motion.div>
          <motion.div
            variants={scrollVariants}
            whileHover={{ scale: 1.2, rotateY: 20, rotateX: -10 }}
            className="transition-transform duration-300 ease-out"
          >
            <FaFacebook className="text-white cursor-pointer" size={36} />
          </motion.div>
          <motion.div
            variants={scrollVariants}
            whileHover={{ scale: 1.2, rotateY: 20, rotateX: -10 }}
            className="transition-transform duration-300 ease-out"
          >
            <FaWhatsapp className="text-white cursor-pointer" size={36} />
          </motion.div>
          <motion.div
            variants={scrollVariants}
            whileHover={{ scale: 1.2, rotateY: 20, rotateX: -10 }}
            className="transition-transform duration-300 ease-out"
          >
            <FaLinkedin className="text-white cursor-pointer" size={36} />
          </motion.div>
          <motion.div
            variants={scrollVariants}
            whileHover={{ scale: 1.2, rotateY: 20, rotateX: -10 }}
            className="transition-transform duration-300 ease-out"
          >
            <FaYoutube className="text-white cursor-pointer" size={36} />
          </motion.div>
        </div>
        <motion.p
          className="text-lg font-bold text-white"
          variants={scrollVariants}
        >
          Ponte en <span className="text-black">CONTACTO</span> con nosotros y
          te daremos respuesta <span className="text-black">INMEDIATA</span>
        </motion.p>
      </motion.div>

      {/* Logotipo e Imagen */}
      <motion.div
        className="md:w-1/2 flex items-center justify-center p-8 relative z-10"
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={scrollVariants}
      >
        <div className="relative w-full h-full max-w-md">
          <motion.div
            className="bg-white rounded-full w-full h-full p-10 flex flex-col items-center justify-center shadow-lg"
            style={{ scale: scaleTransform }}
          >
            <img
              src="dist/RecursosWeb/img/Logo/Logo-Gloove.webp"
              alt="Gloove Logo"
              className="mb-4 w-32 h-32 object-contain"
            />
            <motion.h3
              className="text-2xl font-bold mb-2 text-gray-700"
              initial="hidden"
              animate="visible"
              variants={scrollVariants}
            >
              gloove
            </motion.h3>
            <motion.p
              className="text-lg text-gray-600"
              initial="hidden"
              animate="visible"
              variants={scrollVariants}
            >
              TU ALOJAMIENTO TURÍSTICO
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contacto;
