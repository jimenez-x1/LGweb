import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Pagos = () => {
  const [pagos, setPagos] = useState([]);

  const getPagos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/pagos");
      setPagos(res.data);
    } catch (error) {
      console.error("Error al obtener pagos:", error);
    }
  };

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
                    <th>Monto</th>
                    <th>Método</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((pago) => (
                    <tr key={pago.ID_Pagos}>
                      <td>{pago.ID_Pagos}</td>
                      <td>{pago.Monto}</td>
                      <td>{pago.Metodo_Pago}</td>
                      <td>
                        {String(pago.Estado).toLowerCase() === "pagado" ? (
                          <span className="badge bg-success">Pagado</span>
                        ) : (
                          <span className="badge bg-danger">Pendiente</span>
                        )}
                      </td>
                      <td>{pago.Fecha_Pago}</td>
                      <td>
                        <Link to={`/registrar-pago/${pago.ID_Pagos}`}>
                          <button className="btn btn-warning btn-sm me-2">
                            Editar
                          </button>
                        </Link>

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