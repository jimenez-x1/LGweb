import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Alumnos from "./pages/Alumnos";
import RegistrarAlumno from "./pages/RegistrarAlumno";
import EditarAlumno from "./pages/EditarAlumno"; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/alumnos" element={<Alumnos />} />
      <Route path="/registrar-alumno" element={<RegistrarAlumno />} />
      <Route path="/editar-alumno/:id" element={<EditarAlumno />} />

    </Routes>
  );
}

export default App;