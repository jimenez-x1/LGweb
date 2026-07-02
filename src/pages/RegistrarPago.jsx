import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import AlumnoAutocomplete from "../components/AlumnoAutocomplete";

//guarda la inforacion que llega del api 
const RegistrarPago = () => {
  const [estadoCuenta, setEstadoCuenta] = useState(null);

  // Formulario para registrar un pago con alumno, padre, fecha, monto y número de referencia.
  const [form, setForm] = useState({
    DNI_Alumno: "",
    DNI_Padre: "",
    Fecha_Pago: "",
    Monto: "",
    Numero_Referencia: ""
  });

  // Obtiene el estado de cuenta del padre y del alumno seleccionado.
  const getEstadoCuenta = async (dniPadre, dniAlumno) => {

    try {

      const res = await axios.get(
        `http://localhost:3000/api/estado-cuenta/${dniPadre}/2026`
      );

      const alumno = res.data.alumnos.find(
        a => a.DNI === dniAlumno
      );

      setEstadoCuenta(alumno?.estadoCuenta || null);

    } catch (error) {

      console.error("Error al obtener estado de cuenta:", error);
      setEstadoCuenta(null);

    }

  };


// Actualiza los campos del formulario.
const handleChange = (e) => {

  const { name, value } = e.target;

  setForm({
    ...form,
    [name]: value
  });

};

// Recibe el alumno seleccionado desde el componente de búsqueda.
const handleAlumnoSeleccionado = (alumno) => {

  setForm(prev => ({
    ...prev,
    DNI_Alumno: alumno.DNI,
    DNI_Padre: alumno.Padre.DNI
  }));

  getEstadoCuenta(alumno.Padre.DNI, alumno.DNI);

};

// Esta función registra un nuevo pago.
const insertPago = async (e) => {

  e.preventDefault();

  try {

    await axios.post(
      "http://localhost:3000/api/insertPago",
      {
        ...form,
        DNI_Alumno: form.DNI_Alumno,
        DNI_Padre: form.DNI_Padre
      }
    );

    alert("Pago registrado correctamente");

    setForm({
      DNI_Alumno: "",
      DNI_Padre: "",
      Fecha_Pago: "",
      Monto: "",
      Numero_Referencia: ""
    });

    setEstadoCuenta(null);

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message || "Error al guardar pago"
    );

  }

};

// Formulario para registrar un pago con alumno, fecha, monto y número de referencia.
return (
    <section className="container py-5">      
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9 col-12">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">
                  Registrar Pago
                </h2>
                <p className="text-muted mb-0">
                  Complete la información del pago
                </p>
              </div>

              <form onSubmit={insertPago}>
                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    Alumno
                  </label>

                  <AlumnoAutocomplete
                    onSelect={handleAlumnoSeleccionado}
                  />

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