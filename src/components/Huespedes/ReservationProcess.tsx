// import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
// import { motion } from "framer-motion";

// const steps = [
//   {
//     number: 1,
//     title: "Pago",
//     description:
//       "Para confirmar tu reserva, es necesario realizar el pago. Una vez confirmado, recibirás un correo de confirmación y podrás proceder con los siguientes pasos.",
//     icon: <CheckCircleIcon className="h-8 w-8 text-green-500" />,
//     status: "completed",
//   },
//   {
//     number: 3,
//     title: "Check-in",
//     description:
//       "Nuestro sistema de check-in te permitirá acceder a la vivienda fácilmente. Recibirás un código que podrás usar para entrar durante tu estancia.",
//     icon: <XCircleIcon className="h-8 w-8 text-red-500" />,
//     status: "pending",
//   },
//   {
//     number: 4,
//     title: "Instrucciones",
//     description:
//       "Las instrucciones de la vivienda incluyen detalles sobre el uso de los electrodomésticos, normas de la casa y otras informaciones útiles para tu estancia.",
//     icon: <XCircleIcon className="h-8 w-8 text-red-500" />,
//     status: "pending",
//   },
// ];

// const ReservationProcess = () => {
//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold text-center mb-6">
//         Estado de la reserva
//       </h2>
//       <div className="w-full bg-gray-200 h-1 rounded-full mb-6">
//         <div
//           className="bg-green-500 h-1 rounded-full"
//           style={{ width: "50%" }}
//         ></div>
//       </div>
//       <p className="text-center mb-6">
//         ¡Bienvenidos a nuestro sistema de reservas! Queremos asegurarnos de que
//         tu experiencia sea lo más sencilla y agradable posible. A continuación,
//         te presentamos los pasos que debes seguir para completar tu reserva. Es
//         muy importante que sigas cada uno de ellos para garantizar un proceso
//         fluido y sin inconvenientes.
//       </p>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {steps.map((step, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: index * 0.3 }}
//             className="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg shadow-sm"
//           >
//             <div className="mb-4">{step.icon}</div>
//             <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
//             <p className="text-gray-700 mb-4">{step.description}</p>
//             {step.status === "completed" ? (
//               <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
//                 Completado
//               </button>
//             ) : (
//               <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
//                 Pendiente
//               </button>
//             )}
//           </motion.div>
//         ))}
//       </div>
//       <div className="mt-6 text-center text-red-600">
//         (En el caso de que un proceso no esté completado, se podrá completar
//         gracias a la API)
//       </div>
//       <div className="mt-6 text-center text-gray-600">
//         (Tanto instrucciones como el video NO se pueden descargar hasta que no
//         esté el proceso completado)
//       </div>
//     </div>
//   );
// };

// export default ReservationProcess;

import { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

// Modelo de la reserva. Cuando tengamos la respuesta del endpoint oficial, lo modifico según la response y lo guardo en otro archivo.
interface Reserva {
  id: number;
  isPaga: boolean;
  isFianza: boolean;
}

// Simulación API llamando a todas las reservas
const fetchBookings = async (): Promise<Reserva[]> => {
  try {
    // Simulo URL Api
    // const response = await fetch('https://avantio.com/all-bookings', {
    //   method: 'GET', 
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer TOKEN' // TOKEN del usuario
    //     // Agregar headers necesarios del endpoint - docu avantio.
    //   },
    // });

    // if (!response.ok) {
    //   throw new Error(`Error en la solicitud: ${response.status}`);
    // }

    // // Respuesta original
    // const bookings = await response.json();

    // Hardcodeo la respuesta:
    const bookingsHardcoded: Reserva[] = [
      // Según lo visto, se SUPONE que cada reserva trae la propiedad de si está pagada, afianzada, etc.
      { id: 1, isPaga: true, isFianza: true },
      { id: 2, isPaga: true, isFianza: false },
      // Usa esta
      { id: 3, isPaga: true, isFianza: true },
    ];

    return bookingsHardcoded;
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    return [];
  }
};

const ReservationProcess = () => {
  const [lastReserva, setLastReserva] = useState<Reserva | null>(null);
  const [loading, setLoading] = useState(true);

  // Me traigo la última reserva de todas las reservas (suponiendo que la última es la más reciente).

  // Sino se puede filtrar la response de allBookings por la reserva más reciente.

  // Esto es algo que se tiene que analizar, porque en la pantalla aparece el proceso para 1 sola reserva, pero que pasa si el usuario hizo mas de 1 reserva? Por ej. una persona que hacer un viaje largo y viaja 7 dias a Paris y 7 dìas a Roma, posiblemente quiera hacer las reservas de alojamiento antes de partir, para tener todo organizado.
  useEffect(() => {
    fetchBookings().then((data) => {
      const latestBooking = data[data.length - 1]; 
      setLastReserva(latestBooking);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center">Cargando reserva...</div>;
  }

  if (!lastReserva) {
    return <div className="text-center">No se encontró ninguna reserva.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Estado de la reserva</h2>
      <div className="w-full bg-gray-200 h-1 rounded-full mb-6">
        <div
          className="bg-green-500 h-1 rounded-full"
          style={{ width: "50%" }}
        ></div>
      </div>
      <p className="text-center mb-6">
        ¡Bienvenidos a nuestro sistema de reservas! Queremos asegurarnos de que
        tu experiencia sea lo más sencilla y agradable posible. A continuación,
        te presentamos los pasos que debes seguir para completar tu reserva. Es
        muy importante que sigas cada uno de ellos para garantizar un proceso
        fluido y sin inconvenientes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pago */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg shadow-sm"
        >
          <div className="mb-4">
            {lastReserva.isPaga ? (
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            ) : (
              <XCircleIcon className="h-8 w-8 text-red-500" />
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2">Pago</h3>
          <p className="text-gray-700 mb-4">
            {lastReserva.isPaga
              ? "El pago ha sido completado."
              : "Para confirmar tu reserva, es necesario realizar el pago. Una vez confirmado, recibirás un correo de confirmación y podrás proceder con los siguientes pasos."}
          </p>

          {/* Si el usuario realizó el pago, entonces mostramos el botón como completado, pero sino lo dirijo al link para que realice el pago  */}
          {lastReserva.isPaga ? (
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
              Completado
            </button>
          ) : (
            <a
              href={`https://avantio.com/booking-payment/${lastReserva.id}`}
              target="_blank"
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Completar
            </a>
          )}
        </motion.div>

        {/* Fianza */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg shadow-sm"
        >
          <div className="mb-4">
            {lastReserva.isFianza ? (
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            ) : (
              <XCircleIcon className="h-8 w-8 text-red-500" />
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2">Fianza</h3>
          <p className="text-gray-700 mb-4">
            {lastReserva.isFianza
              ? "La fianza ha sido completada."
              : "Como medida de seguridad, es necesario realizar un depósito de fianza. Este importe será devuelto después de tu estancia si no se han producido daños."}
          </p>
          {/* Si el usuario realizó la fianza, entonces mostramos el botón como completado, pero sino lo dirijo al link para que realice la fianza  */}
          {lastReserva.isFianza ? (
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
              Completado
            </button>
          ) : (
            <a
              href={`https://avantio.com/booking-fianza/${lastReserva.id}`}
              target="_blank"
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Completar
            </a>
          )}
        </motion.div>

        {/* Check in */}
        {/* La logica del check in se realiza con otra API. */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg shadow-sm"
        >
          <div className="mb-4">
            <XCircleIcon className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Check-In</h3>
          <p className="text-gray-700 mb-4">
            Nuestro sistema de check-in te permitirá acceder a la vivienda fácilmente. Recibirás un código que podrás usar para entrar durante tu estancia.          
          </p>          
          <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            Pendiente
          </button>
        </motion.div>

        {/* Instrucciones */}
        {/* Definir */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg shadow-sm"
        >
          <div className="mb-4">
            <XCircleIcon className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">-Instrucciones</h3>
          <p className="text-gray-700 mb-4">
            Las instrucciones de la vivienda incluyen detalles sobre el uso de los electrodomésticos, normas de la casa y otras informaciones útiles para tu estancia.
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
