import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const EditarMaestro = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    DNI: "",
    Nombre: "",
    Apellido: "",
    Telefono: "",
    Correo: "",
    Cargo: "",
    ID_Grado: "",
  });

  const [grados, setGrados] = useState([]);

  useEffect(() => {
    if (!id) return;

    fetch("http://localhost:3000/api/maestros")
      .then((res) => res.json())
      .then((data) => {
        const maestro = (data ?? []).find((m) => m.DNI === id);
        if (maestro) {
          setForm({
            DNI: maestro.DNI,
            Nombre: maestro.Nombre,
            Apellido: maestro.Apellido,
            Telefono: maestro.Telefono || "",
            Correo: maestro.Correo || "",
            Cargo: maestro.Cargo || "Docente",
            ID_Grado: maestro.Grados?.[0]?.ID_Grado || "",
          });
        }
      })
      .catch((error) => console.error(error));

    fetch("http://localhost:3000/api/grados")
      .then((res) => res.json())
      .then((data) => setGrados(data ?? []))
      .catch((error) => console.error(error));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/updateMaestro", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        await Swal.fire({
  icon: "success",
  title: "Actualizado",
  text: "Maestro actualizado correctamente",
  confirmButtonText: "Aceptar",
});

navigate("/maestros");
      } else {
        await Swal.fire({
  icon: "error",
  title: "Error",
  text: "No se pudo actualizar el maestro",
  confirmButtonText: "Aceptar",
});
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
  icon: "error",
  title: "Error",
  text: "No se pudo actualizar el maestro",
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
              <h2>Editar Maestro</h2>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="p-4 border rounded bg-white shadow-sm">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Código Maestro</label>
                  <input
                    type="text"
                    className="form-control"
                    name="DNI"
value={form.DNI}
                    disabled
                  />
                </div>

                <div className="mb-3">
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

                <div className="mb-3">
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

                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Telefono"
                    value={form.Telefono || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    name="Correo"
                    value={form.Correo || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Grado</label>
                  <select
                    className="form-control"
                    name="ID_Grado"
                    value={form.ID_Grado}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un grado</option>
                    {grados.map((g) => (
                      <option key={g.ID_Grado} value={g.ID_Grado}>
                        {g.Nombre_Grado} - {g.Seccion}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="d-flex gap-3">
                  <button type="submit" className="btn btn-warning">
                    Actualizar Maestro
                  </button>

                  <Link to="/maestros" className="btn btn-secondary">
                    Cancelar
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditarMaestro;