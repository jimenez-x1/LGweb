import React, { useEffect, useState } from "react";
import { useDispatch } from "../store";
import fetchers from "../store/slices/Calificaciones/fetchers";
import AlumnoAutocomplete from "../components/AlumnoAutocomplete";

const Calificaciones = () => {

  const dispatch = useDispatch();

  const [calificaciones, setCalificaciones] = useState([]);
  const [clases, setClases] = useState([]);

  const [form, setForm] = useState({
    DNI_Alumno: "",
    ID_Clase: "",
    Parcial: "1",
    Nota: "",
  });

  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  useEffect(() => {
    cargarCalificaciones();
    cargarClases();
  }, []);

  const cargarCalificaciones = () => {

    dispatch(
      fetchers.getCalificaciones({
        url: "/calificaciones",
      })
    )
      .then((res) => {
        setCalificaciones(res.payload?.calificacionesInfo ?? []);
      })
      .catch(console.error);

  };

  const cargarClases = () => {

    dispatch(
      fetchers.getClases({
        url: "/clases",
      })
    )
      .then((res) => {
        setClases(res.payload?.clasesInfo ?? []);
      })
      .catch(console.error);

  };

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleAlumnoSeleccionado = (alumno) => {

    setForm((prev) => ({
      ...prev,
      DNI_Alumno: alumno.DNI,
    }));

  };

  const limpiarFormulario = () => {

    setForm({
      DNI_Alumno: "",
      ID_Clase: "",
      Parcial: "1",
      Nota: "",
    });

    setEditando(false);
    setIdEditar(null);

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const data = {
      DNI_Alumno: form.DNI_Alumno,
      ID_Clase: form.ID_Clase,
      Parcial1: null,
      Parcial2: null,
      Parcial3: null,
      Parcial4: null,
    };

    switch (form.Parcial) {

      case "1":
        data.Parcial1 = Number(form.Nota);
        break;

      case "2":
        data.Parcial2 = Number(form.Nota);
        break;

      case "3":
        data.Parcial3 = Number(form.Nota);
        break;

      case "4":
        data.Parcial4 = Number(form.Nota);
        break;

      default:
        break;

    }

    try {

      if (editando) {

        await dispatch(
          fetchers.updateCalificacion({
            url: "/calificaciones",
            data: {
              ...data,
              ID_Calificacion: idEditar,
            },
          })
        );

        alert("Calificación actualizada");

      } else {

        await dispatch(
          fetchers.insertCalificacion({
            url: "/calificaciones",
            data,
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

    let parcial = "1";
    let nota = "";

    if (c.Parcial1 != null) {
      parcial = "1";
      nota = c.Parcial1;
    } else if (c.Parcial2 != null) {
      parcial = "2";
      nota = c.Parcial2;
    } else if (c.Parcial3 != null) {
      parcial = "3";
      nota = c.Parcial3;
    } else if (c.Parcial4 != null) {
      parcial = "4";
      nota = c.Parcial4;
    }

    setForm({
      DNI_Alumno: c.DNI_Alumno,
      ID_Clase: String(c.ID_Clase),
      Parcial: parcial,
      Nota: nota,
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
          <h5>Calificaciones</h5>
          <h2>
            {editando ? "Actualizar Calificación" : "Registrar Calificación"}
          </h2>
        </div>
      </div>
    </div>

    <div className="row justify-content-center">

      <div className="col-lg-8">

        <div className="card shadow">

          <div className="card-body">

            <form onSubmit={handleSubmit}>

              <div className="mb-3">

                <label className="form-label">
                  Alumno
                </label>

                <AlumnoAutocomplete
                  onSelect={handleAlumnoSeleccionado}
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Clase
                </label>

                <select
                  className="form-control"
                  name="ID_Clase"
                  value={form.ID_Clase}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Seleccione una clase
                  </option>

                  {

                    clases.map((c) => (

                      <option
                        key={c.ID_Clase}
                        value={c.ID_Clase}
                      >
                        {c.Nombre_Clase}
                      </option>

                    ))

                  }

                </select>

              </div>

              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Parcial
                  </label>

                  <select
                    className="form-control"
                    name="Parcial"
                    value={form.Parcial}
                    onChange={handleChange}
                  >

                    <option value="1">
                      Primer Parcial
                    </option>

                    <option value="2">
                      Segundo Parcial
                    </option>

                    <option value="3">
                      Tercer Parcial
                    </option>

                    <option value="4">
                      Cuarto Parcial
                    </option>

                  </select>

                </div>

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Nota
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    name="Nota"
                    value={form.Nota}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    required
                  />

                </div>

              </div>

              <div className="mt-4 d-flex gap-2">

                <button
                  className="btn btn-primary"
                  type="submit"
                >
                  {editando ? "Actualizar" : "Guardar"}
                </button>

                {

                  editando && (

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={limpiarFormulario}
                    >
                      Cancelar
                    </button>

                  )

                }

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
        <div className="row mt_50">

      <div className="col-12">

        <div className="tf__heading_area mb_30">
          <h2>Calificaciones Registradas</h2>
        </div>

        <table className="table table-bordered table-hover">

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

            {

              calificaciones.map((c) => (

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

                  <td>{c.Parcial1 ?? "-"}</td>
                  <td>{c.Parcial2 ?? "-"}</td>
                  <td>{c.Parcial3 ?? "-"}</td>
                  <td>{c.Parcial4 ?? "-"}</td>

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

              ))

            }

          </tbody>

        </table>

      </div>

    </div>

  </div>

</section>

  );

};

export default Calificaciones;