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
    Monto: "1500",
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
      Monto: "2000",
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
  Monto: "2000"
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
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9 col-12">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Registrar Pago</h2>
                <p className="text-muted mb-0">
                  Complete la información del pago
                </p>
              </div>

              <form onSubmit={insertPago}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Alumno</label>
                  <AlumnoAutocomplete onSelect={handleAlumnoSeleccionado} />
                </div>

                {estadoCuenta && (
                  <div className="card border-primary mt-3 mb-3">
                    <div className="card-header bg-primary text-white">
                      Estado de Cuenta
                    </div>

                    <div className="card-body">
                      <p>
                        <strong>Solvente hasta:</strong>{" "}
                        {estadoCuenta.solventeHasta
                          ? `${estadoCuenta.solventeHasta.nombre} ${estadoCuenta.solventeHasta.anio}`
                          : "Sin mensualidades pagadas"}
                      </p>

                      <p>
                        <strong>Próxima mensualidad:</strong>{" "}
                        {estadoCuenta.siguienteMensualidad
                          ? `${estadoCuenta.siguienteMensualidad.nombre} ${estadoCuenta.siguienteMensualidad.anio}`
                          : "No tiene mensualidades pendientes"}
                      </p>

                      <p className="mb-1">
                        <strong>Mensualidades pendientes:</strong>
                      </p>

                      <ul className="mb-0">
                        {estadoCuenta.pendientes.map((mes) => (
                          <li key={`${mes.mes}-${mes.anio}`}>
                            {mes.nombre} {mes.anio}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-semibold">Fecha de pago</label>
                  <input
                    type="date"
                    name="Fecha_Pago"
                    value={form.Fecha_Pago}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Monto</label>
                  <input
                    type="number"
                    name="Monto"
                    value={form.Monto}
                    readOnly
                    required
                    className="form-control"
                    placeholder="Ingrese el monto"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Número de referencia
                  </label>
                  <input
                    type="text"
                    name="Numero_Referencia"
                    value={form.Numero_Referencia}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder="Ingrese el número de referencia"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Mes correspondiente
                  </label>
                  <input
                    type="text"
                    value={
                      estadoCuenta?.siguienteMensualidad
                        ? `${estadoCuenta.siguienteMensualidad.nombre} ${estadoCuenta.siguienteMensualidad.anio}`
                        : ""
                    }
                    readOnly
                    required
                    className="form-control"
                    placeholder="Se selecciona automáticamente"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Comprobante de pago
                  </label>
                  <input
                        key={comprobante ? "con-archivo" : "sin-archivo"}
                        type="file"
                        accept="image/*"
                        onChange={handleComprobante}
                        required
                        className="form-control"
                      />
                  <small className="text-muted">
                    Suba una foto del recibo o comprobante de la mensualidad.
                  </small>
                </div>

                <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                  <button type="submit" className="btn btn-primary px-4">
                    Guardar Pago
                  </button>

                  <Link to="/pagos" className="btn btn-secondary px-4">
                    Volver a Pagos
                  </Link>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrarPago;