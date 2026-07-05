import { useEffect, useState } from "react";
import axios from "axios";

const AlumnoAutocomplete = ({ onSelect }) => {

    const [texto, setTexto] = useState("");
    const [resultados, setResultados] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);

    useEffect(() => {

        if (texto.trim().length < 3) {
            setResultados([]);
            return;
        }

        const buscar = async () => {

            try {

                const res = await axios.get(
                    `http://localhost:3000/api/buscar?texto=${texto}`
                );

                setResultados(res.data);

            } catch (error) {

                console.error(error);

            }

        };

        buscar();

    }, [texto]);

    const seleccionarAlumno = (alumno) => {

        setSeleccionado(alumno);
        setResultados([]);
        setTexto("");

        onSelect(alumno);

    };

    if (seleccionado) {

        return (

            <div className="card mb-3 shadow-sm">

                <div className="card-body">

                    <h5 className="mb-2">
                        👤 {seleccionado.Nombre} {seleccionado.Apellido}
                    </h5>

                    <p className="mb-1">
                        <strong>DNI:</strong> {seleccionado.DNI}
                    </p>

                    <p className="mb-1">
                        <strong>Grado:</strong>{" "}
                        {seleccionado.Grado?.Nombre_Grado}{" "}
                        "{seleccionado.Grado?.Seccion}"
                    </p>

                    <p className="mb-3">
                        <strong>Padre:</strong>{" "}
                        {seleccionado.Padre?.Nombre}{" "}
                        {seleccionado.Padre?.Apellido}
                    </p>

                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setSeleccionado(null)}
                    >
                        Cambiar alumno
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
                placeholder="Buscar por nombre o DNI..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
            />

            {

                resultados.length > 0 && (

                    <div className="list-group mt-2">

                        {

                            resultados.map(alumno => (

                                <button
                                    key={alumno.DNI}
                                    type="button"
                                    className="list-group-item list-group-item-action"
                                    onClick={() => seleccionarAlumno(alumno)}
                                >

                                    <strong>
                                        {alumno.Nombre} {alumno.Apellido}
                                    </strong>

                                    <br />

                                    DNI: {alumno.DNI}

                                    <br />

                                    {alumno.Grado?.Nombre_Grado} "{alumno.Grado?.Seccion}"

                                </button>

                            ))

                        }

                    </div>

                )

            }

        </>

    );

};

export default AlumnoAutocomplete;