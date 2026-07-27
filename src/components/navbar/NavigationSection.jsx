import React from "react";
import { useEduorContext } from "../../context/EduorContext";
// Hook para acceder al estado global del menú (abierto/cerrado)

import Navlink from "./Navlink";
// Componente personalizado para los enlaces de navegación

const NavigationSection = ({ position, navRef }) => {
  const { isMobileNavOpen } = useEduorContext();
  // Estado que indica si el menú móvil está abierto

  return (
    <div
      ref={navRef}
      className={`collapse navbar-collapse ${isMobileNavOpen ? "show" : ""}`}
      // Controla si el menú está visible en móvil
      id="navbarNav"
    >
      <ul className={`navbar-nav ${position}`}>
        {/* Lista de opciones del menú */}

        <li className="nav-item">
          <Navlink href="/">Inicio</Navlink>
        </li>

        <li className="nav-item">
          <Navlink href="/clase">Clase</Navlink>
        </li>
        

        <li className="nav-item">
          <Navlink href="/grado">Grado</Navlink>
        </li>

        <li className="nav-item">
          <Navlink href="/alumnos">Alumnos</Navlink>
        </li>

        <li className="nav-item">
          <Navlink href="/maestros">Maestros</Navlink>
        </li>

        <li className="nav-item">
          <Navlink href="/pagos">Pagos</Navlink>
        </li>

        <li className="nav-item">
          <Navlink href="/padre">Padres</Navlink>
        </li>
        <li className="nav-item">
          <Navlink href="/archivos">Archivos</Navlink>
        </li>
      </ul>
    </div>
  );
};

export default NavigationSection;