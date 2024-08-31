import React from "react";
import { motion } from "framer-motion";
import TypingEffect from "react-typing-effect";

const Hero: React.FC = () => {
  const handleScrollToContact = () => {
    const contactSection = document.getElementById("contacto");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

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
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="RecursosWeb/vid/img.jpg" // Aquí defines la imagen que se mostrará antes de cargar el video
        >
          <source
            src="RecursosWeb/vid/FondoM.mp4"
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source
            src="RecursosWeb/vid/FondoT.mp4"
            type="video/mp4"
            media="(min-width: 768px) and (max-width: 1023px)"
          />
          <source
            src="RecursosWeb/vid/FondoO.mp4"
            type="video/mp4"
            media="(min-width: 1024px) and (max-width: 1423px)"
          />
          <source
            src="RecursosWeb/vid/FondoO2.mp4"
            type="video/mp4"
            media="(min-width: 1424px)"
          />
          <source
            src="RecursosWeb/vid/FondoM.webm"
            type="video/webm"
            media="(min-width: 1424px)"
          />
          <img
            src="RecursosWeb/vid/img.jpg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </video>
      </motion.div>
      <div className="relative text-center text-white px-4 sm:px-6 lg:px-8 z-20 flex flex-col items-center justify-center h-full">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-heading font-bold italic uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tighter mb-6"
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
          className="font-sans font-semibold italic text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-normal mb-8"
        >
          Tu gestor turístico de confianza
        </motion.p>
        <motion.button
          whileHover={{
            scale: 1.2,
            boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.2)",
          }}
          className="mt-8 bg-gradient-to-r from-gloovePrimary via-gloovePrimary-dark to-glooveAccent text-white font-bold py-4 px-10 rounded-full transition duration-300 hover:scale-105 animate-pulse"
          onClick={handleScrollToContact}
        >
          DESCUBRE MÁS
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
