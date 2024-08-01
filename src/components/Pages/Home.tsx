import React from "react";
import Header from "./Header";
import { useDarkMode } from "../../context/DarkModeContext";
import { motion } from "framer-motion";

import Hero from "./Hero";
import ServicesSection from "./ServicesSection";
import FeaturesSection from "./FeaturesSection";
import Footer from "./Footer";
import Experiencias from "./Experiencias";
import Contacto from "./Contacto";
import Blog from "./Blog";
import Testimonios from "./Testimonios";
import CollaboratorsSection from "./CollaboratorsSection";

const Home: React.FC = () => {
  const { mode } = useDarkMode();

  return (
    <div className={mode === "dark" ? "dark" : ""}>
      <Header />
      <Hero />

      <ServicesSection />

      <motion.section
        className="min-h-screen py-16 relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <video
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          src="/RecursosWeb/vid/grabacion_grande.mov"
          autoPlay
          loop
          muted
          playsInline
        />
        <video
          className="absolute inset-0 w-full h-full object-cover md:hidden"
          src="/RecursosWeb/vid/sm6.mov"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="relative z-10"></div>
      </motion.section>
      <FeaturesSection />

      <Contacto />
      <motion.section
        className=" "
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Footer />
      </motion.section>
    </div>
  );
};

export default Home;
