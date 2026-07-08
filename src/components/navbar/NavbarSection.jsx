import { useEduorContext } from "../../context/EduorContext";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import NavigationSection from "./NavigationSection";

const NavbarSection = ({ style, logo }) => {
  const {
    isHeaderFixed,
    handleMobileNavOpen,
    isMobileNavOpen,
    handleMobileNavClose,
    setIsMobileNavOpen,
  } = useEduorContext();

  const navMenuRef = useRef(null);

const navigate = useNavigate();

const cerrarSesion = () => {
  localStorage.removeItem("SECURE");
  navigate("/login");
};

  useEffect(() => {
    const handleClickOutside = (event) => {
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
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileNavOpen, setIsMobileNavOpen]);

  return (
    <nav
      className={`navbar navbar-expand-lg main_menu ${style} ${
        isHeaderFixed ? "menu_fix" : ""
      }`}
      ref={navMenuRef}
    >
      <div className="container-fluid custom-navbar-container">
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

        {isMobileNavOpen ? (
          <button
            className="navbar-toggler"
            type="button"
            onClick={handleMobileNavClose}
          >
            <i className="fa fa-times close_icon"></i>
          </button>
        ) : (
          <button
            className="navbar-toggler"
            type="button"
            onClick={handleMobileNavOpen}
          >
            <i className="fa fa-bars menu_icon"></i>
          </button>
        )}

        <div className="d-flex align-items-center ms-auto">

  <NavigationSection
    position=""
    btnPosition={false}
    navRef={navMenuRef}
  />

  <div className="dropdown ms-3">
    <button
  className="btn btn-primary rounded-circle"
  type="button"
  data-bs-toggle="dropdown"
  aria-expanded="false"
>
  <i className="fas fa-user"></i>
</button>

    <ul className="dropdown-menu dropdown-menu-end">
      <li>
        <button
          className="dropdown-item text-danger"
          onClick={cerrarSesion}
        >
          <i className="fas fa-sign-out-alt me-2"></i>
          Cerrar sesión
        </button>
      </li>
    </ul>
  </div>

</div>
      </div>
    </nav>
  );
};

export default NavbarSection;