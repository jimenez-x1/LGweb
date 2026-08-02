import { Link, useNavigate } from "react-router-dom";
import React from "react";
import NavigationSection from "./NavigationSection";

const NavbarSection = ({ style, logo }) => {

  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("SECURE");
    localStorage.removeItem("ROL");
    localStorage.removeItem("USER_ID");
    navigate("/");
  };

  return (
    <nav className={`navbar navbar-expand-lg main_menu ${style}`}>
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

      <div
          className="dropdown"
          style={{
            position: "absolute",
            top: "20px",
            right: "40px"
          }}
        >

          <button
            className="btn btn-primary rounded-circle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{
              width: "42px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0
            }}
          >
            <i className="fa fa-bars"></i>
          </button>

          <ul
            className="dropdown-menu dropdown-menu-end"
            style={{ minWidth: "220px" }}
          >

            <NavigationSection />

            <li>
              <hr className="dropdown-divider" />
            </li>

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
    </nav>
  );
};

export default NavbarSection;