import { Routes, Route } from "react-router-dom";
import NavbarSection from "./components/navbar/NavbarSection.jsx";
import Home from "./pages/Home";
import Clase from "./pages/Clase";
import Alumnos from "./pages/Alumnos";
import Grado from "./pages/Grado";
import Maestros from "./pages/Maestros";
import RegistrarMaestro from "./pages/RegistrarMaestro";
import EditarMaestro from "./pages/EditarMaestro";
import Pagos from "./pages/Pagos";
import RegistrarPago from "./pages/RegistrarPago";
<<<<<<< HEAD
=======

>>>>>>> origin/carolina
import Padre from "./pages/Padre";

import Archivos from "./pages/Archivos";


function App() {
  return (
    <>
      <NavbarSection style="" logo="/images/logo-escuela-luis-gamero.png" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clase" element={<Clase />} />
        <Route path="/alumnos" element={<Alumnos />} />
        <Route path="/grado" element={<Grado />} />
        <Route path="/maestros" element={<Maestros />} />
        <Route path="/registrar-maestro" element={<RegistrarMaestro />} />
        <Route path="/editar-maestro/:id" element={<EditarMaestro />} />
        <Route path="/pagos" element={<Pagos />} />
        <Route path="/registrar-pago" element={<RegistrarPago />} />
        <Route path="/registrar-pago/:id" element={<RegistrarPago />} />

        <Route path="/padre" element={<Padre />} />
<<<<<<< HEAD

        <Route path="/archivos" element={<Archivos />} />
 
=======
=======
        <Route path="/archivos" element={<Archivos />} />

>>>>>>> origin/carolina
      </Routes>
    </>
  );
}

export default App;