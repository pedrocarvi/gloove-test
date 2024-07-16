import React from "react";
import { Link } from "react-router-dom";
import ReservationProcess from "./ReservationProcess";
import { FiBell, FiEdit } from "react-icons/fi";

const Dashboard = () => {
  return (
    <div className="overflow-auto p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mi Reserva */}
        <section className="lg:col-span-2 bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-primary-dark">
            Mi Reserva
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <img
                src="/casa.jpg"
                alt="Living Room"
                className="rounded-md w-full h-48 object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <img
                src="/salon.jpg"
                alt="Room"
                className="rounded-md h-24 object-cover"
              />
              <img
                src="/cama.jpg"
                alt="Room"
                className="rounded-md h-24 object-cover"
              />
              <img
                src="/habitacion.jpg"
                alt="Room"
                className="rounded-md h-24 object-cover"
              />
              <img
                src="/dormitorio.jpg"
                alt="Room"
                className="rounded-md h-24 object-cover"
              />
            </div>
          </div>
        </section>

        {/* Últimas Reservas */}
        <section className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-primary-dark">
            Últimas Reservas
          </h2>
          <p>Aquí puedes ver las últimas reservas realizadas en tu vivienda.</p>
          <p>
            Mantente al tanto de todas las actividades recientes y gestiona tus
            reservas de manera eficiente.
          </p>
        </section>

        {/* Proceso de Reserva */}
        <section className="lg:col-span-2 bg-white p-6 shadow-lg rounded-lg">
          <Link to="/reservation-process" className="text-primary font-bold">
            <ReservationProcess />
          </Link>
        </section>

        {/* Gloove Points y otros paneles */}
        <div className="grid grid-cols-1 gap-6">
          {/* Gloove Points */}
          <Link
            to="/points"
            className="block bg-white p-6 shadow-lg rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold mb-4 text-primary-dark">
              Gloove Points
            </h2>
            <div className="flex items-center space-x-4">
              <span className="bg-yellow-400 text-white px-4 py-2 rounded-md">
                POINT
              </span>
              <p className="text-gray-700">
                Acumula puntos Gloove con cada reserva y canjéalos por
                descuentos y beneficios exclusivos.
              </p>
            </div>
          </Link>

          {/* Notificaciones */}
          <Link
            to="/notifications"
            className="block bg-white p-6 shadow-lg rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold mb-4 text-primary-dark flex items-center">
              <FiBell className="mr-2" /> Notificaciones
            </h2>
            <p className="text-gray-700">No tienes nuevas notificaciones.</p>
          </Link>

          {/* Perfil del Huésped */}
          <Link
            to="/profile"
            className="block bg-white p-6 shadow-lg rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-2xl font-bold mb-4 text-primary-dark flex items-center">
              <FiEdit className="mr-2" /> Perfil del Huésped
            </h2>
            <p className="text-gray-700">Nombre: Juan Pérez</p>
            <p className="text-gray-700">Correo: juan.perez@example.com</p>
          </Link>
        </div>

        {/* Servicios Adicionales */}
        <section className="lg:col-span-2 bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-primary-dark">
            Servicios Adicionales
          </h2>
          <p className="text-gray-700">
            Aprovecha nuestros servicios adicionales durante tu estancia para
            una experiencia más cómoda y agradable.
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Servicio de limpieza diario</li>
            <li>Desayuno incluido</li>
            <li>Transporte al aeropuerto</li>
            <li>Acceso a gimnasio y spa</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
