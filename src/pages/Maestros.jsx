import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const Maestros = () => {

  const [maestros, setMaestros] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {

    try {

      const res = await fetch("http://localhost:3000/api/maestros");
      const data = await res.json();

      setMaestros(data ?? []);

    } catch (error) {

      console.error(error);

    }

  };

  const handleEliminar = async (dni) => {

    if (!window.confirm("¿Seguro que deseas eliminar este maestro?")) return;

    try {

      const res = await fetch(
        `http://localhost:3000/api/deleteMaestro/${dni}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (res.ok) {

        alert("Maestro eliminado correctamente");
        cargarDatos();

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.error(error);
      alert("Error al eliminar maestro");

    }

  };

  return (
    <section className="pt_100 pb_100">

      <div className="container">

        <div className="row mb_40">

          <div className="col-12 text-center">

            <div className="tf__heading_area">

              <h5>Listado</h5>
              <h2>Maestros registrados</h2>

            </div>

          </div>

        </div>

        <div className="d-flex justify-content-end mb_20">

          <Link
            to="/registrar-maestro"
            className="btn btn-primary"
          >

            + Registrar Maestro

          </Link>

        </div>

        <div className="row">

          {maestros.length === 0 ? (

            <p className="text-center">
              No hay maestros registrados.
            </p>

          ) : (

            maestros.map((maestro) => (

              <div
                className="col-md-6 col-lg-4 mb_30"
                key={maestro.DNI}
              >

                <div className="tf__single_courses">

                  <div className="tf__single_courses_text">

                    <h3>
                      {maestro.Nombre} {maestro.Apellido}
                    </h3>

                    <p>
                      <strong>DNI:</strong> {maestro.DNI}
                    </p>

                    <p>
                      <strong>Teléfono:</strong>{" "}
                      {maestro.Telefono || "—"}
                    </p>

                    <p>
                      <strong>Correo:</strong>{" "}
                      {maestro.Correo || "—"}
                    </p>

                    <div className="d-flex gap-2 mt-3">

                      <Link
                        to={`/editar-maestro/${maestro.DNI}`}
                        className="btn btn-warning btn-sm"
                        onClick={() =>
                          navigate("/editar-maestro", {
                            state: { maestro },
                          })
                        }
                      >

                        Editar

                      </Link>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleEliminar(maestro.DNI)
                        }
                      >

                        Eliminar

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </section>
  );
};

export default Maestros;