import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../store";
import fetchers from "../store/slices/Padre/fetchers";
import Selector from "../store/slices/Padre/selectors";
import Swal from "sweetalert2";

const Padre = () => {
  const dispatch = useDispatch();
  const padres = useSelector(Selector.getPadres);
  const [alumnos, setAlumnos] = useState([]);
 const [form, setForm] = useState({
  DNI: "",
  Nombre: "",
  Apellido: "",
  Telefono: "",
  Correo: "",
  Direccion: ""
});
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  useEffect(() => {
    dispatch(fetchers.getPadres({ url: "/padres" }));
    dispatch(fetchers.getAlumnos({ url: "/alumnos" })).then((res) => {
      setAlumnos(res.payload?.alumnosInfo ?? []);
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let res;

    if (editando) {
      res = await dispatch(
        fetchers.updatePadre({
          url: "/updatePadre",
          data: {
            ...form,
            DNI: idEditar,
          },
        })
      );
    } else {
      res = await dispatch(
        fetchers.insertPadre({
          url: "/insertPadre",
          data: form,
        })
      );
    }

    console.log("RESPUESTA PADRE:", res);

    if (res.payload?.error) {
      throw new Error(
        res.payload.error.message ||
          (editando
            ? "No se pudo actualizar el padre"
            : "No se pudo registrar el padre")
      );
    }

    await Swal.fire({
      icon: "success",
      title: editando ? "Actualizado" : "Registrado",
      text: editando
        ? "Padre actualizado correctamente"
        : "Padre registrado correctamente",
      confirmButtonText: "Aceptar",
    });

    setForm({
      DNI: "",
      Nombre: "",
      Apellido: "",
      Telefono: "",
      Correo: "",
      Direccion: "",
    });

    setEditando(false);
    setIdEditar(null);

    await dispatch(fetchers.getPadres({ url: "/padres" }));
  } catch (error) {
    console.error("ERROR PADRE:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.message ||
        (editando
          ? "No se pudo actualizar el padre"
          : "No se pudo registrar el padre"),
      confirmButtonText: "Aceptar",
    });
  }
};

  const editar = (padre) => {
   setForm({
      DNI: padre.DNI || "",
      Nombre: padre.Nombre,
      Apellido: padre.Apellido,
      Telefono: padre.Telefono ?? "",
      Correo: padre.Correo ?? "",
      Direccion: padre.Direccion ?? "",
    });
    setEditando(true);
    setIdEditar(padre.DNI);
  };

  const eliminar = async (id) => {
 const confirmar = await Swal.fire({
  icon: "warning",
  title: "¿Eliminar padre?",
  text: "Esta acción no se puede deshacer.",
  showCancelButton: true,
  confirmButtonText: "Sí, eliminar",
  cancelButtonText: "Cancelar",
});

if (!confirmar.isConfirmed) return;
  try {
    await dispatch(fetchers.deletePadre({
      url: `/deletePadre/${id}`
    }));

    await dispatch(fetchers.getPadres({
      url: "/padres"
    }));
    await Swal.fire({
  icon: "success",
  title: "Eliminado",
  text: "Padre eliminado correctamente",
  confirmButtonText: "Aceptar",
});

  } catch (error) {
    Swal.fire({
  icon: "error",
  title: "Error",
  text: "No se pudo eliminar el padre",
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

        <h1>Padres</h1>

        <p>
          Registra, consulta y administra la información de los padres o
          encargados de los estudiantes.
        </p>
      </div>

      {/* FORMULARIO */}
      <div className="module-card">
        <h2 className="module-card-title">
          {editando ? "Editar padre" : "Registrar padre"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            <div className="col-12 col-md-6">
              <label className="form-label">Número de identidad</label>

              <input
                type="text"
                className="form-control"
                name="DNI"
                placeholder="Ej: 0801200512345"
                value={form.DNI}
                onChange={(e) => {
                  const valor = e.target.value.replace(/\D/g, "");

                  setForm({
                    ...form,
                    DNI: valor,
                  });
                }}
                maxLength={13}
                disabled={editando}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Nombre</label>

              <input
                type="text"
                className="form-control"
                name="Nombre"
                placeholder="Ej: Juan"
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
                placeholder="Ej: Pérez"
                value={form.Apellido}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Teléfono</label>

              <input
                type="text"
                className="form-control"
                name="Telefono"
                placeholder="Ej: 9999-9999"
                value={form.Telefono}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Correo</label>

              <input
                type="email"
                className="form-control"
                name="Correo"
                placeholder="Ej: correo@email.com"
                value={form.Correo}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Dirección</label>

              <input
                type="text"
                className="form-control"
                name="Direccion"
                placeholder="Ej: Col. Centro"
                value={form.Direccion}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="d-flex flex-wrap gap-2 mt-4">
            <button
              type="submit"
              className="module-primary-btn"
            >
              {editando ? "Actualizar padre" : "Guardar padre"}
            </button>

            {editando && (
              <button
                type="button"
                className="btn btn-secondary module-secondary-btn"
                onClick={() => {
                  setEditando(false);
                  setIdEditar(null);

                  setForm({
                    DNI: "",
                    Nombre: "",
                    Apellido: "",
                    Telefono: "",
                    Correo: "",
                    Direccion: "",
                  });
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLA */}
      <div className="module-card">
        <div className="module-card-header">
          <div>
            <h2 className="module-card-title mb-1">
              Padres registrados
            </h2>

            <p className="module-card-description">
              Total de padres: {padres.length}
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table module-table parent-table">
            <thead>
              <tr>
                <th>DNI</th>
                <th>Nombre completo</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {padres.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-muted py-4"
                  >
                    No hay padres registrados.
                  </td>
                </tr>
              ) : (
                padres.map((padre) => (
                  <tr key={padre.DNI}>
                    <td>{padre.DNI}</td>

                    <td>
                      <strong>
                        {padre.Nombre} {padre.Apellido}
                      </strong>
                    </td>

                    <td>
                      {padre.Telefono || "—"}
                    </td>

                    <td>
                      {padre.Correo || "—"}
                    </td>

                    <td>
                      {padre.Direccion || "—"}
                    </td>

                    <td>
                      <div className="d-flex flex-nowrap gap-2">
                        <button
                          type="button"
                          className="btn btn-warning parent-action-btn"
                          onClick={() => editar(padre)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger parent-action-btn"
                          onClick={() => eliminar(padre.DNI)}
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

export default Padre;