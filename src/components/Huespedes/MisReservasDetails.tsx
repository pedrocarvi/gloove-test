import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const MisReservasDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [reserva, setReserva] = useState<any>(null);
    const [detallePropiedad, setDetallePropiedad] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReserva = async (reservaId: string) => {
        try {
            const response = await fetch(`https://gloove-api-avantio.vercel.app/bookings/${reservaId}`);
            if (response.ok) {
                const data = await response.json();
                return data.data;
            } else {
                const errorBody = await response.text();
                throw new Error(`Request failed: ${response.status} - ${errorBody}`);
            }
        } catch (error) {
            console.error(`Error al obtener la reserva con ID ${reservaId}:`, error);
            throw error;
        }
    };

    const fetchDetallePropiedad = async (accommodationId: number) => {
        try {
            const response = await fetch(`https://gloove-api-avantio.vercel.app/accommodations/${accommodationId}`);
            if (response.ok) {
                const data = await response.json();
                return data.data;
            } else {
                const errorBody = await response.text();
                throw new Error(`Request failed: ${response.status} - ${errorBody}`);
            }
        } catch (error) {
            console.error(`Error al obtener los detalles de la propiedad con ID ${accommodationId}:`, error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const fetchedReserva = await fetchReserva(id!);
                console.log("Reserva que trae", fetchedReserva);
                setReserva(fetchedReserva);

                if (fetchedReserva.accommodation && fetchedReserva.accommodation.id) {
                    const fetchedDetallePropiedad = await fetchDetallePropiedad(fetchedReserva.accommodation.id);
                    setDetallePropiedad(fetchedDetallePropiedad);
                } else {
                    setError("La reserva no contiene información de la propiedad.");
                }

                setLoading(false);
            } catch (err) {
                setError("Error al cargar los datos. Por favor, intente nuevamente.");
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <p className="text-center text-gray-500">Cargando...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="mis-reservas-page">
            <h1 className="text-3xl font-bold text-center mb-6">
                Detalles de la Reserva #{reserva.reference}
            </h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Información de la Reserva</h2>
                <p className="text-gray-700">
                    <strong>Estado:</strong> {reserva.status}
                </p>
                <p className="text-gray-700">
                    <strong>Desde:</strong> {new Date(reserva.stayDates.arrival).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                    <strong>Hasta:</strong> {new Date(reserva.stayDates.departure).toLocaleDateString()}
                </p>
                <h2 className="text-2xl font-semibold mt-6 mb-4">Detalles de la Propiedad</h2>
                {detallePropiedad ? (
                    <div>
                        <p className="text-gray-700">
                            <strong>Nombre:</strong> {detallePropiedad.name}
                        </p>
                        <p className="text-gray-700">
                            <strong>Ubicación:</strong>
                            {detallePropiedad.location
                                ? `${detallePropiedad.location.address}, ${detallePropiedad.location.cityName}, ${detallePropiedad.location.countryCode}`
                                : "Ubicación no disponible"}
                        </p>
                        <p className="text-gray-700">
                            <strong>Descripción:</strong> {detallePropiedad.description}
                        </p>
                    </div>

                ) : (
                    <p className="text-gray-500">No se encontraron detalles de la propiedad.</p>
                )}
            </div>
        </div>
    );
};

export default MisReservasDetails;
