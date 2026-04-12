import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import Clase from "./pages/Clase"; 

import Alumnos from "./pages/Alumnos";
import RegistrarAlumno from "./pages/RegistrarAlumno";
import EditarAlumno from "./pages/EditarAlumno";

import Grado from "./pages/Grado";
import Maestros from "./pages/Maestros";
import RegistrarMaestro from "./pages/RegistrarMaestro";
import EditarMaestro from "./pages/EditarMaestro";
import Pagos from "./pages/Pagos";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/clase" element={<Clase />} /> 

      <Route path="/alumnos" element={<Alumnos />} />
      <Route path="/registrar-alumno" element={<RegistrarAlumno />} />
      <Route path="/editar-alumno/:id" element={<EditarAlumno />} />

      <Route path="/grado" element={<Grado />} />

      <Route path="/maestros" element={<Maestros />} />
      <Route path="/registrar-maestro" element={<RegistrarMaestro />} />
      <Route path="/editar-maestro/:id" element={<EditarMaestro />} />
      <Route path="/pagos" element={<Pagos />} />
    </Routes>
  );
}

export default App;