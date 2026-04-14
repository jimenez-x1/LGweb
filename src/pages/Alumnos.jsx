import React, { useEffect, useState } from "react";
import { getAlumnos } from "../store/slices/Alumnos/fetchers";
import { useNavigate } from "react-router-dom";

const Alumnos = () => {
  const [alumnos, setAlumnos] = useState([]);
  const navigate = useNavigate();

  const cargarAlumnos = () => {
    getAlumnos()
      .then((data) => setAlumnos(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  const eliminarAlumno = async (id) => {
    const confirmar = window.confirm("¿Eliminar este alumno?");
    if (!confirmar) return;

    try {
      const response = await fetch(`http://localhost:3000/api/deleteAlumno/${id}`, {
        method: "DELETE",
      });

      const result = await response.text();
      console.log("Respuesta servidor:", result);

      if (!response.ok) {
        throw new Error("No se pudo eliminar el alumno");
      }

      alert("Alumno eliminado correctamente");
      cargarAlumnos();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar alumno");
    }
  };

  const obtenerNombreGrado = (idGrado) => {
    const grados = {
      1: "Primero",
      4: "Segundo",
      6: "Tercero",
    };

    return grados[idGrado] || idGrado;
  };

  return (
    <section className="pt_100 pb_100">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb_40 flex-wrap gap-3">
          <div>
            <span
              style={{
                color: "#2563eb",
                fontWeight: "600",
                fontSize: "14px",
                letterSpacing: "1px",
              }}
            >
              ● LISTADO
            </span>

            <h2
              style={{
                marginTop: "8px",
                fontWeight: "700",
                color: "#0f172a",
              }}
            >
              Alumnos registrados
            </h2>
          </div>

          <button
            className="common_btn"
            onClick={() => navigate("/registrar-alumno")}
          >
            + Nuevo Alumno
          </button>
        </div>

        <div className="row">
          {alumnos.map((alumno) => (
            <div className="col-md-6 col-lg-4 mb_30" key={alumno.ID_Alumno}>
              <div className="tf__single_courses">
                <div className="tf__single_courses_text">
                  <h3>
                    {alumno.Nombre} {alumno.Apellido}
                  </h3>

                  <p><strong>Dirección:</strong> {alumno.Direccion}</p>
                  <p><strong>Género:</strong> {alumno.Genero}</p>
                  <p><strong>Grado:</strong> {obtenerNombreGrado(alumno.ID_Grado)}</p>

                  <div className="mt-3 d-flex gap-2">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => navigate(`/editar-alumno/${alumno.ID_Alumno}`)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarAlumno(alumno.ID_Alumno)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Alumnos;