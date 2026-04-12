import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../store";
import fetchers from "../store/slices/Clase/fetchers";
import Selector from "../store/slices/Clase/selectors";

const Clase = () => {
  const dispatch = useDispatch();
  const clases = useSelector(Selector.getClases);
  const [form, setForm] = useState({ ID_Clase: "", Nombre_Clase: "" });
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
        alert("Clase actualizada");
      } else {
        await dispatch(fetchers.insertClase({ url: "/insertClase", data: form }));
        alert("Clase registrada");
      }
      setForm({ ID_Clase: "", Nombre_Clase: "" });
      setEditando(false);
      setIdEditar(null);
      dispatch(fetchers.getClases({ url: "/clases" }));
    } catch (error) {
      alert("Error al guardar");
    }
  };

  const editar = (clase) => {
    setForm({ ID_Clase: String(clase.ID_Clase), Nombre_Clase: clase.Nombre_Clase });
    setEditando(true);
    setIdEditar(clase.ID_Clase);
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta clase?")) return;
    try {
      await dispatch(fetchers.deleteClase({ url: `/deleteClase/${id}` }));
      alert("Eliminada correctamente");
      dispatch(fetchers.getClases({ url: "/clases" }));
    } catch (error) {
      alert("Error al eliminar");
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
                      onClick={() => { setEditando(false); setForm({ ID_Clase: "", Nombre_Clase: "" }); }}
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