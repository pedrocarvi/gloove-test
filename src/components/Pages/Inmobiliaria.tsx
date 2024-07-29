import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Inmobiliaria: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="inmobiliaria"
      className="h-screen flex items-center justify-center bg-gray-200 dark:bg-dark-secondary px-4"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="text-center max-w-3xl"
      >
        <h2 className="text-2xl md:text-3xl font-bold dark:text-dark-text">
          Inmobiliaria
        </h2>
        <p className="mt-4 text-base md:text-lg dark:text-dark-text">
          Gloove, el gestor de viviendas vacacionales que se apoya en la
          experiencia de un amplio equipo de profesionales y en las últimas
          tecnologías para ayudarte a alcanzar los mejores resultados.
          <br />
          Logramos ofreceros una alta rentabilidad como propietarios, y a su
          vez, aportar una gran experiencia con un excelente servicio de calidad
          para los huéspedes.
        </p>
      </motion.div>
    </section>
  );
};

export default Inmobiliaria;
