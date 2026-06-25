import { FiUser, FiScissors, FiClock } from "react-icons/fi";
import StatusBadge from "./StatusBadge";
import { formatarDataHora, formatarMoeda } from "../utils/format";

// perspectiva: "cliente" mostra o nome do barbeiro; "barbeiro" mostra o nome do cliente
export default function AppointmentCard({ agendamento, perspectiva = "cliente", actions }) {
  const nomePrincipal = perspectiva === "cliente" ? agendamento.barbeiroNome : agendamento.clienteNome;

  return (
    <div className="card">
      <div className="row-between" style={{ marginBottom: 12 }}>
        <div className="row">
          <FiClock />
          <strong>{formatarDataHora(agendamento.dataHora)}</strong>
        </div>
        <StatusBadge status={agendamento.status} />
      </div>

      <div className="stack" style={{ gap: 6 }}>
        <div className="row text-muted">
          <FiUser size={15} />
          <span>{nomePrincipal || "—"}</span>
        </div>
        <div className="row text-muted">
          <FiScissors size={15} />
          <span>
            {agendamento.servicoNome} · {agendamento.duracaoMinutos} min
          </span>
        </div>
      </div>

      {agendamento.observacoes && (
        <p style={{ marginTop: 12, fontSize: "0.88rem" }}>“{agendamento.observacoes}”</p>
      )}

      <div className="row-between" style={{ marginTop: 16 }}>
        <span className="service-ticket__price" style={{ fontSize: "1.1rem" }}>
          {formatarMoeda(agendamento.valor)}
        </span>
        {actions && <div className="row">{actions}</div>}
      </div>
    </div>
  );
}
