import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Contacto: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="contacto"
      className="h-screen flex items-center justify-center bg-teal-700 dark:bg-dark-primary px-4"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="text-center text-white max-w-3xl"
      >
        <h2 className="text-2xl md:text-3xl font-bold">Contacto</h2>
        <p className="mt-4 text-base md:text-lg">
          Ponte en CONTACTO con nosotros y te daremos respuesta INMEDIATA
          <br />
          info@gloove.com | +34 613105559 | Alicante, España
        </p>
        <div className="mt-6 flex justify-center">
          <button className="bg-white text-teal-700 px-4 py-2 rounded-md hover:bg-primary-dark hover:text-white">
            Contáctanos
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Contacto;
