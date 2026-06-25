import api from "./api";

export function listarServicos() {
  return api.get("/servicos").then((r) => r.data);
}

export function buscarServicoPorId(id) {
  return api.get(`/servicos/${id}`).then((r) => r.data);
}

export function criarServico(dto) {
  return api.post("/servicos", dto).then((r) => r.data);
}

export function atualizarServico(id, dto) {
  return api.put(`/servicos/${id}`, dto).then((r) => r.data);
}

export function removerServico(id) {
  return api.delete(`/servicos/${id}`);
}
