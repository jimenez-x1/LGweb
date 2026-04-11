import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMaestros, deleteMaestro, getGrados } from "../store/slices/Maestros/fetchers";

const Maestros = () => {
  const [maestros, setMaestros] = useState([]);
  const [grados, setGrados] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    getMaestros()
      .then((data) => setMaestros(data))
      .catch((error) => console.error(error));

    getGrados()
      .then((data) => setGrados(data))
      .catch((error) => console.error(error));
  };

  const nombreGrado = (id) => {
    const grado = grados.find((g) => g.ID_Grado === id);
    return grado ? grado.Nombre_Grado : "—";
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este maestro?")) return;
    try {
      await deleteMaestro(id);
      alert("Maestro eliminado correctamente");
      cargarDatos();
    } catch (error) {
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
          <Link to="/registrar-maestro" className="btn btn-primary">
            + Registrar Maestro
          </Link>
        </div>

        <div className="row">
          {maestros.length === 0 ? (
            <p className="text-center">No hay maestros registrados.</p>
          ) : (
            maestros.map((maestro) => (
              <div className="col-md-6 col-lg-4 mb_30" key={maestro.ID_Maestro}>
                <div className="tf__single_courses">
                  <div className="tf__single_courses_text">
                    <h3>{maestro.Nombre} {maestro.Apellido}</h3>
                    <p><strong>Grado:</strong> {nombreGrado(maestro.ID_Grado)}</p>
                    <p><strong>Teléfono:</strong> {maestro.Telefono || "—"}</p>
                    <p><strong>Correo:</strong> {maestro.Correo || "—"}</p>
                    <div className="d-flex gap-2 mt-2">
                      <Link
                        to={`/editar-maestro/${maestro.ID_Maestro}`}
                        className="btn btn-warning btn-sm"
                      >
                        Editar
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleEliminar(maestro.ID_Maestro)}
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