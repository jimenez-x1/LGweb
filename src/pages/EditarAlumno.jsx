import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarAlumno = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [grados, setGrados] = useState([]);

  const [form, setForm] = useState({
    ID_Alumno: "",
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
        (alumno) => String(alumno.ID_Alumno) === String(id)
      );

      if (alumnoEncontrado) {
        setForm({
          ID_Alumno: alumnoEncontrado.ID_Alumno || "",
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
        alert("Alumno no encontrado");
        navigate("/alumnos");
      }
    } catch (error) {
      console.error("Error al obtener alumno:", error);
      alert("Error al cargar el alumno");
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
      ID_Alumno: parseInt(form.ID_Alumno, 10),
      Nombre: form.Nombre.trim(),
      Apellido: form.Apellido.trim(),
      Fecha_Nacimiento: form.Fecha_Nacimiento,
      Direccion: form.Direccion.trim(),
      Genero: form.Genero,
      ID_Grado: parseInt(form.ID_Grado, 10),
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

      alert("Alumno actualizado correctamente");
      navigate("/alumnos");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar alumno");
    }
  };

  return (
    <section className="pt_100 pb_100">
      <div className="container">
        <h2 className="mb_40">Editar Alumno</h2>

        <form onSubmit={actualizarAlumno}>
          <input
            type="text"
            name="Nombre"
            placeholder="Nombre"
            value={form.Nombre}
            onChange={handleChange}
            className="form-control mb-3"
            required
          />

          <input
            type="text"
            name="Apellido"
            placeholder="Apellido"
            value={form.Apellido}
            onChange={handleChange}
            className="form-control mb-3"
            required
          />

          <input
            type="date"
            name="Fecha_Nacimiento"
            value={form.Fecha_Nacimiento}
            onChange={handleChange}
            className="form-control mb-3"
            required
          />

          <input
            type="text"
            name="Direccion"
            placeholder="Dirección"
            value={form.Direccion}
            onChange={handleChange}
            className="form-control mb-3"
          />

          <select
            name="Genero"
            value={form.Genero}
            onChange={handleChange}
            className="form-control mb-3"
            required
          >
            <option value="">Seleccione género</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>

          <select
            name="ID_Grado"
            value={form.ID_Grado}
            onChange={handleChange}
            className="form-control mb-3"
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
            Actualizar
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

export default EditarAlumno;