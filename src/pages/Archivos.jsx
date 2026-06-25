import React, { useState } from "react";
import axios from "axios";

const Archivos = () => {
  const [formData, setFormData] = useState({
    Nombre_Archivo: "",
    Tipo_Archivo: "",
    Fecha_Subida: "",
  });

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
    </div>
  );
};

export default Archivos;