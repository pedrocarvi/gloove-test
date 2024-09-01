import React from "react";
import { motion } from "framer-motion";

const Loader: React.FC = () => {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ backgroundColor: "#F4F7F5" }} // Background color matching the design
    >
      <motion.img
        src="/RecursosWeb/img/Logo/Logo-Gloove.webp"
        alt="Cargando..."
        className="h-32 w-32 mb-8" // Slightly larger to match the image proportions
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2, // Increased duration for slower effect
          ease: "easeInOut",
        }}
        style={{ filter: "drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.2))" }}
      />
      <div className="relative w-3/4 h-1 bg-gray-300 rounded-full overflow-hidden mb-6">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gloovePrimary-dark rounded-full" // Adjusted to match the primary color
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 4, // Slower loading bar animation for longer effect
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      </div>
      <motion.p
        className="text-gloovePrimary-dark text-base font-medium tracking-wide" // Updated text color to match the primary color
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Cargando, por favor espera...
      </motion.p>
    </div>
  );
};

export default Loader;
