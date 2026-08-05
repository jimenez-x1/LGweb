import React, { useEffect, useState } from "react";
import { API_URL } from "../utilities/axiosConfig";

const MisAlumnos = () => {
  const [grados, setGrados] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [gradosAbiertos, setGradosAbiertos] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const dniMaestro = localStorage.getItem("USER_ID");

      const res = await fetch(
        `${API_URL}/maestro-grado/${dniMaestro}/alumnos`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("SECURE")}`,
          },
        }
      );

      const toggleGrado = (idGrado) => {
  setGradosAbiertos((prev) => ({
    ...prev,
    [idGrado]: !prev[idGrado],
  }));
};

      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        setGrados(data);
        setMensaje("");
      } else {
        setGrados([]);
        setMensaje(data.message || "Error al cargar los alumnos");
      }
    } catch (error) {
      console.error(error);
      setGrados([]);
      setMensaje("Error al cargar los alumnos");
    }
  };


const toggleGrado = (idGrado) => {
  setGradosAbiertos((prev) => ({
    ...prev,
    [idGrado]: !prev[idGrado],
  }));
};



 return (
  <section className="module-page">
    <div className="module-container">

      <div className="module-header">
        <span className="module-label">
          Gestión académica
        </span>

        <h1>Mis alumnos</h1>

        <p>
          Consulte los alumnos organizados por grado asignado.
        </p>
      </div>

      {mensaje && (
        <div className="alert alert-danger">
          {mensaje}
        </div>
      )}

      {grados.map((item) => {
        const idGrado = item.grado.ID_Grado;
        const estaAbierto = !!gradosAbiertos[idGrado];

        const alumnosOrdenados = [...item.alumnos].sort((a, b) => {
          const nombreA = `${a.Nombre} ${a.Apellido}`.toLowerCase();
          const nombreB = `${b.Nombre} ${b.Apellido}`.toLowerCase();

          return nombreA.localeCompare(nombreB);
        });

        return (
          <div
            key={idGrado}
            className="module-card mb-4"
          >
            <div
              className="module-card-header"
              style={{ cursor: "pointer" }}
              onClick={() => toggleGrado(idGrado)}
            >
              <div>
                <h2 className="module-card-title">
                  {item.grado.Nombre_Grado}
                  {item.grado.Seccion
                    ? ` - Sección ${item.grado.Seccion}`
                    : ""}
                </h2>

                <p className="module-card-description mb-0">
                  {item.alumnos.length}{" "}
                  {item.alumnos.length === 1
                    ? "alumno asignado"
                    : "alumnos asignados"}
                </p>
              </div>

              <div
                style={{
                  fontSize: "26px",
                  transition: ".3s",
                  transform: estaAbierto
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              >
                ▼
              </div>
            </div>

            {estaAbierto && (
              <div className="row g-4 mt-2">

                {alumnosOrdenados.length === 0 ? (
                  <div className="col-12">
                    <div className="module-empty-state">
                      <i className="fas fa-user-graduate"></i>

                      <h3>
                        No hay alumnos registrados
                      </h3>

                      <p>
                        Este grado aún no tiene alumnos asignados.
                      </p>
                    </div>
                  </div>
                ) : (
                  alumnosOrdenados.map((alumno) => (
                    <div
                      className="col-12 col-md-6 col-xl-4"
                      key={alumno.DNI}
                    >
                      <div className="teacher-card">

                        <div className="teacher-card-top">

                          <div className="teacher-avatar">
                            {alumno.Nombre?.charAt(0)}
                            {alumno.Apellido?.charAt(0)}
                          </div>

                          <div className="teacher-info">
                            <h3>
                              {alumno.Nombre} {alumno.Apellido}
                            </h3>

                            <span className="teacher-role">
                              Alumno
                            </span>
                          </div>

                        </div>

                        <div className="teacher-details">

                          <div className="teacher-detail-item">
                            <span>DNI</span>
                            <strong>{alumno.DNI}</strong>
                          </div>

                          <div className="teacher-detail-item">
                            <span>Grado</span>
                            <strong>
                              {item.grado.Nombre_Grado}
                            </strong>
                          </div>

                          <div className="teacher-detail-item">
                            <span>Sección</span>
                            <strong>
                              {item.grado.Seccion || "-"}
                            </strong>
                          </div>

                        </div>

                      </div>
                    </div>
                  ))
                )}

              </div>
            )}
          </div>
        );
      })}

    </div>
  </section>
);
};

export default MisAlumnos;