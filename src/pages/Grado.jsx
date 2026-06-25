import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../store";
import fetchers from "../store/slices/Grado/fetchers";
import Selector from "../store/slices/Grado/selectors";

const Grado = () => {
  const dispatch = useDispatch();
  const grados = useSelector(Selector.getGrados);
  const [clases, setClases] = useState([]);
  const [form, setForm] = useState({ ID_Clase: "", Nombre_Grado: "", Seccion: "", Anio: "" });
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  useEffect(() => {
    dispatch(fetchers.getGrados({ url: "/grados" }));
    dispatch(fetchers.getClases({ url: "/clases" })).then((res) => {
      setClases(res.payload?.clasesInfo ?? []);
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await dispatch(fetchers.updateGrado({ url: "/grados", data: { ...form, ID_Grado: idEditar } }));
        alert("Grado actualizado");
      } else {
        await dispatch(fetchers.insertGrado({ url: "/grados", data: form }));
        alert("Grado registrado");
      }
      setForm({ ID_Clase: "", Nombre_Grado: "", Seccion: "", Anio: "" });
      setEditando(false);
      setIdEditar(null);
      dispatch(fetchers.getGrados({ url: "/grados" }));
    } catch (error) {
      alert("Error al guardar");
    }
  };

  const editar = (grado) => {
    setForm({ ID_Clase: String(grado.ID_Clase), Nombre_Grado: grado.Nombre_Grado, Seccion: grado.Seccion, Anio: String(grado.Anio) });
    setEditando(true);
    setIdEditar(grado.ID_Grado);
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este grado?")) return;
    try {
      await dispatch(fetchers.deleteGrado({ url: `/grados/${id}` }));
      alert("Eliminado correctamente");
      dispatch(fetchers.getGrados({ url: "/grados" }));
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
              <h2>{editando ? "Editar Grado" : "Registrar Grado"}</h2>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="p-4 border rounded bg-white shadow-sm">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Clase</label>
                  <select className="form-control" name="ID_Clase" value={form.ID_Clase} onChange={handleChange} required>
                    <option value="">Seleccione una Clase...</option>
                    {clases.map((c) => (
                      <option key={c.ID_Clase} value={c.ID_Clase}>{c.Nombre_Clase}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre Grado</label>
                  <input type="text" className="form-control" name="Nombre_Grado" placeholder="Ej: Primero" value={form.Nombre_Grado} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Sección</label>
                  <select className="form-control" name="Seccion" value={form.Seccion} onChange={handleChange} required>
                    <option value="">Seleccione una Sección...</option>
                    <option value="A">A</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Año</label>
                  <input type="number" className="form-control" name="Anio" placeholder="Ej: 2024" value={form.Anio} onChange={handleChange} required />
                </div>
                <div className="d-flex gap-3">
                  <button type="submit" className="btn btn-primary">{editando ? "Actualizar Grado" : "Guardar Grado"}</button>
                  {editando && (
                    <button type="button" className="btn btn-secondary" onClick={() => { setEditando(false); setForm({ ID_Clase: "", Nombre_Grado: "", Seccion: "", Anio: "" }); }}>Cancelar</button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="row mt_50">
          <div className="col-12">
            <div className="tf__heading_area mb_30">
              <h2>Grados Registrados</h2>
            </div>
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Clase</th>
                  <th>Nombre Grado</th>
                  <th>Sección</th>
                  <th>Año</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {grados.map((g) => (
                  <tr key={g.ID_Grado}>
                    <td>{g.ID_Grado}</td>
                    <td>{g.Clase ? g.Clase.Nombre_Clase : "Sin asignar"}</td>
                    <td>{g.Nombre_Grado}</td>
                    <td>{g.Seccion}</td>
                    <td>{g.Anio}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => editar(g)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => eliminar(g.ID_Grado)}>Eliminar</button>
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

export default Grado;