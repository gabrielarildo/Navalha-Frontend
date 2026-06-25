import api from "./api";

export function listarBarbeiros() {
  return api.get("/barbeiros").then((r) => r.data);
}

export function buscarBarbeiroPorId(id) {
  return api.get(`/barbeiros/${id}`).then((r) => r.data);
}

// data no formato "AAAA-MM-DD"
export function buscarHorariosDisponiveis(barbeiroId, data) {
  return api
    .get(`/barbeiros/${barbeiroId}/horarios-disponiveis`, { params: { data } })
    .then((r) => r.data);
}

export function criarBarbeiro({ nome, telefone, especialidade }) {
  return api.post("/barbeiros", { nome, telefone, especialidade }).then((r) => r.data);
}

export function atualizarBarbeiro(id, dto) {
  return api.put(`/barbeiros/${id}`, dto).then((r) => r.data);
}

export function removerBarbeiro(id) {
  return api.delete(`/barbeiros/${id}`);
}
