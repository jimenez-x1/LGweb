import React from "react";
import { Link } from "react-router-dom";

const PanelMaestro = () => {
  return (
    <section className="pt_100 pb_100">
      <div className="container">

        <div className="row mb_50">
          <div className="col-12 text-center">
            <div className="tf__heading_area">
              <h5>Panel</h5>
              <h2>Panel del Maestro</h2>
              <p>
                Bienvenido. Seleccione una opción para administrar sus
                alumnos y calificaciones.
              </p>
            </div>
          </div>
        </div>

        <div className="row g-4">

          {/* MIS ALUMNOS */}
          <div className="col-lg-6">
            <Link
              to="/mis-alumnos"
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg,#1e3a8a,#3158b8)",
                  borderLeft: "8px solid #ff8c1a",
                  borderRadius: "16px",
                  padding: "35px",
                  color: "#fff",
                  boxShadow: "0 12px 28px rgba(0,0,0,.15)",
                  transition: ".3s",
                  cursor: "pointer",
                  height: "100%"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0,0,0,.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(0,0,0,.15)";
                }}
              >
                <div className="d-flex justify-content-between align-items-center">

                  <div>
                    <div
                      style={{
                        fontSize: "55px",
                        marginBottom: "15px"
                      }}
                    >
                      👨‍🎓
                    </div>

                    <h3
                      style={{
                        color: "#fff",
                        marginBottom: "15px"
                      }}
                    >
                      Mis alumnos
                    </h3>

                    <p
                      style={{
                        color: "#eef3ff",
                        marginBottom: 0
                      }}
                    >
                      Consulte los alumnos asignados y
                      organizados por grado.
                    </p>
                  </div>

                  <div
                    style={{
                      fontSize: "40px",
                      color: "#fff"
                    }}
                  >
                    →
                  </div>

                </div>
              </div>
            </Link>
          </div>

          {/* NOTAS */}
          <div className="col-lg-6">
            <Link
              to="/mis-notas"
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg,#1e3a8a,#3158b8)",
                  borderLeft: "8px solid #ff8c1a",
                  borderRadius: "16px",
                  padding: "35px",
                  color: "#fff",
                  boxShadow: "0 12px 28px rgba(0,0,0,.15)",
                  transition: ".3s",
                  cursor: "pointer",
                  height: "100%"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0,0,0,.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(0,0,0,.15)";
                }}
              >
                <div className="d-flex justify-content-between align-items-center">

                  <div>
                    <div
                      style={{
                        fontSize: "55px",
                        marginBottom: "15px"
                      }}
                    >
                      📝
                    </div>

                    <h3
                      style={{
                        color: "#fff",
                        marginBottom: "15px"
                      }}
                    >
                      Gestionar notas
                    </h3>

                    <p
                      style={{
                        color: "#eef3ff",
                        marginBottom: 0
                      }}
                    >
                      Registre, edite y consulte las
                      calificaciones de sus alumnos.
                    </p>
                  </div>

                  <div
                    style={{
                      fontSize: "40px",
                      color: "#fff"
                    }}
                  >
                    →
                  </div>

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