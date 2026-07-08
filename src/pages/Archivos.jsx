import React, { useState } from "react";
import axios from "axios";

const Archivos = () => {
  const [formData, setFormData] = useState({
    Nombre_Archivo: "",
    Tipo_Archivo: "",
    Fecha_Subida: "",
  });

  const [dni, setDni] = useState("");
  const [generando, setGenerando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const guardarArchivo = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/api/archivos", formData);
      alert("Archivo guardado correctamente");

      setFormData({
        Nombre_Archivo: "",
        Tipo_Archivo: "",
        Fecha_Subida: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error al guardar archivo");
    }
  };

  const generarConstancia = async (e) => {
    e.preventDefault();
    if (!dni) return alert("Ingresa el DNI del alumno");

    setGenerando(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/alumno/${dni}/constancia`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `constancia_${dni}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) {
        alert("No se encontró un alumno con ese DNI");
      } else {
        alert("Error al generar la constancia");
      }
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro de Archivos</h2>

      <form onSubmit={guardarArchivo} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Nombre del archivo</label>
          <input
            type="text"
            className="form-control"
            name="Nombre_Archivo"
            value={formData.Nombre_Archivo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de archivo</label>
          <input
            type="text"
            className="form-control"
            name="Tipo_Archivo"
            value={formData.Tipo_Archivo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha de subida</label>
          <input
            type="date"
            className="form-control"
            name="Fecha_Subida"
            value={formData.Fecha_Subida}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar Archivo
        </button>
      </form>

      <hr className="my-5" />

      <h2>Constancia de Matrícula</h2>
      <form onSubmit={generarConstancia} className="mt-4">
        <div className="mb-3">
          <label className="form-label">DNI del alumno</label>
          <input
            type="text"
            className="form-control"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="Ej: 0801-1990-00000"
            required
          />
        </div>
        <button type="submit" className="btn btn-success" disabled={generando}>
          {generando ? "Generando..." : "Generar Constancia"}
        </button>
      </form>
    </div>
  );
};

export default Archivos;