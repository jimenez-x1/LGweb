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
import PanelMaestro from "./pages/PanelMaestro";
import MisAlumnos from "./pages/MisAlumnos";
import MisNotas from "./pages/MisNotas";
import Usuarios from "./pages/Usuarios";

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
            <ProtectedRoute allowedRoles={[1]}>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <Usuarios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/panel-maestro"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <PanelMaestro />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mis-alumnos"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <MisAlumnos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mis-notas"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <MisNotas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clase"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <Clase />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumnos"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <Alumnos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/grado"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <Grado />
            </ProtectedRoute>
          }
        />

        <Route
          path="/maestros"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <Maestros />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calificaciones"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
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
            <ProtectedRoute allowedRoles={[1]}>
              <RegistrarMaestro />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editar-maestro/:id"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <EditarMaestro />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pagos"
          element={
            <ProtectedRoute allowedRoles={[1, 3]}>
              <Pagos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/registrar-pago"
          element={
            <ProtectedRoute allowedRoles={[1, 3]}>
              <RegistrarPago />
            </ProtectedRoute>
          }
        />

        <Route
          path="/registrar-pago/:id"
          element={
            <ProtectedRoute allowedRoles={[1, 3]}>
              <RegistrarPago />
            </ProtectedRoute>
          }
        />

        <Route
          path="/padre"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <Padre />
            </ProtectedRoute>
          }
        />

        <Route
          path="/archivos"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <Archivos />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;