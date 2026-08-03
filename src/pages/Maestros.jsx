import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Maestros = () => {

  const [maestros, setMaestros] = useState([]);
   const navigate = useNavigate(); 
   const rol = Number(localStorage.getItem("ROL"));
const esAdministrador = rol === 1;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {

    try {

      const res = await fetch("http://localhost:3000/api/maestros", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("SECURE")}`,
        },
      });
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {      
        setMaestros(data);                       
      } else {
        console.error("Error al cargar maestros:", data.message);
        setMaestros([]);
      }

    } catch (error) {

      console.error(error);

    }

  };

  const handleEliminar = async (dni) => {

    const confirmar = await Swal.fire({
  icon: "warning",
  title: "¿Eliminar maestro?",
  text: "Esta acción no se puede deshacer.",
  showCancelButton: true,
  confirmButtonText: "Sí, eliminar",
  cancelButtonText: "Cancelar",
});

if (!confirmar.isConfirmed) return;
    try {

      const res = await fetch(
        `http://localhost:3000/api/deleteMaestro/${dni}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (res.ok) {

        await Swal.fire({
  icon: "success",
  title: "Eliminado",
  text: "Maestro eliminado correctamente",
  confirmButtonText: "Aceptar",
});
        cargarDatos();

      } else {

        await Swal.fire({
  icon: "error",
  title: "No se pudo eliminar",
  text: data.message || "Ocurrió un error al eliminar el maestro",
  confirmButtonText: "Aceptar",
});

      }

    } catch (error) {

      console.error(error);
      Swal.fire({
  icon: "error",
  title: "Error",
  text: "No se pudo eliminar el maestro",
  confirmButtonText: "Aceptar",
});

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

       {esAdministrador && (
  <div className="d-flex justify-content-end mb_20">
    <Link
      to="/registrar-maestro"
      className="btn btn-primary"
    >
      + Registrar Maestro
    </Link>
  </div>
)}

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
                    <strong>Cargo:</strong> {maestro.Cargo}
                   </p>

                    <p>
                      <strong>Teléfono:</strong>{" "}
                      {maestro.Telefono || "—"}
                    </p>

                    <p>
                      <strong>Correo:</strong>{" "}
                      {maestro.Correo || "—"}
                    </p>

                  {esAdministrador && (
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
)}

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