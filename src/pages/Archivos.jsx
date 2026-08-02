import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Archivos = () => {
  const [dni, setDni] = useState("");
  const [generandoConstancia, setGenerandoConstancia] = useState(false);
  const [generandoCertificacion, setGenerandoCertificacion] = useState(false);
  const [alumnos, setAlumnos] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const contenedorRef = useRef(null);

  useEffect(() => {
    const cargarAlumnos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/alumnos");
        setAlumnos(response.data || []);
      } catch (error) {
        console.error("Error al cargar alumnos:", error);
      }
    };
    cargarAlumnos();
  }, []);

  useEffect(() => {
    const manejarClicFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setMostrarSugerencias(false);
      }
    };
    document.addEventListener("mousedown", manejarClicFuera);
    return () => document.removeEventListener("mousedown", manejarClicFuera);
  }, []);

  const handleChangeDni = (e) => {
    const valor = e.target.value;
    setDni(valor);

    if (valor.trim().length === 0) {
      setSugerencias([]);
      setMostrarSugerencias(false);
      return;
    }

    const texto = valor.toLowerCase();
    const filtrados = alumnos.filter((alumno) => {
      const nombreCompleto = `${alumno.Nombre} ${alumno.Apellido}`.toLowerCase();
      return (
        alumno.DNI?.toLowerCase().includes(texto) ||
        nombreCompleto.includes(texto)
      );
    }).slice(0, 6);

    setSugerencias(filtrados);
    setMostrarSugerencias(filtrados.length > 0);
  };

  const seleccionarSugerencia = (alumno) => {
    setDni(alumno.DNI);
    setMostrarSugerencias(false);
  };

  const descargarPdf = async (endpoint, prefijoArchivo) => {
    const response = await axios.get(
      `http://localhost:3000/api/alumno/${dni}/${endpoint}`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${prefijoArchivo}_${dni}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const generarConstancia = async (e) => {
    e.preventDefault();
    if (!dni) return alert("Ingresa el DNI del alumno");

    setGenerandoConstancia(true);
    try {
      await descargarPdf("constancia", "constancia");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) {
        alert("No se encontró un alumno con ese DNI");
      } else {
        alert("Error al generar la constancia");
      }
    } finally {
      setGenerandoConstancia(false);
    }
  };

  const generarCertificacion = async (e) => {
    e.preventDefault();
    if (!dni) return alert("Ingresa el DNI del alumno");

    setGenerandoCertificacion(true);
    try {
      await descargarPdf("certificacion", "certificacion");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) {
        alert("No se encontró un alumno con ese DNI");
      } else {
        alert("Error al generar la certificación");
      }
    } finally {
      setGenerandoCertificacion(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Documentos del Alumno</h2>

      <div className="mb-3 position-relative" ref={contenedorRef} style={{ maxWidth: "500px" }}>
        <label className="form-label">DNI del alumno</label>
        <input
          type="text"
          className="form-control"
          value={dni}
          onChange={handleChangeDni}
          onFocus={() => sugerencias.length > 0 && setMostrarSugerencias(true)}
          placeholder="Ej: 0801-1990-00000"
          autoComplete="off"
          required
        />

        {mostrarSugerencias && (
          <ul
            className="list-group position-absolute w-100 shadow"
            style={{
              zIndex: 1050,
              top: "100%",
              left: 0,
              maxHeight: "165px",
              overflowY: "auto",
            }}
          >
            {sugerencias.map((alumno) => (
              <li
                key={alumno.DNI}
                className="list-group-item list-group-item-action"
                style={{
                  cursor: "pointer",
                  padding: "10px 14px",
                  fontSize: "0.95rem",
                }}
                onClick={() => seleccionarSugerencia(alumno)}
              >
                <strong>{alumno.DNI}</strong> — {alumno.Nombre} {alumno.Apellido}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="d-flex gap-3 mt-4">
        <button
          className="btn btn-success"
          onClick={generarConstancia}
          disabled={generandoConstancia}
        >
          {generandoConstancia ? "Generando..." : "Generar Constancia de Matrícula"}
        </button>

        <button
          className="btn btn-primary"
          onClick={generarCertificacion}
          disabled={generandoCertificacion}
        >
          {generandoCertificacion ? "Generando..." : "Generar Certificación de Estudios"}
        </button>
      </div>
    </div>
  );
};

export default Archivos;