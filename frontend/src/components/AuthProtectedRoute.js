// src/components/AuthProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const AuthProtectedRoute = () => {
  const userId = localStorage.getItem("userId"); // Verifica si hay usuario logueado

  if (!userId) {
    return <Navigate to="/login" replace />; // Redirige al login si no está autenticado
  }

  return <Outlet />; // Si está autenticado, renderiza las rutas hijas
};

export default AuthProtectedRoute;