import { normalizarStatus, STATUS } from "../services/agendamentoService";

const CONFIG = {
  [STATUS.AGENDADO]: { label: "Agendado", className: "badge-agendado" },
  [STATUS.CONFIRMADO]: { label: "Confirmado", className: "badge-confirmado" },
  [STATUS.CONCLUIDO]: { label: "Concluído", className: "badge-concluido" },
  [STATUS.CANCELADO]: { label: "Cancelado", className: "badge-cancelado" },
};

export default function StatusBadge({ status }) {
  const normalizado = normalizarStatus(status);
  const config = CONFIG[normalizado] ?? CONFIG[STATUS.AGENDADO];

  return <span className={`badge ${config.className}`}>{config.label}</span>;
}
