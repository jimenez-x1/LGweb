import React, { useEffect, useState } from "react";
import { useDispatch } from "../store";

import calificacionFetchers from "../store/slices/Calificaciones/fetchers";
import gradoFetchers from "../store/slices/Grado/fetchers";
import claseFetchers from "../store/slices/Clase/fetchers";
import alumnoFetchers from "../store/slices/Alumnos/fetchers";

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
            `http://localhost:3000/api/maestro-grado/${dniMaestro}/alumnos`,
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

    const cambiarGrado = (valor) => {

        if (cambiosSinGuardar) {

            const confirmar = window.confirm(
                "Tienes cambios sin guardar. Si continúas, se perderán. ¿Deseas continuar?"
            );

            if (!confirmar) return;

        }

        setGradoSeleccionado(valor);

    };

    const cambiarClase = (valor) => {

        if (cambiosSinGuardar) {

            const confirmar = window.confirm(
                "Tienes cambios sin guardar. Si continúas, se perderán. ¿Deseas continuar?"
            );

            if (!confirmar) return;

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

            alert("Seleccione una clase");
            return;

        }

        if (alumnos.length === 0) {

            alert("No hay alumnos para guardar.");
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

            alert("Calificaciones guardadas correctamente");

            await cargarCalificaciones();

        } catch (error) {

            console.error(error);

            alert("Error al guardar");

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

        const confirmar = window.confirm(
            `¿Eliminar por completo el registro de calificación de ${alumno.Nombre} ${alumno.Apellido} en esta clase? Esta acción no se puede deshacer.`
        );

        if (!confirmar) return;

        try {

            await dispatch(
                calificacionFetchers.deleteCalificacion({
                    url: `/calificaciones/${idCalificacion}`
                })
            );

            await cargarCalificaciones();

        } catch (error) {

            console.error(error);
            alert("Error al eliminar");

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

        <div className="container-fluid mt-4">

            <h3 className="mb-4">Calificaciones</h3>

            <div className="row mb-3">

                <div className="col-md-3">

                    <label className="form-label">Grado</label>

                    <select
                        className="form-select"
                        value={gradoSeleccionado}
                        onChange={(e) => cambiarGrado(e.target.value)}
                    >

                        <option value="">Seleccione un grado</option>

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

                <div className="col-md-3">

                    <label className="form-label">Clase</label>

                    <select
                        className="form-select"
                        value={claseSeleccionada}
                        onChange={(e) => cambiarClase(e.target.value)}
                        disabled={gradoSeleccionado === "" || cargandoClases}
                    >

                        <option value="">
                            {cargandoClases ? "Cargando clases..." : "Seleccione una clase"}
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

                <div className="col-md-4">

                    <label className="form-label">Buscar alumno</label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nombre o DNI"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />

                </div>

                <div className="col-md-2 d-flex align-items-end">

                    <button
                        className="btn btn-primary w-100"
                        onClick={guardarCambios}
                        disabled={guardando || cargando}
                    >
                        {guardando ? "Guardando..." : "Guardar"}
                    </button>

                </div>

            </div>

            <div className="table-responsive">

                <table className="table table-bordered table-hover align-middle">

                    <thead className="table-dark">

                        <tr>
                            <th>DNI</th>
                            <th>Nombre</th>
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

            <td colSpan="10" className="text-center">
                Cargando...
            </td>

        </tr>

    ) : alumnosFiltrados.length === 0 ? (

        <tr>

            <td colSpan="10" className="text-center">
                No hay alumnos para este grado
            </td>

        </tr>

    ) : (

        alumnosFiltrados.map((alumno) => {

            const nota = notas[alumno.DNI] || {};

            const parciales = [
                nota.Parcial1,
                nota.Parcial2,
                nota.Parcial3,
                nota.Parcial4
            ].filter((valor) => valor !== "" && valor != null);

            const promedio = parciales.length === 0
                ? null
                : parciales.reduce((suma, valor) => suma + Number(valor), 0) / parciales.length;

            return (

                <tr key={alumno.DNI}>

                    <td>{alumno.DNI}</td>

                    <td>
                        {alumno.Nombre} {alumno.Apellido}
                    </td>

                    <td>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            className="form-control"
                            value={notas[alumno.DNI]?.Parcial1 ?? ""}
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
                            className="form-control"
                            value={notas[alumno.DNI]?.Parcial2 ?? ""}
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
                            className="form-control"
                            value={notas[alumno.DNI]?.Parcial3 ?? ""}
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
                            className="form-control"
                            value={notas[alumno.DNI]?.Parcial4 ?? ""}
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
                            className="form-control"
                            value={notas[alumno.DNI]?.Reposicion ?? ""}
                            onChange={(e) =>
                                cambiarNota(
                                    alumno.DNI,
                                    "Reposicion",
                                    e.target.value
                                )
                            }
                        />
                    </td>

                    <td>
                        {promedio === null ? "-" : promedio.toFixed(2)}
                    </td>

                    <td>
                        {promedio === null ? (
                            "-"
                        ) : (
                            <span
                                className={
                                    promedio >= 70
                                        ? "badge bg-success"
                                        : "badge bg-danger"
                                }
                            >
                                {promedio >= 70
                                    ? "Aprobado"
                                    : "Reprobado"}
                            </span>
                        )}
                    </td>

                    <td>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminarCalificacion(alumno)}
                            disabled={!notas[alumno.DNI]?.ID_Calificacion}
                            title={
                                notas[alumno.DNI]?.ID_Calificacion
                                    ? "Eliminar este registro de calificación"
                                    : "Este alumno aún no tiene calificación guardada"
                            }
                        >
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

    );

};

export default MisNotas;