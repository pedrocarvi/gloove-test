import React from "react";
import { motion } from "framer-motion";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-gray-100 bg-opacity-80">
      <motion.img
        src="/RecursosWeb/img/Logo/Logo-Gloove.webp"
        alt="Cargando..."
        className="h-28 w-28 mb-8"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
        style={{ filter: "drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.2))" }}
      />
      <div className="relative w-3/4 h-1 bg-gray-300 rounded-full overflow-hidden mb-6">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gray-600 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      </div>
      <motion.p
        className="text-gray-700 text-sm font-medium tracking-wide"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        Cargando, por favor espera...
      </motion.p>
    </div>
  );
};

export default Loader;
