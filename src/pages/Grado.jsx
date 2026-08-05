import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "../store";
import fetchers from "../store/slices/Grado/fetchers";
import Selector from "../store/slices/Grado/selectors";
import maestroFetchers from "../store/slices/Maestros/fetchers";
import MaestroSelector from "../store/slices/Maestros/selectors";
import { obtenerSeccionesUnicas } from "../utilities/seccionUnica";
import Swal from "sweetalert2";

const Grado = () => {
  const dispatch = useDispatch();
  const grados = useSelector(Selector.getGrados);
  const clases = useSelector(Selector.getClases);
  const maestros = useSelector(MaestroSelector.getMaestros);

  const mapaSecciones = obtenerSeccionesUnicas(grados);

  const formularioRef = useRef(null);

  const formVacio = {
    Nombre_Grado: "",
    Seccion: "",
    Anio: "",
    DNI_Maestro: "",
    clases: [],
  };

  const [form, setForm] = useState(formVacio);
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  useEffect(() => {
    dispatch(fetchers.getGrados({ url: "/grados" }));
    dispatch(fetchers.getClases({ url: "/clases" }));
    dispatch(maestroFetchers.getMaestros({ url: "/maestros" }));
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClaseChange = (idClase) => {
    const existe = form.clases.includes(idClase);

    setForm({
      ...form,
      clases: existe
        ? form.clases.filter((id) => id !== idClase)
        : [...form.clases, idClase],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let idGrado = idEditar;

      if (editando) {
        await dispatch(
          fetchers.updateGrado({
            url: "/grados",
            data: {
              ID_Grado: idEditar,
              Nombre_Grado: form.Nombre_Grado,
              Seccion: form.Seccion,
              Anio: form.Anio,
            },
          })
        );

        await Swal.fire({
  icon: "success",
  title: "Actualizado",
  text: "Grado actualizado correctamente",
  confirmButtonText: "Aceptar",
});
      } else {
        const res = await dispatch(
          fetchers.insertGrado({
            url: "/grados",
            data: {
              Nombre_Grado: form.Nombre_Grado,
              Seccion: form.Seccion,
              Anio: form.Anio,
            },
          })
        );
console.log(res);
        idGrado = res?.payload?.gradosInfo?.ID_Grado;
        await Swal.fire({
  icon: "success",
  title: "Registrado",
  text: "Grado registrado correctamente",
  confirmButtonText: "Aceptar",
});
      }

      if (idGrado) {
        await dispatch(
          fetchers.asignarClases({
            url: "/grado-clase/asignar",
            data: {
              ID_Grado: idGrado,
              clases: form.clases,
            },
          })
        );

        await dispatch(
          maestroFetchers.asignarMaestro({
            url: "/maestro-grado/asignar",
            data: {
              ID_Grado: idGrado,
              DNI_Maestro: form.DNI_Maestro,
            },
          })
        );
      }

      setForm(formVacio);
      setEditando(false);
      setIdEditar(null);
      dispatch(fetchers.getGrados({ url: "/grados" }));
    } catch (error) {
      console.error(error);
     Swal.fire({
  icon: "error",
  title: "Error",
  text: editando
    ? "No se pudo actualizar el grado"
    : "No se pudo registrar el grado",
  confirmButtonText: "Aceptar",
});
    }
  };

  const editar = (grado) => {
    setForm({
      Nombre_Grado: grado.Nombre_Grado,
      Seccion: grado.Seccion,
      Anio: String(grado.Anio),
      DNI_Maestro:
        grado.Maestros && grado.Maestros.length > 0
          ? grado.Maestros[0].DNI
          : "",
      clases: grado.Clases ? grado.Clases.map((c) => c.ID_Clase) : [],
    });

    setEditando(true);
    setIdEditar(grado.ID_Grado);

    setTimeout(() => {
      formularioRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const cancelar = () => {
    setForm(formVacio);
    setEditando(false);
    setIdEditar(null);
  };

const eliminar = async (id) => {
  const confirmar = await Swal.fire({
  icon: "warning",
  title: "¿Eliminar grado?",
  text: "Esta acción no se puede deshacer.",
  showCancelButton: true,
  confirmButtonText: "Sí, eliminar",
  cancelButtonText: "Cancelar",
});

if (!confirmar.isConfirmed) return;
  try {
    await dispatch(
      fetchers.deleteGrado({
        url: `/grados/${id}`,
      })
    ).unwrap();

    await Swal.fire({
  icon: "success",
  title: "Eliminado",
  text: "Grado eliminado correctamente",
  confirmButtonText: "Aceptar",
});
    dispatch(fetchers.getGrados({ url: "/grados" }));

  } catch (error) {
    Swal.fire({
  icon: "error",
  title: "No se pudo eliminar",
  text:
    error?.message ||
    error?.error ||
    "No se puede eliminar este grado porque tiene clases o un docente asignado.",
  confirmButtonText: "Aceptar",
});
  }
};

  return (
  <section className="module-page">
    <div className="module-container">

      {/* ENCABEZADO */}
      <div className="module-header">
        <span className="module-label">Gestión académica</span>

        <h1>Grados</h1>

        <p>
          Administra los grados, secciones, maestros titulares y clases
          asignadas.
        </p>
      </div>

      {/* FORMULARIO */}
      <div ref={formularioRef} className="module-card">
        <h2 className="module-card-title">
          {editando ? "Editar grado" : "Registrar grado"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            <div className="col-12 col-md-6">
              <label className="form-label">Nombre del grado</label>

              <select
                className="form-select"
                name="Nombre_Grado"
                value={form.Nombre_Grado}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un grado...</option>
                <option value="Primero">Primero</option>
                <option value="Segundo">Segundo</option>
                <option value="Tercero">Tercero</option>
                <option value="Cuarto">Cuarto</option>
                <option value="Quinto">Quinto</option>
                <option value="Sexto">Sexto</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Sección</label>

              <select
                className="form-select"
                name="Seccion"
                value={form.Seccion}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una sección...</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Año académico</label>

              <input
                type="number"
                className="form-control"
                name="Anio"
                placeholder="Ej: 2026"
                value={form.Anio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Maestro titular</label>

              <select
                className="form-select"
                name="DNI_Maestro"
                value={form.DNI_Maestro}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un maestro...</option>

                {maestros.map((maestro) => (
                  <option key={maestro.DNI} value={maestro.DNI}>
                    {maestro.Nombre} {maestro.Apellido}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* CLASES */}
          <div className="grade-classes-section">
            <h3>Clases asignadas</h3>

            {clases.length === 0 ? (
              <p className="text-muted mb-0">
                No hay clases registradas.
              </p>
            ) : (
              <div className="row g-2">
                {clases.map((clase) => (
                  <div
                    className="col-12 col-sm-6 col-lg-4"
                    key={clase.ID_Clase}
                  >
                    <label className="grade-class-option">
                      <input
                        type="checkbox"
                        checked={form.clases.includes(clase.ID_Clase)}
                        onChange={() =>
                          handleClaseChange(clase.ID_Clase)
                        }
                      />

                      <span>{clase.Nombre_Clase}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BOTONES FORMULARIO */}
          <div className="d-flex flex-wrap gap-2 mt-4">
            <button
              type="submit"
              className="module-primary-btn"
            >
              {editando ? "Actualizar grado" : "Guardar grado"}
            </button>

            {editando && (
              <button
                type="button"
                className="btn btn-secondary module-secondary-btn"
                onClick={cancelar}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LISTADO */}
      <div className="module-card">
        <div className="module-card-header">
          <div>
            <h2 className="module-card-title mb-1">
              Grados registrados
            </h2>

            <p className="module-card-description">
              Total de grados: {grados.length}
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table module-table grade-table">
            <thead>
              <tr>
                <th>Grado</th>
                <th>Sección</th>
                <th>Año</th>
                <th>Maestro titular</th>
                <th>Clases asignadas</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {grados.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-muted py-4"
                  >
                    No hay grados registrados.
                  </td>
                </tr>
              ) : (
                grados.map((grado) => (
                  <tr key={grado.ID_Grado}>
                    <td>
                      <strong>{grado.Nombre_Grado}</strong>
                    </td>

                    <td>{mapaSecciones[grado.ID_Grado]}</td>

                    <td>{grado.Anio}</td>

                    <td>
                      {grado.Maestros &&
                      grado.Maestros.length > 0 ? (
                        grado.Maestros.map((maestro) => (
                          <div
                            key={maestro.DNI}
                            className="grade-teacher-name"
                          >
                            {maestro.Nombre} {maestro.Apellido}
                          </div>
                        ))
                      ) : (
                        <span className="text-muted">
                          Sin maestro
                        </span>
                      )}
                    </td>

                    <td>
                      {grado.Clases &&
                      grado.Clases.length > 0 ? (
                        <div className="grade-badges">
                          {grado.Clases.map((clase) => (
                            <span
                              key={clase.ID_Clase}
                              className="grade-class-badge"
                            >
                              {clase.Nombre_Clase}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">
                          Sin clases
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="d-flex flex-nowrap gap-2">
                        <button
                          type="button"
                          className="btn btn-warning module-action-btn"
                          onClick={() => editar(grado)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger module-action-btn"
                          onClick={() =>
                            eliminar(grado.ID_Grado)
                          }
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </section>
);
};

export default Grado;