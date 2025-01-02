import { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

// Traigo todas las reservas
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

// Traigo reserva por ID
const fetchBookingById = async (id: number): Promise<any> => {
  try {
    const response = await fetch(`https://gloove-api-avantio.vercel.app/bookings/${id}`);
    if (response.ok) {
      const bookingDetails = await response.json();
      return bookingDetails.data; 
    } else {
      const errorBody = await response.text();
      throw new Error(`Request failed: ${response.status} - ${errorBody}`);
    }
  } catch (error) {
    console.error(`Error al obtener la reserva con ID ${id}:`, error);
    return null;
  }
};

// Traigo los detalles de la ultima reserva
const getLastBookingDetails = async (): Promise<any | null> => {
  try {
    const bookings = await fetchBookings(); 
    if (bookings.length === 0) {
      console.log('No hay reservas disponibles.');
      return null;
    }

    // Ultima reserva
    const lastBooking = bookings[bookings.length - 1];
    
    // Obtener detalles de la última reserva por ID
    const bookingDetails = await fetchBookingById(lastBooking.id);
    if (bookingDetails) {
      console.log('Detalles de la última reserva:', bookingDetails);
      // getLastBookingAccommodationDetails(bookingDetails.accommodation.id)
      return bookingDetails;
    } else {
      console.log('No se pudieron obtener los detalles de la reserva.');
      return null;
    }
  } catch (error) {
    console.error('Error en la lógica principal:', error);
    return null;
  }
};

// Traigo detalles de la propiedad de la ultima reserva
// const getLastBookingAccommodationDetails = async (id: number): Promise<any> => {
//   try {
//     const response = await fetch(`https://gloove-api-avantio.vercel.app/accommodations/${id}`);
//     if (response.ok) {
//       const accommodationDetails = await response.json();
//       // console.log('Detalles de la propiedad de la ultima reserva:', accommodationDetails.data);
//       return accommodationDetails.data;
//       // const bookingDetails = await response.json();
//       // return bookingDetails.data;
//     } else {
//       const errorBody = await response.text();
//       throw new Error(`Request failed: ${response.status} - ${errorBody}`);
//     }
//   } catch (error) {
//     console.error(`Error al obtener los detalles de la propiedad de la ultima reserva con ID ${id}:`, error);
//     return null;
//   }
// };

const ReservationProcess = () => {
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any | null>(null);

  useEffect(() => {
    getLastBookingDetails().then((details) => {
      setBookingDetails(details);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center text-black">Cargando reserva...</div>;
  }

  const bookingPayment = bookingDetails?.payments?.find(
    (payment: any) => payment.type === "BOOKING"
  )
  const isPaid = bookingPayment?.status === "PAID";
  
  const securityDeposit = bookingDetails?.payments?.find(
    (payment: any) => payment.type === "SECURITY_DEPOSIT"
  );
  const isFianzaPaid = securityDeposit?.status === "PAID";

  return (
    <div className="p-6 bg-white rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-black text-center mb-6">Estado de la reserva</h2>
      <div className="w-full bg-gray-200 h-1 rounded-full mb-6">
        <div
          className={`h-1 rounded-full ${
            isPaid ? "bg-green-500" : "bg-red-500"
          }`}
          style={{ width: "50%" }}
        ></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pago */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center p-4 bg-gray-100 rounded-lg shadow-sm"
        >
          <div className="mb-4">
            {isPaid ? (
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            ) : (
              <XCircleIcon className="h-8 w-8 text-red-500" />
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2 text-black ">Pago</h3>
          <p className="text-gray-700 mb-4">
            {isPaid
              ? "El pago ha sido confirmado. Puedes proceder con los siguientes pasos."
              : "Para confirmar tu reserva, es necesario completar el pago en el enlace enviado via WhatsApp."}
          </p>
        </motion.div>
        {/* Fianza */}
        {
          securityDeposit ? 
          <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg shadow-sm"
        >
          <div className="mb-4">
            {isFianzaPaid ? (
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            ) : (
              <XCircleIcon className="h-8 w-8 text-red-500" />
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2 text-black ">Fianza</h3>
          <p className="text-gray-700 mb-4">
            {isFianzaPaid
              ? "La fianza ha sido pagada correctamente. No olvides seguir los siguientes pasos."
              : "Como medida de seguridad, es necesario realizar un depósito de fianza. Este importe será devuelto después de tu estancia si no se han producido daños."}
          </p>
        </motion.div>
        :
        ''
      }
      {/* Check in */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg shadow-sm"
      >
        <div className="mb-4">
          <XCircleIcon className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-black ">Check-In</h3>
        <p className="text-gray-700 mb-4">
          Nuestro sistema de check-in te permitirá acceder a la vivienda
          fácilmente. Recibirás un código que podrás usar para entrar durante
          tu estancia.
        </p>
        <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
          Pendiente
        </button>
      </motion.div>

      {/* Instrucciones */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg shadow-sm"
      >
        <div className="mb-4">
          <XCircleIcon className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-black ">Instrucciones</h3>
        <p className="text-gray-700 mb-4">
          Las instrucciones de la vivienda incluyen detalles sobre el uso de
          los electrodomésticos, normas de la casa y otras informaciones
          útiles para tu estancia.
        </p>
        <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
          Pendiente
        </button>
      </motion.div>
      </div>
    </div>
  );
};

export default ReservationProcess;
