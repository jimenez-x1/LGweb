import React, { useState } from "react";
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const guardarAlumno = async (e) => {
    e.preventDefault();

    try {
      await fetch("http://localhost:3000/insertAlumno", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(form),
});

      alert("Alumno registrado correctamente");
      navigate("/alumnos");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="pt_100 pb_100">
      <div className="container">
        <h2 className="mb_40">Registrar Alumno</h2>

        <form onSubmit={guardarAlumno}>

          <input
            type="text"
            name="Nombre"
            placeholder="Nombre"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="Apellido"
            placeholder="Apellido"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="Fecha_Nacimiento"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="Direccion"
            placeholder="Dirección"
            className="form-control mb-3"
            onChange={handleChange}
          />

          <select
            name="Genero"
            className="form-control mb-3"
            onChange={handleChange}
            required
          >
            <option value="">Seleccione género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>

          <input
            type="number"
            name="ID_Grado"
            placeholder="ID Grado"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />

          <button type="submit" className="common_btn">
            Guardar
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
    </section>
  );
};

export default RegistrarAlumno;