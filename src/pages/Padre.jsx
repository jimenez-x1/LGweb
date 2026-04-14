import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../store";
import fetchers from "../store/slices/Padre/fetchers";
import Selector from "../store/slices/Padre/selectors";

const Padre = () => {
  const dispatch = useDispatch();
  const padres = useSelector(Selector.getPadres);
  const [alumnos, setAlumnos] = useState([]);
  const [form, setForm] = useState({ ID_Alumno: "", Nombre: "", Apellido: "", Telefono: "", Correo: "", Direccion: "" });
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  useEffect(() => {
    dispatch(fetchers.getPadres({ url: "/padres" }));
    dispatch(fetchers.getAlumnos({ url: "/alumnos" })).then((res) => {
      setAlumnos(res.payload?.alumnosInfo ?? []);
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await dispatch(fetchers.updatePadre({ url: "/updatePadre", data: { ...form, ID_Padre: idEditar } }));
        alert("Padre actualizado");
      } else {
        await dispatch(fetchers.insertPadre({ url: "/insertPadre", data: form }));
        alert("Padre registrado");
      }
      setForm({ ID_Alumno: "", Nombre: "", Apellido: "", Telefono: "", Correo: "", Direccion: "" });
      setEditando(false);
      setIdEditar(null);
      dispatch(fetchers.getPadres({ url: "/padres" }));
    } catch (error) {
      alert("Error al guardar");
    }
  };

  const editar = (padre) => {
    setForm({
      ID_Alumno: String(padre.ID_Alumno),
      Nombre: padre.Nombre,
      Apellido: padre.Apellido,
      Telefono: padre.Telefono ?? "",
      Correo: padre.Correo ?? "",
      Direccion: padre.Direccion ?? "",
    });
    setEditando(true);
    setIdEditar(padre.ID_Padre);
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este padre?")) return;
    try {
      await dispatch(fetchers.deletePadre({ url: `/padres/${id}` }));
      alert("Eliminado correctamente");
      dispatch(fetchers.getPadres({ url: "/padres" }));
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
              <h2>{editando ? "Editar Padre" : "Registrar Padre"}</h2>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="p-4 border rounded bg-white shadow-sm">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Alumno</label>
                  <select className="form-control" name="ID_Alumno" value={form.ID_Alumno} onChange={handleChange} required>
                    <option value="">Seleccione un Alumno...</option>
                    {alumnos.map((a) => (
                      <option key={a.ID_Alumno} value={a.ID_Alumno}>{a.Nombre} {a.Apellido}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input type="text" className="form-control" name="Nombre" placeholder="Ej: Juan" value={form.Nombre} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input type="text" className="form-control" name="Apellido" placeholder="Ej: Pérez" value={form.Apellido} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input type="text" className="form-control" name="Telefono" placeholder="Ej: 9999-9999" value={form.Telefono} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input type="email" className="form-control" name="Correo" placeholder="Ej: correo@email.com" value={form.Correo} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Dirección</label>
                  <input type="text" className="form-control" name="Direccion" placeholder="Ej: Col. Centro" value={form.Direccion} onChange={handleChange} />
                </div>
                <div className="d-flex gap-3">
                  <button type="submit" className="btn btn-primary">{editando ? "Actualizar Padre" : "Guardar Padre"}</button>
                  {editando && (
                    <button type="button" className="btn btn-secondary" onClick={() => { setEditando(false); setForm({ ID_Alumno: "", Nombre: "", Apellido: "", Telefono: "", Correo: "", Direccion: "" }); }}>Cancelar</button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="row mt_50">
          <div className="col-12">
            <div className="tf__heading_area mb_30">
              <h2>Padres Registrados</h2>
            </div>
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Alumno</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Dirección</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {padres.map((p) => (
                  <tr key={p.ID_Padre}>
                    <td>{p.ID_Padre}</td>
                    <td>{p.ID_Alumno ?? "Sin asignar"}</td>
                    <td>{p.Nombre}</td>
                    <td>{p.Apellido}</td>
                    <td>{p.Telefono}</td>
                    <td>{p.Correo}</td>
                    <td>{p.Direccion}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => editar(p)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => eliminar(p.ID_Padre)}>Eliminar</button>
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

export default Padre;