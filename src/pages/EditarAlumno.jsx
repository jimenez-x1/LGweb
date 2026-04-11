import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarAlumno = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    Nombre: "",
    Apellido: "",
    Fecha_Nacimiento: "",
    Direccion: "",
    Genero: "",
    ID_Grado: "",
  });

  useEffect(() => {
    fetch("http://localhost:3000/alumnos")
      .then((res) => res.json())
      .then((data) => {
        const alumnoEncontrado = data.find(
          (alumno) => String(alumno.ID_Alumno) === String(id)
        );

        if (alumnoEncontrado) {
          setForm({
            Nombre: alumnoEncontrado.Nombre || "",
            Apellido: alumnoEncontrado.Apellido || "",
            Fecha_Nacimiento: alumnoEncontrado.Fecha_Nacimiento
              ? alumnoEncontrado.Fecha_Nacimiento.split("T")[0]
              : "",
            Direccion: alumnoEncontrado.Direccion || "",
            Genero: alumnoEncontrado.Genero || "",
            ID_Grado: alumnoEncontrado.ID_Grado || "",
          });
        }
      })
      .catch((error) => console.error(error));
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 const actualizarAlumno = async (e) => {
  e.preventDefault();

  console.log("Se hizo click en actualizar");
  console.log("Datos enviados:", {
    ID_Alumno: id,
    ...form,
  });

  try {
    const response = await fetch("http://localhost:3000/updateAlumno", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ID_Alumno: id,
        ...form,
      }),
    });

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
            value={form.Nombre}
            onChange={handleChange}
            className="form-control mb-3"
          />

          <input
            type="text"
            name="Apellido"
            value={form.Apellido}
            onChange={handleChange}
            className="form-control mb-3"
          />

          <input
            type="date"
            name="Fecha_Nacimiento"
            value={form.Fecha_Nacimiento}
            onChange={handleChange}
            className="form-control mb-3"
          />

          <input
            type="text"
            name="Direccion"
            value={form.Direccion}
            onChange={handleChange}
            className="form-control mb-3"
          />

          <select
            name="Genero"
            value={form.Genero}
            onChange={handleChange}
            className="form-control mb-3"
          >
            <option value="">Seleccione género</option>
            <option value="M">M</option>
            <option value="F">F</option>
          </select>

          <input
            type="number"
            name="ID_Grado"
            value={form.ID_Grado}
            onChange={handleChange}
            className="form-control mb-3"
          />

          <button type="submit" className="common_btn">
  Actualizar
</button>
        </form>
      </div>
    </section>
  );
};

export default EditarAlumno;