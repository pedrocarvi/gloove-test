import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CheckIcon } from "@heroicons/react/24/outline";

const Propietarios: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="propietarios"
      className="h-screen flex items-center justify-center bg-teal-700 dark:bg-dark-primary px-4"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="text-center text-white max-w-3xl"
      >
        <h2 className="text-2xl md:text-3xl font-bold">
          Colaboradores con los que trabajamos
        </h2>
        <p className="mt-4 text-base md:text-lg">
          Airbnb, Vrbo, Expedia, Booking, Logo (1)
        </p>
        <div className="mt-6 flex justify-center">
          <div className="flex items-center">
            <CheckIcon className="h-6 w-6 text-white" />
            <span className="ml-2 text-base md:text-lg">
              Nos encargamos de TODA LA GESTIÓN de las viviendas
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Propietarios;
