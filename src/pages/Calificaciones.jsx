import React, { useEffect, useState } from "react";
import { useDispatch } from "../store";
import fetchers from "../store/slices/Calificaciones/fetchers";

const Calificaciones = () => {
  const dispatch = useDispatch();

  const [calificaciones, setCalificaciones] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [clases, setClases] = useState([]);

  const [form, setForm] = useState({
    ID_Alumno: "",
    ID_Clase: "",
    Parcial1: "",
    Parcial2: "",
    Parcial3: "",
    Parcial4: "",
  });

  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  const cargarCalificaciones = () => {
    dispatch(fetchers.getCalificaciones({ url: "/calificaciones" }))
      .then((res) => {
        setCalificaciones(res.payload?.calificacionesInfo ?? []);
      })
      .catch(console.error);
  };

  const cargarAlumnos = () => {
    dispatch(fetchers.getAlumnos({ url: "/alumnos" }))
      .then((res) => {
        setAlumnos(res.payload?.alumnosInfo ?? []);
      })
      .catch(console.error);
  };

  const cargarClases = () => {
    dispatch(fetchers.getClases({ url: "/clases" }))
      .then((res) => {
        setClases(res.payload?.clasesInfo ?? []);
      })
      .catch(console.error);
  };

  useEffect(() => {
    cargarCalificaciones();
    cargarAlumnos();
    cargarClases();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const limpiarFormulario = () => {
    setForm({
      ID_Alumno: "",
      ID_Clase: "",
      Parcial1: "",
      Parcial2: "",
      Parcial3: "",
      Parcial4: "",
    });

    setEditando(false);
    setIdEditar(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await dispatch(
          fetchers.updateCalificacion({
            url: "/calificaciones",
            data: {
              ...form,
              ID_Calificacion: idEditar,
            },
          })
        );

        alert("Calificación actualizada");
      } else {
        await dispatch(
          fetchers.insertCalificacion({
            url: "/calificaciones",
            data: form,
          })
        );

        alert("Calificación registrada");
      }

      limpiarFormulario();
      cargarCalificaciones();
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    }
  };

  const editar = (c) => {
    setForm({
      ID_Alumno: String(c.ID_Alumno),
      ID_Clase: String(c.ID_Clase),
      Parcial1: c.Parcial1,
      Parcial2: c.Parcial2,
      Parcial3: c.Parcial3,
      Parcial4: c.Parcial4,
    });

    setEditando(true);
    setIdEditar(c.ID_Calificacion);
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta calificación?")) return;

    await dispatch(
      fetchers.deleteCalificacion({
        url: `/calificaciones/${id}`,
      })
    );

    cargarCalificaciones();
  };

  return (
    <section className="pt_100 pb_100">
  <div className="container">

    <div className="row mb_40">
      <div className="col-12 text-center">
        <div className="tf__heading_area">
          <h5>Formulario</h5>
          <h2>{editando ? "Editar Calificación" : "Registrar Calificación"}</h2>
        </div>
      </div>
    </div>

    <div className="row justify-content-center">
      <div className="col-lg-8">

        <div className="p-4 border rounded bg-white shadow-sm">

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Alumno</label>

              <select
                className="form-control"
                name="ID_Alumno"
                value={form.ID_Alumno}
                onChange={handleChange}
                required
              >

                <option value="">Seleccione un alumno</option>

                {alumnos.map((a) => (
                  <option key={a.ID_Alumno} value={a.ID_Alumno}>
                    {a.Nombre} {a.Apellido}
                  </option>
                ))}

              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Clase</label>

              <select
                className="form-control"
                name="ID_Clase"
                value={form.ID_Clase}
                onChange={handleChange}
                required
              >

                <option value="">Seleccione una clase</option>

                {clases.map((c) => (
                  <option key={c.ID_Clase} value={c.ID_Clase}>
                    {c.Nombre_Clase}
                  </option>
                ))}

              </select>

            </div>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Parcial 1</label>

                <input
                  className="form-control"
                  type="number"
                  name="Parcial1"
                  value={form.Parcial1}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-3">
                <label>Parcial 2</label>

                <input
                  className="form-control"
                  type="number"
                  name="Parcial2"
                  value={form.Parcial2}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-3">
                <label>Parcial 3</label>

                <input
                  className="form-control"
                  type="number"
                  name="Parcial3"
                  value={form.Parcial3}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-3">
                <label>Parcial 4</label>

                <input
                  className="form-control"
                  type="number"
                  name="Parcial4"
                  value={form.Parcial4}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <div className="d-flex gap-3">

              <button
                className="btn btn-primary"
                type="submit"
              >
                {editando ? "Actualizar" : "Guardar"}
              </button>

              {editando && (

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={limpiarFormulario}
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
          <h2>Calificaciones Registradas</h2>
        </div>

        <table className="table table-bordered table-striped">

          <thead className="table-dark">
            <tr>
              <th>Alumno</th>
              <th>Clase</th>
              <th>P1</th>
              <th>P2</th>
              <th>P3</th>
              <th>P4</th>
              <th>Promedio</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {calificaciones.map((c) => (

              <tr key={c.ID_Calificacion}>

                <td>
                  {c.Alumno
                    ? `${c.Alumno.Nombre} ${c.Alumno.Apellido}`
                    : ""}
                </td>

                <td>
                  {c.Clase
                    ? c.Clase.Nombre_Clase
                    : ""}
                </td>

                <td>{c.Parcial1}</td>
                <td>{c.Parcial2}</td>
                <td>{c.Parcial3}</td>
                <td>{c.Parcial4}</td>
                <td>
                  <strong>{c.Promedio}</strong>
                </td>

                <td>

                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editar(c)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminar(c.ID_Calificacion)}
                  >
                    Eliminar
                  </button>

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

export default Calificaciones;