import { useEffect, useState } from "react";
import { listarBarbeiros } from "../../services/barbeiroService";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";

export default function SelecionarPerfil({ onSelecionar }) {
  const [barbeiros, setBarbeiros] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarBarbeiros()
      .then((dados) => setBarbeiros(dados.filter((b) => b.ativo)))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <Loading label="Carregando barbeiros..." />;

  if (barbeiros.length === 0) {
    return (
      <EmptyState
        title="Nenhum barbeiro cadastrado"
        description="Cadastre um barbeiro pela API antes de acessar o painel."
      />
    );
  }

  return (
    <div className="container section-tight" style={{ maxWidth: 560 }}>
      <span className="eyebrow">Validar perfil</span>
      <h2>Qual desses barbeiros é você?</h2>
      <p>Selecione seu perfil para ver e validar os seus agendamentos.</p>

      <div className="stack">
        {barbeiros.map((b) => (
          <div key={b.id} className="pick-card" onClick={() => onSelecionar(b.id)}>
            <strong>{b.nome}</strong>
            <p style={{ margin: "4px 0 0", fontSize: "0.85rem" }}>
              {b.especialidade || "Barbeiro Navalha"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
