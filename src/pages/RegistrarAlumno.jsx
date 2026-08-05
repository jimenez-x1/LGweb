import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PadreAutocomplete from "../components/work/PadreAutocomplete";
import { obtenerSeccionesUnicas } from "../utilities/seccionUnica";
import Swal from "sweetalert2";

const RegistrarAlumno = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    DNI: "",
    DNI_Padre: form.DNI_Padre || null,
    Nombre: "",
    Apellido: "",
    Fecha_Nacimiento: "",
    Direccion: "",
    Genero: "",
    ID_Grado: "",
  });

 const [grados, setGrados] = useState([]);

 const mapaSecciones = obtenerSeccionesUnicas(grados);

  useEffect(() => {
    obtenerGrados();
  }, []);

  const obtenerGrados = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/grados");
      const data = await response.json();
      console.log("GRADOS RECIBIDOS:", data);   // ← agrega esta línea
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
        DNI: form.DNI.trim(),
        DNI_Padre: "",
        Nombre: form.Nombre.trim(),
        Apellido: form.Apellido.trim(),
        Fecha_Nacimiento: form.Fecha_Nacimiento,
        Direccion: form.Direccion.trim(),
        Genero: form.Genero,
        ID_Grado: parseInt(form.ID_Grado, 10),
      };

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
        await Swal.fire({
  icon: "error",
  title: "Error",
  text: "No se pudo registrar el alumno",
  confirmButtonText: "Aceptar",
});

return;
      }

      await Swal.fire({
  icon: "success",
  title: "Registrado",
  text: "Alumno registrado correctamente",
  confirmButtonText: "Aceptar",
});

navigate("/alumnos");
    } catch (error) {
      console.error("Error al registrar alumno:", error);
      Swal.fire({
  icon: "error",
  title: "Error",
  text: "Ocurrió un error al registrar el alumno",
  confirmButtonText: "Aceptar",
});
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
                <label className="form-label">DNI</label>
                <input
                  type="text"
                  name="DNI"
                  placeholder="Ej: 0801199912345"
                  className="form-control"
                  value={form.DNI}
                  onChange={handleChange}
                  required
                />
              </div>

                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    name="Nombre"
                    placeholder="Ej: Cristofer"
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
                    placeholder="Ej: Cerrato"
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
                    placeholder="Ej: Danlí"
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
                        {grado.Nombre_Grado} - {mapaSecciones[grado.ID_Grado]}
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