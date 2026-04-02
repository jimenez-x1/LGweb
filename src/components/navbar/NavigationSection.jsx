import React from "react";
import { useEduorContext } from "../../context/EduorContext";
import Navlink from "./Navlink";

const NavigationSection = ({ position, navRef }) => {
  const { isMobileNavOpen } = useEduorContext();

  return (
    <div
      ref={navRef}
      className={`collapse navbar-collapse ${isMobileNavOpen ? "show" : ""}`}
      id="navbarNav"
    >
      <ul className={`navbar-nav ${position}`}>
        <li className="nav-item">
          <Navlink href="/">Inicio</Navlink>
        </li>

        <li className="nav-item">
          <Navlink href="/alumnos">Alumnos</Navlink>
        </li>

        <li className="nav-item">
          <Navlink href="/registrar-alumno">Registrar Alumno</Navlink>
        </li>
      </ul>
    </div>
  );
};

export default NavigationSection;