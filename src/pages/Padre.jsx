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
    <section className="pt_100 pb_100">
      <div className="container">
        <div className="row mb_40">
          <div className="col-12 text-center">
            <div className="tf__heading_area">
              <h5>Formulario</h5>
              <h2>{editando ? "Editar Padre" : "Registrar Padre"}</h2>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="p-4 border rounded bg-white shadow-sm">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <div className="mb-3">
  <label className="form-label">Número de Identidad</label>
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
    required
  />
</div>

                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input type="text" className="form-control" name="Nombre" placeholder="Ej: Juan" value={form.Nombre} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input type="text" className="form-control" name="Apellido" placeholder="Ej: Pérez" value={form.Apellido} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input type="text" className="form-control" name="Telefono" placeholder="Ej: 9999-9999" value={form.Telefono} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input type="email" className="form-control" name="Correo" placeholder="Ej: correo@email.com" value={form.Correo} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Dirección</label>
                  <input type="text" className="form-control" name="Direccion" placeholder="Ej: Col. Centro" value={form.Direccion} onChange={handleChange} />
                </div>
                <div className="d-flex gap-3">
                  <button type="submit" className="btn btn-primary">{editando ? "Actualizar Padre" : "Guardar Padre"}</button>
                  {editando && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditando(false);
                        setIdEditar(null);
                        setForm({
                          DNI: "",
                          Nombre: "",
                          Apellido: "",
                          Telefono: "",
                          Correo: "",
                          Direccion: ""
                        });
                      }}
                    >
                      Cancelar
                    </button>                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="row mt_50">
  <div className="col-12">
    <div className="tf__heading_area mb_30">
      <h2>Padres Registrados</h2>
    </div>

    <table className="table table-bordered table-striped">

      <thead className="table-dark">
        <tr>
          <th>DNI</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Teléfono</th>
          <th>Correo</th>
          <th>Dirección</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>

        {padres.map((p) => (

          <tr key={p.DNI}>

            <td>{p.DNI}</td>

            <td>{p.Nombre}</td>

            <td>{p.Apellido}</td>

            <td>{p.Telefono}</td>

            <td>{p.Correo}</td>

            <td>{p.Direccion}</td>

            <td>

              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => editar(p)}
              >
                Editar
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => eliminar(p.DNI)}
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

export default Padre;