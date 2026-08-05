import React, { useState, useEffect, useRef } from "react";
import api from "../utilities/axiosConfig";
import Swal from "sweetalert2";

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
        const response = await api.get("/alumnos");
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
    const response = await api.get(
      `/alumno/${dni}/${endpoint}`,
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
    if (!dni) {
  await Swal.fire({
    icon: "warning",
    title: "DNI requerido",
    text: "Ingresa el DNI del alumno",
    confirmButtonText: "Aceptar",
  });
  return;
}
    setGenerandoConstancia(true);
    try {
      await descargarPdf("constancia", "constancia");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) {
        Swal.fire({
  icon: "warning",
  title: "Alumno no encontrado",
  text: "No se encontró un alumno con ese DNI",
  confirmButtonText: "Aceptar",
});
      } else {
       Swal.fire({
  icon: "error",
  title: "Error",
  text: "No se pudo generar la constancia",
  confirmButtonText: "Aceptar",
}); 
      }
    } finally {
      setGenerandoConstancia(false);
    }
  };

  const generarCertificacion = async (e) => {
    e.preventDefault();
   if (!dni) {
  await Swal.fire({
    icon: "warning",
    title: "DNI requerido",
    text: "Ingresa el DNI del alumno",
    confirmButtonText: "Aceptar",
  });
  return;
}

    setGenerandoCertificacion(true);
    try {
      await descargarPdf("certificacion", "certificacion");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) {
        Swal.fire({
  icon: "warning",
  title: "Alumno no encontrado",
  text: "No se encontró un alumno con ese DNI",
  confirmButtonText: "Aceptar",
});

      } else {
        Swal.fire({
  icon: "error",
  title: "Error",
  text: "No se pudo generar la certificación",
  confirmButtonText: "Aceptar",
});
      }
    } finally {
      setGenerandoCertificacion(false);
    }
  };

  return (
  <section className="module-page">
    <div className="module-container">

      {/* ENCABEZADO */}
      <div className="module-header">
        <span className="module-label">Gestión documental</span>

        <h1>Archivos</h1>

        <p>
          Genera y descarga documentos académicos de los alumnos.
        </p>
      </div>

      {/* BUSCADOR */}
      <div className="module-card documents-search-card">
        <div className="module-card-header">
          <div>
            <h2 className="module-card-title mb-1">
              Seleccionar alumno
            </h2>

            <p className="module-card-description">
              Busca al alumno por número de identidad, nombre o apellido.
            </p>
          </div>
        </div>

        <div
          className="documents-search-wrapper position-relative"
          ref={contenedorRef}
        >
          <label className="form-label">
            Alumno
          </label>

          <input
            type="text"
            className="form-control"
            value={dni}
            onChange={handleChangeDni}
            onFocus={() =>
              sugerencias.length > 0 &&
              setMostrarSugerencias(true)
            }
            placeholder="Buscar por DNI, nombre o apellido..."
            autoComplete="off"
          />

          {mostrarSugerencias && (
            <ul className="documents-suggestions">
              {sugerencias.map((alumno) => (
                <li
                  key={alumno.DNI}
                  onClick={() =>
                    seleccionarSugerencia(alumno)
                  }
                >
                  <div className="documents-suggestion-avatar">
                    {alumno.Nombre?.charAt(0)}
                    {alumno.Apellido?.charAt(0)}
                  </div>

                  <div>
                    <strong>
                      {alumno.Nombre} {alumno.Apellido}
                    </strong>

                    <span>{alumno.DNI}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {dni && (
          <div className="documents-selected-student">
            <i className="fas fa-check-circle"></i>

            <span>
              Alumno seleccionado: <strong>{dni}</strong>
            </span>
          </div>
        )}
      </div>

      {/* DOCUMENTOS */}
      <div className="module-card">
        <div className="module-card-header">
          <div>
            <h2 className="module-card-title mb-1">
              Documentos disponibles
            </h2>

            <p className="module-card-description">
              Selecciona el documento que deseas generar.
            </p>
          </div>
        </div>

        <div className="row g-4">

          {/* CONSTANCIA */}
          <div className="col-12 col-lg-6">
            <div className="document-option-card">
              <div className="document-option-icon document-icon-green">
                <i className="fas fa-file-alt"></i>
              </div>

              <div className="document-option-content">
                <h3>Constancia de matrícula</h3>

                <p>
                  Genera una constancia que acredita que el alumno está
                  matriculado en el centro educativo.
                </p>

                <button
                  type="button"
                  className="btn document-btn document-btn-green"
                  onClick={generarConstancia}
                  disabled={generandoConstancia}
                >
                  {generandoConstancia
                    ? "Generando..."
                    : "Generar constancia"}
                </button>
              </div>
            </div>
          </div>

          {/* CERTIFICACIÓN */}
          <div className="col-12 col-lg-6">
            <div className="document-option-card">
              <div className="document-option-icon document-icon-blue">
                <i className="fas fa-file-pdf"></i>
              </div>

              <div className="document-option-content">
                <h3>Certificación de estudios</h3>

                <p>
                  Genera una certificación con la información académica del
                  alumno.
                </p>

                <button
                  type="button"
                  className="btn document-btn document-btn-blue"
                  onClick={generarCertificacion}
                  disabled={generandoCertificacion}
                >
                  {generandoCertificacion
                    ? "Generando..."
                    : "Generar certificación"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
);
};

export default Archivos;