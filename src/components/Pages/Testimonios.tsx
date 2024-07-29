import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Testimonios: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const testimonios = [
    {
      id: 1,
      texto: "Excelente servicio, muy satisfecho!",
      autor: "Juan Pérez",
    },
    {
      id: 2,
      texto: "Una experiencia inolvidable, altamente recomendado.",
      autor: "María López",
    },
    // Añade más testimonios aquí
  ];

  return (
    <section
      id="testimonios"
      className="h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-background px-4"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="text-center max-w-3xl"
      >
        <h2 className="text-2xl md:text-3xl font-bold dark:text-dark-text">
          Testimonios
        </h2>
        <div className="mt-6">
          <Slider {...settings}>
            {testimonios.map((testimonio) => (
              <div key={testimonio.id} className="p-4">
                <p className="text-lg dark:text-dark-text">
                  {testimonio.texto}
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  - {testimonio.autor}
                </p>
              </div>
            ))}
          </Slider>
        </div>
      </motion.div>
    </section>
  );
};

export default Testimonios;
