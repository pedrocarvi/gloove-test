import React from "react";
import { motion } from "framer-motion";

const brands = [
  {
    src: "path/to/your/image1.svg",
    alt: "Brand 1",
    rotate: -90,
  },
  {
    src: "path/to/your/image2.svg",
    alt: "Brand 2",
    rotate: -18,
  },
  // Agrega más marcas según sea necesario
];

const CollaboratorsSection: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 overflow-hidden py-10">
      <div className="absolute w-[1121px] h-[1121px] bg-green-200 rounded-full shadow-inner -left-[30%] -top-[10%]" />
      <motion.div
        className="absolute w-[1380px] h-[1370px] origin-center rotate-[126deg] rounded-[300px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, loop: Infinity, ease: "linear" }}
      >
        <div className="w-[1121px] h-[1121px] absolute left-[130px] top-[126px] bg-teal-800 rounded-full flex justify-center items-center">
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              className="absolute flex justify-center items-center"
              style={{
                width: "250px",
                height: "250px",
                transform: `rotate(${brand.rotate}deg) translate(500px)`,
                backgroundColor: "#f4f7f5",
                borderRadius: "50%",
                padding: "20px",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: index * 0.5 }}
              whileHover={{ scale: 1.1 }}
            >
              <img
                src={brand.src}
                alt={brand.alt}
                className="w-[80%] h-[80%] object-contain"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
      <div className="relative text-center z-10">
        <div className="text-pink-700 text-6xl font-extrabold uppercase">
          Colaboradores
        </div>
        <div className="text-pink-700 text-4xl font-semibold uppercase">
          con los que trabajamos
        </div>
      </div>
    </div>
  );
};

export default CollaboratorsSection;
