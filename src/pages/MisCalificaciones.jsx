import React, { useEffect, useState } from "react";

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
        `http://localhost:3000/api/calificaciones/padre/${dni}`,
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
    <section
      className="notas-section pt_100 pb_100"
      style={{
        background: "linear-gradient(180deg, #eef1f6 0%, #dde3ee 100%)",
        minHeight: "100vh"
      }}
    >

      <style>{`
        .notas-thead th {
          background-color: #1e3a8a !important;
          color: #ffffff !important;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .notas-fila-par {
          background-color: #f8f9fa !important;
        }
        .notas-card {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 4px 20px rgba(30, 58, 138, 0.1);
          border-left: 6px solid #1e3a8a;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .notas-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(30, 58, 138, 0.16);
        }
        .notas-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e3a8a, #3b5fc0);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .notas-badge {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9rem;
          white-space: nowrap;
        }
        .notas-badge-aprobado {
          background-color: #d1f2e0;
          color: #198754;
        }
        .notas-badge-reprobado {
          background-color: #fbdada;
          color: #dc3545;
        }
        .notas-header-click {
          cursor: pointer;
          user-select: none;
        }
        .notas-flecha {
          margin-left: auto;
          transition: transform 0.2s ease;
          color: #1e3a8a;
          font-size: 1.3rem;
        }
        .notas-flecha-abierta {
          transform: rotate(180deg);
        }

        @media (max-width: 768px) {
          .notas-section {
            padding-top: 50px !important;
            padding-bottom: 50px !important;
          }
          .notas-card {
            padding: 20px;
          }
          .notas-avatar {
            width: 42px;
            height: 42px;
            font-size: 1rem;
          }
        }

        @media (max-width: 576px) {
          .notas-section {
            padding-top: 30px !important;
            padding-bottom: 30px !important;
          }
          .notas-card {
            padding: 14px;
            border-radius: 12px;
            border-left-width: 4px;
          }
          .notas-avatar {
            width: 36px;
            height: 36px;
            font-size: 0.85rem;
          }
          .notas-card h3 {
            font-size: 1rem;
          }
          .notas-thead th {
            font-size: 0.68rem;
            padding: 6px 4px;
            white-space: nowrap;
          }
          .notas-card td {
            font-size: 0.8rem;
            padding: 6px 4px;
          }
          .notas-badge {
            padding: 2px 8px;
            font-size: 0.75rem;
          }
        }

        @media (max-width: 360px) {
          .notas-card {
            padding: 10px;
          }
          .notas-avatar {
            width: 32px;
            height: 32px;
            font-size: 0.75rem;
          }
          .notas-card h3 {
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="container">

        <div className="row mb_40">

          <div className="col-12 text-center">

            <div className="tf__heading_area">

              <h5>Consulta</h5>
              <h2>Calificaciones de tus hijos</h2>

            </div>

          </div>

        </div>

        {mensaje && (
          <p className="text-center text-danger">{mensaje}</p>
        )}

        {grupos.length === 0 ? (

          <p className="text-center">
            No hay calificaciones registradas.
          </p>

        ) : (

          grupos.map((grupo, index) => {

            const estaAbierto = !!abiertos[grupo.dni];

            return (

              <div key={index} className="notas-card mb_40">

                <div
                  className="d-flex align-items-center gap-3 notas-header-click"
                  onClick={() => toggleAbierto(grupo.dni)}
                >

                  <div className="notas-avatar">
                    {obtenerIniciales(grupo.nombre)}
                  </div>

                  <h3
                    className="m-0"
                    style={{ color: "#1e3a8a" }}
                  >
                    {grupo.nombre}
                  </h3>

                  <span
                    className={
                      estaAbierto
                        ? "notas-flecha notas-flecha-abierta"
                        : "notas-flecha"
                    }
                  >
                    ▼
                  </span>

                </div>

                {estaAbierto && (

                  <div className="table-responsive mt-3">

                    <table className="table table-bordered text-center mb-0">

                      <thead className="notas-thead">
                        <tr>
                          <th>Clase</th>
                          <th>Parcial 1</th>
                          <th>Parcial 2</th>
                          <th>Parcial 3</th>
                          <th>Parcial 4</th>
                          <th>Promedio</th>
                        </tr>
                      </thead>

                      <tbody>
                        {grupo.notas.map((c, i) => {

                          const promedio = calcularPromedio(c);
                          const aprobado = promedio !== null && promedio >= 60;

                          return (
                            <tr
                              key={c.ID_Calificacion}
                              className={i % 2 === 0 ? "notas-fila-par" : ""}
                            >
                              <td>{c.Clase?.Nombre_Clase}</td>
                              <td>{c.Parcial1 ?? "—"}</td>
                              <td>{c.Parcial2 ?? "—"}</td>
                              <td>{c.Parcial3 ?? "—"}</td>
                              <td>{c.Parcial4 ?? "—"}</td>
                              <td>
                                <span
                                  className={
                                    aprobado
                                      ? "notas-badge notas-badge-aprobado"
                                      : "notas-badge notas-badge-reprobado"
                                  }
                                >
                                  {promedio}
                                </span>
                              </td>
                            </tr>
                          );

                        })}
                      </tbody>

                    </table>

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