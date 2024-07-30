import React from "react";
import { motion } from "framer-motion";
import TypingEffect from "react-typing-effect"; // Librería para el efecto de escritura

const Hero: React.FC = () => {
  return (
    <section id="inicio" className="relative h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
      >
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="/RecursosWeb/vid/FondoM.mp4"
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source
            src="/RecursosWeb/vid/FondoT.mp4"
            type="video/mp4"
            media="(min-width: 768px) and (max-width: 1023px)"
          />
          <source
            src="/RecursosWeb/vid/FondoO.mp4"
            type="video/mp4"
            media="(min-width: 1024px) and (max-width: 1423px)"
          />
          <source
            src="dist/RecursosWeb/vid/FondoO2.mp4"
            type="video/mp4"
            media="(min-width: 1424px)"
          />
        </video>
      </motion.div>
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
      <div className="relative text-center text-white px-4 sm:px-6 lg:px-8 z-20 flex flex-col items-center justify-center h-full">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-heading font-bold italic uppercase text-[34px] sm:text-[45px] md:text-[59px] leading-none tracking-[-0.767px] mb-4"
        >
          <TypingEffect
            text={["Be Happy", "Be Gloove"]}
            speed={100}
            eraseSpeed={50}
            typingDelay={500}
            eraseDelay={1000}
            displayTextRenderer={(text: string, i: number) => (
              <span key={i}>
                {text.split("").map((char, j) => (
                  <span key={j}>{char}</span>
                ))}
              </span>
            )}
          />
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-sans font-semibold italic text-[16px] sm:text-[18px] md:text-[20px] tracking-[0.4px]"
        >
          Tu gestor turístico de confianza
        </motion.p>
        <motion.button
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
          }}
          className="mt-8 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Descubre más
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
