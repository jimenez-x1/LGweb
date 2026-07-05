import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import AlumnoAutocomplete from "../components/AlumnoAutocomplete";

const RegistrarPago = () => {
  const [estadoCuenta, setEstadoCuenta] = useState(null);
  const [comprobante, setComprobante] = useState(null);

  const [form, setForm] = useState({
    DNI_Alumno: "",
    DNI_Padre: "",
    Fecha_Pago: "",
    Monto: "",
    Numero_Referencia: "",
    Mes_Correspondiente: "",
    Anio_Correspondiente: "2026"
  });

  const CLOUD_NAME = "xfzydzcs";
  const UPLOAD_PRESET = "comprobantes_pagos";

  const getEstadoCuenta = async (dniPadre, dniAlumno) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/estado-cuenta/${dniPadre}/2026`
      );

      const alumno = res.data.alumnos.find(a => a.DNI === dniAlumno);
      setEstadoCuenta(alumno?.estadoCuenta || null);
    } catch (error) {
      console.error("Error al obtener estado de cuenta:", error);
      setEstadoCuenta(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleAlumnoSeleccionado = (alumno) => {
    setForm(prev => ({
      ...prev,
      DNI_Alumno: alumno.DNI,
      DNI_Padre: alumno.Padre.DNI
    }));

    getEstadoCuenta(alumno.Padre.DNI, alumno.DNI);
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
        alert("Debe seleccionar un alumno");
        return;
      }

      if (!comprobante) {
        alert("Debe subir el comprobante de pago");
        return;
      }

      const urlComprobante = await subirComprobanteCloudinary();

      await axios.post("http://localhost:3000/api/insertPago", {
        ...form,
        Metodo_Pago: "Transferencia",
        Comprobante: urlComprobante
      });

      alert("Pago registrado correctamente");

      setForm({
        DNI_Alumno: "",
        DNI_Padre: "",
        Fecha_Pago: "",
        Monto: "",
        Numero_Referencia: "",
        Mes_Correspondiente: "",
        Anio_Correspondiente: "2026"
      });

      setComprobante(null);
      setEstadoCuenta(null);

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error al guardar pago");
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
                    onChange={handleChange}
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
                  <select
                    name="Mes_Correspondiente"
                    value={form.Mes_Correspondiente}
                    onChange={handleChange}
                    required
                    className="form-control"
                  >
                    <option value="">Seleccione un mes</option>
                    <option value="1">Enero</option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Comprobante de pago
                  </label>
                  <input
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