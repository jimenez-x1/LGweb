import { useEffect, useState } from "react";
import { getAlumnos } from "../store/slices/Alumnos/fetchers";

const Home = () => {
  const [alumnos, setAlumnos] = useState<any[]>([]);

  useEffect(() => {
    getAlumnos()
      .then((data) => {
        console.log(data);
        setAlumnos(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1>Alumnos</h1>
      <pre>{JSON.stringify(alumnos, null, 2)}</pre>

      {alumnos.map((alumno, index) => (
        <div key={alumno.ID_Alumno ?? index}>
          <p>{alumno.Nombre} {alumno.Apellido}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;