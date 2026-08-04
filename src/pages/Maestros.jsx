import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Maestros = () => {
  const [maestros, setMaestros] = useState([]);

  const rol = Number(localStorage.getItem("ROL"));
  const esAdministrador = rol === 1;
  const token = localStorage.getItem("SECURE");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/maestros", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        setMaestros(data);
      } else {
        console.error(
          "Error al cargar maestros:",
          data.message || "Respuesta inválida"
        );

        setMaestros([]);
      }
    } catch (error) {
      console.error("Error al consultar maestros:", error);
      setMaestros([]);
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          text:
            data.message ||
            "Ocurrió un error al eliminar el maestro",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      console.error("Error al eliminar maestro:", error);

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el maestro",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <section className="module-page">
      <div className="module-container">
        <div className="module-header module-header-row">
          <div>
            <span className="module-label">
              Gestión académica
            </span>

            <h1>Maestros</h1>

            <p>
              Consulta, registra y administra la información
              del personal docente.
            </p>
          </div>

          {esAdministrador && (
            <Link
              to="/registrar-maestro"
              className="module-primary-btn module-header-button"
            >
              + Registrar maestro
            </Link>
          )}
        </div>

        <div className="module-card">
          <div className="module-card-header">
            <div>
              <h2 className="module-card-title mb-1">
                Maestros registrados
              </h2>

              <p className="module-card-description">
                Total de maestros: {maestros.length}
              </p>
            </div>
          </div>

          {maestros.length === 0 ? (
            <div className="module-empty-state">
              <i className="fas fa-chalkboard-teacher"></i>

              <h3>No hay maestros registrados</h3>

              <p>
                Los maestros registrados aparecerán en esta
                sección.
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {maestros.map((maestro) => (
                <div
                  className="col-12 col-md-6 col-xl-4"
                  key={maestro.DNI}
                >
                  <div className="teacher-card">
                    <div className="teacher-card-top">
                      <div className="teacher-avatar">
                        {maestro.Nombre?.charAt(0)}
                        {maestro.Apellido?.charAt(0)}
                      </div>

                      <div className="teacher-info">
                        <h3>
                          {maestro.Nombre} {maestro.Apellido}
                        </h3>

                        <span className="teacher-role">
                          {maestro.Cargo || "Docente"}
                        </span>
                      </div>
                    </div>

                    <div className="teacher-details">
                      <div className="teacher-detail-item">
                        <span>DNI</span>
                        <strong>{maestro.DNI}</strong>
                      </div>

                      <div className="teacher-detail-item">
                        <span>Teléfono</span>
                        <strong>
                          {maestro.Telefono || "No registrado"}
                        </strong>
                      </div>

                      <div className="teacher-detail-item">
                        <span>Correo</span>
                        <strong>
                          {maestro.Correo || "No registrado"}
                        </strong>
                      </div>
                    </div>

                    {esAdministrador && (
                      <div className="teacher-actions">
                        <Link
                          to={`/editar-maestro/${maestro.DNI}`}
                          className="btn btn-warning teacher-btn"
                        >
                          <i className="fas fa-pen me-2"></i>
                          Editar
                        </Link>

                        <button
                          type="button"
                          className="btn btn-danger teacher-btn"
                          onClick={() =>
                            handleEliminar(maestro.DNI)
                          }
                        >
                          <i className="fas fa-trash me-2"></i>
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Maestros;