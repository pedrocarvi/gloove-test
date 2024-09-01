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
    <section className="py-20 bg-gradient-to-r from-[#F6F7F5] to-[#E8E9E7] px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-gloovePrimary-dark mb-6">
          Testimonios
        </h2>
        <p className="text-lg md:text-xl text-glooveSecondary-dark mb-12">
          Lo que nuestros clientes dicen sobre nosotros.
        </p>
      </div>

      <div className="relative">
        <Splide
          options={{
            perPage: 1,
            autoplay: true,
            interval: 4000, // Intervalo de 4 segundos entre los testimonios
            speed: 800, // Velocidad de transición ajustada a 0.8 segundos
            rewind: true,
            rewindByDrag: true,
            arrows: false,
            pagination: true,
            type: "loop",
            gap: "2rem",
            breakpoints: {
              640: {
                gap: "1rem",
              },
            },
          }}
        >
          {reviews.map((review) => (
            <SplideSlide
              key={review.id}
              className="flex flex-col items-center text-center"
            >
              <div className="relative">
                <img
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  src={review.image}
                  alt={review.name}
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gloovePrimary-dark rounded-full flex items-center justify-center">
                  <img
                    className="w-4 h-4 transform rotate-180"
                    src={Quote}
                    alt="quote"
                  />
                </div>
              </div>
              <div className="bg-white shadow-xl rounded-lg p-8 mt-6 w-full max-w-2xl transition-transform transform hover:scale-105">
                <p className="text-gray-700 text-lg md:text-xl mb-6 leading-relaxed">
                  "{review.text}"
                </p>
                <p className="text-gray-600 text-base md:text-lg font-semibold">
                  {review.name}
                </p>
                <div className="flex justify-center text-yellow-500 mt-4">
                  {[...Array(5)].map((_, index) => (
                    <FaStar key={index} size={20} />
                  ))}
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </section>
  );
};

export default Testimonials;
