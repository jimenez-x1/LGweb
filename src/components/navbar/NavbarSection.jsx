import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import NavigationSection from "./NavigationSection";

const NavbarSection = ({ logo }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const cerrarSesion = () => {
    localStorage.removeItem("SECURE");
    localStorage.removeItem("ROL");
    localStorage.removeItem("USER_ID");
    navigate("/");
  };

  return (
    <>
      <header className="dashboard-header">
        <Link className="dashboard-brand" to="/home">
          <img
            src={logo}
            alt="Escuela Luis Gamero"
            className="dashboard-brand-logo"
          />

          <div>
            <h4>ESCUELA LUIS GAMERO</h4>
            <span>Sistema Escolar</span>
          </div>
        </Link>

        <div className="dashboard-user">
          <div className="dashboard-user-avatar">C</div>

          <div>
            <strong>Carolina</strong>
            <span>Administrador</span>
          </div>
        </div>
      </header>

      <aside className="dashboard-sidebar">
        <ul className="dashboard-menu">
          <NavigationSection currentPath={location.pathname} />
        </ul>

        <button
          type="button"
          className="dashboard-logout"
          onClick={cerrarSesion}
        >
          <i className="fas fa-sign-out-alt"></i>
          Cerrar sesión
        </button>
      </aside>
    </>
  );
};

export default NavbarSection;