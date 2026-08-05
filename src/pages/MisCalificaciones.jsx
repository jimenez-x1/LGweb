import React, { useEffect, useState } from "react";
import { API_URL } from "../utilities/axiosConfig";

const MisCalificaciones = () => {

  const [calificaciones, setCalificaciones] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [abiertos, setAbiertos] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {

    try {

      const dni = localStorage.getItem("USER_ID");

      const res = await fetch(
        `${API_URL}/calificaciones/padre/${dni}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("SECURE")}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        setCalificaciones(data);
      } else {
        setMensaje(data.message || "Error al cargar calificaciones");
        setCalificaciones([]);
      }

    } catch (error) {

      console.error(error);
      setMensaje("Error al cargar calificaciones");

    }

  };

  const agruparPorAlumno = () => {

    const grupos = {};

    calificaciones.forEach((c) => {

      const dni = c.Alumno?.DNI;

      if (!grupos[dni]) {
        grupos[dni] = {
          dni: dni,
          nombre: `${c.Alumno?.Nombre} ${c.Alumno?.Apellido}`,
          notas: []
        };
      }

      grupos[dni].notas.push(c);

    });

    return Object.values(grupos);

  };

  const obtenerIniciales = (nombre) => {

    const partes = nombre.trim().split(" ");
    const primera = partes[0]?.[0] || "";
    const segunda = partes[1]?.[0] || "";

    return (primera + segunda).toUpperCase();

  };

  const toggleAbierto = (dni) => {
    setAbiertos((prev) => ({
      ...prev,
      [dni]: !prev[dni]
    }));
  };

  const calcularPromedio = (c) => {
    const parciales = [
      c.Parcial1,
      c.Parcial2,
      c.Parcial3,
      c.Parcial4
    ].filter((valor) => valor !== null && valor !== undefined && valor !== "");

    return parciales.length === 0
      ? null
      : parciales.reduce((suma, valor) => suma + Number(valor), 0) / parciales.length;
  };

  const grupos = agruparPorAlumno();

 return (
  <section className="module-page">
    <div className="module-container">

      <div className="module-header">
        <span className="module-label">
          Portal del Padre
        </span>

        <h1>Calificaciones</h1>

        <p>
          Consulte las calificaciones de sus hijos por asignatura.
        </p>
      </div>

      {mensaje && (
        <div className="alert alert-danger">
          {mensaje}
        </div>
      )}

      {grupos.length === 0 ? (

        <div className="module-card">
          <div className="module-empty-state">
            <i className="fas fa-book-open"></i>

            <h3>No hay calificaciones registradas</h3>

            <p>
              Cuando los docentes registren las notas aparecerán aquí.
            </p>
          </div>
        </div>

      ) : (

        grupos.map((grupo) => {

          const estaAbierto = !!abiertos[grupo.dni];

          return (

            <div
              key={grupo.dni}
              className="module-card mb-4"
            >

              <div
                className="module-card-header grade-card"
                onClick={() => toggleAbierto(grupo.dni)}
              >

                <div className="d-flex align-items-center gap-3">

                  <div className="teacher-avatar">
                    {obtenerIniciales(grupo.nombre)}
                  </div>

                  <div>

                    <h2 className="module-card-title mb-1">
                      {grupo.nombre}
                    </h2>

                    <p className="module-card-description mb-0">
                      {grupo.notas.length} asignaturas registradas
                    </p>

                  </div>

                </div>

                <div
                  className={
                    estaAbierto
                      ? "grade-arrow open"
                      : "grade-arrow"
                  }
                >
                  ▼
                </div>

              </div>

              {estaAbierto && (

                <div className="students-container">

                  <div className="table-responsive">

                    <table className="table align-middle">

                      <thead className="table-light">

                        <tr>
                          <th>Clase</th>
                          <th>P1</th>
                          <th>P2</th>
                          <th>P3</th>
                          <th>P4</th>
                          <th>Promedio</th>
                        </tr>

                      </thead>

                      <tbody>

                        {grupo.notas.map((c) => {

                          const promedio = calcularPromedio(c);

                          const aprobado =
                            promedio !== null &&
                            promedio >= 60;

                          return (

                            <tr key={c.ID_Calificacion}>

                              <td>
                                {c.Clase?.Nombre_Clase}
                              </td>

                              <td>{c.Parcial1 ?? "-"}</td>

                              <td>{c.Parcial2 ?? "-"}</td>

                              <td>{c.Parcial3 ?? "-"}</td>

                              <td>{c.Parcial4 ?? "-"}</td>

                              <td>

                                <span
                                  className={
                                    aprobado
                                      ? "badge bg-success"
                                      : "badge bg-danger"
                                  }
                                  style={{
                                    padding: "8px 14px",
                                    fontSize: "14px",
                                    borderRadius: "20px",
                                  }}
                                >
                                  {promedio ?? "-"}
                                </span>

                              </td>

                            </tr>

                          );

                        })}

                      </tbody>

                    </table>

                  </div>

                </div>

              )}

            </div>

          );

        })

      )}

    </div>
  </section>
);
};

export default MisCalificaciones;