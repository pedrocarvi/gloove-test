import React, { useState, useEffect } from "react";
// Otros componentes
import ReservationProcess from "./ReservationProcess";
// Routing
import { Link } from "react-router-dom";
// Xml
import * as xmljs from "xml-js";
// Carousel imagenes
import Slider from "react-slick";
import { Dialog } from "@headlessui/react";
// Imagenes / Iconos
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import BathhubIcon from "../../assets/bathtub.png";
import BedroomIcon from "../../assets/bedroom.png";
import HouseIcon from "../../assets/house.png";
import LocationIcon from "../../assets/location-tick.png";
import PersonasIcon from "../../assets/user.png";

const CustomPrevArrow = ({ onClick }: any) => (
  <div
    onClick={onClick}
    className="absolute top-1/2 -left-5 transform -translate-y-1/2 cursor-pointer z-10"
  >
    <FaChevronLeft className="text-black text-xl" />
  </div>
);

const CustomNextArrow = ({ onClick }: any) => (
  <div
    onClick={onClick}
    className="absolute top-1/2 -right-5 transform -translate-y-1/2 cursor-pointer z-10"
  >
    <FaChevronRight className="text-black text-xl" />
  </div>
);

const Dashboard = () => {
  const [viviendas, setViviendas] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reservas, setReservas] = useState<any[]>([]);
  const [detallesPropiedades, setDetallesPropiedades] = useState<any[]>([]);

  const renderFirstAccommodationPictures = () => {
    if (!viviendas.length) return <p>Cargando imágenes...</p>;

    const firstAccommodation = viviendas[0];
    const pictures = firstAccommodation.Pictures?.Picture || [];

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 1,
      arrows: true,
      prevArrow: <CustomPrevArrow />,
      nextArrow: <CustomNextArrow />,
    };

    return (
      <div>
        <Slider {...settings}>
          {pictures.map((picture: any, index: number) => (
            <div key={index} className="p-2">
              <img
                src={picture.AdaptedURI?._text}
                alt={picture.Name?._text || "Imagen"}
                className="rounded-md w-full h-72 object-cover cursor-pointer"
                onClick={() => setSelectedImage(picture.OriginalURI?._text)}
              />
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  const fetchBookings = async (): Promise<any[]> => {
    try {
      const response = await fetch('https://gloove-api-avantio.vercel.app/bookings');
      if (response.ok) {
        const bookings = await response.json();
        return bookings.data;
      } else {
        const errorBody = await response.text();
        throw new Error(`Request failed: ${response.status} - ${errorBody}`);
      }
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
      return [];
    }
  };

  const getAccomodationDetails = async (id: number): Promise<any> => {
    try {
      const response = await fetch(`https://gloove-api-avantio.vercel.app/accommodations/${id}`);
      if (response.ok) {
        const accommodationDetails = await response.json();
        console.log("Informacion de la propiedad", accommodationDetails)
        return accommodationDetails.data;
      } else {
        const errorBody = await response.text();
        throw new Error(`Request failed: ${response.status} - ${errorBody}`);
      }
    } catch (error) {
      console.error(`Error al obtener los detalles de la propiedad con ID ${id}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchViviendas = async () => {
      try {
        const response = await fetch("./descriptions.xml");
        const text = await response.text();

        const result: any = xmljs.xml2js(text, { compact: true });
        const accommodations = result.AccommodationList?.Accommodation || [];
        setViviendas(accommodations);
      } catch (error) {
        console.error("Error al procesar el XML:", error);
      }
    };

    fetchViviendas();
  }, []);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      const allBookings = await fetchBookings();

      const sortedBookings = allBookings.sort(
        (a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      const lastThreeBookings = sortedBookings.slice(0, 3);
      setReservas(lastThreeBookings);

      const propertyDetailsPromises = lastThreeBookings.map((booking: any) =>
        getAccomodationDetails(booking.accommodationId)
      );

      const propertiesDetails = await Promise.all(propertyDetailsPromises);
      setDetallesPropiedades(propertiesDetails);
    };

    fetchAndProcessData();
  }, []);

  const latestPropertyDetails = detallesPropiedades[0]; // Detalles de la última propiedad

  return (
    <div className="overflow-auto p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-3 bg-white p-6 shadow-sm rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-primary-dark">Vivienda reservada</h2>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Property Details - Left Side (40%) */}
            <div className="lg:col-span-2">
              {latestPropertyDetails ? (
                <div className="space-y-4">
                  <p><strong>Nombre:</strong> {latestPropertyDetails.name}</p>
                  <div className="flex items-center gap-2">
                    <img src={HouseIcon} alt="house" width={20} />
                    <p>
                      <strong>Tipo:</strong> {latestPropertyDetails.type === "APARTMENT" ? "Departamento" : latestPropertyDetails.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={LocationIcon} alt="location" width={20} />
                    <p><strong>Dirección:</strong> {latestPropertyDetails.location.address}, {latestPropertyDetails.location.cityName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={PersonasIcon} alt="personas" width={20} />
                    <p><strong>Capacidad:</strong> {latestPropertyDetails.capacity.maxAdults} adultos, {latestPropertyDetails.capacity.maxChildren} niños</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={BedroomIcon} alt="bedroom" width={20} />
                    <p><strong>Dormitorios:</strong> {latestPropertyDetails.distribution.bedrooms.length}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={BathhubIcon} alt="bahthub" width={20} />
                    <p><strong>Baños:</strong> {latestPropertyDetails.distribution.bathrooms.length}</p>
                  </div>
                </div>
              ) : (
                <p>Cargando detalles de la reserva...</p>
              )}
            </div>

            <div className="lg:col-span-3">
              {renderFirstAccommodationPictures()}
            </div>
          </div>
        </section>
        {/* Proceso de Reserva */}
        <section className="lg:col-span-2 bg-white p-6 rounded-lg">
          <Link to="/reservation-process" className="text-primary font-bold">
            <ReservationProcess />
          </Link>
        </section>
        {/* Últimas Reservas */}
        <section className="bg-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-primary-dark">
            Últimas Reservas
          </h2>
          <div className="space-y-6">
            {reservas.map((reserva, index) => (
              <Link 
              key={reserva.id} 
              to={`/mis-reservas/${reserva.id}`}
              className="block hover:shadow-lg transition-shadow duration-200"
            >
                <div key={reserva.id} className="p-4 bg-white shadow-md rounded-lg">
                <h4 className="text-lg font-bold text-gray-800">
                  Reserva #{reserva.reference}
                  <p
                    className={`text-sm font-medium ${reserva.status === "UNPAID"
                      ? "text-red-500"
                      : reserva.status === "CONFIRMED"
                        ? "text-blue-500"
                        : reserva.status === "PAID"
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                  >
                    Estado:{" "}
                    {reserva.status === "UNPAID"
                      ? "No paga"
                      : reserva.status === "CONFIRMED"
                        ? "Confirmada"
                        : reserva.status === "PAID"
                          ? "Paga"
                          : reserva.status}
                  </p>
                </h4>
                <p className="text-gray-600">
                  Desde: <b>{new Date(reserva.stayDates.arrival).toLocaleDateString()}</b>
                  <br />
                  Hasta: <b>{new Date(reserva.stayDates.departure).toLocaleDateString()}</b>
                </p>

                {/* Detalles de la propiedad */}
                {detallesPropiedades[index] ? (
                  <div className="d-flex align-items-center gap-1 mt-4">
                    <h3 className="text-md font-semibold text-gray-700">Propiedad:</h3>
                    <p className="text-gray-600">{detallesPropiedades[index].name}</p>
                  </div>
                ) : (
                  <p className="text-gray-600">Cargando detalles de la propiedad...</p>
                )}
              </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Modal para imagen ampliada */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
            <Dialog.Panel className="bg-white p-4 rounded-lg">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
              <img
                src={selectedImage}
                alt="Imagen Ampliada"
                className="rounded-md w-full h-auto"
              />
            </Dialog.Panel>
          </div>
        </Dialog>
      )}

    </div>
  );
};

export default Dashboard;
