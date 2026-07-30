import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {

  const token = localStorage.getItem("SECURE");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const rol = localStorage.getItem("ROL");

  if (allowedRoles && !allowedRoles.includes(Number(rol))) {
    return <Navigate to="/home" replace />;
  }

  return children;

};

export default ProtectedRoute;