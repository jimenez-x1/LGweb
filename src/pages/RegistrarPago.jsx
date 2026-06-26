import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
//guarda la inforacion que llega del api 
const RegistrarPago = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [padres, setPadres] = useState([]);
  const { id } = useParams();
//formulario para registrar o actualizar un pago, con campos para seleccionar el alumno y el padre, ingresar la fecha de pago, monto, método de pago y estado del pago.
  const [form, setForm] = useState({
    DNI_Alumno: "",
    DNI_Padre: "",
    Fecha_Pago: "",
    Monto: "",
    Metodo_Pago: "",
    Estado: ""
  });
//Esta función inserta un nuevo pago en la base de datos utilizando los datos proporcionados en el formulario.
  const getAlumnos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/alumnos");
      setAlumnos(res.data);
    } catch (error) {
      console.error("Error al obtener alumnos:", error);
    }
  };
//Esta función obtiene la lista de padres registrados en la base de datos para mostrarla en el formulario y permitir la selección del padre asociado al pago.
  const getPadres = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/padres");
      setPadres(res.data);
    } catch (error) {
      console.error("Error al obtener padres:", error);
    }
  };
//Esta función maneja los cambios en los campos del formulario, actualizando el estado del formulario con los valores ingresados por el usuario.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };
//El useEffect se utiliza para cargar los datos de alumnos y padres al montar el componente, y si se proporciona un ID en la URL, también carga los datos del pago correspondiente para permitir su edición.
  useEffect(() => {
    getAlumnos();
    getPadres();

    if (id) {
      axios
        .get(`http://localhost:3000/api/pagos/${id}`)
        .then((res) => {
          setForm({
            DNI_Alumno: res.data.DNI_Alumno || "",
            DNI_Padre: res.data.DNI_Padre || "",
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
//esto evita que el formulario recargue la pagina
  const insertPago = async (e) => {
    e.preventDefault();
//actualiza el pago
   try {
        if (id) {

          await axios.put("http://localhost:3000/api/updatePago", {
            ...form,
            ID_Pagos: id,
            DNI_Alumno: form.DNI_Alumno,
            DNI_Padre: form.DNI_Padre || null
          });

          alert("Pago actualizado correctamente");

        } else {

          await axios.post("http://localhost:3000/api/insertPago", {
            ...form,
            DNI_Alumno: form.DNI_Alumno,
            DNI_Padre: form.DNI_Padre || null
          });

          alert("Pago registrado correctamente");

        }

     setForm({
        DNI_Alumno: "",
        DNI_Padre: "",
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
//El formulario incluye campos para seleccionar el alumno y el padre, ingresar la fecha de pago, monto, método de pago y estado del pago. Al enviar el formulario, se llama a la función insertPago para guardar los datos en la base de datos.
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
                      name="DNI_Alumno"
                      value={form.DNI_Alumno}
                      onChange={handleChange}
                      required
                      className="form-control"
                    >
                      <option value="">Seleccione un alumno</option>

                      {alumnos.map((alumno) => (
                        <option key={alumno.DNI} value={alumno.DNI}>
                          {alumno.Nombre} {alumno.Apellido} - {alumno.DNI}
                        </option>
                      ))}

                    </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Padre</label>
                 <select
                    name="DNI_Padre"
                    value={form.DNI_Padre}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Seleccione un padre</option>

                    {padres.map((padre) => (
                      <option key={padre.DNI} value={padre.DNI}>
                        {padre.Nombre} {padre.Apellido} - {padre.DNI}
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