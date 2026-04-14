import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RegistrarAlumno = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    Nombre: "",
    Apellido: "",
    Fecha_Nacimiento: "",
    Direccion: "",
    Genero: "",
    ID_Grado: "",
  });

  const [grados, setGrados] = useState([]);

  useEffect(() => {
    obtenerGrados();
  }, []);

  const obtenerGrados = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/grados");

      if (!response.ok) {
        throw new Error("No se pudieron obtener los grados");
      }

      const data = await response.json();
      setGrados(data);
    } catch (error) {
      console.error("Error al obtener grados:", error);
      alert("Error al cargar los grados");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const guardarAlumno = async (e) => {
    e.preventDefault();

    if (!form.ID_Grado) {
      alert("Seleccione un grado");
      return;
    }

    const alumnoData = {
      Nombre: form.Nombre.trim(),
      Apellido: form.Apellido.trim(),
      Fecha_Nacimiento: form.Fecha_Nacimiento,
      Direccion: form.Direccion.trim(),
      Genero: form.Genero,
      ID_Grado: Number(form.ID_Grado),
    };

    try {
      const response = await fetch("http://localhost:3000/api/insertAlumno", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alumnoData),
      });

      const result = await response.text();
      console.log("Respuesta servidor:", result);

      if (!response.ok) {
        alert("No se pudo registrar el alumno");
        return;
      }

      alert("Alumno registrado correctamente");
      navigate("/alumnos");
    } catch (error) {
      console.error("Error al registrar alumno:", error);
      alert("Ocurrió un error al registrar alumno");
    }
  };

  return (
    <section className="pt_100 pb_100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="tf__heading_area text-center mb_40">
              <h5>Formulario</h5>
              <h2>Registrar Alumno</h2>
            </div>

            <div className="card shadow-sm border-0 p-4 rounded-4">
              <form onSubmit={guardarAlumno}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    name="Nombre"
                    placeholder="Ej: Sofía"
                    className="form-control"
                    value={form.Nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    type="text"
                    name="Apellido"
                    placeholder="Ej: Maradiaga"
                    className="form-control"
                    value={form.Apellido}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Fecha de nacimiento</label>
                  <input
                    type="date"
                    name="Fecha_Nacimiento"
                    className="form-control"
                    value={form.Fecha_Nacimiento}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Dirección</label>
                  <input
                    type="text"
                    name="Direccion"
                    placeholder="Ej: Col. El Zarzal"
                    className="form-control"
                    value={form.Direccion}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Género</label>
                  <select
                    name="Genero"
                    className="form-control"
                    value={form.Genero}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione género</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label">Grado</label>
                  <select
                    name="ID_Grado"
                    className="form-control"
                    value={form.ID_Grado}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione grado</option>
                    {grados.map((grado) => (
                      <option key={grado.ID_Grado} value={grado.ID_Grado}>
                        {grado.Nombre_Grado}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="common_btn">
                  Guardar Alumno
                </button>

                <button
                  type="button"
                  className="btn btn-secondary ms-3"
                  onClick={() => navigate("/alumnos")}
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrarAlumno;