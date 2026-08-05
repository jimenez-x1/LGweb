import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import AlumnoAutocomplete from "../components/AlumnoAutocomplete";

const RegistrarPago = () => {
  const [estadoCuenta, setEstadoCuenta] = useState(null);
  const [comprobante, setComprobante] = useState(null);

  const [form, setForm] = useState({
    DNI_Alumno: "",
    DNI_Padre: "",
    Fecha_Pago: "",
    Monto: "1000",
    Numero_Referencia: "",
    Mes_Correspondiente: "",
    Anio_Correspondiente: "2026"
  });

  const CLOUD_NAME = "xfzydzcs";
  const UPLOAD_PRESET = "comprobantes_pagos";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

 const handleAlumnoSeleccionado = async (alumno) => {
  try {
    const res = await axios.get(
      `http://localhost:3000/api/estado-cuenta/${alumno.Padre.DNI}/2026`
    );

    const alumnoEstado = res.data.alumnos.find(a => a.DNI === alumno.DNI);
    const estado = alumnoEstado?.estadoCuenta || null;

    setEstadoCuenta(estado);

    setForm(prev => ({
      ...prev,
      DNI_Alumno: alumno.DNI,
      DNI_Padre: alumno.Padre.DNI,
      Monto: "1000",
      Mes_Correspondiente: estado?.siguienteMensualidad?.mes || "",
      Anio_Correspondiente: estado?.siguienteMensualidad?.anio || "2026"
    }));

  } catch (error) {
    console.error("Error al obtener estado de cuenta:", error);
    setEstadoCuenta(null);
  }
};

  const handleComprobante = (e) => {
    setComprobante(e.target.files[0]);
  };

  const subirComprobanteCloudinary = async () => {
    const data = new FormData();

    data.append("file", comprobante);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      data
    );

    return res.data.secure_url;
  };

  const insertPago = async (e) => {
    e.preventDefault();

    try {
      if (!form.DNI_Alumno || !form.DNI_Padre) {
       await Swal.fire({
  icon: "warning",
  title: "Alumno requerido",
  text: "Debe seleccionar un alumno",
  confirmButtonText: "Aceptar",
});

return;
      }

      if (!form.Mes_Correspondiente) {
        await Swal.fire({
  icon: "info",
  title: "Sin mensualidades pendientes",
  text: "El alumno no tiene mensualidades pendientes",
  confirmButtonText: "Aceptar",
});

return;
      }

      if (!comprobante) {
        await Swal.fire({
  icon: "warning",
  title: "Comprobante requerido",
  text: "Debe subir el comprobante de pago",
  confirmButtonText: "Aceptar",
});

return;
      }

      const urlComprobante = await subirComprobanteCloudinary();

      const datosPago = {
        ...form,
        Monto: Number(form.Monto),
        Metodo_Pago: "Transferencia",
        Comprobante: urlComprobante
      };

      console.log("Datos que se enviarán:", datosPago);

      await axios.post("http://localhost:3000/api/insertPago", datosPago);

      await Swal.fire({
  icon: "success",
  title: "Pago registrado",
  text: "El pago fue registrado correctamente",
  confirmButtonText: "Aceptar",
});

      await handleAlumnoSeleccionado({
  DNI: form.DNI_Alumno,
  Padre: {
    DNI: form.DNI_Padre
  }
});

setForm(prev => ({
  ...prev,
  Fecha_Pago: "",
  Numero_Referencia: "",
  Monto: "1000"
}));

setComprobante(null);

    } catch (error) {
      console.error(error);
     Swal.fire({
  icon: "error",
  title: "Error",
  text: error.response?.data?.message || "No se pudo guardar el pago",
  confirmButtonText: "Aceptar",
});
    }
  };

 return (
  <section className="module-page">
    <div className="module-container">

      <div className="module-header">
        <span className="module-label">
          Gestión financiera
        </span>

        <h1>Registrar pago</h1>

        <p>
          Complete la información del pago del alumno.
        </p>
      </div>

      <div className="module-card">

        <div className="module-card-header">
          <div>
            <h2 className="module-card-title mb-1">
              Información del pago
            </h2>

            <p className="module-card-description">
              Registre una nueva mensualidad.
            </p>
          </div>
        </div>

        <form onSubmit={insertPago}>

          <div className="row g-3">

            <div className="col-12">
              <label className="form-label">
                Alumno
              </label>

              <AlumnoAutocomplete
                onSelect={handleAlumnoSeleccionado}
              />
            </div>

            {estadoCuenta && (
              <div className="col-12">
                <div className="alert alert-primary rounded-4">

                  <h6 className="fw-bold mb-3">
                    Estado de cuenta
                  </h6>

                  <p className="mb-2">
                    <strong>Solvente hasta:</strong>{" "}
                    {estadoCuenta.solventeHasta
                      ? `${estadoCuenta.solventeHasta.nombre} ${estadoCuenta.solventeHasta.anio}`
                      : "Sin mensualidades pagadas"}
                  </p>

                  <p className="mb-2">
                    <strong>Próxima mensualidad:</strong>{" "}
                    {estadoCuenta.siguienteMensualidad
                      ? `${estadoCuenta.siguienteMensualidad.nombre} ${estadoCuenta.siguienteMensualidad.anio}`
                      : "No tiene mensualidades pendientes"}
                  </p>

                  <strong>Mensualidades pendientes:</strong>

                  <ul className="mb-0 mt-2">
                    {estadoCuenta.pendientes.map((mes) => (
                      <li key={`${mes.mes}-${mes.anio}`}>
                        {mes.nombre} {mes.anio}
                      </li>
                    ))}
                  </ul>

                </div>
              </div>
            )}

            <div className="col-md-6">
              <label className="form-label">
                Fecha de pago
              </label>

              <input
                type="date"
                name="Fecha_Pago"
                value={form.Fecha_Pago}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">
                Monto
              </label>

              <input
                type="number"
                name="Monto"
                value={form.Monto}
                readOnly
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">
                Número de referencia
              </label>

              <input
                type="text"
                name="Numero_Referencia"
                value={form.Numero_Referencia}
                onChange={handleChange}
                className="form-control"
                placeholder="Ingrese el número de referencia"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">
                Mensualidad
              </label>

              <input
                type="text"
                className="form-control"
                readOnly
                value={
                  estadoCuenta?.siguienteMensualidad
                    ? `${estadoCuenta.siguienteMensualidad.nombre} ${estadoCuenta.siguienteMensualidad.anio}`
                    : ""
                }
                placeholder="Se selecciona automáticamente"
              />
            </div>

            <div className="col-12">
              <label className="form-label">
                Comprobante de pago
              </label>

              <input
                key={comprobante ? "con-archivo" : "sin-archivo"}
                type="file"
                accept="image/*"
                onChange={handleComprobante}
                className="form-control"
                required
              />

              <small className="text-muted">
                Adjunte una fotografía del comprobante.
              </small>
            </div>

          </div>

          <div className="d-flex gap-2 mt-4">

            <button
              type="submit"
              className="module-primary-btn"
            >
              Guardar pago
            </button>

            <Link
              to="/pagos"
              className="btn btn-outline-secondary"
            >
              Cancelar
            </Link>

          </div>

        </form>

      </div>

    </div>
  </section>
);
};

export default RegistrarPago;