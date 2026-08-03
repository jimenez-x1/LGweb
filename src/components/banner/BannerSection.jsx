import React from "react";
import "../../assets/css/dashboard.css";

const BannerSection = ({ stats }) => {
  return (
    <section className="dashboard-home-section">
      <div className="container-fluid dashboard-home-container">

        {/* Bienvenida */}
        <div className="dashboard-welcome-card">
          <div>
            <h1>Bienvenido al Sistema Escolar</h1>

            <p>
              Administra la información académica y financiera de la Escuela
              Luis Gamero desde un solo lugar.
            </p>
          </div>
        </div>

        {/* Resumen */}
        <div className="dashboard-summary-section">
          <h2>Resumen general</h2>

          <div className="row g-4">

            {/* Alumnos */}
            <div className="col-12 col-md-6 col-xl-4">
              <div className="dashboard-stat-card card-blue">
                <div className="dashboard-stat-icon icon-blue">
                  👥
                </div>

                <div className="dashboard-stat-content">
                  <h3>{stats?.totalAlumnos || 0}</h3>
                  <h4>Alumnos</h4>
                  <p>Registrados en el sistema</p>
                </div>
              </div>
            </div>

            {/* Maestros */}
            <div className="col-12 col-md-6 col-xl-4">
              <div className="dashboard-stat-card card-green">
                <div className="dashboard-stat-icon icon-green">
                  👨‍🏫
                </div>

                <div className="dashboard-stat-content">
                  <h3>{stats?.totalMaestros || 0}</h3>
                  <h4>Maestros</h4>
                  <p>Registrados en el sistema</p>
                </div>
              </div>
            </div>

            {/* Grados */}
            <div className="col-12 col-md-6 col-xl-4">
              <div className="dashboard-stat-card card-orange">
                <div className="dashboard-stat-icon icon-orange">
                  🎓
                </div>

                <div className="dashboard-stat-content">
                  <h3>{stats?.gradosRegistrados || 0}</h3>
                  <h4>Grados</h4>
                  <p>Activos actualmente</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default BannerSection;