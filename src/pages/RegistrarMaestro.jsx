import React, { useState } from "react";
import { Link } from "react-router-dom";

const RegistrarMaestro = () => {

  const [form, setForm] = useState({
    DNI: "",
    Nombre: "",
    Apellido: "",
    Telefono: "",
    Correo: "",
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

      const res = await fetch(
        "http://localhost:3000/api/insertMaestro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        throw new Error("Error al registrar maestro");
      }

      alert("Maestro registrado correctamente");

      setForm({
        DNI: "",
        Nombre: "",
        Apellido: "",
        Telefono: "",
        Correo: "",
      });

    } catch (error) {

      console.error(error);
      alert("Error al registrar maestro");

    }
  };

  return (
    <section className="pt_100 pb_100">

      <div className="container">

        <div className="row mb_40">

          <div className="col-12 text-center">

            <div className="tf__heading_area">

              <h5>Formulario</h5>
              <h2>Registrar Maestro</h2>

            </div>

          </div>

        </div>

        <div className="row justify-content-center">

          <div className="col-lg-8">

            <div className="p-4 border rounded bg-white shadow-sm">

              <form onSubmit={handleSubmit}>

                <div className="mb-3">

                  <label className="form-label">
                    DNI
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="DNI"
                    maxLength={13}
                    value={form.DNI}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label">
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

                <div className="mb-3">

                  <label className="form-label">
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

                <div className="mb-3">

                  <label className="form-label">
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

                <div className="mb-3">

                  <label className="form-label">
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

                <div className="d-flex gap-3">

                  <button
                    type="submit"
                    className="btn btn-primary"
                  >

                    Guardar Maestro

                  </button>

                  <Link
                    to="/maestros"
                    className="btn btn-secondary"
                  >

                    Ver maestros

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

export default RegistrarMaestro;