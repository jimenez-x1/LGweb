import React, { useEffect, useState } from "react";
import { getAlumnos } from "../store/slices/Alumnos/fetchers";
import BannerSection from "../components/banner/BannerSection.jsx";

const Home = () => {
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    getAlumnos()
      .then((data) => setAlumnos(data))
      .catch((error) => console.error(error));
  }, []);

  const obtenerNombreGrado = (idGrado) => {
    const grados = {
      1: "Primero",
      4: "Segundo",
      6: "Tercero",
    };

    return grados[idGrado] || idGrado;
  };

  const totalAlumnos = alumnos.length;

  const gradosRegistrados = new Set(
    alumnos.map((alumno) => alumno.ID_Grado).filter(Boolean)
  ).size;

  const stats = {
    totalAlumnos,
    gradosRegistrados,
  };

  return (
    <>
      <BannerSection stats={stats} />

      <section className="pt_100 pb_100">
        <div className="container-fluid px-5">
          <div className="row mb_40">
            <div className="col-12 text-center">
              <div className="tf__heading_area">
                <h5>Listado</h5>
                <h2>Alumnos registrados</h2>
              </div>
            </div>
          </div>

          <div className="row">
            {alumnos.map((alumno) => (
              <div className="col-md-6 col-lg-4 mb_30" key={alumno.ID_Alumno}>
                <div className="tf__single_courses">
                  <div className="tf__single_courses_text">
                    <h3>
                      {alumno.Nombre} {alumno.Apellido}
                    </h3>
                    <p><strong>Dirección:</strong> {alumno.Direccion}</p>
                    <p><strong>Género:</strong> {alumno.Genero}</p>
                    <p><strong>Grado:</strong> {obtenerNombreGrado(alumno.ID_Grado)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;