import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const RegistrarPago = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [padres, setPadres] = useState([]);
  const { id } = useParams();

  const [form, setForm] = useState({
    ID_Alumno: "",
    ID_Padre: "",
    Fecha_Pago: "",
    Monto: "",
    Metodo_Pago: "",
    Estado: ""
  });

  const getAlumnos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/alumnos");
      setAlumnos(res.data);
    } catch (error) {
      console.error("Error al obtener alumnos:", error);
    }
  };

  const getPadres = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/padres");
      setPadres(res.data);
    } catch (error) {
      console.error("Error al obtener padres:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  useEffect(() => {
    getAlumnos();
    getPadres();

    if (id) {
      axios
        .get(`http://localhost:3000/api/pagos/${id}`)
        .then((res) => {
          setForm({
            ID_Alumno: res.data.ID_Alumno || "",
            ID_Padre: res.data.ID_Padre || "",
            Fecha_Pago: res.data.Fecha_Pago || "",
            Monto: res.data.Monto || "",
            Metodo_Pago: res.data.Metodo_Pago || "",
            Estado: res.data.Estado || ""
          });
        })
        .catch((error) => {
          console.error("Error al cargar pago:", error);
        });
    }
  }, [id]);

  const insertPago = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put("http://localhost:3000/api/updatePago", {
          ...form,
          ID_Pagos: id,
          ID_Padre: form.ID_Padre || null
        });

        alert("Pago actualizado correctamente");
      } else {
        await axios.post("http://localhost:3000/api/insertPago", {
          ...form,
          ID_Padre: form.ID_Padre || null
        });

        alert("Pago registrado correctamente");
      }

      setForm({
        ID_Alumno: "",
        ID_Padre: "",
        Fecha_Pago: "",
        Monto: "",
        Metodo_Pago: "",
        Estado: ""
      });
    } catch (error) {
      console.error("Error al guardar pago:", error);
      alert("Error al guardar pago");
    }
  };

  return (
    <section className="container py-5" style={{ marginLeft: "250px" }}>
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9 col-12">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">
                  {id ? "Actualizar Pago" : "Registrar Pago"}
                </h2>
                <p className="text-muted mb-0">
                  Complete la información del pago
                </p>
              </div>

              <form onSubmit={insertPago}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Alumno</label>
                  <select
                    name="ID_Alumno"
                    value={form.ID_Alumno}
                    onChange={handleChange}
                    required
                    className="form-control"
                  >
                    <option value="">Seleccione un alumno</option>
                    {alumnos.map((alumno) => (
                      <option key={alumno.ID_Alumno} value={alumno.ID_Alumno}>
                        {alumno.Nombre} {alumno.Apellido}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Padre</label>
                  <select
                    name="ID_Padre"
                    value={form.ID_Padre}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Seleccione un padre</option>
                    {padres.map((padre) => (
                      <option key={padre.ID_Padre} value={padre.ID_Padre}>
                        {padre.Nombre} {padre.Apellido}
                      </option>
                    ))}
                  </select>
                </div>

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
                  <label className="form-label fw-semibold">Método de pago</label>
                  <input
                    type="text"
                    name="Metodo_Pago"
                    value={form.Metodo_Pago}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder="Ej: Efectivo, Transferencia"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Estado</label>
                  <input
                    type="text"
                    name="Estado"
                    value={form.Estado}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder="Ej: Pagado o Pendiente"
                  />
                </div>

                <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                  <button type="submit" className="btn btn-primary px-4">
                    {id ? "Actualizar Pago" : "Guardar Pago"}
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