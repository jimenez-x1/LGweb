import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerSeccionesUnicas } from "../utilities/seccionUnica";
import Swal from "sweetalert2";

const EditarAlumno = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [grados, setGrados] = useState([]);

  const mapaSecciones = obtenerSeccionesUnicas(grados);

  const [form, setForm] = useState({
    DNI: "",
    DNI_Padre: "",
    Nombre: "",
    Apellido: "",
    Fecha_Nacimiento: "",
    Direccion: "",
    Genero: "",
    ID_Grado: "",
  });

  useEffect(() => {
    obtenerAlumno();
    obtenerGrados();
  }, [id]);

  const obtenerAlumno = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/alumnos");
      const data = await response.json();

      const alumnoEncontrado = data.find(
        (alumno) => String(alumno.DNI) === id
      );

      if (alumnoEncontrado) {
        setForm({
          DNI: alumnoEncontrado.DNI || "",
          DNI_Padre: alumnoEncontrado.DNI_Padre || "",
          Nombre: alumnoEncontrado.Nombre || "",
          Apellido: alumnoEncontrado.Apellido || "",
          Fecha_Nacimiento: alumnoEncontrado.Fecha_Nacimiento
            ? String(alumnoEncontrado.Fecha_Nacimiento).slice(0, 10)
            : "",
          Direccion: alumnoEncontrado.Direccion || "",
          Genero: alumnoEncontrado.Genero || "",
          ID_Grado: alumnoEncontrado.ID_Grado || "",
        });
      } else {
        await Swal.fire({
  icon: "warning",
  title: "Alumno no encontrado",
  text: "No se encontró el alumno solicitado",
  confirmButtonText: "Aceptar",
});

navigate("/alumnos");
      }
    } catch (error) {
      console.error("Error al obtener alumno:", error);
      Swal.fire({
  icon: "error",
  title: "Error",
  text: "No se pudo cargar la información del alumno",
  confirmButtonText: "Aceptar",
});
    }
  };

  const obtenerGrados = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/grados");
      const data = await response.json();
      setGrados(data);
    } catch (error) {
      console.error("Error al obtener grados:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const actualizarAlumno = async (e) => {
    e.preventDefault();

    const datosActualizados = {
      DNI: form.DNI,
      DNI_Padre: form.DNI_Padre,
      Nombre: form.Nombre.trim(),
      Apellido: form.Apellido.trim(),
      Fecha_Nacimiento: form.Fecha_Nacimiento,
      Direccion: form.Direccion.trim(),
      Genero: form.Genero,
      ID_Grado: Number(form.ID_Grado),
    };

    console.log("Datos enviados:", datosActualizados);

    try {
      const response = await fetch("http://localhost:3000/api/updateAlumno", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosActualizados),
      });

      const result = await response.text();
      console.log("Respuesta servidor:", result);
      console.log("Status:", response.status);

      if (!response.ok) {
        throw new Error("No se pudo actualizar");
      }

      await Swal.fire({
  icon: "success",
  title: "Actualizado",
  text: "Alumno actualizado correctamente",
  confirmButtonText: "Aceptar",
});

navigate("/alumnos");
    } catch (error) {
      console.error("Error al actualizar:", error);
      Swal.fire({
  icon: "error",
  title: "Error",
  text: "No se pudo actualizar el alumno",
  confirmButtonText: "Aceptar",
});
    }
  };

  return (
  <section className="module-page">
    <div className="module-container">

      <div className="module-header">
        <span className="module-label">
          Gestión académica
        </span>

        <h1>Editar Alumno</h1>

        <p>
          Modifique la información del alumno.
        </p>
      </div>

      <div className="module-card">

        <div className="module-card-header">
          <div>
            <h2 className="module-card-title">
              Información del alumno
            </h2>

            <p className="module-card-description">
              Actualice los datos del alumno seleccionado.
            </p>
          </div>
        </div>

        <form onSubmit={actualizarAlumno}>

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
                Padre
              </label>

              <input
                type="text"
                className="form-control"
                name="DNI_Padre"
                value={form.DNI_Padre}
                onChange={handleChange}
                required
              />
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
                Fecha de nacimiento
              </label>

              <input
                type="date"
                className="form-control"
                name="Fecha_Nacimiento"
                value={form.Fecha_Nacimiento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">
                Género
              </label>

              <select
                className="form-select"
                name="Genero"
                value={form.Genero}
                onChange={handleChange}
                required
              >
                <option value="">
                  Seleccione género
                </option>

                <option value="M">
                  Masculino
                </option>

                <option value="F">
                  Femenino
                </option>
              </select>
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">
                Dirección
              </label>

              <input
                type="text"
                className="form-control"
                name="Direccion"
                value={form.Direccion}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">
                Grado
              </label>

              <select
                className="form-select"
                name="ID_Grado"
                value={form.ID_Grado}
                onChange={handleChange}
                required
              >
                <option value="">
                  Seleccione grado
                </option>

                {grados.map((grado) => (
                  <option
                    key={grado.ID_Grado}
                    value={grado.ID_Grado}
                  >
                    {grado.Nombre_Grado} - {mapaSecciones[grado.ID_Grado]}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="teacher-actions mt-4">

            <button
              type="submit"
              className="btn btn-primary teacher-btn"
            >
              <i className="fas fa-save me-2"></i>
              Actualizar Alumno
            </button>

            <button
              type="button"
              className="btn btn-secondary teacher-btn"
              onClick={() => navigate("/alumnos")}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Cancelar
            </button>

          </div>

        </form>

      </div>

    </div>
  </section>
);
};

export default EditarAlumno;