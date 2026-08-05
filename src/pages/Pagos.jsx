import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utilities/axiosConfig";
import Swal from "sweetalert2";

const Pagos = () => {
  const [pagos, setPagos] = useState([]);

  const esPadre = Number(localStorage.getItem("ROL")) === 3;

  // Trae los pagos (todos para admin/maestro, solo los de sus hijos para el padre)
  const getPagos = async () => {
    try {
      const dni = localStorage.getItem("USER_ID");
      const url = esPadre
        ? `/pagos/padre/${dni}`
        : "/pagos";
      const res = await api.get(url);
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
      await api.delete(`/deletePago/${id}`);
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
  <section className="module-page">
    <div className="module-container">

      {/* ENCABEZADO */}
      <div className="module-header module-header-row">
        <div>
          <span className="module-label">
            Gestión financiera
          </span>

          <h1>Pagos</h1>

          <p>
            Consulta y administra los pagos registrados en el sistema.
          </p>
        </div>

        <Link
          to="/registrar-pago"
          className="module-primary-btn module-header-button"
        >
          + Registrar pago
        </Link>
      </div>

      {/* LISTADO */}
      <div className="module-card">
        <div className="module-card-header">
          <div>
            <h2 className="module-card-title mb-1">
              Pagos registrados
            </h2>

            <p className="module-card-description">
              Total de pagos: {pagos.length}
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table module-table payments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DNI alumno</th>
                <th>DNI padre</th>
                <th>Monto</th>
                <th>Mes</th>
                <th>Año</th>
                <th>Referencia</th>
                <th>Fecha</th>
                <th>Comprobante</th>

                {!esPadre && (
                  <th>Acciones</th>
                )}
              </tr>
            </thead>

            <tbody>
              {pagos.length === 0 ? (
                <tr>
                  <td
                    colSpan={esPadre ? 9 : 10}
                    className="text-center text-muted py-5"
                  >
                    No hay pagos registrados.
                  </td>
                </tr>
              ) : (
                pagos.map((pago) => (
                  <tr key={pago.ID_Pagos}>
                    <td>
                      <strong>
                        {pago.ID_Pagos}
                      </strong>
                    </td>

                    <td>
                      {pago.DNI_Alumno}
                    </td>

                    <td>
                      {pago.DNI_Padre}
                    </td>

                    <td>
                      <span className="payment-amount">
                        L. {Number(pago.Monto || 0).toFixed(2)}
                      </span>
                    </td>

                    <td>
                      {pago.Mes_Correspondiente}
                    </td>

                    <td>
                      {pago.Anio_Correspondiente}
                    </td>

                    <td>
                      {pago.Numero_Referencia || "—"}
                    </td>

                    <td>
                      {pago.Fecha_Pago
                        ? String(pago.Fecha_Pago).slice(0, 10)
                        : "—"}
                    </td>

                    <td>
                      {pago.Comprobante ? (
                        <a
                          href={pago.Comprobante}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn payment-proof-btn"
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
                          type="button"
                          className="btn btn-danger payment-delete-btn"
                          onClick={() =>
                            deletePago(pago.ID_Pagos)
                          }
                        >
                          Eliminar
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </section>
);
};

export default Pagos;