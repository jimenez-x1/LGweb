import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Pagos = () => {
  const [pagos, setPagos] = useState([]);

  // Trae todos los pagos
  const getPagos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/pagos");
      setPagos(res.data);
    } catch (error) {
      console.error("Error al obtener pagos:", error);
    }
  };

  // Elimina un pago
  const deletePago = async (id) => {
    const confirmar = window.confirm("¿Seguro que quieres eliminar este pago?");
    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:3000/api/deletePago/${id}`);
      alert("Pago eliminado correctamente");
      getPagos();
    } catch (error) {
      console.error("Error al eliminar pago:", error);
      alert("Error al eliminar el pago");
    }
  };

  useEffect(() => {
    getPagos();
  }, []);

  return (
    <section className="container-fluid py-5">
      <div className="row">
        <div className="col-12">
          <h2 className="fw-bold mb-4" style={{ fontSize: "56px" }}>
            Pagos Registrados
          </h2>

          {pagos.length === 0 ? (
            <p>No hay pagos registrados</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>DNI Alumno</th>
                    <th>DNI Padre</th>
                    <th>Monto</th>
                    <th>Mes</th>
                    <th>Año</th>
                    <th>Referencia</th>
                    <th>Fecha</th>
                    <th>Comprobante</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {pagos.map((pago) => (
                    <tr key={pago.ID_Pagos}>
                      <td>{pago.ID_Pagos}</td>
                      <td>{pago.DNI_Alumno}</td>
                      <td>{pago.DNI_Padre}</td>
                      <td>L. {pago.Monto}</td>
                      <td>{pago.Mes_Correspondiente}</td>
                      <td>{pago.Anio_Correspondiente}</td>
                      <td>{pago.Numero_Referencia}</td>
                      <td>{pago.Fecha_Pago}</td>

                      <td>
                        {pago.Comprobante ? (
                          <a
                            href={pago.Comprobante}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-info btn-sm"
                          >
                            Ver comprobante
                          </a>
                        ) : (
                          <span className="text-muted">
                            Sin comprobante
                          </span>
                        )}
                      </td>

                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deletePago(pago.ID_Pagos)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

          <div className="mt-4">
            <Link to="/registrar-pago" className="btn btn-primary">
              Registrar Pago
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pagos;