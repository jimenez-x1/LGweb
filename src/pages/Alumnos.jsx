import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "../store";
import fetchers from "../store/slices/Alumnos/fetchers";
import PadreAutocomplete from "../components/work/PadreAutocomplete";

const Alumnos = () => {
  const dispatch = useDispatch();
  const formularioRef = useRef(null);

  const [alumnos, setAlumnos] = useState([]);
  const [grados, setGrados] = useState([]);
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
      alert("Error al guardar alumno");
      return null;
    });

    if (!res) return;

    if (res.payload?.error) {
      console.error("Error:", res.payload.error);
      alert(
        res.payload.error.message ||
          (editando ? "Error al actualizar alumno" : "Error al registrar alumno")
      );
      return;
    }

    alert(editando ? "Alumno actualizado correctamente" : "Alumno registrado correctamente");
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
    const confirmar = window.confirm("¿Eliminar este alumno?");
    if (!confirmar) return;

    try {
      await dispatch(
        fetchers.deleteAlumno({
          url: `/deleteAlumno/${id}`,
        })
      );
      alert("Alumno eliminado correctamente");
      cargarAlumnos();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar alumno");
    }
  };

  const obtenerNombreGrado = (alumno) => {
    const gradoEncontrado = grados.find(
      (g) => String(g.ID_Grado) === String(alumno.ID_Grado)
    );

    return gradoEncontrado?.Nombre_Grado || gradoEncontrado?.Nombre || alumno.ID_Grado || "Sin grado";
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

      <div className="row justify-content-center" ref={formularioRef}>
        <div className="col-lg-8">
          <div className="p-4 border rounded bg-white shadow-sm">
            <form onSubmit={handleSubmit}>

              {/* Padre o Encargado */}
              <div className="mb-3">
                <label className="form-label">Padre o Encargado</label>
                

              <PadreAutocomplete
  padreSeleccionado={padreEditar}
  onSelect={(padre) => {
    setPadreEditar(padre);

    setForm((prev) => ({
      ...prev,
      DNI_Padre: padre ? padre.DNI : "",
    }));
  }}
                />
              </div>

              {/* DNI del Alumno */}
              <div className="mb-3">
                <label className="form-label">
                  Número de identidad del alumno
                </label>

                <input
                  type="text"
                  name="DNI"
                  className="form-control"
                  value={form.DNI}
                  onChange={handleChange}
                  maxLength={13}
                  required
                />
              </div>

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
                        {grado.Nombre_Grado || grado.Nombre} - {grado.Seccion}
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

        <div className="row mt_50">
          <div className="col-12">
            <div className="tf__heading_area mb_30">
              <h2>Listado Alumnos Registrados</h2>
            </div>

            <div className="row">
              {alumnos.map((alumno) => (
                <div className="col-md-6 col-lg-4 mb_30" key={alumno.DNI}>
                  <div className="tf__single_courses">
                    <div className="tf__single_courses_text">
                      <h3>
                        {alumno.Nombre} {alumno.Apellido}
                      </h3>
                      <p>
                        <strong>Identidad:</strong> {alumno.DNI}
                      </p>

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
                          onClick={() => eliminar(alumno.DNI)}
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