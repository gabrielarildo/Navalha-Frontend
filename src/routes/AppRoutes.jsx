import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import ClienteDashboard from "../pages/cliente/ClienteDashboard";
import NovoAgendamento from "../pages/cliente/NovoAgendamento";
import BarbeiroDashboard from "../pages/barbeiro/BarbeiroDashboard";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route
        path="/cliente"
        element={
          <ProtectedRoute somenteRole="Cliente">
            <ClienteDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cliente/novo-agendamento"
        element={
          <ProtectedRoute somenteRole="Cliente">
            <NovoAgendamento />
          </ProtectedRoute>
        }
      />

      <Route
        path="/barbeiro"
        element={
          <ProtectedRoute rolesPermitidos={["Barbeiro", "Admin"]}>
            <BarbeiroDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
