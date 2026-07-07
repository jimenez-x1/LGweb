import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "../store";
import fetchers from "../store/slices/Grado/fetchers";
import Selector from "../store/slices/Grado/selectors";
import maestroFetchers from "../store/slices/Maestros/fetchers";
import MaestroSelector from "../store/slices/Maestros/selectors";

const Grado = () => {
  const dispatch = useDispatch();
  const grados = useSelector(Selector.getGrados);
  const clases = useSelector(Selector.getClases);
  const maestros = useSelector(MaestroSelector.getMaestros);

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

        alert("Grado actualizado");
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

        idGrado = res?.payload?.gradosInfo?.ID_Grado;
        alert("Grado registrado");
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
      alert("Error al guardar");
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
    if (!window.confirm("¿Eliminar este grado?")) return;

    try {
      await dispatch(fetchers.deleteGrado({ url: `/grados/${id}` }));
      alert("Eliminado correctamente");
      dispatch(fetchers.getGrados({ url: "/grados" }));
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
              <h2>{editando ? "Editar Grado" : "Registrar Grado"}</h2>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div ref={formularioRef} className="p-4 border rounded bg-white shadow-sm">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre Grado</label>
                  <select
                    className="form-control"
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

                <div className="mb-3">
                  <label className="form-label">Sección</label>
                  <select
                    className="form-control"
                    name="Seccion"
                    value={form.Seccion}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione una Sección...</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Año</label>
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

                <div className="mb-3">
                  <label className="form-label">Maestro Titular</label>
                  <select
                    className="form-control"
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

                <div className="mb-3">
                  <label className="form-label">Clases</label>

                  <div className="row">
                    {clases.map((clase) => (
                      <div className="col-md-4 mb-2" key={clase.ID_Clase}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={form.clases.includes(clase.ID_Clase)}
                            onChange={() => handleClaseChange(clase.ID_Clase)}
                          />
                          <label className="form-check-label">
                            {clase.Nombre_Clase}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <button type="submit" className="btn btn-primary">
                    {editando ? "Actualizar Grado" : "Guardar Grado"}
                  </button>

                  {editando && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={cancelar}
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
              <h2>Grados Registrados</h2>
            </div>

            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre Grado</th>
                  <th>Sección</th>
                  <th>Año</th>
                  <th>Maestro Titular</th>
                  <th>Clases Asignadas</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {grados.map((g) => (
                  <tr key={g.ID_Grado}>
                    <td>{g.ID_Grado}</td>
                    <td>{g.Nombre_Grado}</td>
                    <td>{g.Seccion}</td>
                    <td>{g.Anio}</td>

                    <td>
                      {g.Maestros && g.Maestros.length > 0 ? (
                        g.Maestros.map((maestro) => (
                          <div key={maestro.DNI}>
                            {maestro.Nombre} {maestro.Apellido}
                          </div>
                        ))
                      ) : (
                        <span className="text-muted">Sin maestro</span>
                      )}
                    </td>

                    <td>
                      {g.Clases && g.Clases.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                          {g.Clases.map((clase) => (
                            <span
                              key={clase.ID_Clase}
                              className="badge bg-primary px-3 py-2"
                            >
                              {clase.Nombre_Clase}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">Sin clases</span>
                      )}
                    </td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => editar(g)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminar(g.ID_Grado)}
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

export default Grado;