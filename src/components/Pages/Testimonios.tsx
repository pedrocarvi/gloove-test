import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import Quote from "/RecursosWeb/img/blockquote.svg";

const reviews = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "John Doe",
    text: "I was extremely pleased with the quality of the product. It exceeded my expectations and provided great value for the price.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Jane Smith",
    text: "The customer service was excellent. They were responsive and helpful throughout the entire process, making it a smooth experience for me.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Alex Johnson",
    text: "The attention to detail in their work is impressive. Every aspect of the project was handled with precision and care. I highly recommend their services.",
  },
  {
    id: 4,
    image:
      "https://plus.unsplash.com/premium_photo-1671823917954-dc943c1bd9df?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Emily Davis",
    text: "The team demonstrated a deep understanding of my requirements. They were able to capture the essence of my vision and deliver a product that exceeded my expectations.",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "David Miller",
    text: "The product not only met but exceeded my expectations. It's clear that the team is dedicated to delivering high-quality work. I'm a satisfied customer.",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-gradient-to-r from-blue-700 to-teal-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-white mb-4">Testimonios</h2>
        <p className="text-lg text-teal-100">
          Lo que nuestros clientes dicen sobre nosotros.
        </p>
      </div>

      <div className="mt-12 relative">
        <Splide
          options={{
            perPage: 1,
            autoplay: true,
            speed: 1000,
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
