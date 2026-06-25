import api from "./api";

// A API serializa o enum StatusAgendamento. Esses nomes são exatamente os
// valores definidos em Models/Entities/StatusAgendamento.cs
export const STATUS = {
  AGENDADO: "Agendado",
  CONFIRMADO: "Confirmado",
  CONCLUIDO: "Concluido",
  CANCELADO: "Cancelado",
};

const STATUS_POR_INDICE = [STATUS.AGENDADO, STATUS.CONFIRMADO, STATUS.CONCLUIDO, STATUS.CANCELADO];

// Normaliza o status recebido da API: pode chegar como número (enum) ou string
export function normalizarStatus(status) {
  if (typeof status === "number") return STATUS_POR_INDICE[status] ?? STATUS.AGENDADO;
  return status;
}

export function listarAgendamentos() {
  return api.get("/agendamentos").then((r) => r.data);
}

export function buscarAgendamentoPorId(id) {
  return api.get(`/agendamentos/${id}`).then((r) => r.data);
}

export function listarAgendamentosPorBarbeiro(barbeiroId) {
  return api.get(`/agendamentos/barbeiro/${barbeiroId}`).then((r) => r.data);
}

export function criarAgendamento({ clienteId, barbeiroId, servicoId, dataHora, observacoes }) {
  return api
    .post("/agendamentos", { clienteId, barbeiroId, servicoId, dataHora, observacoes })
    .then((r) => r.data);
}

export function reagendar(id, { servicoId, dataHora, observacoes }) {
  return api.put(`/agendamentos/${id}`, { servicoId, dataHora, observacoes }).then((r) => r.data);
}

export function atualizarStatus(id, status) {
  return api.patch(`/agendamentos/${id}/status`, { status }).then((r) => r.data);
}

export function cancelarAgendamento(id) {
  return api.patch(`/agendamentos/${id}/cancelar`).then((r) => r.data);
}
