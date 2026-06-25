import api from "./api";

// POST /api/auth/register
export function registrarUsuario({ nome, email, senha, role }) {
  return api.post("/auth/register", { nome, email, senha, role }).then((r) => r.data);
}

// POST /api/auth/login -> { token, usuario: { id, nome, email, role } }
export function login({ email, senha }) {
  return api.post("/auth/login", { email, senha }).then((r) => r.data);
}

// GET /api/auth/{id} (rota autenticada)
export function buscarUsuarioPorId(id) {
  return api.get(`/auth/${id}`).then((r) => r.data);
}
