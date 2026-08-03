import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../store";
import fetchers from "../store/slices/Clase/fetchers";
import Selector from "../store/slices/Clase/selectors";
import Swal from "sweetalert2";

const Clase = () => {
  const dispatch = useDispatch();
  const clases = useSelector(Selector.getClases);
  const [form, setForm] = useState({ Nombre_Clase: "" });
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  useEffect(() => {
    dispatch(fetchers.getClases({ url: "/clases" }));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await dispatch(fetchers.updateClase({ url: "/updateClase", data: { ...form, ID_Clase: idEditar } }));
        await Swal.fire({
  icon: "success",
  title: "Actualizada",
  text: "Clase actualizada correctamente",
  confirmButtonText: "Aceptar",
});
      } else {
        await dispatch(fetchers.insertClase({ url: "/insertClase", data: { Nombre_Clase: form.Nombre_Clase } }));
        await Swal.fire({
  icon: "success",
  title: "Registrada",
  text: "Clase registrada correctamente",
  confirmButtonText: "Aceptar",
});
      }
      setForm({ Nombre_Clase: "" });
      setEditando(false);
      setIdEditar(null);
      dispatch(fetchers.getClases({ url: "/clases" }));
    } catch (error) {
      Swal.fire({
  icon: "error",
  title: "Error",
  text: editando
    ? "No se pudo actualizar la clase"
    : "No se pudo registrar la clase",
  confirmButtonText: "Aceptar",
});
    }
  };

  const editar = (clase) => {
    setForm({ Nombre_Clase: clase.Nombre_Clase });
    setEditando(true);
    setIdEditar(clase.ID_Clase);
  };

  const eliminar = async (id) => {
    const confirmar = await Swal.fire({
  icon: "warning",
  title: "¿Eliminar clase?",
  text: "Esta acción no se puede deshacer.",
  showCancelButton: true,
  confirmButtonText: "Sí, eliminar",
  cancelButtonText: "Cancelar",
});

if (!confirmar.isConfirmed) return;
    try {
      await dispatch(fetchers.deleteClase({ url: `/deleteClase/${id}` }));
      await Swal.fire({
  icon: "success",
  title: "Eliminada",
  text: "Clase eliminada correctamente",
  confirmButtonText: "Aceptar",
});
      dispatch(fetchers.getClases({ url: "/clases" }));
    } catch (error) {
      Swal.fire({
  icon: "error",
  title: "Error",
  text: "No se pudo eliminar la clase",
  confirmButtonText: "Aceptar",
});
    }
  };

 return (
  <section className="module-page">
    <div className="module-container">

      <div className="module-header">
        <span className="module-label">Gestión académica</span>
        <h1>Clases</h1>
        <p>Registra, actualiza y administra las clases del sistema.</p>
      </div>

      <div className="module-card">
        <h2 className="module-card-title">
          {editando ? "Editar clase" : "Registrar clase"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre de la clase</label>

            <input
              type="text"
              className="form-control"
              name="Nombre_Clase"
              placeholder="Ej: Contabilidad"
              value={form.Nombre_Clase}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="module-primary-btn">
              {editando ? "Actualizar clase" : "Guardar clase"}
            </button>

            {editando && (
              <button
                type="button"
                className="btn btn-secondary module-secondary-btn"
                onClick={() => {
                  setEditando(false);
                  setIdEditar(null);
                  setForm({ Nombre_Clase: "" });
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="module-card">
        <h2 className="module-card-title">Clases registradas</h2>

        <div className="table-responsive">
          <table className="table module-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre de la clase</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {clases.map((clase) => (
                <tr key={clase.ID_Clase}>
                  <td>{clase.ID_Clase}</td>
                  <td>{clase.Nombre_Clase}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm module-action-btn me-2"
                      onClick={() => editar(clase)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger btn-sm module-action-btn"
                      onClick={() => eliminar(clase.ID_Clase)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {clases.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-4">
                    No hay clases registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </section>
);
};

export default Clase;