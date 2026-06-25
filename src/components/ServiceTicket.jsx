import { formatarMoeda } from "../utils/format";

export default function ServiceTicket({ servico, selected, onSelect }) {
  const clicavel = typeof onSelect === "function";

  return (
    <div
      className={`service-ticket ${clicavel ? "pick-card" : ""} ${selected ? "selected" : ""}`}
      onClick={clicavel ? () => onSelect(servico) : undefined}
      role={clicavel ? "button" : undefined}
      tabIndex={clicavel ? 0 : undefined}
    >
      <strong>{servico.nome}</strong>
      {servico.descricao && <p style={{ margin: 0, fontSize: "0.85rem" }}>{servico.descricao}</p>}
      <span className="service-ticket__price">{formatarMoeda(servico.valor)}</span>
      <span className="service-ticket__meta">{servico.duracaoMinutos} min</span>
    </div>
  );
}
