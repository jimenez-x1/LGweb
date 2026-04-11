import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Alumnos from "./pages/Alumnos";
import RegistrarAlumno from "./pages/RegistrarAlumno";
import Grado from "./pages/Grado";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/alumnos" element={<Alumnos />} />
      <Route path="/registrar-alumno" element={<RegistrarAlumno />} />
      <Route path="/grado" element={<Grado />} />
    </Routes>
  );
}

export default App;