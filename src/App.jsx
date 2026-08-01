import { Routes, Route, useLocation } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import NavbarSection from "./components/navbar/NavbarSection";

import Home from "./pages/Home";
import Clase from "./pages/Clase";
import Alumnos from "./pages/Alumnos";
import Grado from "./pages/Grado";
import Maestros from "./pages/Maestros";
import RegistrarMaestro from "./pages/RegistrarMaestro";
import EditarMaestro from "./pages/EditarMaestro";
import Pagos from "./pages/Pagos";
import RegistrarPago from "./pages/RegistrarPago";
import Padre from "./pages/Padre";
import Archivos from "./pages/Archivos";
import Login from "./pages/Login";
import Calificaciones from "./pages/Calificaciones";
import MisCalificaciones from "./pages/MisCalificaciones";


function App() {
  const location = useLocation();

  return (
    <>
     {location.pathname !== "/" && (
  <NavbarSection
    style=""
    logo="/images/logo-escuela-luis-gamero.png"
  />
)}
      <Routes>

  <Route path="/" element={<Login />} />

<Route
  path="/home"
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  }
/>

  <Route
    path="/clase"
    element={
      <ProtectedRoute>
        <Clase />
      </ProtectedRoute>
    }
  />

  <Route
    path="/alumnos"
    element={
      <ProtectedRoute>
        <Alumnos />
      </ProtectedRoute>
    }
  />

  <Route
    path="/grado"
    element={
      <ProtectedRoute>
        <Grado />
      </ProtectedRoute>
    }
  />

  <Route
    path="/maestros"
    element={
      <ProtectedRoute>
        <Maestros />
      </ProtectedRoute>
    }
  />
  <Route                              
    path="/calificaciones"
    element={
      <ProtectedRoute>
        <Calificaciones />
      </ProtectedRoute>
    }
  />
  <Route
    path="/mis-calificaciones"
    element={
      <ProtectedRoute allowedRoles={[3]}>
        <MisCalificaciones />
      </ProtectedRoute>
    }
  />

  <Route
    path="/registrar-maestro"
    element={
      <ProtectedRoute>
        <RegistrarMaestro />
      </ProtectedRoute>
    }
  />

  <Route
    path="/editar-maestro/:id"
    element={
      <ProtectedRoute>
        <EditarMaestro />
      </ProtectedRoute>
    }
  />

  <Route
    path="/pagos"
    element={
      <ProtectedRoute>
        <Pagos />
      </ProtectedRoute>
    }
  />

  <Route
    path="/registrar-pago"
    element={
      <ProtectedRoute>
        <RegistrarPago />
      </ProtectedRoute>
    }
  />

  <Route
    path="/registrar-pago/:id"
    element={
      <ProtectedRoute>
        <RegistrarPago />
      </ProtectedRoute>
    }
  />

  <Route
    path="/padre"
    element={
      <ProtectedRoute>
        <Padre />
      </ProtectedRoute>
    }
  />

  <Route
    path="/archivos"
    element={
      <ProtectedRoute>
        <Archivos />
      </ProtectedRoute>
    }
  />
      </Routes>
    </>
  );
}

export default App;