import React, { useEffect, useState } from "react";

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
        `http://localhost:3000/api/maestro-grado/${dniMaestro}/alumnos`,
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
    <section className="pt_100 pb_100">
      <div className="container">

        <div className="row mb_40">
          <div className="col-12 text-center">
            <div className="tf__heading_area">
              <h5>Consulta</h5>
              <h2>Mis alumnos</h2>
              <p>Alumnos organizados por grado asignado.</p>
            </div>
          </div>
        </div>

        {mensaje && (
          <p className="text-center text-danger">{mensaje}</p>
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
      className="mb_40"
    >
      <div
        className="p-4 rounded shadow-sm"
        onClick={() => toggleGrado(idGrado)}
        style={{
          background: "linear-gradient(135deg, #1e3a8a, #3158b8)",
          color: "white",
          borderLeft: "8px solid #ff8c1a",
          cursor: "pointer",
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <p className="mb-1" style={{ opacity: 0.85 }}>
              Grado asignado
            </p>

            <h3 className="mb-0 text-white">
              {item.grado.Nombre_Grado}
              {item.grado.Seccion
                ? ` - Sección ${item.grado.Seccion}`
                : ""}
            </h3>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded p-3 text-center"
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                minWidth: "150px",
              }}
            >
              <h2 className="mb-0 text-white">
                {item.alumnos.length}
              </h2>

              <p className="mb-0 text-white">
                {item.alumnos.length === 1
                  ? "Alumno asignado"
                  : "Alumnos asignados"}
              </p>
            </div>

            <span
              style={{
                fontSize: "1.5rem",
                transition: "transform 0.2s ease",
                transform: estaAbierto
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              }}
            >
              ▼
            </span>
          </div>
        </div>

        {estaAbierto && (
          <div
            className="row mt-4 pt-4"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {alumnosOrdenados.length === 0 ? (
              <div className="col-12">
                <p className="text-center text-white mb-0">
                  No hay alumnos registrados en este grado.
                </p>
              </div>
            ) : (
              alumnosOrdenados.map((alumno, index) => (
                <div
                  className="col-md-6 col-lg-4 mb-3"
                  key={alumno.DNI}
                >
                  <div
                    className="p-3 rounded h-100"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.95)",
                      color: "#17213b",
                      borderTop: "4px solid #ff8c1a",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "45px",
                          height: "45px",
                          backgroundColor: "#e8efff",
                          color: "#1e3a8a",
                          fontWeight: "bold",
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </div>

                      <div>
                        <h4 className="mb-1">
                          {alumno.Nombre} {alumno.Apellido}
                        </h4>

                        <p className="mb-0">
                          <strong>DNI:</strong> {alumno.DNI}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
})}
      </div>
    </section>
  );
};

export default MisAlumnos;