import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Archivos = () => {
  const [dni, setDni] = useState("");
  const [generando, setGenerando] = useState(false);
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
      <h2>Constancia de Matrícula</h2>
      <form onSubmit={generarConstancia} className="mt-4">
        <div className="mb-3 position-relative" ref={contenedorRef}>
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

        <button type="submit" className="btn btn-success" disabled={generando}>
          {generando ? "Generando..." : "Generar Constancia"}
        </button>
      </form>
    </div>
  );
};

export default Archivos;