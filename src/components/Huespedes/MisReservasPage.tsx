import React, { useState, useEffect } from "react";
// Routing
import { Link } from "react-router-dom";

const MisReservas: React.FC = () => {

    const [reservas, setReservas] = useState<any[]>([]);
    const [detallesPropiedades, setDetallesPropiedades] = useState<any[]>([]);

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
        const fetchAndProcessData = async () => {
            const allBookings = await fetchBookings();

            const sortedBookings = allBookings.sort(
                (a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );

            setReservas(sortedBookings);
            console.log("Reservas", reservas);

            const propertyDetailsPromises = sortedBookings.map((booking: any) =>
                getAccomodationDetails(booking.accommodationId)
            );


            const propertiesDetails = await Promise.all(propertyDetailsPromises);
            setDetallesPropiedades(propertiesDetails);
            console.log("Properties details", propertiesDetails);
        };

        fetchAndProcessData();
    }, []);

    return (
        <div className="mis-reservas-page">
            <h1 className="text-3xl font-bold text-center mb-6">
                Reservas realizadas
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {reservas.map((reserva, index) => (
                    <Link
                        to={`/mis-reservas/${reserva.id}`}
                        key={reserva.id}
                        className="block bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="p-6">
                            <h4 className="text-xl font-bold text-gray-800 mb-2">
                                Reserva #{reserva.reference}
                            </h4>
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
                            <div className="mt-4">
                                <p className="text-gray-600">
                                    <span className="font-medium text-gray-800">Desde:</span>{" "}
                                    {new Date(reserva.stayDates.arrival).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium text-gray-800">Hasta:</span>{" "}
                                    {new Date(reserva.stayDates.departure).toLocaleDateString()}
                                </p>
                            </div>
                            {detallesPropiedades[index] ? (
                                <div className="mt-4">
                                    <h5 className="text-md font-semibold text-gray-700">Propiedad:</h5>
                                    <p className="text-gray-600">{detallesPropiedades[index].name}</p>
                                </div>
                            ) : (
                                <p className="text-gray-600 mt-4">Cargando detalles de la propiedad...</p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
};

export default MisReservas;
