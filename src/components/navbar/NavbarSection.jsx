import { useEduorContext } from "../../context/EduorContext";
// Hook del contexto para manejar estado del navbar (abierto, cerrado, fijo, etc.)

import { Link } from "react-router-dom";
// Permite navegar sin recargar la página

import React, { useEffect, useRef } from "react";
import NavigationSection from "./NavigationSection";
// Componente donde están los links del menú

const NavbarSection = ({ style, logo }) => {
  const {
    isHeaderFixed, // Indica si el navbar está fijo al hacer scroll
    handleMobileNavOpen, // Abre menú en móvil
    isMobileNavOpen, // Estado del menú móvil
    handleMobileNavClose, // Cierra menú móvil
    setIsMobileNavOpen, // Cambia estado del menú móvil
  } = useEduorContext();

  const navMenuRef = useRef(null); 
  // Referencia al navbar para detectar clics fuera de él

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si se hace clic fuera del menú y está abierto, lo cierra
      if (
        navMenuRef.current &&
        !navMenuRef.current.contains(event.target) &&
        isMobileNavOpen
      ) {
        setIsMobileNavOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Limpia el evento al desmontar el componente
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileNavOpen, setIsMobileNavOpen]);

  return (
    <nav
      className={`navbar navbar-expand-lg main_menu ${style} ${
        isHeaderFixed ? "menu_fix" : ""
      }`}
      // Aplica clase extra si el navbar está fijo
      ref={navMenuRef}
    >
      <div className="container-fluid custom-navbar-container">

        {/* Logo y nombre de la escuela */}
        <Link className="navbar-brand custom-brand" to="/">
          <img
            src={logo}
            alt="Escuela Luis Gamero"
            className="brand-logo"
          />
          <div className="brand-text">
            <h4>ESCUELA LUIS GAMERO</h4>
            <span>Sistema Escolar</span>
          </div>
        </Link>

        {/* Botón de menú en móvil */}
        {isMobileNavOpen ? (
          <button
            className="navbar-toggler"
            type="button"
            onClick={handleMobileNavClose}
          >
            <i className="fa fa-times close_icon"></i>
            {/* Icono de cerrar */}
          </button>
        ) : (
          <button
            className="navbar-toggler"
            type="button"
            onClick={handleMobileNavOpen}
          >
            <i className="fa fa-bars menu_icon"></i>
            {/* Icono de menú */}
          </button>
        )}

        {/* Sección de navegación (links) */}
        <NavigationSection
          position="ms-auto"
          btnPosition={false}
          navRef={navMenuRef}
        />
      </div>
    </nav>
  );
};

export default NavbarSection;