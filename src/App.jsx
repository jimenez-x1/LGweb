import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Alumnos from "./pages/Alumnos";
import RegistrarAlumno from "./pages/RegistrarAlumno";
import Grado from "./pages/Grado";
import Maestros from "./pages/Maestros";
import RegistrarMaestro from "./pages/RegistrarMaestro";
import EditarMaestro from "./pages/EditarMaestro";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/alumnos" element={<Alumnos />} />
      <Route path="/registrar-alumno" element={<RegistrarAlumno />} />
      <Route path="/grado" element={<Grado />} />
      <Route path="/maestros" element={<Maestros />} />
      <Route path="/registrar-maestro" element={<RegistrarMaestro />} />
      <Route path="/editar-maestro/:id" element={<EditarMaestro />} />
    </Routes>
  );
}

export default App;