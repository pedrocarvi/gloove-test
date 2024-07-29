import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Experiencias: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="experiencias"
      className="h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-background px-4"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="text-center max-w-3xl"
      >
        <h2 className="text-2xl md:text-3xl font-bold dark:text-dark-text">
          Experiencias
        </h2>
        <p className="mt-4 text-base md:text-lg dark:text-dark-text">
          Vive experiencias únicas con nuestros servicios personalizados.
        </p>
      </motion.div>
    </section>
  );
};

export default Experiencias;
