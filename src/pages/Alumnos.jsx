import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "../store";
import fetchers from "../store/slices/Alumnos/fetchers";
import PadreAutocomplete from "../components/work/PadreAutocomplete";
import { obtenerSeccionesUnicas } from "../utilities/seccionUnica";
import Swal from "sweetalert2";

const Alumnos = () => {
  const dispatch = useDispatch();
  const formularioRef = useRef(null);

  const [alumnos, setAlumnos] = useState([]);
  const [grados, setGrados] = useState([]);

  const mapaSecciones = obtenerSeccionesUnicas(grados);
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const [vista, setVista] = useState("formulario"); //Tesly prueba 
  const [gradoConsulta, setGradoConsulta] = useState("");
  const [padreEditar, setPadreEditar] = useState(null);
const [busquedaConsulta, setBusquedaConsulta] = useState("");
  const [form, setForm] = useState({
  DNI: "",
  DNI_Padre: "",
  ID_Grado: "",
  Nombre: "",
  Apellido: "",
  Fecha_Nacimiento: "",
  Direccion: "",
  Genero: "",
});


  const cargarAlumnos = () => {
    dispatch(fetchers.getAlumnos({ url: "/alumnos" }))
      .then((res) => setAlumnos(res.payload?.alumnosInfo ?? []))
      .catch((error) => console.error(error));
  };

  const cargarGrados = () => {
    dispatch(fetchers.getGrados({ url: "/grados" }))
      .then((res) => setGrados(res.payload?.gradosInfo ?? []))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    cargarAlumnos();
    cargarGrados();
  }, []);

  const limpiarFormulario = () => {
    setForm({
  ID_Grado: "",
  DNI: "",
  DNI_Padre: "",
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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payloadData = {
      DNI: editando ? idEditar : form.DNI,
      DNI_Padre: form.DNI_Padre || null,
      ID_Grado: Number(form.ID_Grado),
      Nombre: form.Nombre,
      Apellido: form.Apellido,
      Fecha_Nacimiento: form.Fecha_Nacimiento,
      Direccion: form.Direccion,
      Genero: form.Genero,
    };

    const action = editando ? fetchers.updateAlumno : fetchers.insertAlumno;
    const url = editando ? "/updateAlumno" : "/insertAlumno";

    const res = await dispatch(
      action({
        url,
        data: payloadData,
      })
    ).catch((error) => {
      console.error("Error:", error);
      Swal.fire({
  icon: "error",
  title: "Error",
  text: "Error al guardar alumno",
  confirmButtonText: "Aceptar",
});
      return null;
    });

    if (!res) return;

    if (res.payload?.error) {
      console.error("Error:", res.payload.error);
     Swal.fire({
  icon: "error",
  title: "Error",
  text:
    res.payload.error.message ||
    (editando
      ? "Error al actualizar alumno"
      : "Error al registrar alumno"),
  confirmButtonText: "Aceptar",
});
      return;
    }

    Swal.fire({
  icon: "success",
  title: "¡Éxito!",
  text: editando
    ? "Alumno actualizado correctamente"
    : "Alumno registrado correctamente",
  confirmButtonText: "Aceptar",
});

limpiarFormulario();
cargarAlumnos();
};

  const editar = (alumno) => {
  setForm({
    ID_Grado: alumno.ID_Grado ? String(alumno.ID_Grado) : "",
    DNI: alumno.DNI || "",
    DNI_Padre: alumno.DNI_Padre || "",
    Nombre: alumno.Nombre || "",
    Apellido: alumno.Apellido || "",
    Fecha_Nacimiento: alumno.Fecha_Nacimiento
      ? String(alumno.Fecha_Nacimiento).slice(0, 10)
      : "",
    Direccion: alumno.Direccion || "",
    Genero: alumno.Genero || "",
  });

  setPadreEditar(alumno.Padre || null);

  setEditando(true);
  setIdEditar(alumno.DNI);

  setTimeout(() => {
    formularioRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
};


  const eliminar = async (id) => {
    const confirmar = await Swal.fire({
  title: "¿Eliminar alumno?",
  text: "Esta acción no se puede deshacer.",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#d33",
  cancelButtonColor: "#6c757d",
  confirmButtonText: "Sí, eliminar",
  cancelButtonText: "Cancelar",
});

if (!confirmar.isConfirmed) return;

    try {
      await dispatch(
        fetchers.deleteAlumno({
          url: `/deleteAlumno/${id}`,
        })
      );
      Swal.fire({
  icon: "success",
  title: "Eliminado",
  text: "Alumno eliminado correctamente",
  confirmButtonText: "Aceptar",
});
      cargarAlumnos();
    } catch (error) {
      console.error(error);
      Swal.fire({
  icon: "error",
  title: "Error",
  text: "Error al eliminar alumno",
  confirmButtonText: "Aceptar",
});
    }
  };

  const obtenerNombreGrado = (alumno) => {
    const gradoEncontrado = grados.find(
      (g) => String(g.ID_Grado) === String(alumno.ID_Grado)
    );

    return gradoEncontrado?.Nombre_Grado || gradoEncontrado?.Nombre || alumno.ID_Grado || "Sin grado";
  };

  return (
  <section className="module-page">
    <div className="module-container">

      <div className="module-header">
        <span className="module-label">Gestión académica</span>
        <h1>Alumnos</h1>
        <p>
          Registra, consulta y administra la información de los estudiantes.
        </p>
      </div>

      <div className="module-card">
        <h2 className="module-card-title">
          {editando ? "Editar alumno" : "Registrar alumno"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            <div className="col-12 col-md-6">
              <label className="form-label">Padre o encargado</label>

              <PadreAutocomplete
                onSelect={(padre) =>
                  setForm({
                    ...form,
                    DNI_Padre: padre.DNI,
                  })
                }
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">
                Número de identidad del alumno
              </label>

              <input
                type="text"
                className="form-control"
                name="DNI"
                value={form.DNI}
                onChange={handleChange}
                maxLength={13}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Nombre</label>

              <input
                type="text"
                className="form-control"
                name="Nombre"
                value={form.Nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Apellido</label>

              <input
                type="text"
                className="form-control"
                name="Apellido"
                value={form.Apellido}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Fecha de nacimiento</label>

              <input
                type="date"
                className="form-control"
                name="Fecha_Nacimiento"
                value={form.Fecha_Nacimiento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Dirección</label>

              <input
                type="text"
                className="form-control"
                name="Direccion"
                value={form.Direccion}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Género</label>

              <select
                className="form-select"
                name="Genero"
                value={form.Genero}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione género</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Grado</label>

              <select
                className="form-select"
                name="ID_Grado"
                value={form.ID_Grado}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione grado</option>

                {grados.map((grado) => (
                  <option
                    key={grado.ID_Grado}
                    value={grado.ID_Grado}
                  >
                    {grado.Nombre_Grado} - {mapaSecciones[grado.ID_Grado]}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="d-flex flex-wrap gap-2 mt-4">
            <button
              type="submit"
              className="module-primary-btn"
            >
              {editando ? "Actualizar alumno" : "Guardar alumno"}
            </button>

          
          </div>
        </form>
      </div>

      <div className="module-card">
        <div className="module-card-header">
          <div>
            <h2 className="module-card-title mb-1">
              Alumnos registrados
            </h2>

            <p className="module-card-description">
              Total de alumnos: {alumnos.length}
            </p>
          </div>
        </div>

        {alumnos.length === 0 ? (
          <div className="module-empty-state">
            <i className="fas fa-user-graduate"></i>
            <h3>No hay alumnos registrados</h3>
            <p>Los alumnos registrados aparecerán en esta sección.</p>
          </div>
        ) : (
          <div className="row g-4">
            {alumnos.map((alumno) => (
              <div
                className="col-12 col-md-6 col-xl-4"
                key={alumno.DNI}
              >
                <div className="student-card">
                  <div className="student-card-top">
                    <div className="student-avatar">
                      {alumno.Nombre?.charAt(0)}
                      {alumno.Apellido?.charAt(0)}
                    </div>

                    <div className="student-info">
                      <h3>
                        {alumno.Nombre} {alumno.Apellido}
                      </h3>

                      <span className="student-grade">
                        {alumno.Grado?.Nombre_Grado ||
                          obtenerNombreGrado(alumno.ID_Grado)}
                      </span>
                    </div>
                  </div>

                  <div className="student-details">
                    <div className="student-detail-item">
                      <span>Identidad</span>
                      <strong>{alumno.DNI}</strong>
                    </div>

                    <div className="student-detail-item">
                      <span>Dirección</span>
                      <strong>{alumno.Direccion || "No registrada"}</strong>
                    </div>

                    <div className="student-detail-item">
                      <span>Género</span>
                      <strong>
                        {alumno.Genero === "F"
                          ? "Femenino"
                          : alumno.Genero === "M"
                            ? "Masculino"
                            : "No registrado"}
                      </strong>
                    </div>

                    <div className="student-detail-item">
                      <span>Fecha de nacimiento</span>
                      <strong>
                        {alumno.Fecha_Nacimiento || "No registrada"}
                      </strong>
                    </div>
                  </div>

                  <div className="student-actions">
                    <button
                      type="button"
                      className="btn btn-warning student-btn"
                      onClick={() => editar(alumno)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger student-btn"
                      onClick={() => eliminar(alumno.DNI)}
                    >
                      Eliminar
                    </button>
                  </div>
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


export default Alumnos;