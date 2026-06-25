import api from "./api";

export function listarClientes() {
  return api.get("/clientes").then((r) => r.data);
}

export function buscarClientePorId(id) {
  return api.get(`/clientes/${id}`).then((r) => r.data);
}

export function buscarHistoricoCliente(id) {
  return api.get(`/clientes/${id}/historico`).then((r) => r.data);
}

export function criarCliente({ nome, telefone, email }) {
  return api.post("/clientes", { nome, telefone, email }).then((r) => r.data);
}

export function atualizarCliente(id, { nome, telefone, email }) {
  return api.put(`/clientes/${id}`, { nome, telefone, email }).then((r) => r.data);
}

export function removerCliente(id) {
  return api.delete(`/clientes/${id}`);
}
