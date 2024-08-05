import React from "react";
import { motion } from "framer-motion";
import logo from "../../../public/RecursosWeb/img/Logo/Logo-Gloove.webp";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <motion.img
        src={logo}
        alt="Cargando..."
        className="h-24 w-24 mb-4"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      />
      <div className="w-3/4 h-1 bg-gray-300 rounded-full">
        <motion.div
          className="h-full bg-gloovePrimary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
        />
      </div>
      <p className="mt-4 text-glooveText text-sm">
        Cargando, por favor espera...
      </p>
    </div>
  );
};

export default Loader;
