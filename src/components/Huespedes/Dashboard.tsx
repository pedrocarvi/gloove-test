import react, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Dialog } from "@headlessui/react";
import * as xmljs from "xml-js";
import { Link } from "react-router-dom";
import ReservationProcess from "./ReservationProcess";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

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

  // Traigo todas las reservas
  const fetchBookings = async (): Promise<any[]> => {
    // console.log("Entra al fetch bookings de dashboard")
    try {
      const response = await fetch('https://gloove-api-avantio.vercel.app/bookings');
      if (response.ok) {
        const bookings = await response.json();
        console.log("Bookings dashboard", bookings)
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

  // Traigo detalles de la propiedad 
  const getAccomodationDetails = async (id: number): Promise<any> => {
    try {
      const response = await fetch(`https://gloove-api-avantio.vercel.app/accommodations/${id}`);
      if (response.ok) {
        const accommodationDetails = await response.json();
        console.log('Detalles de la propiedad de la ultima reserva:', accommodationDetails.data);
        return accommodationDetails.data;
        // const bookingDetails = await response.json();
        // return bookingDetails.data;
      } else {
        const errorBody = await response.text();
        throw new Error(`Request failed: ${response.status} - ${errorBody}`);
      }
    } catch (error) {
      console.error(`Error al obtener los detalles de la propiedad de la ultima reserva con ID ${id}:`, error);
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

  return (
    <div className="overflow-auto p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-primary-dark">
            Fotos de la Vivienda
          </h2>
          {renderFirstAccommodationPictures()}
        </section>
        <section className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-primary-dark"> Datos de la reserva </h2>
        </section>
        {/* Proceso de Reserva */}
        <section className="lg:col-span-2 bg-white p-6 shadow-lg rounded-lg">
          <Link to="/reservation-process" className="text-primary font-bold">
            <ReservationProcess />
          </Link>
        </section>
        {/* Últimas Reservas */}
        <section className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-primary-dark">
            Últimas Reservas
          </h2>
          <div className="space-y-6">
            {reservas.map((reserva, index) => (
              <div key={reserva.id} className="p-4 bg-white shadow rounded-lg">
                <h4 className="text-lg font-bold text-gray-800">
                  Reserva #{reserva.reference} ({reserva.status})
                </h4>
                <p className="text-gray-600">
                  Desde: <b>{new Date(reserva.stayDates.arrival).toLocaleDateString()}</b>
                  <br />
                  Hasta: <b>{new Date(reserva.stayDates.departure).toLocaleDateString()}</b>
                </p>

                {/* Detalles de la propiedad */}
                {detallesPropiedades[index] ? (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold text-gray-700">Detalles de la Propiedad:</h3>
                    <p className="text-gray-600">{detallesPropiedades[index].name}</p>
                    <p className="text-gray-600">{detallesPropiedades[index].description}</p>
                  </div>
                ) : (
                  <p className="text-gray-600">Cargando detalles de la propiedad...</p>
                )}
              </div>
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
