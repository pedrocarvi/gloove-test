import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import Testimonios from "./Testimonios";

const Contacto = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <section className="relative flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-700 to-teal-400 p-8 overflow-hidden">
      {/* Texto e Información */}
      <motion.div className="w-full max-w-3xl p-8 text-center relative z-10 space-y-6">
        <motion.h2 className="text-white text-4xl md:text-5xl font-extrabold uppercase tracking-wide">
          Sobre Nosotros
        </motion.h2>
        <motion.p className="text-white text-lg leading-relaxed">
          Gloove, el gestor de viviendas vacacionales que se apoya en la
          experiencia de un amplio equipo de profesionales y en las últimas
          tecnologías para ayudarte a alcanzar los mejores resultados.
        </motion.p>
        <motion.p className="text-white text-lg leading-relaxed">
          Ofrecemos una alta rentabilidad a los propietarios y una experiencia
          excepcional a los huéspedes con un servicio de calidad.
        </motion.p>
        <div className="flex justify-center space-x-4 mt-4">
          {[FaInstagram, FaFacebook, FaWhatsapp, FaLinkedin, FaYoutube].map(
            (Icon, index) => (
              <motion.a
                key={index}
                href="#"
                className="text-white hover:text-teal-300 transition-colors duration-300"
                whileHover={{ scale: 1.3, rotate: 15 }}
              >
                <Icon size={32} />
              </motion.a>
            )
          )}
        </div>
        <motion.p className="text-lg font-bold text-white">
          Ponte en <span className="text-teal-300">CONTACTO</span> con nosotros
          y te daremos respuesta{" "}
          <span className="text-teal-300">INMEDIATA</span>
        </motion.p>
        <motion.button
          className="mt-6 px-8 py-4 bg-teal-300 text-blue-700 font-bold rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 focus:outline-none"
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          Contáctanos
        </motion.button>
      </motion.div>

      {/* Componente de Testimonios */}
      <Testimonios />

      {/* Formulario de Contacto */}
      {isFormVisible && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full mx-4 sm:mx-0"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Formulario de Contacto</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setIsFormVisible(false)}
              >
                &times;
              </button>
            </div>
            <form className="space-y-4" autoComplete="off">
              <div>
                <label htmlFor="nombre" className="block text-gray-700">
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-teal-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-teal-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="mensaje" className="block text-gray-700">
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-teal-300"
                  rows={4}
                  required
                ></textarea>
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-700 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition-colors duration-300"
                >
                  Enviar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Contacto;
