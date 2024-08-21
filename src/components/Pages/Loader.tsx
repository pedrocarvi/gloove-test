import React from "react";
import { motion } from "framer-motion";
import logo from "../../../public/RecursosWeb/img/Logo/Logo-Gloove.webp";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-gradient-to-b from-glooveSecondary-light to-white animate-backgroundMove">
      <motion.img
        src={logo}
        alt="Cargando..."
        className="h-24 w-24 mb-8"
        animate={{
          rotate: 360,
          scale: [1, 1.15, 1],
          filter: "brightness(1.2)",
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
        style={{ filter: "drop-shadow(0px 0px 10px rgba(32, 164, 243, 0.8))" }}
      />
      <div className="relative w-3/4 h-2 bg-gray-300 rounded-full overflow-hidden mb-4">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-gloovePrimary to-glooveAccent rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
        />
      </div>
      <div className="flex space-x-2 mb-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-gloovePrimary rounded-full"
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      <motion.p
        className="text-glooveText text-base font-semibold"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Cargando, por favor espera...
      </motion.p>
    </div>
  );
};

export default Loader;
