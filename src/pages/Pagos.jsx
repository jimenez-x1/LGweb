import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Pagos = () => {
  const [pagos, setPagos] = useState([]);

  const esPadre = Number(localStorage.getItem("ROL")) === 3;

  // Trae los pagos (todos para admin/maestro, solo los de sus hijos para el padre)
  const getPagos = async () => {
    try {
      const dni = localStorage.getItem("USER_ID");
      const url = esPadre
        ? `http://localhost:3000/api/pagos/padre/${dni}`
        : "http://localhost:3000/api/pagos";
      const res = await axios.get(url);
      setPagos(res.data);
    } catch (error) {
      console.error("Error al obtener pagos:", error);
    }
  };

  // Elimina un pago (solo admin/maestro)
  const deletePago = async (id) => {
   const confirmar = await Swal.fire({
  icon: "warning",
  title: "¿Eliminar pago?",
  text: "Esta acción no se puede deshacer.",
  showCancelButton: true,
  confirmButtonText: "Sí, eliminar",
  cancelButtonText: "Cancelar",
});

if (!confirmar.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/api/deletePago/${id}`);
      await Swal.fire({
  icon: "success",
  title: "Eliminado",
  text: "Pago eliminado correctamente",
  confirmButtonText: "Aceptar",
});
      getPagos();
    } catch (error) {
      console.error("Error al eliminar pago:", error);
     Swal.fire({
  icon: "error",
  title: "Error",
  text: "No se pudo eliminar el pago",
  confirmButtonText: "Aceptar",
});
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
                    {!esPadre && <th>Acciones</th>}
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

                      {!esPadre && (
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deletePago(pago.ID_Pagos)}
                          >
                            Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

          {!esPadre && (
            <div className="mt-4">
              <Link to="/registrar-pago" className="btn btn-primary">
                Registrar Pago
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Pagos;