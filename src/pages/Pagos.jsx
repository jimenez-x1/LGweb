import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    getPagos();
  }, []);

  return (
    <div>
      <h1>Pagos</h1>

      {pagos.length === 0 ? (
        <p>No hay pagos registrados</p>
      ) : (
        pagos.map((pago) => (
          <div key={pago.ID_Pagos}>
            <p>Monto: {pago.Monto}</p>
            <p>Metodo: {pago.Metodo_Pago}</p>
            <p>Estado: {pago.Estado}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default Pagos;