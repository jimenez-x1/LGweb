import React, { useEffect, useState } from "react";
import { useDispatch } from "../store";
import { API_URL } from "../utilities/axiosConfig";

import calificacionFetchers from "../store/slices/Calificaciones/fetchers";
import gradoFetchers from "../store/slices/Grado/fetchers";
import claseFetchers from "../store/slices/Clase/fetchers";
import alumnoFetchers from "../store/slices/Alumnos/fetchers";
import Swal from "sweetalert2";
const MisNotas = () => {

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

   const cargarGrados = async () => {

    try {

        const dniMaestro = localStorage.getItem("USER_ID");

        const res = await fetch(
            `${API_URL}/maestro-grado/${dniMaestro}/alumnos`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("SECURE")}`,
                },
            }
        );

        const data = await res.json();

        if (res.ok && Array.isArray(data)) {

            setGrados(data);

            if (data.length > 0) {

                setGradoSeleccionado(
                    String(data[0].grado.ID_Grado)
                );

            }

        } else {

            setGrados([]);

        }

    } catch (error) {

        console.error(error);

    }

};

    // ============================
    // Cargar clases del grado
    // ============================

    // NOTA: el método correcto es getClases (confirmado en fetchers.ts), no getGradoClase
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

    const grado = grados.find(
        g => String(g.grado.ID_Grado) === gradoSeleccionado
    );

    if (grado) {

        setAlumnos(grado.alumnos ?? []);

    } else {

        setAlumnos([]);

    }

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
  text: "Si continúas, se perderán los cambios realizados.",
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

        // No permitir valores fuera de rango 0-100
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

      <div className="module-header">
        <div>
          <span className="module-label">
            Panel del Maestro
          </span>

          <h1>Gestionar Calificaciones</h1>

          <p>
            Registre y administre las calificaciones de sus alumnos.
          </p>
        </div>
      </div>

      <div className="module-card">

        <div className="module-card-header">
          <div>
            <h2 className="module-card-title">
              Registro de calificaciones
            </h2>

            <p className="module-card-description">
              Seleccione un grado y una asignatura para comenzar.
            </p>
          </div>
        </div>

        <div className="row g-4 align-items-end mb-4">

          <div className="col-lg-3 col-md-6">
            <label className="form-label fw-semibold">
              Grado
            </label>

            <select
              className="form-select"
              value={gradoSeleccionado}
              onChange={(e) => cambiarGrado(e.target.value)}
            >
              <option value="">
                Seleccione un grado
              </option>

              {grados.map((item) => (
                <option
                  key={item.grado.ID_Grado}
                  value={item.grado.ID_Grado}
                >
                  {item.grado.Nombre_Grado}
                  {item.grado.Seccion
                    ? ` - Sección ${item.grado.Seccion}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="col-lg-3 col-md-6">
            <label className="form-label fw-semibold">
              Clase
            </label>

            <select
              className="form-select"
              value={claseSeleccionada}
              onChange={(e) => cambiarClase(e.target.value)}
              disabled={
                gradoSeleccionado === "" || cargandoClases
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

          <div className="col-lg-4 col-md-8">
            <label className="form-label fw-semibold">
              Buscar alumno
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre o DNI..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
            />
          </div>

          <div className="col-lg-2 col-md-4">
            <button
              className="module-primary-btn w-100"
              onClick={guardarCambios}
              disabled={guardando || cargando}
            >
              <i className="fas fa-save me-2"></i>

              {guardando
                ? "Guardando..."
                : "Guardar"}
            </button>
          </div>

        </div>

            <div className="table-responsive">

  <table className="table table-hover align-middle module-table">

    <thead>
      <tr>
        <th>DNI</th>
        <th>Alumno</th>
        <th>P1</th>
        <th>P2</th>
        <th>P3</th>
        <th>P4</th>
        <th>Rec.</th>
        <th>Prom.</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>

    <tbody>

      {cargando ? (

        <tr>
          <td colSpan="10" className="text-center py-5">
            <i className="fas fa-spinner fa-spin me-2"></i>
            Cargando alumnos...
          </td>
        </tr>

      ) : alumnosFiltrados.length === 0 ? (

        <tr>
          <td colSpan="10" className="text-center py-5">
            <i className="fas fa-user-slash me-2"></i>
            No hay alumnos registrados para este grado.
          </td>
        </tr>

      ) : (

        alumnosFiltrados.map((alumno) => {

          const nota = notas[alumno.DNI] || {};

          const parciales = [
            nota.Parcial1,
            nota.Parcial2,
            nota.Parcial3,
            nota.Parcial4,
          ].filter(
            (valor) =>
              valor !== "" &&
              valor !== null &&
              valor !== undefined
          );

          const promedio =
            parciales.length === 0
              ? null
              : parciales.reduce(
                  (suma, valor) => suma + Number(valor),
                  0
                ) / parciales.length;

          return (

            <tr key={alumno.DNI}>

              <td>
                <strong>{alumno.DNI}</strong>
              </td>

              <td>
                <div className="d-flex align-items-center gap-3">

                  <div className="teacher-avatar">
                    {alumno.Nombre?.charAt(0)}
                    {alumno.Apellido?.charAt(0)}
                  </div>

                  <div>
                    <strong>
                      {alumno.Nombre} {alumno.Apellido}
                    </strong>
                  </div>

                </div>
              </td>

              <td>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-control text-center"
                  value={nota.Parcial1 ?? ""}
                  onChange={(e) =>
                    cambiarNota(
                      alumno.DNI,
                      "Parcial1",
                      e.target.value
                    )
                  }
                />
              </td>

                    <td>
  <input
    type="number"
    min="0"
    max="100"
    className="form-control text-center"
    value={nota.Parcial2 ?? ""}
    onChange={(e) =>
      cambiarNota(
        alumno.DNI,
        "Parcial2",
        e.target.value
      )
    }
  />
</td>

<td>
  <input
    type="number"
    min="0"
    max="100"
    className="form-control text-center"
    value={nota.Parcial3 ?? ""}
    onChange={(e) =>
      cambiarNota(
        alumno.DNI,
        "Parcial3",
        e.target.value
      )
    }
  />
</td>

<td>
  <input
    type="number"
    min="0"
    max="100"
    className="form-control text-center"
    value={nota.Parcial4 ?? ""}
    onChange={(e) =>
      cambiarNota(
        alumno.DNI,
        "Parcial4",
        e.target.value
      )
    }
  />
</td>

<td>
  <input
    type="number"
    min="0"
    max="100"
    className="form-control text-center"
    value={nota.Reposicion ?? ""}
    onChange={(e) =>
      cambiarNota(
        alumno.DNI,
        "Reposicion",
        e.target.value
      )
    }
  />
</td>

<td className="text-center">
  {promedio === null ? (
    "-"
  ) : (
    <span
      className="badge bg-primary"
      style={{
        fontSize: "14px",
        padding: "8px 14px",
        borderRadius: "20px",
      }}
    >
      {promedio.toFixed(2)}
    </span>
  )}
</td>

<td className="text-center">
  {promedio === null ? (
    "-"
  ) : (
    <span
      className={
        promedio >= 70
          ? "badge rounded-pill bg-success"
          : "badge rounded-pill bg-danger"
      }
      style={{
        fontSize: "13px",
        padding: "8px 14px",
      }}
    >
      {promedio >= 70
        ? "Aprobado"
        : "Reprobado"}
    </span>
  )}
</td>

<td className="text-center">

  <button
    className="btn btn-danger teacher-btn"
    onClick={() => eliminarCalificacion(alumno)}
    disabled={!nota.ID_Calificacion}
  >
    <i className="fas fa-trash me-2"></i>
    Eliminar
  </button>

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
}; export default MisNotas;