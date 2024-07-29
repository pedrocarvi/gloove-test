import React from "react";
import Navbar from "./Header";
import { useDarkMode } from "../../context/DarkModeContext";
import { motion } from "framer-motion";

import Hero from "./Hero";
import ServicesSection from "./ServicesSection";
import Carousel from "./Carousel";
import FeaturesSection from "./FeaturesSection";
import Inmobiliaria from "./Inmobiliaria";
import Experiencias from "./Experiencias";
import Contacto from "./Contacto";
import Blog from "./Blog";
import Testimonios from "./Testimonios";
import CollaboratorsSection from "./CollaboratorsSection";

const Home: React.FC = () => {
  const { mode } = useDarkMode();

  return (
    <div className={mode === "dark" ? "dark" : ""}>
      <Navbar />
      <section className="min-h-screen">
        <Hero />
      </section>
      <motion.section
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <ServicesSection />
      </motion.section>
      <motion.section
        className="min-h-screen"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <FeaturesSection />
      </motion.section>
      <motion.section
        className="min-h-screen"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <CollaboratorsSection />
      </motion.section>
      <motion.section
        className="min-h-screen"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Experiencias />
      </motion.section>
      <motion.section
        className="min-h-screen"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Contacto />
      </motion.section>
      <motion.section
        className="min-h-screen"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Blog />
      </motion.section>
      <motion.section
        className="min-h-screen"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Testimonios />
      </motion.section>
    </div>
  );
};

export default Home;
