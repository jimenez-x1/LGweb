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
      await fetch(`http://localhost:3000/alumnos/${id}`, {
        method: "DELETE",
      });

      cargarAlumnos(); // refresca lista
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="pt_100 pb_100">
      <div className="container">

        <div className="d-flex justify-content-between align-items-center mb_40">
          <div>
            <h5>Listado</h5>
            <h2>Alumnos registrados</h2>
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

                  <h3>{alumno.Nombre} {alumno.Apellido}</h3>

                  <p><strong>Dirección:</strong> {alumno.Direccion}</p>
                  <p><strong>Género:</strong> {alumno.Genero}</p>
                  <p><strong>Grado:</strong> {alumno.ID_Grado}</p>

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