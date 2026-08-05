import { useEffect, useState } from "react";
import api from "../../utilities/axiosConfig";

const PadreAutocomplete = ({ onSelect, padreSeleccionado }) => {
  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    setSeleccionado(padreSeleccionado || null);
  }, [padreSeleccionado]);

  useEffect(() => {
    if (texto.trim().length < 2) {
      setResultados([]);
      return;
    }

    const buscar = async () => {
      try {
        const res = await api.get(
          `/buscarPadre?texto=${encodeURIComponent(texto)}`
        );

        setResultados(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    buscar();
  }, [texto]);

  const seleccionarPadre = (padre) => {
    setSeleccionado(padre);
    setResultados([]);
    setTexto("");
    onSelect(padre);
  };

  const limpiarSeleccion = () => {
    setSeleccionado(null);
    onSelect(null);
  };

  if (seleccionado) {
    return (
      <div className="card mb-3 shadow-sm">
        <div className="card-body">
          <h5 className="mb-2">
            👤 {seleccionado.Nombre} {seleccionado.Apellido}
          </h5>

          <p className="mb-3">
            <strong>DNI:</strong> {seleccionado.DNI}
          </p>

          <button
            type="button"
            className="btn btn-primary btn-sm mt-2 px-3"
            onClick={limpiarSeleccion}
          >
            Cambiar padre o encargado
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar padre por DNI, nombre o apellido..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />

      {resultados.length > 0 && (
        <div className="list-group mt-2">
          {resultados.map((padre) => (
            <button
              key={padre.DNI}
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => seleccionarPadre(padre)}
            >
              <strong>
                {padre.Nombre} {padre.Apellido}
              </strong>
              <br />
              DNI: {padre.DNI}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default PadreAutocomplete;