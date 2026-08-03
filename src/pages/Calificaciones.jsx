import React, { useEffect, useState } from "react";
import { useDispatch } from "../store";
import axios from "axios";
import Swal from "sweetalert2";

import calificacionFetchers from "../store/slices/Calificaciones/fetchers";
import gradoFetchers from "../store/slices/Grado/fetchers";
import claseFetchers from "../store/slices/Clase/fetchers";
import alumnoFetchers from "../store/slices/Alumnos/fetchers";

const Calificaciones = () => {

    const dispatch = useDispatch();

    // ============================
    // Estados
    // ============================

    const [grados, setGrados] = useState([]);
    const [clases, setClases] = useState([]);
    const [alumnos, setAlumnos] = useState([]);

    const [gradoSeleccionado, setGradoSeleccionado] = useState("");
    const [claseSeleccionada, setClaseSeleccionada] = useState("");

    const [notas, setNotas] = useState({});
    const [busqueda, setBusqueda] = useState("");

    const [cargandoAlumnos, setCargandoAlumnos] = useState(false);
    const [cargandoClases, setCargandoClases] = useState(false);
    const [cargandoNotas, setCargandoNotas] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const [cambiosSinGuardar, setCambiosSinGuardar] = useState(false);

    // ============================
    // Al abrir la página
    // ============================

    useEffect(() => {

        cargarGrados();

    }, []);

    // ============================
    // Cuando cambia el grado
    // ============================

    useEffect(() => {

        if (gradoSeleccionado === "") {

            setClases([]);
            setAlumnos([]);
            setClaseSeleccionada("");
            setNotas({});
            setCambiosSinGuardar(false);

            return;

        }

        setClaseSeleccionada("");
        setNotas({});
        setCambiosSinGuardar(false);

        cargarClases();
        cargarAlumnos();

    }, [gradoSeleccionado]);

    // ============================
    // Cuando cambia la clase
    // ============================

    useEffect(() => {

        setNotas({});
        setCambiosSinGuardar(false);

        if (claseSeleccionada !== "") {

            cargarCalificaciones();

        }

    }, [claseSeleccionada]);

    // ============================
    // Cargar grados
    // ============================

    const cargarGrados = () => {

        dispatch(
            gradoFetchers.getGrados({
                url: "/grados"
            })
        )
        .then((res) => {

            setGrados(res.payload?.gradosInfo ?? []);

        })
        .catch(console.error);

    };

    // ============================
    // Cargar clases del grado
    // ============================

    const cargarClases = () => {

        setCargandoClases(true);

        dispatch(
            claseFetchers.getClases({
                url: `/grado-clase/${gradoSeleccionado}`
            })
        )
        .then((res) => {

            setClases(res.payload?.clasesInfo ?? []);

        })
        .catch(console.error)
        .finally(() => setCargandoClases(false));

    };

    // ============================
    // Cargar alumnos
    // ============================

    const cargarAlumnos = () => {

        setCargandoAlumnos(true);

        dispatch(
            alumnoFetchers.getAlumnos({
                url: "/alumnos"
            })
        )
        .then((res) => {

            const lista = res.payload?.alumnosInfo ?? [];

            const filtrados = lista.filter(
                alumno => alumno.ID_Grado == gradoSeleccionado
            );

            setAlumnos(filtrados);

        })
        .catch(console.error)
        .finally(() => setCargandoAlumnos(false));

    };

    // ============================
    // Cargar calificaciones guardadas
    // ============================

    const cargarCalificaciones = () => {

        setCargandoNotas(true);

        dispatch(
            calificacionFetchers.getCalificaciones({
                url: "/calificaciones"
            })
        )
        .then((res) => {

            const lista = res.payload?.calificacionesInfo ?? [];

            const nuevasNotas = {};

            lista.forEach((calificacion) => {

                if (calificacion.ID_Clase == claseSeleccionada) {

                    nuevasNotas[calificacion.DNI_Alumno] = {

                        ID_Calificacion: calificacion.ID_Calificacion,
                        Parcial1: calificacion.Parcial1 ?? "",
                        Parcial2: calificacion.Parcial2 ?? "",
                        Parcial3: calificacion.Parcial3 ?? "",
                        Parcial4: calificacion.Parcial4 ?? "",
                        Reposicion: calificacion.Reposicion ?? ""

                    };

                }

            });

            setNotas(nuevasNotas);
            setCambiosSinGuardar(false);

        })
        .catch(console.error)
        .finally(() => setCargandoNotas(false));

    };

    // ============================
    // Cambiar grado / clase (con aviso de cambios sin guardar)
    // ============================

    const cambiarGrado = async (valor) => {

        if (cambiosSinGuardar) {

            const confirmar = await Swal.fire({
  icon: "warning",
  title: "Cambios sin guardar",
  text: "Si continúas perderás los cambios realizados.",
  showCancelButton: true,
  confirmButtonText: "Continuar",
  cancelButtonText: "Cancelar",
});

if (!confirmar.isConfirmed) return;

        }

        setGradoSeleccionado(valor);

    };

    const cambiarClase = async (valor) => {

        if (cambiosSinGuardar) {

            const confirmar = await Swal.fire({
  icon: "warning",
  title: "Cambios sin guardar",
  text: "Si continúas perderás los cambios realizados.",
  showCancelButton: true,
  confirmButtonText: "Continuar",
  cancelButtonText: "Cancelar",
});

if (!confirmar.isConfirmed) return;

        }

        setClaseSeleccionada(valor);

    };

    // ============================
    // Cambiar nota
    // ============================

    const cambiarNota = (dni, parcial, valor) => {

        if (valor !== "" && (Number(valor) < 0 || Number(valor) > 100)) {

            return;

        }

        setNotas((prev) => ({

            ...prev,

            [dni]: {

                ...prev[dni],

                [parcial]: valor

            }

        }));

        setCambiosSinGuardar(true);

    };

    // ============================
    // Guardar cambios
    // ============================

    const guardarCambios = async () => {

        if (claseSeleccionada === "") {

            await Swal.fire({
  icon: "warning",
  title: "Clase requerida",
  text: "Seleccione una clase",
  confirmButtonText: "Aceptar",
});
            return;

        }

        if (alumnos.length === 0) {

            await Swal.fire({
  icon: "warning",
  title: "Sin alumnos",
  text: "No hay alumnos para guardar.",
  confirmButtonText: "Aceptar",
});
            return;

        }

        if (guardando) return;

        setGuardando(true);

        try {

            for (const alumno of alumnos) {

                const nota = notas[alumno.DNI] || {};

                await dispatch(

                    calificacionFetchers.insertCalificacion({

                        url: "/calificaciones",

                        data: {

                            DNI_Alumno: alumno.DNI,

                            ID_Clase: Number(claseSeleccionada),

                            Parcial1:
                                nota.Parcial1 === "" || nota.Parcial1 == null
                                    ? null
                                    : Number(nota.Parcial1),

                            Parcial2:
                                nota.Parcial2 === "" || nota.Parcial2 == null
                                    ? null
                                    : Number(nota.Parcial2),

                            Parcial3:
                                nota.Parcial3 === "" || nota.Parcial3 == null
                                    ? null
                                    : Number(nota.Parcial3),

                            Parcial4:
                                nota.Parcial4 === "" || nota.Parcial4 == null
                                    ? null
                                    : Number(nota.Parcial4),

                            Reposicion:
                                nota.Reposicion === "" || nota.Reposicion == null
                                    ? null
                                    : Number(nota.Reposicion)

                        }

                    })

                );

            }

            await Swal.fire({
  icon: "success",
  title: "Guardado",
  text: "Calificaciones guardadas correctamente",
  confirmButtonText: "Aceptar",
});

            await cargarCalificaciones();

        } catch (error) {

            console.error(error);

            Swal.fire({
  icon: "error",
  title: "Error",
  text: "No se pudieron guardar las calificaciones",
  confirmButtonText: "Aceptar",
});

        } finally {

            setGuardando(false);

        }

    };

    // ============================
    // Eliminar calificación
    // ============================

    const eliminarCalificacion = async (alumno) => {

        const idCalificacion = notas[alumno.DNI]?.ID_Calificacion;

        if (!idCalificacion) return;

        const confirmar = await Swal.fire({
  icon: "warning",
  title: "¿Eliminar calificación?",
  text: `¿Eliminar por completo el registro de ${alumno.Nombre} ${alumno.Apellido}?`,
  showCancelButton: true,
  confirmButtonText: "Sí, eliminar",
  cancelButtonText: "Cancelar",
});

if (!confirmar.isConfirmed) return;

        try {

            await dispatch(
                calificacionFetchers.deleteCalificacion({
                    url: `/calificaciones/${idCalificacion}`
                })
            );

            await cargarCalificaciones();

        } catch (error) {

            console.error(error);
            Swal.fire({
  icon: "error",
  title: "Error",
  text: "No se pudo eliminar la calificación",
  confirmButtonText: "Aceptar",
});

        }

    };

    // ============================
    // Generar boletín individual (un alumno por PDF)
    // ============================

    const generarBoletin = async (alumno) => {

        try {

            const response = await axios.get(
                `http://localhost:3000/api/alumno/${alumno.DNI}/boletin`,
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `boletin_${alumno.DNI}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {

            console.error(error);
            Swal.fire({
  icon: "error",
  title: "Error",
  text: "No se pudo generar el boletín",
  confirmButtonText: "Aceptar",
});

        }

    };

    // ============================
    // Filtrado por búsqueda
    // ============================
    const alumnosFiltrados = alumnos.filter((alumno) => {

        const texto = busqueda.trim().toLowerCase();

        if (texto === "") return true;

        const nombreCompleto = `${alumno.Nombre} ${alumno.Apellido}`.toLowerCase();

        return (
            nombreCompleto.includes(texto) ||
            String(alumno.DNI).toLowerCase().includes(texto)
        );

    });

    const cargando = cargandoAlumnos || cargandoClases || cargandoNotas;

    return (
  <section className="module-page">
    <div className="module-container">

      {/* ENCABEZADO */}
      <div className="module-header">
        <span className="module-label">Gestión académica</span>

        <h1>Calificaciones</h1>

        <p>
          Registra, consulta y administra las calificaciones de los alumnos.
        </p>
      </div>

      {/* FILTROS */}
      <div className="module-card">
        <div className="module-card-header">
          <div>
            <h2 className="module-card-title mb-1">
              Selección académica
            </h2>

            <p className="module-card-description">
              Selecciona el grado y la clase para gestionar las notas.
            </p>
          </div>
        </div>

        <div className="row g-3">

          {/* GRADO */}
          <div className="col-12 col-md-6 col-xl-3">
            <label className="form-label">Grado</label>

            <select
              className="form-select"
              value={gradoSeleccionado}
              onChange={(e) => cambiarGrado(e.target.value)}
            >
              <option value="">Seleccione un grado</option>

              {grados.map((grado) => (
                <option
                  key={grado.ID_Grado}
                  value={grado.ID_Grado}
                >
                  {grado.Nombre_Grado} - {grado.Seccion}
                </option>
              ))}
            </select>
          </div>

          {/* CLASE */}
          <div className="col-12 col-md-6 col-xl-3">
            <label className="form-label">Clase</label>

            <select
              className="form-select"
              value={claseSeleccionada}
              onChange={(e) => cambiarClase(e.target.value)}
              disabled={
                gradoSeleccionado === "" ||
                cargandoClases
              }
            >
              <option value="">
                {cargandoClases
                  ? "Cargando clases..."
                  : "Seleccione una clase"}
              </option>

              {clases.map((item) => (
                <option
                  key={item.ID_Clase}
                  value={item.ID_Clase}
                >
                  {item.Clase.Nombre_Clase}
                </option>
              ))}
            </select>
          </div>

          {/* BUSCADOR */}
          <div className="col-12 col-md-8 col-xl-4">
            <label className="form-label">
              Buscar alumno
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre o DNI"
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
            />
          </div>

          {/* GUARDAR */}
          <div className="col-12 col-md-4 col-xl-2 d-flex align-items-end">
            <button
              type="button"
              className="module-primary-btn w-100"
              onClick={guardarCambios}
              disabled={guardando || cargando}
            >
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          </div>

        </div>

        {cambiosSinGuardar && (
          <div className="calificaciones-warning mt-3">
            <i className="fas fa-exclamation-circle"></i>

            <span>
              Hay cambios pendientes de guardar.
            </span>
          </div>
        )}
      </div>

      {/* TABLA DE CALIFICACIONES */}
      <div className="module-card">
        <div className="module-card-header">
          <div>
            <h2 className="module-card-title mb-1">
              Registro de calificaciones
            </h2>

            <p className="module-card-description">
              Total de alumnos: {alumnosFiltrados.length}
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table module-table calificaciones-table">
            <thead>
              <tr>
                <th>DNI</th>
                <th>Alumno</th>
                <th>Parcial 1</th>
                <th>Parcial 2</th>
                <th>Parcial 3</th>
                <th>Parcial 4</th>
                <th>Recuperación</th>
                <th>Promedio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {cargando ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-5"
                  >
                    <div className="calificaciones-loading">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">
                          Cargando...
                        </span>
                      </div>

                      <span>Cargando información...</span>
                    </div>
                  </td>
                </tr>
              ) : alumnosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center text-muted py-5"
                  >
                    {gradoSeleccionado === ""
                      ? "Seleccione un grado para consultar los alumnos."
                      : "No hay alumnos para este grado."}
                  </td>
                </tr>
              ) : (
                alumnosFiltrados.map((alumno) => {
                  const nota =
                    notas[alumno.DNI] || {};

                  const parciales = [
                    nota.Parcial1,
                    nota.Parcial2,
                    nota.Parcial3,
                    nota.Parcial4,
                  ].filter(
                    (valor) =>
                      valor !== "" &&
                      valor != null
                  );

                  const promedio =
                    parciales.length === 0
                      ? null
                      : parciales.reduce(
                          (suma, valor) =>
                            suma + Number(valor),
                          0
                        ) / parciales.length;

                  const aprobado =
                    promedio !== null &&
                    promedio >= 70;

                  return (
                    <tr key={alumno.DNI}>
                      {/* DNI */}
                      <td>
                        <span className="calificaciones-dni">
                          {alumno.DNI}
                        </span>
                      </td>

                      {/* NOMBRE */}
                      <td>
                        <div className="calificaciones-alumno">
                          <div className="calificaciones-avatar">
                            {alumno.Nombre?.charAt(0)}
                            {alumno.Apellido?.charAt(0)}
                          </div>

                          <div>
                            <strong>
                              {alumno.Nombre}{" "}
                              {alumno.Apellido}
                            </strong>
                          </div>
                        </div>
                      </td>

                      {/* PARCIAL 1 */}
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="form-control form-control-sm calificacion-input"
                          value={
                            notas[alumno.DNI]
                              ?.Parcial1 ?? ""
                          }
                          onChange={(e) =>
                            cambiarNota(
                              alumno.DNI,
                              "Parcial1",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      {/* PARCIAL 2 */}
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="form-control form-control-sm calificacion-input"
                          value={
                            notas[alumno.DNI]
                              ?.Parcial2 ?? ""
                          }
                          onChange={(e) =>
                            cambiarNota(
                              alumno.DNI,
                              "Parcial2",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      {/* PARCIAL 3 */}
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="form-control form-control-sm calificacion-input"
                          value={
                            notas[alumno.DNI]
                              ?.Parcial3 ?? ""
                          }
                          onChange={(e) =>
                            cambiarNota(
                              alumno.DNI,
                              "Parcial3",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      {/* PARCIAL 4 */}
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="form-control form-control-sm calificacion-input"
                          value={
                            notas[alumno.DNI]
                              ?.Parcial4 ?? ""
                          }
                          onChange={(e) =>
                            cambiarNota(
                              alumno.DNI,
                              "Parcial4",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      {/* RECUPERACIÓN */}
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="form-control form-control-sm calificacion-input"
                          value={
                            notas[alumno.DNI]
                              ?.Reposicion ?? ""
                          }
                          onChange={(e) =>
                            cambiarNota(
                              alumno.DNI,
                              "Reposicion",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      {/* PROMEDIO */}
                      <td>
                        <strong className="calificacion-promedio">
                          {promedio === null
                            ? "—"
                            : promedio.toFixed(2)}
                        </strong>
                      </td>

                      {/* ESTADO */}
                      <td>
                        {promedio === null ? (
                          <span className="text-muted">
                            —
                          </span>
                        ) : (
                          <span
                            className={
                              aprobado
                                ? "calificacion-status status-approved"
                                : "calificacion-status status-failed"
                            }
                          >
                            {aprobado
                              ? "Aprobado"
                              : "Reprobado"}
                          </span>
                        )}
                      </td>

                      {/* ACCIONES */}
                      <td>
                        <div className="calificaciones-actions">
                          <button
                            type="button"
                            className="btn calificacion-boletin-btn"
                            onClick={() =>
                              generarBoletin(alumno)
                            }
                          >
                            Boletín
                          </button>

                          <button
                            type="button"
                            className="btn btn-danger calificacion-delete-btn"
                            onClick={() =>
                              eliminarCalificacion(
                                alumno
                              )
                            }
                            disabled={
                              !notas[alumno.DNI]
                                ?.ID_Calificacion
                            }
                            title={
                              notas[alumno.DNI]
                                ?.ID_Calificacion
                                ? "Eliminar este registro de calificación"
                                : "Este alumno aún no tiene una calificación guardada"
                            }
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </section>
);

};

export default Calificaciones;