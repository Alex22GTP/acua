// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const userId = localStorage.getItem("userId");
  const id_rol = localStorage.getItem("id_rol");

  // Si no hay usuario O no es admin, redirige al inicio
  if (!userId || id_rol !== "1") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Si pasa las validaciones, renderiza la ruta
};

export default ProtectedRoute;