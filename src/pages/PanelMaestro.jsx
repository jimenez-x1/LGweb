import React from "react";
import { Link } from "react-router-dom";

const PanelMaestro = () => {
  return (
  <section className="module-page">
    <div className="module-container">

      <div className="module-header">
        <span className="module-label">
          Panel del Maestro
        </span>

        <h1>Bienvenido</h1>

        <p>
          Seleccione una opción para administrar sus alumnos y registrar calificaciones.
        </p>
      </div>

      <div className="row g-4">

        <div className="col-lg-6">
          <Link
            to="/mis-alumnos"
            style={{ textDecoration: "none" }}
          >
            <div className="teacher-card teacher-panel-card">

              <div className="teacher-card-top">

                <div className="teacher-avatar">
                  👨‍🎓
                </div>

                <div className="teacher-info">
                  <h3>Mis alumnos</h3>

                  <span className="teacher-role">
                    Consulta de alumnos
                  </span>
                </div>

              </div>

              <div className="teacher-details">

                <div className="teacher-detail-item">
                  <span>
                    Consulte los alumnos asignados organizados por grado.
                  </span>
                </div>

              </div>

              <div className="teacher-actions">
                <button className="btn btn-primary teacher-btn">
                  Ingresar
                </button>
              </div>

            </div>
          </Link>
        </div>

        <div className="col-lg-6">
          <Link
            to="/mis-notas"
            style={{ textDecoration: "none" }}
          >
            <div className="teacher-card teacher-panel-card">

              <div className="teacher-card-top">

                <div className="teacher-avatar">
                  📝
                </div>

                <div className="teacher-info">
                  <h3>Gestionar notas</h3>

                  <span className="teacher-role">
                    Registro de calificaciones
                  </span>
                </div>

              </div>

              <div className="teacher-details">

                <div className="teacher-detail-item">
                  <span>
                    Registre, modifique y consulte las notas de sus alumnos.
                  </span>
                </div>

              </div>

              <div className="teacher-actions">
                <button className="btn btn-primary teacher-btn">
                  Ingresar
                </button>
              </div>

            </div>
          </Link>
        </div>

      </div>

    </div>
  </section>
);
};

export default PanelMaestro;