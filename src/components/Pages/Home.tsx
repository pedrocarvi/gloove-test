import React, { Suspense } from "react";
import { useDarkMode } from "../../context/DarkModeContext";
import { motion } from "framer-motion";
import { Element } from "react-scroll"; // Asegúrate de importar sólo Element si no usas Link
import Loader from "./Loader";

const Header = React.lazy(() => import("./Header"));
const Hero = React.lazy(() => import("./Hero"));
const ServicesSection = React.lazy(() => import("./ServicesSection"));
const FeaturesSection = React.lazy(() => import("./FeaturesSection"));
const Footer = React.lazy(() => import("./Footer"));
const Contacto = React.lazy(() => import("./Contacto"));

const Home: React.FC = () => {
  const { mode } = useDarkMode();

  return (
    <div className={mode === "dark" ? "dark" : ""}>
      <Suspense fallback={<Loader />}>
        <Header />
        <Element name="inicio">
          <motion.div
            id="inicio"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Hero />
          </motion.div>
        </Element>

        <Element name="servicios">
          <motion.section id="servicios">
            <ServicesSection />
          </motion.section>
        </Element>

        <motion.section
          id="nosotros"
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
        <Element name="nosotros">
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <FeaturesSection />
          </motion.section>
        </Element>

        <Element name="contacto">
          <motion.section
            id="contacto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Contacto />
          </motion.section>
        </Element>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Footer />
        </motion.section>
      </Suspense>
    </div>
  );
};

export default Home;
