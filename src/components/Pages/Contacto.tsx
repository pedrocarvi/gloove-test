import React from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

const Contacto = () => {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col items-center justify-center text-white">
      {/* Video de fondo */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
        style={{ filter: "brightness(70%) contrast(85%)" }} // Reduciendo la oscuridad del video
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="RecursosWeb/vid/img.jpg"
        >
          <source
            src="RecursosWeb/vid/FondoM.mp4"
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source
            src="RecursosWeb/vid/FondoT.mp4"
            type="video/mp4"
            media="(min-width: 768px) and (max-width: 1023px)"
          />
          <source
            src="RecursosWeb/vid/FondoO.mp4"
            type="video/mp4"
            media="(min-width: 1024px) and (max-width: 1423px)"
          />
          <source
            src="RecursosWeb/vid/FondoO2.mp4"
            type="video/mp4"
            media="(min-width: 1424px)"
          />
        </video>
      </motion.div>

      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent z-1"></div>

      {/* Contenido principal */}
      <motion.div
        className="relative z-10 max-w-4xl p-8 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h2
          className="text-4xl font-extrabold mb-6 text-glooveText-dark"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Ponte en CONTACTO con nosotros
        </motion.h2>
        <motion.p
          className="text-lg leading-relaxed mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Gloove, el gestor de viviendas vacacionales que se apoya en la
          experiencia de un amplio equipo de profesionales y en las últimas
          tecnologías para ayudarte a alcanzar los mejores resultados.
        </motion.p>
        <motion.p
          className="text-lg leading-relaxed mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Logramos ofrecerte una alta rentabilidad como propietarios, y a su
          vez, aportar una gran experiencia con un excelente servicio de calidad
          para los huéspedes.
        </motion.p>

        <motion.p
          className="text-xl font-bold mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Ponte en CONTACTO con nosotros y te daremos respuesta INMEDIATA
        </motion.p>

        <div className="flex justify-center space-x-4 mb-8">
          {/* Instagram */}
          <motion.a
            href="https://www.instagram.com/gloove_me/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-glooveAccent transition-colors duration-300"
            whileHover={{ scale: 1.3, rotate: 15 }}
          >
            <FaInstagram size={32} />
          </motion.a>

          {/* Facebook */}
          <motion.a
            href="https://www.facebook.com/profile.php?id=100090425376184"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-glooveAccent transition-colors duration-300"
            whileHover={{ scale: 1.3, rotate: 15 }}
          >
            <FaFacebook size={32} />
          </motion.a>

          {/* LinkedIn */}
          <motion.a
            href="https://www.linkedin.com/company/gloove-gestor-turistico/?viewAsMember=true"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-glooveAccent transition-colors duration-300"
            whileHover={{ scale: 1.3, rotate: 15 }}
          >
            <FaLinkedin size={32} />
          </motion.a>

          {/* YouTube */}
          <motion.a
            href="https://www.youtube.com/channel/UCjqP8g14G2SG3lK6OYGupMA"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-glooveAccent transition-colors duration-300"
            whileHover={{ scale: 1.3, rotate: 15 }}
          >
            <FaYoutube size={32} />
          </motion.a>
        </div>


        <motion.a
          href="https://wa.me/34613105559"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
          }}
          className="flex items-center justify-center bg-gloovePrimary-dark text-white font-bold py-3 px-6 rounded-full transition duration-300 hover:scale-105"
        >
          <FaWhatsapp size={20} className="mr-2" />
          Contáctanos por WhatsApp
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Contacto;
