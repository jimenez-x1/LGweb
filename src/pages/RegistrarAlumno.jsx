import React, { useState } from "react";
import { Link } from "react-router-dom";

const RegistrarAlumno = () => {
  const [form, setForm] = useState({
    Nombre: "",
    Apellido: "",
    Direccion: "",
    Genero: "",
    ID_Grado: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/alumnos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      console.log(data);
      alert("Alumno registrado correctamente");

      setForm({
        Nombre: "",
        Apellido: "",
        Direccion: "",
        Genero: "",
        ID_Grado: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error al registrar alumno");
    }
  };

  return (
    <section className="pt_100 pb_100">
      <div className="container">
        <div className="row mb_40">
          <div className="col-12 text-center">
            <div className="tf__heading_area">
              <h5>Formulario</h5>
              <h2>Registrar Alumno</h2>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="p-4 border rounded bg-white shadow-sm">
              <form onSubmit={handleSubmit}>
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
                  <label className="form-label">Dirección</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Direccion"
                    value={form.Direccion}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Género</label>
                  <select
                    className="form-control"
                    name="Genero"
                    value={form.Genero}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Grado</label>
                  <input
                    type="number"
                    className="form-control"
                    name="ID_Grado"
                    value={form.ID_Grado}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-flex gap-3">
                  <button type="submit" className="btn btn-primary">
                    Guardar Alumno
                  </button>

                  <Link to="/alumnos" className="btn btn-secondary">
                    Ver alumnos
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

export default RegistrarAlumno;