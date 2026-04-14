import { Routes, Route } from "react-router-dom";
import NavbarSection from "./components/navbar/NavbarSection.jsx";
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
import RegistrarPago from "./pages/RegistrarPago";
<<<<<<< HEAD
import Padre from "./pages/Padre";
=======
import Archivos from "./pages/Archivos";
>>>>>>> origin/Ari

function App() {
  return (
    <>
      <NavbarSection style="" logo="/images/logo-escuela-luis-gamero.png" />
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
        <Route path="/registrar-pago" element={<RegistrarPago />} />
        <Route path="/registrar-pago/:id" element={<RegistrarPago />} />
<<<<<<< HEAD
        <Route path="/padre" element={<Padre />} />
=======
        <Route path="/archivos" element={<Archivos />} />
>>>>>>> origin/Ari
      </Routes>
    </>
  );
}

export default App;