import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Pago",
    description:
      "Para confirmar tu reserva, es necesario realizar el pago. Una vez confirmado, recibirás un correo de confirmación y podrás proceder con los siguientes pasos.",
    icon: <CheckCircleIcon className="h-8 w-8 text-green-500" />,
    status: "completed",
  },
  {
    number: 2,
    title: "Fianza",
    description:
      "Como medida de seguridad, es necesario realizar un depósito de fianza. Este importe será devuelto después de tu estancia si no se han producido daños.",
    icon: <CheckCircleIcon className="h-8 w-8 text-green-500" />,
    status: "completed",
  },
  {
    number: 3,
    title: "Check-in",
    description:
      "Nuestro sistema de check-in te permitirá acceder a la vivienda fácilmente. Recibirás un código que podrás usar para entrar durante tu estancia.",
    icon: <XCircleIcon className="h-8 w-8 text-red-500" />,
    status: "pending",
  },
  {
    number: 4,
    title: "Instrucciones",
    description:
      "Las instrucciones de la vivienda incluyen detalles sobre el uso de los electrodomésticos, normas de la casa y otras informaciones útiles para tu estancia.",
    icon: <XCircleIcon className="h-8 w-8 text-red-500" />,
    status: "pending",
  },
];

const ReservationProcess = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        Estado de la reserva
      </h2>
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
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.3 }}
            className="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg shadow-sm"
          >
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-700 mb-4">{step.description}</p>
            {step.status === "completed" ? (
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                Completado
              </button>
            ) : (
              <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Pendiente
              </button>
            )}
          </motion.div>
        ))}
      </div>
      <div className="mt-6 text-center text-red-600">
        (En el caso de que un proceso no esté completado, se podrá completar
        gracias a la API)
      </div>
      <div className="mt-6 text-center text-gray-600">
        (Tanto instrucciones como el video NO se pueden descargar hasta que no
        esté el proceso completado)
      </div>
    </div>
  );
};

export default ReservationProcess;
