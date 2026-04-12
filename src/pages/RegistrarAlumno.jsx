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

  const guardarAlumno = async (e) => {
    e.preventDefault();

    try {
      const alumnoData = {
        Nombre: form.Nombre.trim(),
        Apellido: form.Apellido.trim(),
        Fecha_Nacimiento: form.Fecha_Nacimiento,
        Direccion: form.Direccion.trim(),
        Genero: form.Genero,
        ID_Grado: parseInt(form.ID_Grado, 10),
      };

      console.log("Datos enviados:", alumnoData);

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
        <h2 className="mb_40">Registrar Alumno</h2>

        <form onSubmit={guardarAlumno}>
          <input
            type="text"
            name="Nombre"
            placeholder="Nombre"
            className="form-control mb-3"
            value={form.Nombre}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="Apellido"
            placeholder="Apellido"
            className="form-control mb-3"
            value={form.Apellido}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="Fecha_Nacimiento"
            className="form-control mb-3"
            value={form.Fecha_Nacimiento}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="Direccion"
            placeholder="Dirección"
            className="form-control mb-3"
            value={form.Direccion}
            onChange={handleChange}
          />

          <select
            name="Genero"
            className="form-control mb-3"
            value={form.Genero}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione género</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>

          <select
            name="ID_Grado"
            className="form-control mb-3"
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