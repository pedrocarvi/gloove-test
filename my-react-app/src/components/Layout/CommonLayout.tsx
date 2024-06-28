import React from 'react';
import { Outlet } from 'react-router-dom';
import './CommonLayout.css';

interface CommonLayoutProps {
  role: 'Huésped' | 'Propietario' | 'Empleado';
}

const CommonLayout: React.FC<CommonLayoutProps> = ({ role }) => {
  return (
    <div className="common-layout">
      <aside className="sidebar">
        <div className="logo-placeholder">Logo</div>
        <nav>
          <ul>
            {role === 'Huésped' && (
              <>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/reservation">Proceso de Reserva</a></li>
                <li><a href="/chat">Chat</a></li>
                <li><a href="/open-property">Abrir Vivienda</a></li>
                <li><a href="/incidents">Incidencias</a></li>
                <li><a href="/profile">Mi Perfil</a></li>
                <li><a href="/settings">Configuraciones</a></li>
                <li><a href="/help">Help</a></li>
              </>
            )}
            {role === 'Propietario' && (
              <>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/property-form">Alta de Vivienda</a></li>
                <li><a href="/properties">Mis Viviendas</a></li>
                <li><a href="/chat">Chat</a></li>
                <li><a href="/documents">Mi Documentación</a></li>
                <li><a href="/notifications">Notificaciones</a></li>
                <li><a href="/profile">Mi Perfil</a></li>
                <li><a href="/settings">Configuraciones</a></li>
                <li><a href="/help">Help</a></li>
              </>
            )}
            {role === 'Empleado' && (
              <>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/owners">Propietarios</a></li>
                <li><a href="/guests">Huéspedes</a></li>
                <li><a href="/notifications">Notificaciones</a></li>
                <li><a href="/profile">Perfil</a></li>
                <li><a href="/settings">Configuraciones</a></li>
                <li><a href="/help">Help</a></li>
              </>
            )}
          </ul>
        </nav>
      </aside>
      <header className="header">
        <div className="user-info">
          <div className="user-photo-placeholder">Photo</div>
          <div>
            <span className="role">{role}</span>
            <span className="welcome-message">Hola XXXXX</span>
          </div>
        </div>
        <button className="ask-button">
          <span>Pregúntanos</span>
        </button>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default CommonLayout;

