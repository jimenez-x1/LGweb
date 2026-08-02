import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {

  const token = localStorage.getItem("SECURE");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const tokenExpirado = (() => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp && payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  })();

  if (tokenExpirado) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  const rol = Number(localStorage.getItem("ROL"));

  if (allowedRoles && !allowedRoles.includes(rol)) {
    const destino = rol === 3 ? "/mis-calificaciones" : "/home";
    return <Navigate to={destino} replace />;
  }

  return children;
};

export default ProtectedRoute;
