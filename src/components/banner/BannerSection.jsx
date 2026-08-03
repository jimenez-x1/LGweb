import React from "react";
import { Link } from "react-router-dom";

const BannerSection = ({ stats }) => {
  return (
    <section className="dashboard-hero-section">
      <div className="container-fluid banner-full">
        <div className="dashboard-hero-card">
        <div className="dashboard-hero-left">           
         <div className="dashboard-badge">🎓 Módulo académico</div>

            <h1>Gestión de Alumnos</h1>

            <p>
              Administra, consulta y organiza la información de los estudiantes
              de forma clara, rápida y ordenada.
            </p>

            <div className="dashboard-hero-actions">
              <Link to="/alumnos" className="hero-btn hero-btn-primary">
                Ver alumnos
              </Link>

      
            </div>
          </div>

          <div className="dashboard-hero-right">            
          <h3>Resumen del módulo</h3>

            <div className="summary-item">
              <div className="summary-icon blue">👥</div>
              <div>
                <h4>{stats?.totalAlumnos || 0}</h4>
                <p>Total alumnos</p>
                <span>Registrados en el sistema</span>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-icon orange">🎓</div>
              <div>
                <h4>{stats?.gradosRegistrados || 0}</h4>
                <p>Grados registrados</p>
                <span>Con alumnos asociados</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;