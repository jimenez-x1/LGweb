import React, { useEffect, useState } from "react";
import { useDispatch } from "../store";
import fetchers from "../store/slices/Alumnos/fetchers";

const Alumnos = () => {
  const dispatch = useDispatch(); // Hook para ejecutar acciones de Redux

  const [alumnos, setAlumnos] = useState([]); // Guarda lista de alumnos
  const [grados, setGrados] = useState([]); // Guarda lista de grados
  const [form, setForm] = useState({ // Estado del formularioq
    Direccion: "",
    Genero: "",
  });

  const [editando, setEditando] = useState(false); // Indica si está en modo editar
  const [idEditar, setIdEditar] = useState(null); // Guarda ID del alumno que se edita

  const cargarAlumnos = () => {
    // Llama al backend para obtener alumnos
    dispatch(fetchers.getAlumnos({ url: "/alumnos" }))
      .then((res) => {
        setAlumnos(res.payload?.alumnosInfo ?? []); // Guarda los alumnos en el estado
      })
      .catch((error) => console.error(error));
  };

  const cargarGrados = () => {
    // Llama al backend para obtener grados
    dispatch(fetchers.getGrados({ url: "/grados" }))
      .then((res) => {
        setGrados(res.payload?.gradosInfo ?? []); // Guarda los grados
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    // Se ejecuta al cargar la página
    cargarAlumnos();
    cargarGrados();
  }, []);

  const limpiarFormulario = () => {
    // Reinicia el formulario y sale del modo edición
    setForm({
      ID_Grado: "",
      Nombre: "",
      Apellido: "",
      Fecha_Nacimiento: "",
      Direccion: "",
      Genero: "",
    });
    setEditando(false);
    setIdEditar(null);
  };

  const handleChange = (e) => {
    // Actualiza los valores del formulario según lo que escribe el usuario
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita recargar la página

    try {
      if (editando) {
        // Si está editando, actualiza el alumno
        await dispatch(
          fetchers.updateAlumno({
            url: "/updateAlumno",
            data: {
              ...form,
              ID_Alumno: idEditar,
              ID_Grado: Number(form.ID_Grado),
            },
          })
        );
        alert("Alumno actualizado correctamente");
      } else {
        // Si no, crea un nuevo alumno
        await dispatch(
          fetchers.insertAlumno({
            url: "/insertAlumno",
            data: {
              ...form,
              ID_Grado: Number(form.ID_Grado),
            },
          })
        );
        alert("Alumno registrado correctamente");
      }

      limpiarFormulario(); // Limpia el form
      cargarAlumnos(); // Recarga lista
    } catch (error) {
      console.error(error);
      alert("Error al guardar alumno");
    }
  };

  const editar = (alumno) => {
    // Carga los datos del alumno en el formulario
    setForm({
      ID_Grado: alumno.ID_Grado ? String(alumno.ID_Grado) : "",
      Nombre: alumno.Nombre || "",
      Apellido: alumno.Apellido || "",
      Fecha_Nacimiento: alumno.Fecha_Nacimiento
        ? String(alumno.Fecha_Nacimiento).slice(0, 10)
        : "",
      Direccion: alumno.Direccion || "",
      Genero: alumno.Genero || "",
    });

    setEditando(true); // Activa modo edición
    setIdEditar(alumno.ID_Alumno); // Guarda ID del alumno
  };

  const eliminar = async (id) => {
    // Pregunta confirmación antes de eliminar
    const confirmar = window.confirm("¿Eliminar este alumno?");
    if (!confirmar) return;

    try {
      // Llama al backend para eliminar
      await dispatch(
        fetchers.deleteAlumno({
          url: `/deleteAlumno/${id}`,
        })
      );

      alert("Alumno eliminado correctamente");
      cargarAlumnos(); // Recarga lista
    } catch (error) {
      console.error(error);
      alert("Error al eliminar alumno");
    }
  };

  const obtenerNombreGrado = (alumno) => {
    // Busca el nombre del grado según el ID del alumno
    const gradoEncontrado = grados.find(
      (g) => String(g.ID_Grado) === String(alumno.ID_Grado)
    );

    return (
      gradoEncontrado?.Nombre_Grado ||
      gradoEncontrado?.Nombre ||
      alumno.ID_Grado ||
      "Sin grado"
    );
  };

  return (
    <section className="pt_100 pb_100">
      <div className="container">
        <div className="row mb_40">
          <div className="col-12 text-center">
            <div className="tf__heading_area">
              <h5>Formulario</h5>
              <h2>{editando ? "Editar Alumno" : "Registrar Alumno"}</h2>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="p-4 border rounded bg-white shadow-sm">
              <form onSubmit={handleSubmit}>
                {/* Inputs del formulario */}
                
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    name="Nombre"
                    className="form-control"
                    value={form.Nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    type="text"
                    name="Apellido"
                    className="form-control"
                    value={form.Apellido}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Fecha de nacimiento</label>
                  <input
                    type="date"
                    name="Fecha_Nacimiento"
                    className="form-control"
                    value={form.Fecha_Nacimiento}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Dirección</label>
                  <input
                    type="text"
                    name="Direccion"
                    className="form-control"
                    value={form.Direccion}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Género</label>
                  <select
                    name="Genero"
                    className="form-control"
                    value={form.Genero}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione género</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label">Grado</label>
                  <select
                    name="ID_Grado"
                    className="form-control"
                    value={form.ID_Grado}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione grado</option>
                    {grados.map((grado) => (
                      <option key={grado.ID_Grado} value={grado.ID_Grado}>
                        {grado.Nombre_Grado || grado.Nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="d-flex gap-3">
                  <button type="submit" className="common_btn">
                    {editando ? "Actualizar Alumno" : "Guardar Alumno"}
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

        {/* Listado de alumnos */}
        <div className="row mt_50">
          <div className="col-12">
            <div className="tf__heading_area mb_30">
              <h2>Listado Alumnos Registrados</h2>
            </div>

            <div className="row">
              {alumnos.map((alumno) => (
                <div className="col-md-6 col-lg-4 mb_30" key={alumno.ID_Alumno}>
                  <div className="tf__single_courses">
                    <div className="tf__single_courses_text">
                      <h3>
                        {alumno.Nombre} {alumno.Apellido}
                      </h3>

                      <p><strong>Dirección:</strong> {alumno.Direccion}</p>
                      <p><strong>Género:</strong> {alumno.Genero}</p>
                      <p>
                        <strong>Fecha de nacimiento:</strong>{" "}
                        {alumno.Fecha_Nacimiento
                          ? String(alumno.Fecha_Nacimiento).slice(0, 10)
                          : ""}
                      </p>
                      <p><strong>Grado:</strong> {obtenerNombreGrado(alumno)}</p>

                      <div className="mt-3 d-flex gap-2">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => editar(alumno)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminar(alumno.ID_Alumno)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Alumnos;