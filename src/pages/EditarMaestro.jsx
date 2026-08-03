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
  <section className="module-page">
    <div className="module-container">

      <div className="module-header">
        <span className="module-label">Gestión académica</span>

        <h1>Editar Maestro</h1>

        <p>
          Modifique la información del personal docente.
        </p>
      </div>

      <div className="module-card">

        <div className="module-card-header">
          <div>
            <h2 className="module-card-title">
              Información del maestro
            </h2>

            <p className="module-card-description">
              Actualice los datos del maestro seleccionado.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="row">

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">
                DNI
              </label>

              <input
                type="text"
                className="form-control"
                value={form.DNI}
                disabled
              />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">
                Grado asignado
              </label>

              <select
                className="form-select"
                name="ID_Grado"
                value={form.ID_Grado}
                onChange={handleChange}
                required
              >
                <option value="">
                  Seleccione un grado
                </option>

                {grados.map((g) => (
                  <option
                    key={g.ID_Grado}
                    value={g.ID_Grado}
                  >
                    {g.Nombre_Grado} - {g.Seccion}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">
                Nombre
              </label>

              <input
                type="text"
                className="form-control"
                name="Nombre"
                value={form.Nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">
                Apellido
              </label>

              <input
                type="text"
                className="form-control"
                name="Apellido"
                value={form.Apellido}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">
                Teléfono
              </label>

              <input
                type="text"
                className="form-control"
                name="Telefono"
                value={form.Telefono}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">
                Correo
              </label>

              <input
                type="email"
                className="form-control"
                name="Correo"
                value={form.Correo}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="teacher-actions mt-4">

            <button
              type="submit"
              className="btn btn-primary teacher-btn"
            >
              <i className="fas fa-save me-2"></i>
              Actualizar Maestro
            </button>

            <Link
              to="/maestros"
              className="btn btn-secondary teacher-btn"
            >
              <i className="fas fa-arrow-left me-2"></i>
              Cancelar
            </Link>

          </div>

        </form>

      </div>

    </div>
  </section>
);
};

export default EditarMaestro;