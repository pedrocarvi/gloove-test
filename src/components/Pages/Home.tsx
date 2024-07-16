// src/components/Pages/Home.tsx
import React from "react";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import NavbarHome from "../Layout/NavbarHome";
import { CheckIcon } from "@heroicons/react/24/outline";
import Chatbot from "../UI/Chatbot";

const Home: React.FC = () => {
  const { ref: section1Ref, inView: section1InView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: section2Ref, inView: section2InView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: section3Ref, inView: section3InView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: section4Ref, inView: section4InView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: section5Ref, inView: section5InView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div>
      <NavbarHome />
      <Parallax pages={6} className="h-screen">
        <ParallaxLayer
          offset={0}
          speed={0.5}
          className="bg-cover bg-center"
          style={{ backgroundImage: "url('/background.jpg')" }}
        >
          <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl text-white font-bold"
            >
              Gloove tu alojamiento turístico
            </motion.h1>
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={1}
          speed={0.5}
          className="flex items-center justify-center bg-gray-100"
        >
          <motion.div
            ref={section1Ref}
            initial={{ opacity: 0, y: 50 }}
            animate={section1InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center max-w-3xl"
          >
            <h2 className="text-3xl font-bold">
              TU GESTOR TURÍSTICO DE CONFIANZA
            </h2>
            <p className="mt-4 text-lg">
              Servicio de gestión de reservas y ocupación
              <br />
              Servicio de máxima calidad
              <br />
              Servicios de atención 24 horas para huéspedes y propietarios
              <br />
              Servicios de tecnología y automatización
              <br />
              Servicios de mejora continua
              <br />
              Servicios de gestión financiera
            </p>
            <div className="mt-6 flex justify-center">
              <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
                Ir a la página
              </button>
            </div>
          </motion.div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={1.5}
          speed={0.5}
          className="flex items-center justify-center bg-white"
        >
          <Chatbot />{" "}
          {/* Aquí se muestra el Chatbot en una posición más visible */}
        </ParallaxLayer>

        <ParallaxLayer
          offset={2}
          speed={0.5}
          className="flex items-center justify-center bg-teal-700"
        >
          <motion.div
            ref={section2Ref}
            initial={{ opacity: 0, y: 50 }}
            animate={section2InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center text-white max-w-3xl"
          >
            <h2 className="text-3xl font-bold">
              Colaboradores con los que trabajamos
            </h2>
            <p className="mt-4 text-lg">
              Airbnb, Vrbo, Expedia, Booking, Logo (1)
            </p>
            <div className="mt-6 flex justify-center">
              <div className="flex items-center">
                <CheckIcon className="h-6 w-6 text-white" />
                <span className="ml-2 text-lg">
                  Nos encargamos de TODA LA GESTIÓN de las viviendas
                </span>
              </div>
            </div>
          </motion.div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={3}
          speed={0.5}
          className="flex items-center justify-center bg-gray-200"
        >
          <motion.div
            ref={section3Ref}
            initial={{ opacity: 0, y: 50 }}
            animate={section3InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center max-w-3xl"
          >
            <h2 className="text-3xl font-bold">Sobre Nosotros</h2>
            <p className="mt-4 text-lg">
              Gloove, el gestor de viviendas vacacionales que se apoya en la
              experiencia de un amplio equipo de profesionales y en las últimas
              tecnologías para ayudarte a alcanzar los mejores resultados.
              <br />
              Logramos ofreceros una alta rentabilidad como propietarios, y a su
              vez, aportar una gran experiencia con un excelente servicio de
              calidad para los huéspedes.
            </p>
          </motion.div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={4}
          speed={0.5}
          className="flex items-center justify-center bg-gray-100"
        >
          <motion.div
            ref={section4Ref}
            initial={{ opacity: 0, y: 50 }}
            animate={section4InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center max-w-3xl"
          >
            <h2 className="text-3xl font-bold">Información Legal</h2>
            <p className="mt-4 text-lg">
              Política de privacidad
              <br />
              Política de Cookies
              <br />
              Aviso Legal
            </p>
          </motion.div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={5}
          speed={0.5}
          className="flex items-center justify-center bg-teal-700"
        >
          <motion.div
            ref={section5Ref}
            initial={{ opacity: 0, y: 50 }}
            animate={section5InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center text-white max-w-3xl"
          >
            <h2 className="text-3xl font-bold">Contacto</h2>
            <p className="mt-4 text-lg">
              Ponte en CONTACTO con nosotros y te daremos respuesta INMEDIATA
              <br />
              info@gloove.com | +34 613105559 | Alicante, España
            </p>
            <div className="mt-6 flex justify-center">
              <button className="bg-white text-teal-700 px-4 py-2 rounded-md hover:bg-teal-600">
                Contáctanos
              </button>
            </div>
          </motion.div>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
};

export default Home;
