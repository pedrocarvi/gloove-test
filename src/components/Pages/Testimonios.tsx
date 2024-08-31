import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import { FaStar } from "react-icons/fa";
import Quote from "/RecursosWeb/img/blockquote.svg";

const reviews = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Veronika771 G. M.",
    text: `Alojamiento Calas Beach Santa Pola, estancia del 23 al 26 de diciembre. Dos adultos y un perro.
    Las indicaciones para encontrar la vivienda fueron perfectas. El apartamento estaba limpio y bien dotado de los elementos necesarios para una estancia cómoda, con todo en perfecto funcionamiento.
    Las vistas al mar desde la terraza en plenas navidades fueron de lo más reconfortante para nosotros. Relación calidad-precio para tres noches en Navidad (291 euros) me pareció correcto.`,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Ana Maria Craciun",
    text: `El personal es encantador, siempre dispuesto a ayudar y a brindar confort y comodidad al huésped. La decoración es de muy buen gusto y la higiene es impecable. Muy recomendable, sin duda volveremos.`,
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-[#F6F7F5] px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gloovePrimary-dark mb-4">
          Testimonios
        </h2>
        <p className="text-lg md:text-xl text-glooveSecondary-dark">
          Lo que nuestros clientes dicen sobre nosotros.
        </p>
      </div>

      <div className="mt-12 relative">
        <Splide
          options={{
            perPage: 1,
            autoplay: true,
            interval: 3000, // Intervalo de 3 segundos entre los testimonios
            speed: 500, // Velocidad de transición ajustada a 0.5 segundos
            rewind: true,
            rewindByDrag: true,
            arrows: false,
            pagination: true,
            type: "loop",
            gap: "1rem",
            breakpoints: {
              640: {
                gap: "0.5rem",
              },
            },
          }}
        >
          {reviews.map((review) => (
            <SplideSlide
              key={review.id}
              className="flex flex-col items-center text-center"
            >
              <img
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-white mb-4"
                src={review.image}
                alt={review.name}
              />
              <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <p className="text-gray-700 text-sm md:text-base mb-4">
                  "{review.text}"
                </p>
                <p className="text-gray-600 text-xs md:text-sm">
                  {review.name}
                </p>
                {/* Añadir 5 estrellas */}
                <div className="flex justify-center text-yellow-400 mt-2">
                  {[...Array(5)].map((_, index) => (
                    <FaStar key={index} />
                  ))}
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
        <blockquote className="flex justify-center items-center mt-4 opacity-20">
          <img
            className="w-10 h-10 transform rotate-180"
            src={Quote}
            alt="quote"
          />
        </blockquote>
      </div>
    </section>
  );
};

export default Testimonials;
