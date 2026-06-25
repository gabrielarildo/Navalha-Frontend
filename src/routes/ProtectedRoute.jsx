import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, somenteRole, rolesPermitidos }) {
  const { estaLogado, usuario } = useAuth();
  const location = useLocation();

  if (!estaLogado) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const permitido = somenteRole
    ? usuario.role === somenteRole
    : rolesPermitidos
    ? rolesPermitidos.includes(usuario.role)
    : true;

  if (!permitido) {
    const destino = usuario.role === "Cliente" ? "/cliente" : "/barbeiro";
    return <Navigate to={destino} replace />;
  }

  return children;
}
