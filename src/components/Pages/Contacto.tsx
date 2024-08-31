import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import Testimonials from "./Testimonios";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const Contacto = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "contacto"), {
        nombre,
        email,
        mensaje,
        timestamp: serverTimestamp(),
      });
      alert("Mensaje enviado correctamente.");
      setNombre("");
      setEmail("");
      setMensaje("");
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      alert("Hubo un error al enviar el mensaje.");
    }
  };

  return (
    <section className="py-16 bg-[#F6F7F5] px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col items-center">
      <Testimonials />

      <motion.div
        className="w-full max-w-4xl p-8 text-center relative z-10 space-y-8 bg-white shadow-xl rounded-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-gloovePrimary-dark mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Contáctanos
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-glooveSecondary-dark leading-relaxed"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Estamos aquí para ayudarte a obtener los mejores resultados. Déjanos
          un mensaje o contáctanos directamente a través de nuestras redes
          sociales.
        </motion.p>
        <div className="flex justify-center space-x-4 mt-8">
          {[FaInstagram, FaFacebook, FaLinkedin, FaYoutube].map(
            (Icon, index) => (
              <motion.a
                key={index}
                href="#"
                className="text-gloovePrimary-dark hover:text-teal-300 transition-colors duration-300"
                whileHover={{ scale: 1.3, rotate: 15 }}
              >
                <Icon size={32} />
              </motion.a>
            )
          )}
          <motion.a
            href="https://wa.me/34613105559"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gloovePrimary-dark hover:text-teal-300 transition-colors duration-300"
            whileHover={{ scale: 1.3, rotate: 15 }}
          >
            <FaWhatsapp size={32} />
          </motion.a>
        </div>
        <motion.div
          className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mt-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.a
            href="https://wa.me/34613105559"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
            }}
            className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-bold py-3 px-10 rounded-full transition duration-300 hover:scale-105 animate-pulse"
          >
            Contáctanos por WhatsApp
          </motion.a>
          <motion.button
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
            }}
            className="bg-gradient-to-r from-gloovePrimary via-gloovePrimary-dark to-glooveAccent text-white font-bold py-3 px-10 rounded-full transition duration-300 hover:scale-105 animate-pulse"
            onClick={() => setIsFormVisible(!isFormVisible)}
          >
            Envíanos un Mensaje
          </motion.button>
        </motion.div>
      </motion.div>

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
              <h3 className="text-2xl font-bold text-gloovePrimary-dark">
                Formulario de Contacto
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setIsFormVisible(false)}
              >
                &times;
              </button>
            </div>
            <form
              className="space-y-4"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <div>
                <label htmlFor="nombre" className="block text-gray-700">
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-teal-300"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
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
