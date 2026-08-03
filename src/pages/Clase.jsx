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
    <section className="pt_100 pb_100">
      <div className="container">
        <div className="row mb_40">
          <div className="col-12 text-center">
            <div className="tf__heading_area">
              <h5>Formulario</h5>
              <h2>{editando ? "Editar Clase" : "Registrar Clase"}</h2>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="p-4 border rounded bg-white shadow-sm">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre Clase</label>
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
                <div className="d-flex gap-3">
                  <button type="submit" className="btn btn-primary">
                    {editando ? "Actualizar Clase" : "Guardar Clase"}
                  </button>
                  {editando && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => { setEditando(false); setForm({ Nombre_Clase: "" }); }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="row mt_50">
          <div className="col-12">
            <div className="tf__heading_area mb_30">
              <h2>Clases Registradas</h2>
            </div>
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre Clase</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clases.map((c) => (
                  <tr key={c.ID_Clase}>
                    <td>{c.ID_Clase}</td>
                    <td>{c.Nombre_Clase}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => editar(c)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => eliminar(c.ID_Clase)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clase;