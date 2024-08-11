import React from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaArrowUp, // Importamos el ícono de flecha hacia arriba
} from "react-icons/fa";
import { motion } from "framer-motion";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

const socialMediaVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.3,
    rotate: 360,
    transition: { duration: 0.5 },
  },
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center md:items-start">
        {/* Encabezado Principal */}
        <motion.div
          className="mb-6 md:mb-0 text-center md:text-left"
          initial="hidden"
          whileInView="visible"
          variants={textVariants}
        >
          <h3 className="text-2xl font-bold mb-4 text-white">
            Nos encargamos de TODA LA GESTIÓN de las viviendas
          </h3>
        </motion.div>

        {/* Información Legal */}
        <motion.div
          className="mb-6 md:mb-0 text-center md:text-left"
          initial="hidden"
          whileInView="visible"
          variants={textVariants}
        >
          <h4 className="text-lg font-semibold mb-2 text-white">
            INFORMACIÓN LEGAL
          </h4>
          <ul className="text-sm space-y-2">
            <li>
              <a
                href="#"
                className="hover:text-teal-500 transition duration-300"
              >
                Política de privacidad
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-teal-500 transition duration-300"
              >
                Política de Cookies
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-teal-500 transition duration-300"
              >
                Aviso Legal
              </a>
            </li>
          </ul>
        </motion.div>

        {/* Nosotros */}
        <motion.div
          className="mb-6 md:mb-0 text-center md:text-left"
          initial="hidden"
          whileInView="visible"
          variants={textVariants}
        >
          <h4 className="text-lg font-semibold mb-2 text-white">NOSOTROS</h4>
          <ul className="text-sm space-y-2">
            <li>
              <a
                href="#"
                className="hover:text-teal-500 transition duration-300"
              >
                Centro de Ayuda
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-teal-500 transition duration-300"
              >
                Sobre nosotros
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-teal-500 transition duration-300"
              >
                Preguntas Frecuentes
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-teal-500 transition duration-300"
              >
                Trabaja con nosotros
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-teal-500 transition duration-300"
              >
                Nuestro Blog
              </a>
            </li>
          </ul>
        </motion.div>

        {/* Contacto */}
        <motion.div
          className="text-center md:text-left"
          initial="hidden"
          whileInView="visible"
          variants={textVariants}
        >
          <h4 className="text-lg font-semibold mb-2 text-white">CONTÁCTANOS</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-center justify-center md:justify-start">
              <FaEnvelope className="mr-2 text-teal-500" />
              <a
                href="mailto:info@gloove.com"
                className="hover:text-teal-500 transition duration-300"
              >
                info@gloove.com
              </a>
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <FaPhone className="mr-2 text-teal-500" />
              <a
                href="tel:+34613105559"
                className="hover:text-teal-500 transition duration-300"
              >
                +34 613105559
              </a>
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <FaMapMarkerAlt className="mr-2 text-teal-500" />
              <span>Alicante, España</span>
            </li>
          </ul>
          <div className="flex space-x-4 mt-4 justify-center md:justify-start">
            {[
              { href: "#", icon: FaFacebook },
              { href: "#", icon: FaInstagram },
              { href: "#", icon: FaTwitter },
              { href: "#", icon: FaLinkedin },
              { href: "#", icon: FaYoutube },
            ].map(({ href, icon: Icon }, index) => (
              <motion.a
                key={index}
                href={href}
                className="text-gray-300 hover:text-teal-500 transition duration-300"
                variants={socialMediaVariants}
                whileHover="hover"
              >
                <Icon size={24} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Botón de Volver Arriba */}
      <motion.div
        whileHover={{ scale: 1.2 }}
        className="flex justify-center mt-8"
      >
        <a
          href="#inicio"
          className="bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 transition"
        >
          <FaArrowUp size={24} />
        </a>
      </motion.div>

      <div className="bg-gray-800 py-4 mt-10">
        <div className="container mx-auto text-center">
          <p className="text-sm text-gray-500">
            &copy; 2024 Gloove. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
